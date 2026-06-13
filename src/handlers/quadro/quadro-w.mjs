import { fileKey, KLAR_FMV_DEC_31, LARKAN_VAL_JAN_1 } from '../../constants.mjs'
import {
  convertToEur,
  countDays,
  formatAmountForReport,
} from '../../helpers.mjs'
import { parsedData } from '../../state.mjs'
import { renderTable } from './helper.mjs'

export function buildQuadroW() {
  const errEl = document.getElementById('error-quadro-w')
  errEl.style.display = 'none'
  try {
    const quadroWData = calculateW(parsedData)
    const quadroWTableData = quadroWData.map((el) => ({
      ticker: el.ticker,
      startDate: el.startDate,
      endDate: el.endDate,
      quantity: el.quantityTimes100 / 100,
      startValue: formatAmountForReport(el.startValue).value,
      endValue: formatAmountForReport(el.endValue).value,
      holdingDays: el.holdingDays,
    }))

    renderTable('table-w', quadroWTableData, {
      alignRight: ['startValue', 'endValue'],
      bold: ['startValue', 'endValue', 'holdingDays'],
    })
  } catch (err) {
    console.error(err)

    document.getElementById('result-w').style.display = 'none'
    document.querySelector('#table-w tbody').innerHTML = ''
    errEl.textContent = 'Quadro W error: ' + err.message
    errEl.style.display = 'block'
  }
}

export function calculateW(data) {
  if (!data[fileKey.LARKAN_HOLDINGS]) {
    throw new Error(
      `buildQuadroW: ${fileKey.LARKAN_HOLDINGS} export is missing`,
    )
  }
  if (!data[fileKey.KLARNA_HOLDINGS]) {
    throw new Error(
      `buildQuadroW: ${fileKey.KLARNA_HOLDINGS} export is missing`,
    )
  }
  if (!data[fileKey.LARKAN_SALES]) {
    throw new Error(`buildQuadroW: ${fileKey.LARKAN_SALES} export is missing`)
  }
  if (!data[fileKey.KLARNA_SALES]) {
    throw new Error(`buildQuadroW: ${fileKey.KLARNA_SALES} export is missing`)
  }

  const holdings = [
    ...data[fileKey.LARKAN_HOLDINGS].data,
    ...data[fileKey.KLARNA_HOLDINGS].data,
  ]

  const sales = [
    ...data[fileKey.LARKAN_SALES].data,
    ...data[fileKey.KLARNA_SALES].data,
  ]

  // calculate holding periods
  // - if a lot was issued before Jan 1, the start date is Jan 1, with value at Jan 1
  // - if a lot was not sold, the end date is Dec 31 with value at Dec 31
  // - if a lot was sold partially, the part that was sold was held until sale date,
  // the other part was held until Dec 31
  const holdingPeriods = []

  for (const h of holdings) {
    const isBefore2025 = new Date(h.issuanceDate) < new Date('01-Jan-2025')

    const startDate = isBefore2025 ? '01-Jan-2025' : h.issuanceDate
    const startValueUnit = {
      value: isBefore2025 ? LARKAN_VAL_JAN_1 : h.issuanceValueUnit.value,
      currency: h.issuanceValueUnit.currency,
    }

    const endDate = '31-Dec-2025'
    const endValueUnit = {
      value: KLAR_FMV_DEC_31,
      currency: h.issuanceValueUnit.currency,
    }

    const lotSales = sales.filter(
      (s) => s.certificateNumber === h.certificateNumber,
    )

    const lot = {
      ticker: h.ticker,
      quantityTimes100: h.quantityTimes100,
      startDate: startDate,
      startValueUnit: startValueUnit,
      endDate: endDate,
      endValueUnit: endValueUnit,
    }

    if (!lotSales.length) {
      holdingPeriods.push(lot)
    } else {
      for (const s of lotSales) {
        // remove shares that were sold from the starting lot
        lot.quantityTimes100 -= s.quantityTimes100

        // shares held until sale date
        const saleEntry = {
          ticker: h.ticker,
          quantityTimes100: s.quantityTimes100,
          startDate: startDate,
          startValueUnit: startValueUnit,
          endDate: s.saleDate,
          endValueUnit: s.salePriceUnit,
        }
        holdingPeriods.push(saleEntry)
      }
      if (lot.quantityTimes100 > 0) {
        // shares that were not sold
        holdingPeriods.push(lot)
      }
    }
  }

  // aggregate lots by ticker, startDate, and endDate
  const aggregated = {}
  for (const d of holdingPeriods) {
    const aggregationKey = `${d.ticker}%%${d.startDate}%%${d.endDate}`

    if (!aggregated[aggregationKey]) {
      aggregated[aggregationKey] = {
        ticker: d.ticker,
        quantityTimes100: 0,
        startDate: d.startDate,
        startValue: { value: 0, currency: d.startValueUnit.currency },
        endDate: d.endDate,
        endValue: { value: 0, currency: d.endValueUnit.currency },
        holdingDays: countDays(d.endDate, d.startDate),
      }
    }

    const startValue = d.quantityTimes100 * d.startValueUnit.value
    const endValue = d.quantityTimes100 * d.endValueUnit.value

    aggregated[aggregationKey].quantityTimes100 += d.quantityTimes100
    aggregated[aggregationKey].startValue.value += startValue
    aggregated[aggregationKey].endValue.value += endValue
  }

  // convert to EUR
  return Object.values(aggregated).map((e) => {
    return {
      ...e,
      startValue: convertToEur(e.startValue, e.startDate),
      endValue: convertToEur(e.endValue, e.endDate),
    }
  })
}
