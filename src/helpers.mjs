import {
  dailyExchangeRateEurSekTimes,
  dailyExchangeRateEurUsdTimes,
  DAY_MS,
} from './constants.mjs'

// format: `SEK 96.07`
// if the text is within parenthesis, e.g. `(SEK 96.07)`, it's considered negative
export function amountFromText(text) {
  let multiplier = 1

  if (text.startsWith('(')) {
    multiplier = -1
    text = text.slice(1, -1)
  }

  const spl = text.trim().split(' ')

  const currency = spl[0]
  // multiply by 100 to deal with minor units instead of decimals
  const value = Math.round(
    Number(spl[1].replaceAll(',', '')) * 100 * multiplier,
  )

  return { value, currency }
}

// for some reason some quantities are floating point numbers with up to 2 decimals
// multiply by 100 to deal with integers
export function quantityTimes100FromText(text) {
  const quantity = Number(text)

  return quantity * 100
}

export function convertToEur(amount, day) {
  const fromCur = amount.currency
  const value = amount.value

  let exchangeRate = 1

  if (fromCur !== 'USD' && fromCur !== 'SEK') {
    throw new Error(`convertToEur: Currency not supported, got "${fromCur}"`)
  }

  if (fromCur === 'SEK') {
    if (!(day in dailyExchangeRateEurSekTimes)) {
      throw new Error(
        `convertToEur: Exchange rate EUR-SEK for day "${day}" not available`,
      )
    }

    exchangeRate = dailyExchangeRateEurSekTimes[day]
  }

  if (fromCur === 'USD') {
    if (!(day in dailyExchangeRateEurUsdTimes)) {
      throw new Error(
        `convertToEur: Exchange rate EUR-USD for day "${day}" not available`,
      )
    }

    exchangeRate = dailyExchangeRateEurUsdTimes[day]
  }

  // the value is scaled up by 10_000 due to foreign currency value
  // and quantity being scaled up each by 100
  // roud to 2 decimals while still keeping the number scaled by 10_000
  const convertedValue = Math.round(value / exchangeRate / 100) * 100

  return { result: { value: convertedValue, currency: 'EUR' }, exchangeRate }
}

// amount.value is multiplied by 100 on collection to make it an integer
// quantity is multiplied by 100 on collection to make it an integer
// the value needs to be scaled down and rounded before displaying it
export function formatAmountForReport(amount, decimals = 0) {
  const { value, currency } = amount

  const v = (value / 100 / 100).toFixed(decimals)

  const currencySymbol =
    currency === 'EUR'
      ? '€'
      : currency === 'USD'
        ? '$'
        : currency === 'SEK'
          ? 'kr'
          : '??'

  return {
    value: `${v} ${currencySymbol}`,
    currency,
  }
}

export function countDays(a, b) {
  const aDate = new Date(a)
  const bDate = new Date(b)

  const aDateUTC = Date.UTC(
    aDate.getFullYear(),
    aDate.getMonth(),
    aDate.getDate(),
  )
  const bDateUTC = Date.UTC(
    bDate.getFullYear(),
    bDate.getMonth(),
    bDate.getDate(),
  )

  return (aDateUTC - bDateUTC) / DAY_MS
}
