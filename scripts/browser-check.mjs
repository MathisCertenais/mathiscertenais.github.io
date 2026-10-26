#!/usr/bin/env node
/**
 * Render a page in the Chromium that is already on this machine and report what
 * it actually produced: the DOM after JavaScript ran, a screenshot, and the
 * console errors Chromium logged.
 *
 * The point is evidence. `pnpm check` proves the build; this proves the page.
 *
 * Usage:
 *   node scripts/browser-check.mjs <url> [options]
 *
 * Options:
 *   --serve            start `vite preview` on --port and stop it afterwards
 *   --port <n>         preview port (default 4173)
 *   --out <file.png>   write a screenshot
 *   --expect <text>    fail unless the rendered DOM contains this text (repeatable)
 *   --size <WxH>       viewport (default 1440x900)
 *   --timeout <ms>     total budget for the page (default 20000)
 *   --eval <js>        evaluate this expression in the page (async allowed),
 *                      print the JSON result and exit — for interaction tests
 *
 * Environment:
 *   CHROME_PATH        explicit browser binary; otherwise the Playwright cache,
 *                      then a system Chrome/Chromium is used.
 *
 * Exit code 0 when the page rendered, every --expect matched, no console error
 * was logged and the React root is not empty. 1 otherwise.
 */

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const options = {
  expect: [],
  out: null,
  port: 4173,
  serve: false,
  size: '1440x900',
  timeout: 20000,
  eval: null,
}

const positional = []
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index]
  const next = () => {
    const value = process.argv[index + 1]
    if (!value) throw new Error(`${argument} needs a value`)
    index += 1
    return value
  }
  if (argument === '--serve') options.serve = true
  else if (argument === '--out') options.out = next()
  else if (argument === '--expect') options.expect.push(next())
  else if (argument === '--port') options.port = Number(next())
  else if (argument === '--size') options.size = next()
  else if (argument === '--timeout') options.timeout = Number(next())
  else if (argument === '--eval') options.eval = next()
  else if (argument.startsWith('--')) throw new Error(`Unknown option ${argument}`)
  else positional.push(argument)
}

const url = positional[0]
if (!url) throw new Error('Usage: node scripts/browser-check.mjs <url> [--serve] [--out shot.png] [--expect text]')

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH

  const cache = join(homedir(), 'Library/Caches', 'ms-playwright')
  if (existsSync(cache)) {
    const builds = readdirSync(cache)
      .filter((entry) => entry.startsWith('chromium-'))
      .sort()
      .reverse()
    for (const build of builds) {
      const binary = join(
        cache,
        build,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      )
      if (existsSync(binary)) return binary
    }
  }

  for (const candidate of [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]) {
    if (existsSync(candidate)) return candidate
  }

  throw new Error('No Chromium found. Set CHROME_PATH to a Chrome or Chromium binary.')
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForServer(target, timeout) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    try {
      const response = await fetch(target)
      if (response.ok) return
    } catch {
      // The preview server is not listening yet.
    }
    await sleep(200)
  }
  throw new Error(`No server answered at ${target} within ${timeout} ms`)
}

const viteBin = join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')

async function evaluateInPage(chrome, target, expression, timeout) {
  const profile = mkdtempSync(join(tmpdir(), 'browser-check-'))
  const browser = spawn(
    '/bin/sh',
    [
      '-c',
      'exec "$0" "$@"',
      chrome,
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      `--window-size=${options.size.replace('x', ',')}`,
      'about:blank',
    ],
    { detached: true, stdio: 'ignore' },
  )

  try {
    const portFile = join(profile, 'DevToolsActivePort')
    const deadline = Date.now() + timeout
    let port = null
    while (Date.now() < deadline) {
      if (existsSync(portFile)) {
        port = Number(readFileSync(portFile, 'utf8').split('\n')[0])
        if (port) break
      }
      await sleep(100)
    }
    if (!port) throw new Error('Chromium did not expose a DevTools port')

    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
    const page = targets.find((target) => target.type === 'page')
    if (!page) throw new Error('Chromium exposed no page target')

    const socket = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => {
      socket.onopen = resolve
      socket.onerror = reject
    })

    let nextId = 0
    const pending = new Map()
    const events = []
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message)
        pending.delete(message.id)
      } else {
        events.push(message)
      }
    }
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = (nextId += 1)
        pending.set(id, resolve)
        socket.send(JSON.stringify({ id, method, params }))
      })

    await send('Page.enable')
    const loaded = new Promise((resolve) => {
      const timer = setInterval(() => {
        const index = events.findIndex((event) => event.method === 'Page.loadEventFired')
        if (index >= 0) {
          events.splice(index, 1)
          clearInterval(timer)
          resolve()
        }
      }, 50)
      setTimeout(() => {
        clearInterval(timer)
        resolve()
      }, Math.min(timeout, 10000))
    })
    await send('Page.navigate', { url: target })
    await loaded
    await sleep(700)

    const result = await send('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    })
    socket.close()

    if (result.result?.exceptionDetails) {
      throw new Error(
        result.result.exceptionDetails.exception?.description ??
          result.result.exceptionDetails.text,
      )
    }
    return result.result?.result?.value
  } finally {
    try {
      process.kill(-browser.pid, 'SIGTERM')
    } catch {
      browser.kill('SIGTERM')
    }
    // Chromium writes its profile while shutting down; retry rather than race it.
    await sleep(200)
    rmSync(profile, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 })
  }
}

