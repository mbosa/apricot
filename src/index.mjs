import { attachEvents } from './DOMEvents.mjs'

function showGlobalError(message, stack) {
  const banner = document.getElementById('global-error')
  const msg = document.getElementById('global-error-message')
  msg.textContent = message
  if (stack) {
    const pre = document.createElement('pre')
    pre.style.cssText = 'margin-top:8px;font-size:0.8rem;white-space:pre-wrap;opacity:0.8'
    pre.textContent = stack
    msg.appendChild(pre)
  }
  banner.style.display = 'block'
  banner.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

window.addEventListener('error', (e) => showGlobalError(e.message, e.error?.stack))
window.addEventListener('unhandledrejection', (e) => showGlobalError(e.reason?.message ?? String(e.reason), e.reason?.stack))

attachEvents()
