import { fileKey, ticker } from '../constants.mjs'
import { amountFromText, quantityTimes100FromText } from '../helpers.mjs'
import { parsedData } from '../state.mjs'

export function removeFile(key, event) {
  event.stopPropagation()
  const nameEl = document.getElementById('name-' + key)
  const areaEl = document.getElementById('upload-' + key)
  const inputEl = document.getElementById('file-' + key)
  nameEl.innerHTML = ''
  nameEl.style.display = 'none'
  areaEl.classList.remove('has-file')
  inputEl.value = ''
  parsedData[key] = null
  const body = document.getElementById('accordion-body-' + key)
  body.innerHTML = ''
  document.getElementById('accordion-' + key).classList.remove('open')
  const parsedBody = document.getElementById('accordion-body-parsed-' + key)
  if (parsedBody) parsedBody.innerHTML = ''
  document.getElementById('accordion-parsed-' + key)?.classList.remove('open')
}

export function processFile(file, key) {
  document.getElementById('error-' + key)?.remove()
  const nameEl = document.getElementById('name-' + key)
  const areaEl = document.getElementById('upload-' + key)
  nameEl.innerHTML = `<span>${file.name}</span><button class="remove-file" data-remove-key="${key}" title="Remove">✕</button>`
  nameEl.style.display = 'flex'
  areaEl.classList.add('has-file')

  const reader = new FileReader()
  reader.onload = function (e) {
    try {
      parsedData[key] = parseCsvFile(e.target.result, key)
      populateAccordion(key, e.target.result)
      populateParsedAccordion(key, parsedData[key])
    } catch (err) {
      console.error(err)

      removeFile(key, { stopPropagation: () => {} })
      const areaEl = document.getElementById('upload-' + key)
      const errorEl = document.createElement('div')
      errorEl.className = 'upload-error'
      errorEl.id = 'error-' + key
      errorEl.textContent = 'Failed to parse file: ' + err.message
      areaEl.after(errorEl)
    }
  }
  reader.readAsText(file)
}

export function populateAccordion(key, text) {
  const body = document.getElementById('accordion-body-' + key)
  if (!text || !text.trim()) {
    body.innerHTML =
      '<p style="padding:12px;color:#aaa;font-size:0.85rem">No data</p>'
    return
  }
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  body.innerHTML = `<pre style="padding:12px;font-size:0.78rem;line-height:1.5;overflow-x:auto;white-space:pre;color:#333;max-width:100%;box-sizing:border-box">${escaped}</pre>`
}

export function populateParsedAccordion(key, parsed) {
  const body = document.getElementById('accordion-body-parsed-' + key)
  if (!parsed) {
    body.innerHTML =
      '<p style="padding:12px;color:#aaa;font-size:0.85rem">No data</p>'
    return
  }
  const escaped = JSON.stringify(parsed, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  body.innerHTML = `<pre style="padding:12px;font-size:0.78rem;line-height:1.5;overflow-x:auto;white-space:pre;color:#333;max-width:100%;box-sizing:border-box">${escaped}</pre>`
}

export function toggleAccordion(key) {
  document.getElementById('accordion-' + key).classList.toggle('open')
}

export function parseCsvFile(text, key) {
  if (key === fileKey.LARKAN_HOLDINGS) {
    const parsed = parseHoldings(text)

    if (parsed.meta.ticker !== ticker.LARKAN) {
      throw new Error(`parseCsvFile: Ticker must be ${ticker.LARKAN}`)
    }

    if (parsed.meta.currency !== 'SEK') {
      throw new Error(
        `parseCsvFile: Currency must be SEK, got "${parsed.meta.currency}"`,
      )
    }

    if (parsed.meta.filter !== 'All') {
      throw new Error(
        `parseCsvFile: Filter must be "all", got "${parsed.meta.filter}"`,
      )
    }

    return parsed
  }

  if (key === fileKey.KLARNA_HOLDINGS) {
    const parsed = parseHoldings(text)

    if (parsed.meta.ticker !== ticker.KLARNA) {
      throw new Error(`parseCsvFile: Ticker must be ${ticker.KLARNA}`)
    }

    if (parsed.meta.currency !== 'USD') {
      throw new Error(
        `parseCsvFile: Currency must be USD, got "${parsed.meta.currency}"`,
      )
    }

    if (parsed.meta.filter !== 'All') {
      throw new Error(
        `parseCsvFile: Filter must be "all", got "${parsed.meta.filter}"`,
      )
    }

    return parsed
  }

  if (key === fileKey.LARKAN_SALES) {
    const parsed = parseSales(text)

    if (parsed.meta.ticker !== ticker.LARKAN) {
      throw new Error(`parseCsvFile: Ticker must be ${ticker.LARKAN}`)
    }

    if (parsed.meta.currency !== 'SEK') {
      throw new Error(
        `parseCsvFile: Currency must be SEK, got "${parsed.meta.currency}"`,
      )
    }

    if (parsed.meta.filter !== '2025') {
      throw new Error(
        `parseCsvFile: Filter must be "2025", got ${parsed.meta.filter}`,
      )
    }

    return parsed
  }

  if (key === fileKey.KLARNA_SALES) {
    const parsed = parseSales(text)

    if (parsed.meta.ticker !== ticker.KLARNA) {
      throw new Error(`Ticker must be ${ticker.KLARNA}`)
    }

    if (parsed.meta.currency !== 'USD') {
      throw new Error(
        `parseCsvFile: Currency must be USD, got "${parsed.meta.currency}"`,
      )
    }

    if (parsed.meta.filter !== '2025') {
      throw new Error(
        `parseCsvFile: Filter must be "2025", got ${parsed.meta.filter}`,
      )
    }

    return parsed
  }

  throw new Error(`parseCSV: unknown key, got "${key}"`)
}

export function parseHoldings(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.split(',').map((t) => t.replaceAll('"', '')))

  const csvType = lines[6][0]

  if (csvType !== 'My holdings') {
    throw new Error(`parseHoldings: Expected holdings, got "${csvType}"`)
  }

  const metaLine = lines[3]

  const dataLines = lines.slice(9, -6)

  const meta = {
    ticker: metaLine[4],
    currency: metaLine[6],
    filter: metaLine[7],
  }

  const data = dataLines
    .map((l) => ({
      ticker: metaLine[4],
      certificateNumber: l[0],
      issuanceDate: l[1],
      quantityTimes100: quantityTimes100FromText(l[4]),
      issuanceValueUnit: amountFromText(l[5]),
    }))
    .filter((el) => new Date(el.issuanceDate) < new Date('01-Jan-2026'))

  return { meta, data }
}

export function parseSales(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.split(',').map((t) => t.replaceAll('"', '')))

  const csvType = lines[6][0]

  if (csvType !== 'Sale history') {
    throw new Error(`parseSales: Expected sales, got "${csvType}"`)
  }

  const metaLine = lines[3]

  const dataLines = lines.slice(9, -5)

  const meta = {
    ticker: metaLine[4],
    currency: metaLine[6],
    filter: metaLine[7],
  }

  const data = dataLines.map((l) => ({
    ticker: metaLine[4],
    certificateNumber: l[0],
    issuanceDate: l[1],
    saleDate: l[2],
    issuanceValueUnit: amountFromText(l[3]),
    quantityTimes100: quantityTimes100FromText(l[4]),
    salePriceUnit: amountFromText(l[5]),
  }))

  return { meta, data }
}
