import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = join(projectRoot, 'dist')
const manifest = JSON.parse(
  await readFile(join(projectRoot, 'src', 'generated', 'manifest.json'), 'utf8'),
)
const template = await readFile(join(distRoot, 'index.html'), 'utf8')
const siteUrl = loadEnv('production', projectRoot, '').VITE_SITE_URL?.trim().replace(/\/$/, '')

function escapeAttribute(value = '') {
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
  return html.replace('</head>', `    ${tag}\n  </head>`)
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
    `<meta name="${escapeAttribute(name)}" content="${escapeAttribute(content)}" />`,
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
    `<meta property="${escapeAttribute(property)}" content="${escapeAttribute(content)}" />`,
  )
}

function setCanonical(html, path) {
  const pattern = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i
  const href = absoluteUrl(path)
  return replaceOrInsert(
    html,
    pattern,
    `<link rel="canonical" href="${escapeAttribute(href)}" />`,
  )
}

function renderMetadata(entry) {
  const title = entry.title || 'Nate Bauer'
  const description = entry.description || ''
  const ogTitle = entry.ogTitle || title
  const ogDescription = entry.ogDescription || description
  const twitterTitle = entry.twitterTitle || ogTitle
  const twitterDescription = entry.twitterDescription || ogDescription
  const ogImage = absoluteUrl(entry.ogImage)
  const twitterImage = absoluteUrl(entry.twitterImage || entry.ogImage)
  const canonical = absoluteUrl(entry.path)
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)}</title>`)

  html = setNamedMeta(html, 'description', description)
  html = setNamedMeta(html, 'robots', entry.robots || 'index, follow')
  html = setNamedMeta(html, 'twitter:card', 'summary_large_image')
  html = setNamedMeta(html, 'twitter:title', twitterTitle)
  html = setNamedMeta(html, 'twitter:description', twitterDescription)
  html = setNamedMeta(html, 'twitter:image', twitterImage)
  html = setNamedMeta(html, 'twitter:image:alt', entry.ogImageAlt)
  html = setPropertyMeta(html, 'og:title', ogTitle)
  html = setPropertyMeta(html, 'og:description', ogDescription)
  html = setPropertyMeta(html, 'og:image', ogImage)
  html = setPropertyMeta(html, 'og:image:alt', entry.ogImageAlt)
  html = setPropertyMeta(html, 'og:url', canonical)
  html = setCanonical(html, entry.path)

  if (entry.path !== '/') {
    html = html.replace(
      /\s*<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bhref=["']\/images\/home\/nate-bauer-portrait\.webp["'])[^>]*>\s*/i,
      '\n',
    )
  }

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

const staticEntries = [
  ...manifest.pages,
  {
    path: '/whiteboard',
    title: 'Whiteboard | Nate Bauer',
    description: 'A browser-based whiteboard stored locally in this browser.',
    robots: 'noindex, nofollow',
  },
]

await Promise.all(staticEntries.map(writeRoute))
await writeFile(
  join(distRoot, '404.html'),
  renderMetadata({
    path: '/404',
    title: 'Page not found | Nate Bauer',
    description: "The page you're looking for doesn't exist or has been moved.",
    robots: 'noindex, nofollow',
  }),
)

console.log(`Prerendered metadata shells for ${staticEntries.length} routes plus 404.html.`)
