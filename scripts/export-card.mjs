#!/usr/bin/env node
/**
 * Exports the contact page business card as the files a print shop asks for — a
 * PDF, a JPEG — and as the image link previews need.
 *
 * The card is HTML and CSS, so every file comes from the browser's own rendering
 * of the very same markup and styles the page uses: no second design to keep in
 * sync, and nothing to redraw when the copy changes. The print stylesheet on
 * /contact isolates the card and sizes the paper to 91 x 61 mm, which is a
 * 85 x 55 mm card plus 3 mm of bleed on each side. The share image renders the
 * card's `share` variant instead: the same design at 1200 x 630, the shape
 * LinkedIn and Facebook render.
 *
 * Usage:
 *   node scripts/export-card.mjs [output-path] [--format pdf|jpg|both|social]
 *
 * Defaults to --format pdf and mathis-certenais-card.<ext> in the project root.
 * `social` always writes public/images/mathis/social-card.png, which the site
 * references. Set CHROME_PATH to use a specific Chromium build.
 */

import { spawn } from 'node:child_process'
import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const MM = 1 / 25.4 // millimetres to inches, for the printToPDF paper size
const FORMATS = ['pdf', 'jpg', 'both', 'social']

/* The card is 91 x 61 mm. A JPEG at four device pixels per CSS pixel lands at
   1376 x 922 px, which is 384 dpi — comfortably above the 300 dpi floor print
   shops ask for — and needs no resampling step afterwards. */
const JPEG_SCALE = 4
const JPEG_QUALITY = 95

/* The share image is the size LinkedIn and Facebook render into: 1200 x 630,
   which is what the `share` variant of the card is drawn at. */
const SHARE_WIDTH = 1200
const SHARE_HEIGHT = 630
const SHARE_DESTINATION = join(projectRoot, 'public', 'images', 'mathis', 'social-card.png')

function pngSize(buffer) {
  return { height: buffer.readUInt32BE(20), width: buffer.readUInt32BE(16) }
}

/** Pixel dimensions of a JPEG, read from its start-of-frame segment. */
function jpegSize(buffer) {
  let offset = 2
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buffer[offset + 1]
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isStartOfFrame) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    const length = buffer.readUInt16BE(offset + 2)
    if (length < 2) return null
    offset += 2 + length
  }
  return null
}

/**
 * Writes the real resolution into the JFIF header. Without it the file claims
 * 72 dpi, and a layout tool placing it would size the card at three times its
 * physical dimensions.
 */
function stampJpegResolution(buffer, dpi) {
  const isJfif = buffer[2] === 0xff && buffer[3] === 0xe0 && buffer.toString('latin1', 6, 10) === 'JFIF'
  if (!isJfif || buffer.length < 18) return buffer

  const stamped = Buffer.from(buffer)
  stamped[13] = 1 // density units: dots per inch
  stamped.writeUInt16BE(dpi, 14)
  stamped.writeUInt16BE(dpi, 16)
  return stamped
}

async function exists(path) {
  try {
    await access(path, constants.X_OK)
    return true
  } catch {
    return false
  }
}

async function playwrightChromium() {
  const cache = join(homedir(), 'Library', 'Caches', 'ms-playwright')
  let entries = []
  try {
    entries = await readdir(cache)
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.startsWith('chromium-'))
    .map((entry) =>
      join(
        cache,
        entry,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      ),
    )
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    ...(await playwrightChromium()),
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }
  throw new Error(`No Chromium build found. Tried:\n  ${candidates.join('\n  ')}`)
}

async function debuggerUrl(port) {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = targets.find((target) => target.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {
      // The debugging endpoint is not up yet.
    }
    await new Promise((done) => setTimeout(done, 250))
  }
  throw new Error('The browser never opened its debugging port.')
}

function createClient(socket) {
  let messageId = 0
  const pending = new Map()

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    const settle = pending.get(message.id)
    if (!settle) return
    pending.delete(message.id)
    settle(message)
  }

  return (method, params = {}) =>
    new Promise((resolveCall, rejectCall) => {
      const id = ++messageId
      pending.set(id, (message) =>
        message.error
          ? rejectCall(new Error(`${method}: ${message.error.message}`))
          : resolveCall(message.result),
      )
      socket.send(JSON.stringify({ id, method, params }))
    })
}

