import { createServer } from 'http'
import { readFile } from 'fs'
import { join, extname } from 'path'

const ROOT = new URL('..', import.meta.url).pathname
const MOCK_STATE = process.env.MOCK_STATE === 'true'

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
}

createServer((req, res) => {
  const filePath = join(ROOT, req.url === '/' ? 'index.html' : req.url)
  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    let body = data
    if (extname(filePath) === '.html') {
      body = data
        .toString()
        .replace(
          '<head>',
          `<head>\n    <script>window.MOCK_STATE = ${MOCK_STATE}</script>`,
        )
    }

    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
    })
    res.end(body)
  })
}).listen(3000, () => console.log('http://localhost:3000'))
