// wires a toggle button to show/hide a (hidden-by-default) detail table
export function wireDetailToggle(buttonId, detailTableId) {
  const detail = document.getElementById(detailTableId)
  const btn = document.getElementById(buttonId)

  detail.style.display = 'none'
  btn.textContent = '▶ Show Detailed table'
  btn.style.display = 'inline-block'

  btn.onclick = () => {
    const open = detail.style.display !== 'none'
    detail.style.display = open ? 'none' : ''
    btn.textContent = open ? '▶ Show Detailed table' : '▼ Hide Detailed table'
  }
}

export function renderTable(
  tableId,
  rows,
  { alignRight = [], bold = [], boldHeaders = [], reveal = true } = {},
) {
  const tbody = document.querySelector('#' + tableId + ' tbody')
  tbody.innerHTML = ''
  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="100%" style="text-align:center;color:#aaa;padding:20px">No data</td></tr>'
    return
  }

  const keys = Object.keys(rows[0])
  // +1 because column 0 is the # index column
  const rightAlignCols = new Set(alignRight.map((k) => keys.indexOf(k) + 1))
  const boldCols = new Set(bold.map((k) => keys.indexOf(k) + 1))
  const boldHeaderCols = new Set(
    [...boldHeaders, ...bold].map((k) => keys.indexOf(k) + 1),
  )

  const ths = document.querySelectorAll('#' + tableId + ' thead th')
  ths.forEach((th, i) => {
    th.style.textAlign = rightAlignCols.has(i) ? 'right' : ''
    th.style.fontWeight = boldHeaderCols.has(i) ? '700' : ''
  })

  for (const [i, row] of rows.entries()) {
    const tr = document.createElement('tr')

    const td = document.createElement('td')
    td.textContent = i + 1
    tr.appendChild(td)

    for (const [j, val] of Object.values(row).entries()) {
      const td = document.createElement('td')
      td.textContent = val
      if (rightAlignCols.has(j + 1)) td.style.textAlign = 'right'
      if (boldCols.has(j + 1)) td.style.fontWeight = '700'
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }

  if (reveal) {
    const wrapperId = tableId.replace('table-', 'result-')
    document.getElementById(wrapperId).style.display = 'block'
  }
}
