import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateW } from '../src/handlers/quadro/quadro-w.mjs'

export const larkanHoldings = {
  meta: {
    ticker: 'Larkan AB RSU Program',
    currency: 'SEK',
    filter: 'All',
  },
  data: [
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '1',
      issuanceDate: '01-Apr-2023',
      quantityTimes100: 24000,
      issuanceValueUnit: {
        value: 4482,
        currency: 'SEK',
      },
    },
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '2',
      issuanceDate: '01-Oct-2023',
      quantityTimes100: 7000,
      issuanceValueUnit: {
        value: 4487,
        currency: 'SEK',
      },
    },
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '3',
      issuanceDate: '01-Jul-2025',
      quantityTimes100: 9000,
      issuanceValueUnit: {
        value: 8099,
        currency: 'SEK',
      },
    },
  ],
}

export const klarnaHoldings = {
  meta: {
    ticker: 'KLARNA GROUP PLC',
    currency: 'USD',
    filter: 'All',
  },
  data: [
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '101',
      issuanceDate: '11-Sep-2025',
      quantityTimes100: 10000,
      issuanceValueUnit: {
        value: 4000,
        currency: 'USD',
      },
    },
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '102',
      issuanceDate: '24-Oct-2025',
      quantityTimes100: 5000,
      issuanceValueUnit: {
        value: 3656,
        currency: 'USD',
      },
    },
  ],
}

export const larkanSales = {
  meta: {
    ticker: 'Larkan AB RSU Program',
    currency: 'SEK',
    filter: '2025',
  },
  data: [
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '1',
      issuanceDate: '01-Apr-2023',
      saleDate: '11-Sep-2025',
      quantityTimes100: 24000,
      issuanceValueUnit: {
        value: 4482,
        currency: 'SEK',
      },
      salePriceUnit: {
        value: 9607,
        currency: 'SEK',
      },
    },
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '2',
      issuanceDate: '01-Oct-2023',
      saleDate: '11-Sep-2025',
      quantityTimes100: 7000,
      issuanceValueUnit: {
        value: 4487,
        currency: 'SEK',
      },
      salePriceUnit: {
        value: 9607,
        currency: 'SEK',
      },
    },
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '3',
      issuanceDate: '01-Jul-2025',
      saleDate: '11-Sep-2025',
      quantityTimes100: 9000,
      issuanceValueUnit: {
        value: 8099,
        currency: 'SEK',
      },
      salePriceUnit: {
        value: 9607,
        currency: 'SEK',
      },
    },
  ],
}

export const klarnaSalesNoSale = {
  meta: {
    ticker: 'KLARNA GROUP PLC',
    currency: 'USD',
    filter: '2025',
  },
  data: [],
}

export const klarnaSalesAll = {
  meta: {
    ticker: 'KLARNA GROUP PLC',
    currency: 'USD',
    filter: '2025',
  },
  data: [
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '101',
      issuanceDate: '11-Sep-2025',
      saleDate: '12-Dec-2025',
      issuanceValueUnit: {
        value: 4000,
        currency: 'USD',
      },
      quantityTimes100: 10000,
      salePriceUnit: {
        value: 3054,
        currency: 'USD',
      },
    },
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '102',
      issuanceDate: '24-Oct-2025',
      saleDate: '12-Dec-2025',
      issuanceValueUnit: {
        value: 3656,
        currency: 'USD',
      },
      quantityTimes100: 5000,
      salePriceUnit: {
        value: 3054,
        currency: 'USD',
      },
    },
  ],
}

export const klarnaSalesPartial = {
  meta: {
    ticker: 'KLARNA GROUP PLC',
    currency: 'USD',
    filter: '2025',
  },
  data: [
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '101',
      issuanceDate: '11-Sep-2025',
      saleDate: '12-Dec-2025',
      issuanceValueUnit: {
        value: 4000,
        currency: 'USD',
      },
      quantityTimes100: 2000,
      salePriceUnit: {
        value: 3054,
        currency: 'USD',
      },
    },
    {
      ticker: 'KLARNA GROUP PLC',
      certificateNumber: '102',
      issuanceDate: '24-Oct-2025',
      saleDate: '12-Dec-2025',
      issuanceValueUnit: {
        value: 3656,
        currency: 'USD',
      },
      quantityTimes100: 5000,
      salePriceUnit: {
        value: 3054,
        currency: 'USD',
      },
    },
  ],
}

