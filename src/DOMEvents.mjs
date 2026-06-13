import { processFile, toggleAccordion, removeFile } from './handlers/file.mjs'
import { buildQuadroT } from './handlers/quadro/quadro-t.mjs'
import { buildQuadroW } from './handlers/quadro/quadro-w.mjs'

export function attachEvents() {
  document.querySelectorAll('.upload-area').forEach((area) => {
    const key = area.id.replace('upload-', '')
    area
      .querySelector('input[type="file"]')
      .addEventListener('change', function (e) {
        e.preventDefault()
        const file = e.target.files[0]

        if (file) {
          processFile(file, key)
        }
      })
    area.addEventListener('dragover', (e) => {
      e.preventDefault()
      area.classList.add('drag-over')
    })
    area.addEventListener('dragleave', (e) => {
      if (!area.contains(e.relatedTarget)) area.classList.remove('drag-over')
    })
    area.addEventListener('drop', (e) => {
      e.preventDefault()
      area.classList.remove('drag-over')
      const file = e.dataTransfer.files[0]

      if (file) {
        processFile(file, key)
      }
    })
  })

  document.querySelectorAll('.accordion-header').forEach((btn) => {
    const key = btn.closest('.accordion').id.replace('accordion-', '')
    btn.addEventListener('click', () => toggleAccordion(key))
  })

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-key]')
    if (btn) removeFile(btn.dataset.removeKey, e)
  })

  document
    .getElementById('btn-quadro-w')
    .addEventListener('click', buildQuadroW)
  document
    .getElementById('btn-quadro-t')
    .addEventListener('click', buildQuadroT)
}
