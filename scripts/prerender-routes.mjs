import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = join(projectRoot, 'dist')
const manifest = JSON.parse(
  await readFile(join(projectRoot, 'src', 'data', 'route-manifest.json'), 'utf8'),
)
const template = await readFile(join(distRoot, 'index.html'), 'utf8')
const configuredSiteUrl = loadEnv('production', projectRoot, '').VITE_SITE_URL?.trim()
const siteUrl = configuredSiteUrl?.replace(/\/$/, '')

if (!Array.isArray(manifest)) {
  throw new TypeError('src/data/route-manifest.json must contain an array of routes.')
}

const manifestPaths = new Set()
for (const entry of manifest) {
  if (
    !entry ||
    typeof entry.path !== 'string' ||
    typeof entry.canonical !== 'string' ||
    typeof entry.title !== 'string' ||
    typeof entry.description !== 'string' ||
    !entry.path.startsWith('/') ||
    entry.path.includes('..')
  ) {
    throw new TypeError('Every route needs safe path, canonical, title, and description values.')
  }
  if (manifestPaths.has(entry.path)) throw new TypeError(`Duplicate route path: ${entry.path}`)
  manifestPaths.add(entry.path)
}

for (const entry of manifest) {
  if (!manifestPaths.has(entry.canonical)) {
    throw new TypeError(`Unknown canonical target: ${entry.path} -> ${entry.canonical}`)
  }
}

if (siteUrl && !/^https?:\/\/[^\s]+$/i.test(siteUrl)) {
  throw new TypeError('VITE_SITE_URL must be an absolute http(s) URL.')
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function absoluteUrl(value) {
  if (!value || !siteUrl) return value
  return new URL(value, `${siteUrl}/`).href
}

function replaceOrInsert(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace(
    /^([ \t]*)<\/head>/m,
    (_match, indentation) => `${indentation}  ${tag}\n${indentation}</head>`,
  )
}

function setNamedMeta(html, name, content) {
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\bname=["']${escapePattern(name)}["'])[^>]*>`,
    'i',
  )
  if (!content) return html.replace(pattern, '')
  return replaceOrInsert(
    html,
    pattern,
    `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`,
  )
}

function setPropertyMeta(html, property, content) {
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\bproperty=["']${escapePattern(property)}["'])[^>]*>`,
    'i',
  )
  if (!content) return html.replace(pattern, '')
  return replaceOrInsert(
    html,
    pattern,
    `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`,
  )
}

function setCanonical(html, path) {
  const pattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i
  return replaceOrInsert(
    html,
    pattern,
    `<link rel="canonical" href="${escapeHtml(absoluteUrl(path))}" />`,
  )
}

function removeHomePreload(html) {
  return html.replace(
    /^[ \t]*<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bhref=["']\/images\/mathis\/(?:hero-research\.svg|mathis-portrait\.webp)["'])[^>]*>[ \t]*(?:\r?\n)?/im,
    '',
  )
}

function renderMetadata(entry) {
  const title = entry.title || 'Mathis Certenais'
  const description = entry.description || ''
  const ogTitle = entry.ogTitle || title
  const ogDescription = entry.ogDescription || description
  const twitterTitle = entry.twitterTitle || ogTitle
  const twitterDescription = entry.twitterDescription || ogDescription
  const ogImage = absoluteUrl(entry.ogImage)
  const twitterImage = absoluteUrl(entry.twitterImage || entry.ogImage)
  const canonicalPath = entry.canonical || entry.path
  const canonical = absoluteUrl(canonicalPath)
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)

  html = setNamedMeta(html, 'description', description)
  html = setNamedMeta(html, 'robots', entry.robots || 'index, follow')
  html = setNamedMeta(html, 'twitter:card', 'summary_large_image')
  html = setNamedMeta(html, 'twitter:title', twitterTitle)
  html = setNamedMeta(html, 'twitter:description', twitterDescription)
  html = setNamedMeta(html, 'twitter:image', twitterImage)
  html = setNamedMeta(html, 'twitter:image:alt', entry.ogImageAlt)
  html = setPropertyMeta(html, 'og:title', ogTitle)
  html = setPropertyMeta(html, 'og:description', ogDescription)
  html = setPropertyMeta(html, 'og:site_name', 'Mathis Certenais')
  html = setPropertyMeta(html, 'og:locale', 'en_US')
  html = setPropertyMeta(html, 'og:type', 'website')
  html = setPropertyMeta(html, 'og:image', ogImage)
  html = setPropertyMeta(html, 'og:image:alt', entry.ogImageAlt)
  html = setPropertyMeta(html, 'og:url', canonical)
  html = setCanonical(html, canonicalPath)

  if (entry.path !== '/') html = removeHomePreload(html)

  return `${html.trim()}\n`
}

async function writeRoute(entry) {
  const destination =
    entry.path === '/'
      ? join(distRoot, 'index.html')
      : join(distRoot, ...entry.path.split('/').filter(Boolean), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, renderMetadata(entry))
}

await Promise.all(manifest.map(writeRoute))
await writeFile(
  join(distRoot, '404.html'),
  renderMetadata({
    path: '/404',
    canonical: '/404',
    title: 'Page not found | Mathis Certenais',
    description: "The page you're looking for doesn't exist or has been moved.",
    robots: 'noindex, nofollow',
  }),
)

console.log(`Prerendered metadata shells for ${manifest.length} routes plus 404.html.`)