test('no klarna sales', (t) => {
  const data = {
    'larkan-holdings': larkanHoldings,
    'klarna-holdings': klarnaHoldings,
    'larkan-sales': larkanSales,
    'klarna-sales': klarnaSalesNoSale,
  }

  const quadroWData = calculateW(data)

  const expected = [
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jan-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 31000,
      startValue: { value: 25440600, currency: 'EUR' },
      endValue: { value: 27194200, currency: 'EUR' },
      holdingDays: 253,
    },
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jul-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 9000,
      startValue: { value: 6532000, currency: 'EUR' },
      endValue: { value: 7895100, currency: 'EUR' },
      holdingDays: 72,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '11-Sep-2025',
      endDate: '31-Dec-2025',
      quantityTimes100: 10000,
      startValue: { value: 34231900, currency: 'EUR' },
      endValue: { value: 24612800, currency: 'EUR' },
      holdingDays: 111,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '24-Oct-2025',
      endDate: '31-Dec-2025',
      quantityTimes100: 5000,
      startValue: { value: 15742300, currency: 'EUR' },
      endValue: { value: 12306400, currency: 'EUR' },
      holdingDays: 68,
    },
  ]

  assert.deepEqual(quadroWData, expected)
})

test('sell everything', (t) => {
  const data = {
    'larkan-holdings': larkanHoldings,
    'klarna-holdings': klarnaHoldings,
    'larkan-sales': larkanSales,
    'klarna-sales': klarnaSalesAll,
  }

  const quadroWData = calculateW(data)

  const expected = [
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jan-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 31000,
      startValue: { value: 25440600, currency: 'EUR' },
      endValue: { value: 27194200, currency: 'EUR' },
      holdingDays: 253,
    },
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jul-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 9000,
      startValue: { value: 6532000, currency: 'EUR' },
      endValue: { value: 7895100, currency: 'EUR' },
      holdingDays: 72,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '11-Sep-2025',
      endDate: '12-Dec-2025',
      quantityTimes100: 10000,
      startValue: { value: 34231900, currency: 'EUR' },
      endValue: { value: 26033600, currency: 'EUR' },
      holdingDays: 92,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '24-Oct-2025',
      endDate: '12-Dec-2025',
      quantityTimes100: 5000,
      startValue: { value: 15742300, currency: 'EUR' },
      endValue: { value: 13016800, currency: 'EUR' },
      holdingDays: 49,
    },
  ]

  assert.deepEqual(quadroWData, expected)
})

test('partial klarna sale', (t) => {
  const data = {
    'larkan-holdings': larkanHoldings,
    'klarna-holdings': klarnaHoldings,
    'larkan-sales': larkanSales,
    'klarna-sales': klarnaSalesPartial,
  }

  const quadroWData = calculateW(data)

  const expected = [
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jan-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 31000,
      startValue: { value: 25440600, currency: 'EUR' },
      endValue: { value: 27194200, currency: 'EUR' },
      holdingDays: 253,
    },
    {
      ticker: 'Larkan AB RSU Program',
      startDate: '01-Jul-2025',
      endDate: '11-Sep-2025',
      quantityTimes100: 9000,
      startValue: { value: 6532000, currency: 'EUR' },
      endValue: { value: 7895100, currency: 'EUR' },
      holdingDays: 72,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '11-Sep-2025',
      endDate: '12-Dec-2025',
      quantityTimes100: 2000,
      startValue: { value: 6846400, currency: 'EUR' },
      endValue: { value: 5206700, currency: 'EUR' },
      holdingDays: 92,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '11-Sep-2025',
      endDate: '31-Dec-2025',
      quantityTimes100: 8000,
      startValue: { value: 27385500, currency: 'EUR' },
      endValue: { value: 19690200, currency: 'EUR' },
      holdingDays: 111,
    },
    {
      ticker: 'KLARNA GROUP PLC',
      startDate: '24-Oct-2025',
      endDate: '12-Dec-2025',
      quantityTimes100: 5000,
      startValue: { value: 15742300, currency: 'EUR' },
      endValue: { value: 13016800, currency: 'EUR' },
      holdingDays: 49,
    },
  ]

  assert.deepEqual(quadroWData, expected)
})
