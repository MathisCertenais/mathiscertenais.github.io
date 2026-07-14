import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REFERENCE_ORIGIN = 'https://nabauer.com'
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url))
const GENERATED_ROOT = join(PROJECT_ROOT, 'src', 'generated')
const GENERATED_PAGES_ROOT = join(GENERATED_ROOT, 'pages')
const PUBLIC_ROOT = join(PROJECT_ROOT, 'public')
const REQUEST_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138 Safari/537.36',
}
const LEGACY_LINK_REWRITES = new Map([
  [
    'http://www.myfonts.com/fonts/mti/goudy-text-mt/lombardic-caps/',
    'https://www.myfonts.com/collections/goudy-text-mt-font-monotype-imaging/',
  ],
  ['http://www.superbrothershq.com/artwork/', 'https://superbrothershq.com/shop/artwork'],
  [
    'https://www.myfonts.com/fonts/adobe/centaur/',
    'https://www.myfonts.com/collections/centaur-font-monotype-imaging',
  ],
  [
    'https://www.myfonts.com/fonts/mti/dante-mt/regular/',
    'https://www.myfonts.com/collections/dante-mt-font-monotype-imaging/',
  ],
])

const htmlEntities = new Map([
  ['amp', '&'],
  ['apos', "'"],
  ['gt', '>'],
  ['lt', '<'],
  ['nbsp', '\u00a0'],
  ['quot', '"'],
])

function decodeHtml(value = '') {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, key) => {
    if (key[0] === '#') {
      const isHex = key[1]?.toLowerCase() === 'x'
      const parsed = Number.parseInt(key.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : entity
    }

    return htmlEntities.get(key.toLowerCase()) ?? entity
  })
}

function normalizePath(value) {
  const url = new URL(value, REFERENCE_ORIGIN)
  let pathname = decodeURIComponent(url.pathname)

  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '')
  return pathname || '/'
}

function isPublicPagePath(pathname) {
  if (pathname.startsWith('/_next/')) return false
  if (pathname.startsWith('/images/')) return false
  if (pathname.startsWith('/files/')) return false
  if (pathname.startsWith('/cdn-cgi/')) return false
  if (/\.[a-z0-9]+$/i.test(pathname)) return false
  return true
}

function discoverInternalRoutes(html) {
  const routes = new Set()

  for (const match of html.matchAll(/href=(?:"([^"]+)"|'([^']+)')/gi)) {
    const rawHref = decodeHtml(match[1] ?? match[2] ?? '')
    if (!rawHref || rawHref.startsWith('#')) continue

    try {
      const url = new URL(rawHref, REFERENCE_ORIGIN)
      if (url.origin !== REFERENCE_ORIGIN) continue
      const pathname = normalizePath(url.href)
      if (isPublicPagePath(pathname)) routes.add(pathname)
    } catch {
      // Ignore malformed author-provided links while continuing the public crawl.
    }
  }

  return routes
}

function extractAttribute(html, tagName, attributeName, identifyingFragment = '') {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*${identifyingFragment}[^>]*>`, 'i')
  const tag = html.match(tagPattern)?.[0]
  if (!tag) return ''

  const attributePattern = new RegExp(`${attributeName}=(?:"([^"]*)"|'([^']*)')`, 'i')
  const match = tag.match(attributePattern)
  return decodeHtml(match?.[1] ?? match?.[2] ?? '')
}

function extractMetadata(html) {
  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? 'Nate Bauer')
  const description = extractAttribute(html, 'meta', 'content', 'name=["\']description["\']')
  const canonical = extractAttribute(html, 'link', 'href', 'rel=["\']canonical["\']')
  const robots = extractAttribute(html, 'meta', 'content', 'name=["\']robots["\']')
  const ogTitle = extractAttribute(html, 'meta', 'content', 'property=["\']og:title["\']')
  const ogDescription = extractAttribute(
    html,
    'meta',
    'content',
    'property=["\']og:description["\']',
  )
  const ogImage = extractAttribute(html, 'meta', 'content', 'property=["\']og:image["\']')
  const ogImageAlt = extractAttribute(html, 'meta', 'content', 'property=["\']og:image:alt["\']')
  const twitterTitle = extractAttribute(html, 'meta', 'content', 'name=["\']twitter:title["\']')
  const twitterDescription = extractAttribute(
    html,
    'meta',
    'content',
    'name=["\']twitter:description["\']',
  )
  const twitterImage = extractAttribute(html, 'meta', 'content', 'name=["\']twitter:image["\']')

  return {
    title,
    description,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    twitterTitle,
    twitterDescription,
    twitterImage,
  }
}