function parseArguments(argv) {
  let format = 'pdf'
  const positional = []

  for (let index = 0; index < argv.length; index++) {
    if (argv[index] === '--format') {
      format = argv[++index]
      if (!FORMATS.includes(format)) {
        throw new TypeError(`Unknown format: ${format}. Use one of ${FORMATS.join(', ')}.`)
      }
    } else if (argv[index].startsWith('--')) {
      throw new TypeError(`Unknown option: ${argv[index]}`)
    } else {
      positional.push(argv[index])
    }
  }

  const base = (positional[0] ? resolve(positional[0]) : join(projectRoot, 'mathis-certenais-card'))
    .replace(/\.(?:pdf|jpe?g|png)$/i, '')

  return { base, format }
}

const { base, format } = parseArguments(process.argv.slice(2))
const wanted = format === 'both' ? ['pdf', 'jpg'] : [format]
const written = []
const server = await createServer({
  root: projectRoot,
  logLevel: 'warn',
  server: { host: '127.0.0.1', port: 0 },
})
await server.listen()

const origin = server.resolvedUrls?.local?.[0]
if (!origin) {
  await server.close()
  throw new Error('Vite did not report a local URL.')
}

const chrome = spawn(
  await findChrome(),
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${join(tmpdir(), `card-export-${process.pid}`)}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    // Pin the colour space: a headless profile on a wide-gamut display would
    // otherwise shift every colour in the exported files.
    '--force-color-profile=srgb',
    '--window-size=1440,1200',
    'about:blank',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)

let port
await new Promise((resolveReady, rejectReady) => {
  const timeout = setTimeout(
    () => rejectReady(new Error('Timed out waiting for the browser to start.')),
    30_000,
  )
  const listen = (stream) => {
    stream.on('data', (chunk) => {
      const found = /DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/.exec(String(chunk))?.[1]
      if (!found) return
      clearTimeout(timeout)
      port = Number(found)
      resolveReady()
    })
  }
  listen(chrome.stdout)
  listen(chrome.stderr)
  chrome.on('exit', () => rejectReady(new Error('The browser exited before it was ready.')))
})

const socket = new WebSocket(await debuggerUrl(port))
await new Promise((resolveOpen, rejectOpen) => {
  socket.onopen = resolveOpen
  socket.onerror = () => rejectOpen(new Error('Could not attach to the browser.'))
})

const send = createClient(socket)
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    awaitPromise: true,
    expression,
    returnByValue: true,
  })
  return result.result?.value
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: 'light' }],
})

const target = new URL('contact', origin).href
await send('Page.navigate', { url: target })

for (let attempt = 0; attempt < 120; attempt++) {
  if (await evaluate(`!!document.querySelector('.business-card')`)) break
  await new Promise((done) => setTimeout(done, 250))
}

// The card is set in the site's webfonts, so wait for them before exporting,
// otherwise both files would fall back to a system face.
await evaluate(`document.fonts.ready.then(() => true)`)
const card = await evaluate(`(() => {
  const node = document.querySelector('.business-card')
  if (!node) return null
  return {
    height: Math.round(node.getBoundingClientRect().height),
    width: Math.round(node.getBoundingClientRect().width),
  }
})()`)

if (!card) throw new Error(`No business card found at ${target}.`)

if (wanted.includes('pdf')) {
  const pdf = await send('Page.printToPDF', {
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    // 85 x 55 mm of card plus 3 mm of bleed on every side. The explicit size
    // keeps the export deterministic; the named `@page card` rule in the
    // stylesheet gives a browser's own print dialog the same format.
    paperHeight: 61 * MM,
    paperWidth: 91 * MM,
    preferCSSPageSize: false,
    printBackground: true,
  })
  const data = Buffer.from(pdf.data, 'base64')
  const path = `${base}.pdf`
  await writeFile(path, data)
  const pages = (data.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length
  const box = /MediaBox\s*\[([^\]]*)\]/
    .exec(data.toString('latin1'))?.[1]
    .trim()
    .split(/\s+/)
    .map(Number)
  written.push({
    detail: box
      ? `${pages} page(s), ${(Math.abs(box[2] - box[0]) / 72) * 25.4} x ${(Math.abs(box[3] - box[1]) / 72) * 25.4} mm`
      : `${pages} page(s)`,
    kb: Math.round(data.length / 1024),
    path,
  })
}

