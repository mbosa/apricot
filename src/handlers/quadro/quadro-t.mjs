import { fileKey } from '../../constants.mjs'
import { convertToEur, formatAmountForReport } from '../../helpers.mjs'
import { parsedData } from '../../state.mjs'
import { renderTable, wireDetailToggle } from './helper.mjs'

export function buildQuadroT() {
  const errEl = document.getElementById('error-quadro-t')
  errEl.style.display = 'none'
  try {
    const quadroTData = calculateT(parsedData)

    // headline: just the totals
    const tfoot = document.querySelector('#table-t tfoot')
    tfoot.innerHTML = `
      <tr>
        <td colspan="1" style="text-align:right;font-weight:600;color:#555">Total</td>
        <td style="font-weight:600">${quadroTData.totals.quantityTimes100 / 100}</td>
        <td style="font-weight:600;text-align:right">${formatAmountForReport(quadroTData.totals.costi).value}</td>
        <td style="font-weight:600;text-align:right">${formatAmountForReport(quadroTData.totals.corrispettivi).value}</td>
      </tr>`

    document.getElementById('result-t').style.display = 'block'

    // detail table: per-sale breakdown with the currency conversion
    const detailData = quadroTData.sales.map((el) => ({
      ticker: el.ticker,
      issuanceDate: el.issuanceDate,
      saleDate: el.saleDate,
      quantity: el.quantityTimes100 / 100,
      costiBase: formatAmountForReport(el.costiBase, 2).value,
      costiExchangeRate: el.issuanceExchangeRate,
      costi: formatAmountForReport(el.costi, 2).value,
      corrispettiviBase: formatAmountForReport(el.corrispettiviBase, 2).value,
      corrispettiviExchangeRate: el.saleExchangeRate,
      corrispettivi: formatAmountForReport(el.corrispettivi, 2).value,
    }))

    renderTable('table-t-detail', detailData, {
      alignRight: [
        'costiBase',
        'costiExchangeRate',
        'costi',
        'corrispettiviBase',
        'corrispettiviExchangeRate',
        'corrispettivi',
      ],
      boldHeaders: ['costi', 'corrispettivi'],
      reveal: false,
    })

    wireDetailToggle('toggle-table-t', 'detail-t')
  } catch (err) {
    console.error(err)

    document.getElementById('result-t').style.display = 'none'
    document.querySelector('#table-t tfoot').innerHTML = ''
    document.querySelector('#table-t-detail tbody').innerHTML = ''
    document.getElementById('toggle-table-t').style.display = 'none'
    errEl.textContent = 'Quadro T error: ' + err.message
    errEl.style.display = 'block'
  }
}

export function calculateT(data) {
  if (!data[fileKey.LARKAN_HOLDINGS]) {
    throw new Error(
      `buildQuadroT: ${fileKey.LARKAN_HOLDINGS} export is missing`,
    )
  }
  if (!data[fileKey.KLARNA_HOLDINGS]) {
    throw new Error(
      `buildQuadroT: ${fileKey.KLARNA_HOLDINGS} export is missing`,
    )
  }
  if (!data[fileKey.LARKAN_SALES]) {
    throw new Error(`buildQuadroT: ${fileKey.LARKAN_SALES} export is missing`)
  }
  if (!data[fileKey.KLARNA_SALES]) {
    throw new Error(`buildQuadroT: ${fileKey.KLARNA_SALES} export is missing`)
  }

  const larkanSales = data[fileKey.LARKAN_SALES].data
  const klarnaSales = data[fileKey.KLARNA_SALES].data

  const sales = [...larkanSales, ...klarnaSales]

  // for each sale calculate
  // - costi = value at vesting
  // - corrispettivi = value at sale
  const salesDataEur = []

  for (const s of sales) {
    const corrispettivi = {
      value: s.quantityTimes100 * s.salePriceUnit.value,
      currency: s.salePriceUnit.currency,
    }
    const costi = {
      value: s.quantityTimes100 * s.issuanceValueUnit.value,
      currency: s.issuanceValueUnit.currency,
    }

    const costiConverted = convertToEur(costi, s.issuanceDate)
    const corrispettiviConverted = convertToEur(corrispettivi, s.saleDate)

    const sale = {
      ticker: s.ticker,
      quantityTimes100: s.quantityTimes100,
      issuanceDate: s.issuanceDate,
      costiBase: costi,
      issuanceExchangeRate: costiConverted.exchangeRate,
      costi: costiConverted.result,
      saleDate: s.saleDate,
      corrispettiviBase: corrispettivi,
      saleExchangeRate: corrispettiviConverted.exchangeRate,
      corrispettivi: corrispettiviConverted.result,
    }

    salesDataEur.push(sale)
  }

  const quantityTotal = salesDataEur.reduce(
    (sum, el) => sum + el.quantityTimes100,
    0,
  )

  const corrispettiviTotal = {
    value: salesDataEur.reduce((sum, el) => sum + el.corrispettivi.value, 0),
    currency: 'EUR',
  }

  const costiTotal = {
    value: salesDataEur.reduce((sum, el) => sum + el.costi.value, 0),
    currency: 'EUR',
  }

  return {
    totals: {
      quantityTimes100: quantityTotal,
      costi: costiTotal,
      corrispettivi: corrispettiviTotal,
    },
    sales: salesDataEur,
  }
}
