import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateT } from '../src/handlers/quadro/quadro-t.mjs'

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
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '4',
      issuanceDate: '01-Oct-2025',
      quantityTimes100: 2000,
      issuanceValueUnit: {
        value: 8653,
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
      quantityTimes100: 500,
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
    {
      ticker: 'Larkan AB RSU Program',
      certificateNumber: '4',
      issuanceDate: '01-Oct-2025',
      saleDate: '24-Oct-2025',
      quantityTimes100: 2000,
      issuanceValueUnit: {
        value: 8653,
        currency: 'SEK',
      },
      salePriceUnit: {
        value: 8653,
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

test('no klarna sales', (t) => {
  const data = {
    'larkan-holdings': larkanHoldings,
    'klarna-holdings': klarnaHoldings,
    'larkan-sales': larkanSales,
    'klarna-sales': klarnaSalesNoSale,
  }

  const quadroWData = calculateT(data)

  const expected = {
    totals: {
      quantityTimes100: 42000,
      costi: { value: 20359400, currency: 'EUR' },
      corrispettivi: { value: 36676400, currency: 'EUR' },
    },
    sales: [
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Apr-2023',
        saleDate: '11-Sep-2025',
        quantityTimes100: 24000,
        costiBase: { value: 107568000, currency: 'SEK' },
        issuanceExchangeRate: 11.2805,
        costi: { value: 9535700, currency: 'EUR' },
        corrispettiviBase: { value: 230568000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 21053600, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Oct-2023',
        saleDate: '11-Sep-2025',
        quantityTimes100: 7000,
        costiBase: { value: 31409000, currency: 'SEK' },
        issuanceExchangeRate: 11.5325,
        costi: { value: 2723500, currency: 'EUR' },
        corrispettiviBase: { value: 67249000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 6140600, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Jul-2025',
        saleDate: '11-Sep-2025',
        quantityTimes100: 9000,
        costiBase: { value: 72891000, currency: 'SEK' },
        issuanceExchangeRate: 11.159,
        costi: { value: 6532000, currency: 'EUR' },
        corrispettiviBase: { value: 86463000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 7895100, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Oct-2025',
        saleDate: '24-Oct-2025',
        quantityTimes100: 2000,
        costiBase: { value: 17306000, currency: 'SEK' },
        issuanceExchangeRate: 11.0355,
        costi: { value: 1568200, currency: 'EUR' },
        corrispettiviBase: { value: 17306000, currency: 'SEK' },
        saleExchangeRate: 10.904,
        corrispettivi: { value: 1587100, currency: 'EUR' },
      },
    ],
  }

  assert.deepEqual(quadroWData, expected)
})

test('sell everything', (t) => {
  const data = {
    'larkan-holdings': larkanHoldings,
    'klarna-holdings': klarnaHoldings,
    'larkan-sales': larkanSales,
    'klarna-sales': klarnaSalesAll,
  }

  const quadroWData = calculateT(data)

  const expected = {
    totals: {
      quantityTimes100: 57000,
      costi: { value: 70333600, currency: 'EUR' },
      corrispettivi: { value: 75726800, currency: 'EUR' },
    },
    sales: [
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Apr-2023',
        saleDate: '11-Sep-2025',
        quantityTimes100: 24000,
        costiBase: { value: 107568000, currency: 'SEK' },
        issuanceExchangeRate: 11.2805,
        costi: { value: 9535700, currency: 'EUR' },
        corrispettiviBase: { value: 230568000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 21053600, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Oct-2023',
        saleDate: '11-Sep-2025',
        quantityTimes100: 7000,
        costiBase: { value: 31409000, currency: 'SEK' },
        issuanceExchangeRate: 11.5325,
        costi: { value: 2723500, currency: 'EUR' },
        corrispettiviBase: { value: 67249000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 6140600, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Jul-2025',
        saleDate: '11-Sep-2025',
        quantityTimes100: 9000,
        costiBase: { value: 72891000, currency: 'SEK' },
        issuanceExchangeRate: 11.159,
        costi: { value: 6532000, currency: 'EUR' },
        corrispettiviBase: { value: 86463000, currency: 'SEK' },
        saleExchangeRate: 10.9515,
        corrispettivi: { value: 7895100, currency: 'EUR' },
      },
      {
        ticker: 'Larkan AB RSU Program',
        issuanceDate: '01-Oct-2025',
        saleDate: '24-Oct-2025',
        quantityTimes100: 2000,
        costiBase: { value: 17306000, currency: 'SEK' },
        issuanceExchangeRate: 11.0355,
        costi: { value: 1568200, currency: 'EUR' },
        corrispettiviBase: { value: 17306000, currency: 'SEK' },
        saleExchangeRate: 10.904,
        corrispettivi: { value: 1587100, currency: 'EUR' },
      },
      {
        ticker: 'KLARNA GROUP PLC',
        issuanceDate: '11-Sep-2025',
        saleDate: '12-Dec-2025',
        quantityTimes100: 10000,
        costiBase: { value: 40000000, currency: 'USD' },
        issuanceExchangeRate: 1.1685,
        costi: { value: 34231900, currency: 'EUR' },
        corrispettiviBase: { value: 30540000, currency: 'USD' },
        saleExchangeRate: 1.1731,
        corrispettivi: { value: 26033600, currency: 'EUR' },
      },
      {
        ticker: 'KLARNA GROUP PLC',
        issuanceDate: '24-Oct-2025',
        saleDate: '12-Dec-2025',
        quantityTimes100: 5000,
        costiBase: { value: 18280000, currency: 'USD' },
        issuanceExchangeRate: 1.1612,
        costi: { value: 15742300, currency: 'EUR' },
        corrispettiviBase: { value: 15270000, currency: 'USD' },
        saleExchangeRate: 1.1731,
        corrispettivi: { value: 13016800, currency: 'EUR' },
      },
    ],
  }

  assert.deepEqual(quadroWData, expected)
})