function decodeCloudflareEmail(encoded) {
  if (!encoded || encoded.length < 4) return ''
  const key = Number.parseInt(encoded.slice(0, 2), 16)
  let email = ''

  for (let index = 2; index < encoded.length; index += 2) {
    email += String.fromCharCode(Number.parseInt(encoded.slice(index, index + 2), 16) ^ key)
  }

  return email
}

function cleanMainMarkup(html) {
  const main = html.match(/<main\b[^>]*id=(?:"main-content"|'main-content')[^>]*>[\s\S]*?<\/main>/i)?.[0]
  if (!main) throw new Error('The page did not contain #main-content')

  const cleaned = main
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<(script|style|object)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(?:base|embed|link|meta)\b[^>]*>/gi, '')
    .replace(/\s(?:on[a-z]+|srcdoc)=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)=("|')\s*javascript:[^"']*\2/gi, ' $1="#"')
    .replace(/\s(href|src)=\s*javascript:[^\s>]+/gi, ' $1="#"')
    .replace(
      /(src=(?:"|'))https:\/\/(?:www\.)?youtube\.com\/embed\//gi,
      '$1https://www.youtube-nocookie.com/embed/',
    )
    .replace(/\sdata-nimg=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/href=("|')https:\/\/nabauer\.com([^"']*)\1/gi, 'href="$2"')
    .replace(
      /<a\b([^>]*?)href=("|')\/cdn-cgi\/l\/email-protection(?:#[^"']*)?\2([^>]*)>([\s\S]*?)<\/a>/gi,
      (anchor, before, quote, after, contents) => {
        const encoded = contents.match(/data-cfemail=(?:"([^"]+)"|'([^']+)')/i)
        const email = decodeCloudflareEmail(encoded?.[1] ?? encoded?.[2] ?? '')
        return email ? `<a${before}href="mailto:${email}"${after}>${email}</a>` : anchor
      },
    )
    .replace(/<a\b([^>]*\bclass=(?:"__cf_email__"|'__cf_email__')[^>]*)>[\s\S]*?<\/a>/gi, (anchor, attributes) => {
      const encoded = attributes.match(/data-cfemail=(?:"([^"]+)"|'([^']+)')/i)
      const email = decodeCloudflareEmail(encoded?.[1] ?? encoded?.[2] ?? '')
      if (!email) return anchor
      const localizedAttributes = attributes
        .replace(/\s*href=(?:"[^"]*"|'[^']*')/i, '')
        .replace(/\s*data-cfemail=(?:"[^"]*"|'[^']*')/i, '')
      return `<a${localizedAttributes} href="mailto:${email}">${email}</a>`
    })

  return cleaned.replace(/href=("|')([^"']+)\1/gi, (attribute, quote, href) => {
    const replacement = LEGACY_LINK_REWRITES.get(decodeHtml(href))
    return replacement ? `href=${quote}${replacement}${quote}` : attribute
  })
}

function pageFilename(pathname) {
  if (pathname === '/') return 'home.html'
  return `${pathname.slice(1).replaceAll('/', '--')}.html`
}

function socialImagePath(pathname) {
  return `/images/meta/${pageFilename(pathname).replace(/\.html$/, '.png')}`
}

function localizeSocialMetadata(metadata, pathname, socialAssets) {
  const source = metadata.ogImage || metadata.twitterImage
  if (!source) return

  try {
    const sourceUrl = new URL(source, REFERENCE_ORIGIN)
    if (sourceUrl.origin !== REFERENCE_ORIGIN) return

    const destination = socialImagePath(pathname)
    socialAssets.set(destination, sourceUrl.href)
    if (metadata.ogImage) metadata.ogImage = destination
    if (metadata.twitterImage) metadata.twitterImage = destination
  } catch {
    // Preserve malformed author-provided metadata for review rather than failing the page crawl.
  }
}

function collectAssetUrls(markup) {
  const assets = new Set()
  const addAsset = (candidate) => {
    const decoded = decodeHtml(candidate.trim())
    if (!decoded || decoded.startsWith('data:')) return

    try {
      const url = new URL(decoded, REFERENCE_ORIGIN)
      if (url.origin !== REFERENCE_ORIGIN) return
      if (!/^\/(?:images|files)\//.test(url.pathname)) return
      assets.add(url.pathname)
    } catch {
      // Ignore malformed author-provided assets.
    }
  }

  for (const match of markup.matchAll(/(?:src|poster|href)=(?:"([^"]+)"|'([^']+)')/gi)) {
    addAsset(match[1] ?? match[2] ?? '')
  }

  for (const match of markup.matchAll(/srcset=(?:"([^"]+)"|'([^']+)')/gi)) {
    const srcset = match[1] ?? match[2] ?? ''
    for (const candidate of srcset.split(',')) addAsset(candidate.trim().split(/\s+/)[0] ?? '')
  }

  for (const match of markup.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\)/gi)) {
    addAsset(match[1] ?? match[2] ?? match[3] ?? '')
  }

  return assets
}

async function fetchText(url) {
  const response = await fetch(url, { headers: REQUEST_HEADERS, redirect: 'follow' })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return { text: await response.text(), finalUrl: response.url }
}

async function mapWithConcurrency(items, concurrency, callback) {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()
      if (item !== undefined) await callback(item)
    }
  })

  await Promise.all(workers)
}

async function crawlPages() {
  const { text: sitemap } = await fetchText(`${REFERENCE_ORIGIN}/sitemap.xml`)
  const queued = new Set(
    [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => normalizePath(match[1])),
  )
  const pages = new Map()

  while ([...queued].some((pathname) => !pages.has(pathname))) {
    const batch = [...queued].filter((pathname) => !pages.has(pathname))

    await mapWithConcurrency(batch, 6, async (pathname) => {
      const response = await fetch(`${REFERENCE_ORIGIN}${pathname}`, {
        headers: REQUEST_HEADERS,
        redirect: 'follow',
      })

      if (!response.ok) {
        console.warn(`Skipping ${pathname}: ${response.status} ${response.statusText}`)
        pages.set(pathname, null)
        return
      }

      const html = await response.text()
      pages.set(pathname, { html, finalPath: normalizePath(response.url) })
      for (const discoveredPath of discoverInternalRoutes(html)) queued.add(discoveredPath)
    })
  }

  return new Map([...pages].filter((entry) => entry[1] !== null))
}

async function downloadAsset(pathname) {
  const response = await fetch(`${REFERENCE_ORIGIN}${encodeURI(pathname)}`, {
    headers: REQUEST_HEADERS,
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${pathname}`)

  const destination = join(PUBLIC_ROOT, pathname.slice(1))
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, new Uint8Array(await response.arrayBuffer()))
}

async function downloadRemoteAsset(sourceUrl, pathname) {
  const response = await fetch(sourceUrl, {
    headers: REQUEST_HEADERS,
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${sourceUrl}`)
  const bytes = new Uint8Array(await response.arrayBuffer())
  const isPng =
    bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  if (!isPng) throw new Error(`Expected a PNG image response: ${sourceUrl}`)

  const destination = join(PUBLIC_ROOT, pathname.slice(1))
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, bytes)
}

async function syncReferenceStyles() {
  const { text: stylesheet } = await fetchText(
    `${REFERENCE_ORIGIN}/_next/static/chunks/0z72rqlijqo2m.css`,
  )
  const localizedStylesheet = stylesheet
    .replace(
      /url\(\.\.\/media\/(?:b2ea385cb5ae8625|1b99372b3eaef0c8)[^)]*\.woff2\)/g,
      "url('/assets/fonts/outfit-latin.woff2')",
    )
    .replace(
      /url\(\.\.\/media\/(?:85e270911e713436|2ad3cd63006f4f39)[^)]*\.woff2\)/g,
      "url('/assets/fonts/libre-baskerville-latin.woff2')",
    )

  if (/@import|expression\s*\(|javascript\s*:|url\(\s*['"]?https?:/i.test(localizedStylesheet)) {
    throw new Error('Reference stylesheet contains a disallowed external or active CSS construct')
  }

  await writeFile(join(PROJECT_ROOT, 'src', 'reference.css'), localizedStylesheet)
}

async function collectInteractionAssets(assets, optionalAssets) {
  const shorts = JSON.parse(
    await readFile(join(PROJECT_ROOT, 'src', 'data', 'reference-shorts.json'), 'utf8'),
  )
  const videos = JSON.parse(
    await readFile(join(PROJECT_ROOT, 'src', 'data', 'reference-videos.json'), 'utf8'),
  )

  for (const item of shorts) {
    for (const asset of collectAssetUrls(item.html ?? '')) assets.add(asset)
  }

  for (const item of videos) {
    if (!item.image?.startsWith('/images/videos/')) continue
    assets.add(item.image)
    const base = item.image.replace(/\.[^.]+$/, '')
    optionalAssets.add(`${base}.480.webp`)
    optionalAssets.add(`${base}.960.webp`)
  }
}

async function main() {
  const pages = await crawlPages()
  const manifest = []
  const assets = new Set([
    '/apple-icon.png',
    '/favicon-dark.png',
    '/favicon.ico',
    '/icon-192.png',
    '/icon-512.png',
    '/images/ui/logo.png',
    '/images/ui/logo.480.webp',
    '/manifest.webmanifest',
  ])
  const optionalAssets = new Set()
  const socialAssets = new Map()

  await rm(GENERATED_ROOT, { recursive: true, force: true })
  await mkdir(GENERATED_PAGES_ROOT, { recursive: true })

  for (const [pathname, page] of [...pages].sort(([left], [right]) => left.localeCompare(right))) {
    const metadata = extractMetadata(page.html)
    localizeSocialMetadata(metadata, pathname, socialAssets)
    let markup
    try {
      markup = cleanMainMarkup(page.html)
    } catch (error) {
      console.warn(`Recording client-only route ${pathname}: ${error.message}`)
      manifest.push({
        path: pathname,
        finalPath: page.finalPath,
        file: null,
        clientOnly: true,
        ...metadata,
      })
      continue
    }
    const filename = pageFilename(pathname)

    await writeFile(join(GENERATED_PAGES_ROOT, filename), `${markup}\n`)
    manifest.push({
      path: pathname,
      finalPath: page.finalPath,
      file: filename,
      ...metadata,
    })

    for (const asset of collectAssetUrls(markup)) assets.add(asset)
  }

  await writeFile(
    join(GENERATED_ROOT, 'manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), origin: REFERENCE_ORIGIN, pages: manifest }, null, 2)}\n`,
  )
  await syncReferenceStyles()
  await collectInteractionAssets(assets, optionalAssets)
  await mapWithConcurrency([...assets].sort(), 10, downloadAsset)
  await mapWithConcurrency([...optionalAssets].sort(), 10, async (asset) => {
    try {
      await downloadAsset(asset)
    } catch (error) {
      console.warn(`Optional responsive asset unavailable: ${asset} (${error.message})`)
    }
  })
  await mapWithConcurrency([...socialAssets], 10, ([pathname, sourceUrl]) =>
    downloadRemoteAsset(sourceUrl, pathname),
  )

  console.log(
    `Synced ${manifest.length} routes and ${assets.size + optionalAssets.size + socialAssets.size} local assets from ${REFERENCE_ORIGIN}.`,
  )
}

await main()
