import { access, readFile, readdir } from 'node:fs/promises'
import { basename, extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const manifestPath = join(projectRoot, 'src', 'data', 'route-manifest.json')
const publicRoot = join(projectRoot, 'public')
const sourceRoot = join(projectRoot, 'src')
const distRoot = join(projectRoot, 'dist')
const includeDist = process.argv.includes('--dist')
const issues = []

const requiredCanonicalPaths = new Set([
  '/',
  '/about',
  '/archive',
  '/contact',
  '/research',
  '/research/cross-facility-workflows',
  '/research/ddf-pipeline',
  '/research/hpc-as-a-service',
  '/resources',
  '/resources/network',
  '/resources/publications',
  '/resources/talks',
  '/resume',
  '/videos',
  '/whiteboard',
  '/writing',
  '/writing/hpc-applications-as-a-service',
  '/writing/international-hackathon-for-astronomy',
  '/writing/webinar-hpc-applications-as-a-service',
])

const requiredLegacyPaths = new Set([
  '/archive/child-of-light-design-analysis',
  '/archive/monument-valley-design-analysis',
  '/archive/superbrothers-sword-and-sworcery-design-analysis',
  '/articles',
  '/articles/ai-will-revolutionize-accessibility',
  '/articles/attitudinal-and-behavioral-research',
  '/articles/capturing-brand-drivers',
  '/articles/designing-the-perfect-game-show',
  '/articles/how-ladders-alter-your-marketing-strategies',
  '/articles/how-ux-fits-in-an-agile-framework',
  '/articles/lean-agile-and-scrum',
  '/articles/memories-on-a-graph',
  '/articles/my-5-most-influential-books',
  '/articles/proto-personas',
  '/articles/shorts',
  '/articles/slicing',
  '/articles/three-principles-of-persuasion',
  '/articles/ux-agile-and-healthcare-innovation-projects',
  '/articles/what-aristotle-can-teach-us-about-marketing',
  '/articles/what-is-ux-design-in-marketing',
  '/articles/when-to-interview-survey-and-focus-group',
  '/articles/why-build-design-systems',
  '/resources/mental-models',
  '/resources/other',
  '/resources/portfolio',
  '/work',
  '/work/centene-recovery-platform',
  '/work/daily-noodle',
  '/work/designing-systems-at-scale',
])

const allowedPages = new Set([
  'about',
  'archive',
  'article:hpc-applications-as-a-service',
  'article:international-hackathon-for-astronomy',
  'article:webinar-hpc-applications-as-a-service',
  'contact',
  'home',
  'research',
  'research:cross-facility-workflows',
  'research:ddf-pipeline',
  'research:hpc-as-a-service',
  'resource:network',
  'resource:publications',
  'resource:talks',
  'resources',
  'resume',
  'videos',
  'whiteboard',
  'writing',
])

const requiredAssets = new Set([
  '/_redirects',
  '/assets/fonts/libre-baskerville-latin.woff2',
  '/assets/fonts/outfit-latin.woff2',
  '/favicon.svg',
  '/images/mathis/cross-facility-workflows.svg',
  '/images/mathis/ddf-pipeline.svg',
  '/images/mathis/hero-research.svg',
  '/images/mathis/hpc-as-a-service.svg',
  '/images/mathis/mathis-portrait.webp',
  '/images/mathis/social-card.svg',
  '/images/mathis/videos/hackathon.jpg',
  '/images/mathis/videos/interview.jpg',
  '/images/mathis/videos/webinar.jpg',
])

const retiredPaths = [
  'scripts/sync-reference.mjs',
  'src/data/reference-shorts.json',
  'src/data/reference-videos.json',
  'src/generated',
  'src/reference',
  'src/reference.css',
]

const forbiddenContent = [
  { label: 'retired identity', pattern: /\bnate\b|nate[-_.\s]*bauer/i },
  { label: 'retired domain', pattern: /\bnabauer(?:\.com)?\b/i },
  { label: 'synthetic portrait watermark', pattern: /this[- ]person[- ]does[- ]not[- ]exist/i },
  { label: 'placeholder copy', pattern: /\b(?:content|copy|text)\s+(?:to be|will be)\s+(?:provided|added)\b/i },
  { label: 'placeholder copy', pattern: /\blorem ipsum\b/i },
  { label: 'placeholder copy', pattern: /\[(?:insert|placeholder)\b/i },
]

const forbiddenFileName = /(?:^|[-_. ])(?:nate|nabauer)(?:[-_. ]|$)|this[-_. ]person[-_. ]does[-_. ]not[-_. ]exist/i
const textExtensions = new Set([
  '',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.map',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.webmanifest',
  '.xml',
])

function normalizeRoutePath(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeRobots(value) {
  return String(value || 'index, follow')
    .toLowerCase()
    .replaceAll(/\s+/g, '')
}

function isValidRoutePath(value) {
  return value === '/' || /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)
}

function toProjectPath(filePath) {
  return relative(projectRoot, filePath).split(sep).join('/')
}

function toPublicPath(filePath) {
  return `/${relative(publicRoot, filePath).split(sep).join('/')}`
}

async function pathExists(pathname) {
  try {
    await access(pathname)
    return true
  } catch {
    return false
  }
}

async function listFiles(root) {
  const files = []
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    const pathname = join(root, entry.name)
    if (entry.isDirectory()) files.push(...(await listFiles(pathname)))
    else if (entry.isFile()) files.push(pathname)
  }
  return files
}

function isTextFile(pathname) {
  return textExtensions.has(extname(pathname).toLowerCase()) || basename(pathname) === '_redirects'
}

function collectLocalAssets(text, target) {
  for (const match of text.matchAll(/(?<![A-Za-z0-9:])\/(?:assets|files|images)\/[^"'`\\\s)>,]+/g)) {
    const pathname = match[0].split(/[?#]/)[0]
    if (!pathname.endsWith('/')) target.add(pathname)
  }
  for (const match of text.matchAll(
    /(?<![A-Za-z0-9:])\/(?:favicon[^"'`\\\s)>,]*\.[a-z0-9]+|manifest\.webmanifest)/gi,
  )) {
    target.add(match[0].split(/[?#]/)[0])
  }
}

async function auditTextTree(root, label, referencedAssets) {
  if (!(await pathExists(root))) {
    issues.push(`Missing ${label} directory: ${toProjectPath(root)}`)
    return []
  }

  const files = await listFiles(root)
  for (const pathname of files) {
    const displayPath = toProjectPath(pathname)
    if (forbiddenFileName.test(basename(pathname))) {
      issues.push(`Forbidden retired name in ${label} filename: ${displayPath}`)
    }
    if (!isTextFile(pathname)) continue

    const text = await readFile(pathname, 'utf8')
    collectLocalAssets(text, referencedAssets)
    for (const rule of forbiddenContent) {
      if (rule.pattern.test(text)) issues.push(`Found ${rule.label} in ${displayPath}`)
    }
  }
  return files
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readAttribute(tag, attribute) {
  const match = tag.match(
    new RegExp(`\\b${escapePattern(attribute)}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'),
  )
  return match?.[1] ?? match?.[2]
}

function findTag(html, tagName, attribute, value) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || []
  return tags.find((tag) => readAttribute(tag, attribute)?.toLowerCase() === value.toLowerCase())
}

function decodeHtml(value) {
  return String(value ?? '')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function readMeta(html, key, value) {
  const tag = findTag(html, 'meta', key, value)
  return decodeHtml(tag ? readAttribute(tag, 'content') : '')
}

function routeDestination(root, routePath) {
  return routePath === '/'
    ? join(root, 'index.html')
    : join(root, ...routePath.split('/').filter(Boolean), 'index.html')
}

async function auditBuiltRoutes(manifest, siteUrl) {
  const builtAssetReferences = new Set()
  await auditTextTree(distRoot, 'dist', builtAssetReferences)
  for (const pathname of builtAssetReferences) {
    if (!(await pathExists(join(distRoot, pathname.slice(1))))) {
      issues.push(`Missing referenced dist asset: ${pathname}`)
    }
  }

  for (const entry of manifest) {
    const destination = routeDestination(distRoot, entry.path)
    if (!(await pathExists(destination))) {
      issues.push(`Missing prerendered route shell: ${toProjectPath(destination)}`)
      continue
    }

    const html = await readFile(destination, 'utf8')
    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1])
    const canonicalTag = findTag(html, 'link', 'rel', 'canonical')
    const expectedCanonical = siteUrl
      ? new URL(entry.canonical, `${siteUrl}/`).href
      : entry.canonical
    const expectedImage =
      entry.ogImage && siteUrl ? new URL(entry.ogImage, `${siteUrl}/`).href : entry.ogImage || ''
    const twitterImagePath = entry.twitterImage || entry.ogImage
    const expectedTwitterImage =
      twitterImagePath && siteUrl
        ? new URL(twitterImagePath, `${siteUrl}/`).href
        : twitterImagePath || ''
    const expectedOgTitle = entry.ogTitle || entry.title
    const expectedOgDescription = entry.ogDescription || entry.description
    const expectedTwitterTitle = entry.twitterTitle || expectedOgTitle
    const expectedTwitterDescription = entry.twitterDescription || expectedOgDescription

    if (title !== entry.title) issues.push(`Incorrect title in prerendered route: ${entry.path}`)
    if (readMeta(html, 'name', 'description') !== entry.description) {
      issues.push(`Incorrect description in prerendered route: ${entry.path}`)
    }
    if (normalizeRobots(readMeta(html, 'name', 'robots')) !== normalizeRobots(entry.robots)) {
      issues.push(`Incorrect robots metadata in prerendered route: ${entry.path}`)
    }
    if (decodeHtml(canonicalTag ? readAttribute(canonicalTag, 'href') : '') !== expectedCanonical) {
      issues.push(`Incorrect canonical URL in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:url') !== expectedCanonical) {
      issues.push(`Incorrect Open Graph URL in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:title') !== expectedOgTitle) {
      issues.push(`Incorrect Open Graph title in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:description') !== expectedOgDescription) {
      issues.push(`Incorrect Open Graph description in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:site_name') !== 'Mathis Certenais') {
      issues.push(`Incorrect Open Graph site name in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:type') !== 'website') {
      issues.push(`Incorrect Open Graph type in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:image') !== expectedImage) {
      issues.push(`Incorrect Open Graph image in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'property', 'og:image:alt') !== (entry.ogImageAlt || '')) {
      issues.push(`Incorrect Open Graph image alt text in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'name', 'twitter:title') !== expectedTwitterTitle) {
      issues.push(`Incorrect Twitter title in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'name', 'twitter:description') !== expectedTwitterDescription) {
      issues.push(`Incorrect Twitter description in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'name', 'twitter:image') !== expectedTwitterImage) {
      issues.push(`Incorrect Twitter image in prerendered route: ${entry.path}`)
    }
    if (readMeta(html, 'name', 'twitter:image:alt') !== (entry.ogImageAlt || '')) {
      issues.push(`Incorrect Twitter image alt text in prerendered route: ${entry.path}`)
    }
    if (
      entry.path !== '/' &&
      /rel=["']preload["'][^>]+(?:hero-research\.svg|mathis-portrait\.webp)/i.test(html)
    ) {
      issues.push(`Home-only hero preload present in prerendered route: ${entry.path}`)
    }
  }

  const notFoundPath = join(distRoot, '404.html')
  if (!(await pathExists(notFoundPath))) {
    issues.push('Missing dist/404.html')
  } else {
    const notFoundHtml = await readFile(notFoundPath, 'utf8')
    if (!decodeHtml(notFoundHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]).includes('Mathis Certenais')) {
      issues.push('Incorrect title in dist/404.html')
    }
    if (normalizeRobots(readMeta(notFoundHtml, 'name', 'robots')) !== 'noindex,nofollow') {
      issues.push('Incorrect robots metadata in dist/404.html')
    }
  }
}

let manifest
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
} catch (error) {
  console.error(`Unable to read src/data/route-manifest.json: ${error.message}`)
  process.exit(1)
}

if (!Array.isArray(manifest)) {
  console.error('src/data/route-manifest.json must contain an array of routes.')
  process.exit(1)
}

const routesByPath = new Map()
for (const entry of manifest) {
  const routePath = normalizeRoutePath(entry.path)
  const canonicalPath = normalizeRoutePath(entry.canonical)

  if (!isValidRoutePath(routePath)) issues.push(`Invalid route path: ${String(entry.path)}`)
  if (!isValidRoutePath(canonicalPath)) {
    issues.push(`Invalid canonical path for ${routePath || '(unknown route)'}`)
  }
  if (routesByPath.has(routePath)) issues.push(`Duplicate route path: ${routePath}`)
  routesByPath.set(routePath, entry)

  if (!allowedPages.has(entry.page)) issues.push(`Unknown page mapping at ${routePath}: ${entry.page}`)
  if (!entry.title?.includes('Mathis Certenais')) issues.push(`Incomplete Mathis title: ${routePath}`)
  if (!entry.description?.trim()) issues.push(`Missing description: ${routePath}`)
}

for (const routePath of requiredCanonicalPaths) {
  const entry = routesByPath.get(routePath)
  if (!entry) issues.push(`Missing canonical route: ${routePath}`)
  else if (entry.canonical !== routePath) issues.push(`Canonical route points elsewhere: ${routePath}`)
}

for (const routePath of requiredLegacyPaths) {
  const entry = routesByPath.get(routePath)
  if (!entry) issues.push(`Missing legacy route alias: ${routePath}`)
  else if (entry.canonical === routePath) issues.push(`Legacy route must point to a Mathis canonical: ${routePath}`)
}

for (const entry of manifest) {
  const canonicalEntry = routesByPath.get(entry.canonical)
  if (!canonicalEntry) {
    issues.push(`Canonical target is not in the manifest: ${entry.path} -> ${entry.canonical}`)
    continue
  }
  if (canonicalEntry.canonical !== canonicalEntry.path) {
    issues.push(`Canonical target must be self-canonical: ${entry.path} -> ${entry.canonical}`)
  }

  if (entry.path !== entry.canonical && normalizeRobots(entry.robots) !== 'noindex,follow') {
    issues.push(`Legacy alias must use noindex, follow: ${entry.path}`)
  }
  if (entry.path === entry.canonical && entry.path !== '/whiteboard') {
    if (normalizeRobots(entry.robots) !== 'index,follow') {
      issues.push(`Canonical public route must be indexable: ${entry.path}`)
    }
    if (!entry.ogImage || !entry.ogImageAlt) {
      issues.push(`Canonical public route needs social image metadata: ${entry.path}`)
    }
  }
  if (entry.path === '/whiteboard' && normalizeRobots(entry.robots) !== 'noindex,nofollow') {
    issues.push('The local whiteboard must use noindex, nofollow')
  }
}

for (const pathname of retiredPaths) {
  if (await pathExists(join(projectRoot, pathname))) issues.push(`Retired snapshot dependency remains: ${pathname}`)
}

const referencedAssets = new Set(requiredAssets)
const indexSource = await readFile(join(projectRoot, 'index.html'), 'utf8')
collectLocalAssets(indexSource, referencedAssets)
for (const rule of forbiddenContent) {
  if (rule.pattern.test(indexSource)) issues.push(`Found ${rule.label} in index.html`)
}
await auditTextTree(sourceRoot, 'source', referencedAssets)

const appSource = await readFile(join(sourceRoot, 'App.tsx'), 'utf8')
const portfolioPageSource = await readFile(join(sourceRoot, 'components', 'PortfolioPage.tsx'), 'utf8')
const whiteboardSource = await readFile(join(sourceRoot, 'whiteboard', 'WhiteboardPage.tsx'), 'utf8')
if (!appSource.includes("route?.page === 'whiteboard'")) {
  issues.push('The /whiteboard page is not registered in App.tsx')
}
if (!/<main\b[^>]*\bid=["']main-content["']/i.test(whiteboardSource)) {
  issues.push('WhiteboardPage.tsx is missing its accessible #main-content landmark')
}
for (const marker of [
  "page === 'home'",
  "page === 'research'",
  "page.startsWith('research:')",
  "page === 'writing'",
  "page.startsWith('article:')",
  "page === 'videos'",
  "page === 'about'",
  "page === 'resume'",
  "page === 'resources'",
  "page.startsWith('resource:')",
  "page === 'archive'",
  "page === 'contact'",
]) {
  if (!portfolioPageSource.includes(marker)) issues.push(`Missing page renderer contract: ${marker}`)
}

const publicFiles = await auditTextTree(publicRoot, 'public', referencedAssets)

for (const pathname of referencedAssets) {
  if (!(await pathExists(join(publicRoot, pathname.slice(1))))) {
    issues.push(`Missing referenced public asset: ${pathname}`)
  }
}

for (const pathname of publicFiles.map(toPublicPath)) {
  if (!referencedAssets.has(pathname)) issues.push(`Unreferenced public asset: ${pathname}`)
}

const configuredSiteUrl = loadEnv('production', projectRoot, '').VITE_SITE_URL?.trim()
const siteUrl = configuredSiteUrl?.replace(/\/$/, '')
if (siteUrl && !/^https?:\/\/[^\s]+$/i.test(siteUrl)) {
  issues.push('VITE_SITE_URL must be an absolute http(s) URL')
}

if (includeDist) await auditBuiltRoutes(manifest, siteUrl)

if (issues.length > 0) {
  const shownIssues = issues.slice(0, 100)
  console.error(shownIssues.map((issue) => `- ${issue}`).join('\n'))
  if (issues.length > shownIssues.length) {
    console.error(`- …and ${issues.length - shownIssues.length} additional issue(s).`)
  }
  process.exitCode = 1
} else {
  const canonicalCount = manifest.filter((entry) => entry.path === entry.canonical).length
  const aliasCount = manifest.length - canonicalCount
  const distMessage = includeDist ? ', prerendered shells, and dist output' : ''
  console.log(
    `Validated ${canonicalCount} canonical routes, ${aliasCount} legacy aliases, ${referencedAssets.size} public assets${distMessage}.`,
  )
}