if (wanted.includes('jpg')) {
  // The print stylesheet is what isolates the card and gives it its exact
  // 91 x 61 mm geometry, so the image uses the same rules the PDF does.
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
    media: 'print',
  })
  await new Promise((done) => setTimeout(done, 300))

  const clip = await evaluate(`(() => {
    const frame = document.querySelector('.contact-card__frame')
    if (!frame) return null
    const rect = frame.getBoundingClientRect()
    // One CSS pixel of slack: Chrome snaps the clip to whole CSS pixels before
    // scaling, which would otherwise eat into the right and bottom bleed.
    return {
      height: rect.height + 1,
      scale: ${JPEG_SCALE},
      width: rect.width + 1,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    }
  })()`)

  if (!clip) throw new Error('The print layout did not expose the card frame.')

  const shot = await send('Page.captureScreenshot', {
    captureBeyondViewport: true,
    clip,
    format: 'jpeg',
    quality: JPEG_QUALITY,
  })
  const raw = Buffer.from(shot.data, 'base64')
  const pixels = jpegSize(raw)
  const dpi = pixels ? Math.round(pixels.width / (91 / 25.4)) : 0
  const data = dpi ? stampJpegResolution(raw, dpi) : raw
  const path = `${base}.jpg`

  await writeFile(path, data)
  written.push({
    detail: pixels ? `${pixels.width} x ${pixels.height} px, ${dpi} dpi` : 'JPEG',
    kb: Math.round(data.length / 1024),
    path,
  })
}

if (wanted.includes('social')) {
  // Back to screen media: the share variant is a page element, not a print one.
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
    media: '',
  })
  await evaluate(`document.documentElement.classList.add('share-capture')`)
  await new Promise((done) => setTimeout(done, 400))

  const share = await evaluate(`(() => {
    const card = document.querySelector('.business-card--share')
    if (!card) return null
    const rect = card.getBoundingClientRect()
    // Anything drawn outside the card would be silently clipped by the capture,
    // which is how a share image ends up missing its last line.
    const escapes = []
    for (const node of card.querySelectorAll('*')) {
      const box = node.getBoundingClientRect()
      if (box.width === 0 && box.height === 0) continue
      if (box.right > rect.right + 1 || box.bottom > rect.bottom + 1) {
        escapes.push(
          (node.className || node.tagName) + ' ' + Math.round(box.right - rect.left) + 'x' + Math.round(box.bottom - rect.top),
        )
      }
    }
    return {
      escapes,
      height: Math.round(rect.height),
      offsetX: rect.left + window.scrollX,
      offsetY: rect.top + window.scrollY,
      width: Math.round(rect.width),
    }
  })()`)

  if (!share) throw new Error('The page rendered no share variant of the card.')
  if (share.width !== SHARE_WIDTH || share.height !== SHARE_HEIGHT) {
    throw new Error(
      `The share card rendered at ${share.width}x${share.height} instead of ${SHARE_WIDTH}x${SHARE_HEIGHT}.`,
    )
  }
  if (share.escapes.length > 0) {
    throw new Error(
      `Content runs outside the share card, so the image would be clipped: ${share.escapes.join(', ')}`,
    )
  }

  const shot = await send('Page.captureScreenshot', {
    // Flatten onto white: the card's rounded corners would otherwise stay
    // transparent, and previews composite PNG alpha inconsistently.
    backgroundColor: { a: 1, b: 255, g: 255, r: 255 },
    captureBeyondViewport: true,
    clip: {
      height: SHARE_HEIGHT,
      scale: 1,
      width: SHARE_WIDTH,
      x: share.offsetX,
      y: share.offsetY,
    },
    format: 'png',
    optimizeForSpeed: false,
  })
  const data = Buffer.from(shot.data, 'base64')
  await writeFile(SHARE_DESTINATION, data)
  written.push({
    detail: `${pngSize(data).width} x ${pngSize(data).height} px`,
    kb: Math.round(data.length / 1024),
    path: SHARE_DESTINATION,
  })
}

socket.close()
chrome.kill()
await server.close()

for (const file of written) {
  console.log(`Wrote ${relative(projectRoot, file.path)} — ${file.detail}, ${file.kb} kB`)
}
console.log(
  `Card ${card.width}x${card.height} px on screen, rendered from ${target} at 85x55 mm plus 3 mm of bleed.`,
)