let preview = null
try {
  if (options.serve) {
    if (!existsSync(viteBin)) throw new Error(`No Vite at ${viteBin}; run pnpm install first.`)

    const urlPort = Number(new URL(url).port || 80)
    if (urlPort !== options.port) {
      throw new Error(`--port ${options.port} does not match the URL port ${urlPort}`)
    }

    let alreadyListening = false
    try {
      await fetch(url)
      alreadyListening = true
    } catch {
      // Nothing is listening yet: that is what --serve expects.
    }
    if (alreadyListening) {
      throw new Error(`Something is already listening at ${url}; stop it or choose another --port.`)
    }

    // Spawn Vite directly, in its own process group: killing the group in the
    // finally block also stops the esbuild/rollup children, so a later --serve
    // cannot be answered by a stale server.
    preview = spawn(
      process.execPath,
      [viteBin, 'preview', '--port', String(options.port), '--strictPort'],
      { detached: true, stdio: 'ignore' },
    )
    await waitForServer(url, options.timeout)
  }

  const chrome = findChrome()

  if (options.eval) {
    const value = await evaluateInPage(chrome, url, options.eval, options.timeout)
    console.log(JSON.stringify(value, null, 2))
  } else {
  // Launching the signed Chromium binary directly from Node is killed by macOS
  // (SIGKILL, no output); going through /bin/sh with `exec "$0" "$@"` works and
  // still passes every argument verbatim, with no shell interpolation.
  const result = spawnSync(
    '/bin/sh',
    [
      '-c',
      'exec "$0" "$@"',
      chrome,
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--enable-logging=stderr',
      '--v=0',
      `--window-size=${options.size.replace('x', ',')}`,
      `--virtual-time-budget=${Math.min(options.timeout, 10000)}`,
      ...(options.out ? [`--screenshot=${options.out}`] : []),
      '--dump-dom',
      url,
    ],
    { encoding: 'utf8', timeout: options.timeout, maxBuffer: 20 * 1024 * 1024 },
  )

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`Chromium exited with ${result.status}: ${(result.stderr || '').trim()}`)
  }

  const dom = result.stdout
  const title = /<title>([^<]*)<\/title>/i.exec(dom)?.[1]?.trim() ?? '(no title)'
  const emptyRoot = /<div id="root">\s*<\/div>/i.test(dom)
  const consoleErrors = (result.stderr || '')
    .split('\n')
    .filter((line) => /ERROR:CONSOLE|Uncaught/i.test(line))
    .map((line) => line.trim())

  const missing = options.expect.filter((text) => !dom.includes(text))
  const checks = [
    ['rendered DOM', dom.length > 0],
    ['React root is not empty', !emptyRoot],
    ['no console errors', consoleErrors.length === 0],
    ...options.expect.map((text) => [`contains ${JSON.stringify(text)}`, !missing.includes(text)]),
  ]

  console.log(`url:    ${url}`)
  console.log(`title:  ${title}`)
  console.log(`dom:    ${dom.length} characters`)
  if (options.out) console.log(`shot:   ${options.out}`)
  for (const [label, passed] of checks) console.log(`${passed ? 'ok  ' : 'FAIL'}  ${label}`)
  if (consoleErrors.length) for (const line of consoleErrors) console.log(`      ${line}`)

  if (checks.some(([, passed]) => !passed)) process.exitCode = 1
  }
} finally {
  if (preview) {
    try {
      process.kill(-preview.pid, 'SIGTERM')
    } catch {
      preview.kill('SIGTERM')
    }
  }
}
