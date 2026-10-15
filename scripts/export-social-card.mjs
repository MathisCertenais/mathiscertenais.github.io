#!/usr/bin/env node
/**
 * Renders the social sharing card as a PNG.
 *
 * Link previews — LinkedIn, WhatsApp, Slack, Facebook, X — do not decode SVG,
 * so the Open Graph image has to be a raster file. This renders the committed
 * `social-card.svg` (which stays the editable source) at the 1200 x 630 size
 * those services expect, through the same headless Chromium the card export
 * uses. Nothing here runs at build time: the PNG is committed, so the site and
 * the deploy workflow need no browser.
 *
 * Usage:
 *   node scripts/export-social-card.mjs [--scale 1]
 *
 * Set CHROME_PATH to use a specific Chromium build.
 */

import { spawn } from 'node:child_process'
import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const source = join(projectRoot, 'public', 'images', 'mathis', 'social-card.svg')
const destination = join(projectRoot, 'public', 'images', 'mathis', 'social-card.png')
const WIDTH = 1200
const HEIGHT = 630

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

const scaleArgument = process.argv.indexOf('--scale')
const scale = scaleArgument === -1 ? 1 : Number(process.argv[scaleArgument + 1])
if (!Number.isFinite(scale) || scale <= 0) throw new TypeError('--scale needs a positive number.')

const chrome = spawn(
  await findChrome(),
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${join(tmpdir(), `social-card-${process.pid}`)}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    // Roomier than the artwork, so Chrome renders the SVG at its intrinsic size
    // instead of scaling it down to fit the window.
    `--window-size=${WIDTH + 200},${HEIGHT + 200}`,
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
await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  deviceScaleFactor: scale,
  height: HEIGHT + 200,
  mobile: false,
  width: WIDTH + 200,
})

await send('Page.navigate', { url: pathToFileURL(source).href })
await new Promise((done) => setTimeout(done, 500))

// Measure the artwork instead of assuming it sits at the origin: a standalone
// SVG is laid out by the browser like any other replaced element.
const artwork = await send('Runtime.evaluate', {
  expression: `(() => {
    const node = document.documentElement
    const rect = node.getBoundingClientRect()
    return { height: rect.height, offsetX: rect.left, offsetY: rect.top, width: rect.width }
  })()`,
  returnByValue: true,
}).then((result) => result.result.value)

if (Math.round(artwork.width) !== WIDTH || Math.round(artwork.height) !== HEIGHT) {
  throw new Error(
    `The artwork rendered at ${artwork.width}x${artwork.height} instead of ${WIDTH}x${HEIGHT}.`,
  )
}

const shot = await send('Page.captureScreenshot', {
  backgroundColor: { a: 1, b: 255, g: 255, r: 255 },
  captureBeyondViewport: true,
  clip: {
    height: HEIGHT,
    scale,
    width: WIDTH,
    x: artwork.offsetX,
    y: artwork.offsetY,
  },
  format: 'png',
  optimizeForSpeed: false,
})

await writeFile(destination, Buffer.from(shot.data, 'base64'))

socket.close()
chrome.kill()

const bytes = await readFile(destination)
// PNG stores its dimensions as two big-endian uint32 at bytes 16 and 20.
const width = bytes.readUInt32BE(16)
const height = bytes.readUInt32BE(20)

console.log(
  `Wrote ${relative(projectRoot, destination)} — ${width} x ${height} px, ${Math.round(bytes.length / 1024)} kB, from ${relative(projectRoot, source)}`,
)
