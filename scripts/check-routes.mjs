import { access, readFile, readdir } from 'node:fs/promises'
import { basename, extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { articleItems } from '../src/content/en.ts'

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
  '/contact',
  '/research',
  '/resume',
  '/videos',
  '/insights',
  '/insights/eclat-interview',
  '/insights/youngpex',
  '/insights/predicting-for-sizing',
  '/insights/international-hackathon-for-astronomy',
  '/insights/rennes-hackathon-for-astronomy',
  '/insights/webinar-hpc-applications-as-a-service',
  '/insights/exascale-astronomy-cybersecurity',
  '/insights/mcp-server-software-ontology',
])

const requiredLegacyPaths = new Set([
  '/writing',
  '/writing/eclat-interview',
  '/writing/youngpex',
  '/writing/predicting-for-sizing',
  '/writing/webinar-hpc-applications-as-a-service',
  '/writing/international-hackathon-for-astronomy',
  '/writing/rennes-hackathon-for-astronomy',
  '/writing/exascale-astronomy-cybersecurity',
  '/writing/mcp-server-software-ontology',
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
  '/work',
  '/work/centene-recovery-platform',
  '/work/daily-noodle',
  '/work/designing-systems-at-scale',
])

const allowedPages = new Set([
  'about',
  'article:eclat-interview',
  'article:youngpex',
  'article:predicting-for-sizing',
  'article:international-hackathon-for-astronomy',
  'article:rennes-hackathon-for-astronomy',
  'article:webinar-hpc-applications-as-a-service',
  'article:exascale-astronomy-cybersecurity',
  'article:mcp-server-software-ontology',
  'contact',
  'home',
  'research',
  'resume',
  'videos',
  'writing',
])

const requiredAssets = new Set([  '/_redirects',
  '/CNAME',
  '/robots.txt',
  '/assets/fonts/libre-baskerville-latin.woff2',
  '/assets/fonts/outfit-latin.woff2',
  '/favicon.svg',
  '/images/mathis/ska-processing-chain.webp',
  '/images/mathis/hero-research.svg',
  '/images/mathis/mathis-portrait.webp',
  '/images/mathis/social-card.png',
  '/images/mathis/videos/interview.webp',
  '/images/mathis/videos/webinar.webp',
  '/images/mathis/rennes-hackathon/rennes-hackathon-front.webp',
  '/images/mathis/rennes-hackathon/rennes-hackathon-back.webp',
])

/**
 * Routes whose shell carries the static text of the page, so a client that never
 * runs JavaScript still reads it. Each entry lists literal strings the shell must
 * contain, picked from the page rather than derived from the generator, so that a
 * generator which silently drops a section fails here. The article routes are
 * checked against their own title and description. Every prerendered shell must
 * also carry at least this much readable text.
 */
const prerenderedFallbacks = {
  '/': ['Scientific data logistics.', 'Exascale workflows.', 'Radio astronomy'],
  '/research': [
    'Collaborative System of Systems for Scientific Data Logistics',
    'Scientific instruments and industrial platforms alike',
    'Five perspectives on one logistics problem.',
    'The reasoning is written up in public.',
  ],
  '/insights': ['Explaining systems through their use.', 'Latest entries'],
  '/videos': ['Research, explained in context.', 'Watch & listen'],
  '/about': ['Building infrastructure through collaboration.', 'Working principles'],
  '/resume': ['arXiv:2509.03075', 'Relevant certifications'],
  '/contact': ['Let’s connect the systems.', 'The card I hand out.'],
}

const PRERENDERED_MIN_CHARACTERS = 300

/**
 * Links a prerendered shell must carry: an internal link a crawler cannot follow
 * from elsewhere is a page it may never find, and a link that lost its markup —
 * because it was double-escaped into plain text — helps nobody.
 */
const prerenderedMinLinks = {
  '/': 8,
  '/research': 3,
  '/writing': 8,
  '/videos': 3,
  '/about': 1,
  '/resume': 1,
  '/contact': 3,
}

const PRERENDERED_ARTICLE_MIN_LINKS = 3

function expectedPrerenderedMarkers(routePath) {
  if (prerenderedFallbacks[routePath]) return prerenderedFallbacks[routePath]

  const article = articleItems.find((item) => item.href === routePath)
  return article ? [article.title] : null
}

const retiredPaths = [
  'scripts/sync-reference.mjs',
  'src/data/reference-shorts.json',
  'src/data/reference-videos.json',
  'src/generated',
  'src/whiteboard',
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

/** Mirrors canonicalUrl() in scripts/prerender-routes.mjs. */
function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`
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

/**
 * The sitemap and robots.txt are what search engines actually read, so they are
 * audited against the manifest: every canonical, indexable route must appear,
 * no alias and no noindex route may appear, and robots.txt must point at the
 * sitemap. A stale sitemap asking Google to index a noindex page fails here
 * rather than in Search Console.
 */
async function auditSearchFiles(manifest, siteUrl) {
  const expected = manifest
    .filter((entry) => entry.path === entry.canonical && !/noindex/i.test(entry.robots || ''))
    .map((entry) => withTrailingSlash(new URL(entry.path, `${siteUrl}/`).href))

  const sitemapPath = join(distRoot, 'sitemap.xml')
  if (!(await pathExists(sitemapPath))) {
    issues.push('Missing dist/sitemap.xml even though the build had an origin configured')
  } else {
    const sitemap = await readFile(sitemapPath, 'utf8')
    const declared = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => decodeHtml(match[1]))
    if (declared.length !== new Set(declared).size) issues.push('Sitemap lists the same URL twice')
    for (const url of expected) {
      if (!declared.includes(url)) issues.push(`Sitemap is missing an indexable route: ${url}`)
    }
    for (const url of declared) {
      if (!expected.includes(url)) issues.push(`Sitemap lists a URL that is not indexable: ${url}`)
    }
  }

  const robotsPath = join(distRoot, 'robots.txt')
  if (!(await pathExists(robotsPath))) {
    issues.push('Missing dist/robots.txt')
    return
  }

  const robots = await readFile(robotsPath, 'utf8')
  if (!robots.includes(`${siteUrl}/sitemap.xml`)) issues.push('robots.txt does not point at the sitemap')
  if (/^\s*disallow:\s*\/\s*$/im.test(robots)) {
    issues.push('robots.txt disallows the whole site')
  }
  if (/^\s*disallow:\s*\/(?:articles|work)/im.test(robots)) {
    issues.push('robots.txt blocks a noindex route, so search engines cannot see the noindex')
  }
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
      ? withTrailingSlash(new URL(entry.canonical, `${siteUrl}/`).href)
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

    const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>/)
    const root = rootMatch?.[1] ?? ''
    const indexableCanonical =
      entry.path === entry.canonical && !/noindex/i.test(entry.robots || '')
    const markers = expectedPrerenderedMarkers(entry.path)

    if (markers) {
      // Markers are written the way the page reads them, so they are looked for
      // in the decoded text as well as in the raw markup.
      const text = decodeHtml(root.replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim()
      for (const marker of markers) {
        if (!root.includes(marker) && !text.includes(marker)) {
          issues.push(`Prerendered text missing from ${entry.path}: ${marker}`)
        }
      }
      if (text.length < PRERENDERED_MIN_CHARACTERS) {
        issues.push(`Prerendered text is too thin in ${entry.path}: ${text.length} characters`)
      }

      const links = (root.match(/<a\s/g) ?? []).length
      const minimum = prerenderedMinLinks[entry.path] ?? PRERENDERED_ARTICLE_MIN_LINKS
      if (links < minimum) {
        issues.push(
          `Prerendered text in ${entry.path} carries ${links} links, fewer than the ${minimum} expected`,
        )
      }
    } else if (root.includes('class="prerendered"') && indexableCanonical) {
      issues.push(
        `Route ${entry.path} carries prerendered text but declares no expected markers, so nothing checks it`,
      )
    }

    if (indexableCanonical && !root.includes('class="prerendered"')) {
      issues.push(`Indexable route ${entry.path} carries no prerendered text`)
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

  if (siteUrl) await auditSearchFiles(manifest, siteUrl)
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
  const isFrench = entry.path === '/fr' || entry.path.startsWith('/fr/')

  if (entry.path === entry.canonical && isFrench && normalizeRobots(entry.robots) !== 'noindex,follow') {
    // Transitional: a French page goes indexable only once its prerendered
    // fallback exists, otherwise Google would index an empty shell.
    issues.push(`French route must stay noindex until it has a prerendered fallback: ${entry.path}`)
  }

  if (entry.path === entry.canonical && !isFrench) {
    if (normalizeRobots(entry.robots) !== 'index,follow') {
      issues.push(`Canonical public route must be indexable: ${entry.path}`)
    }
    if (!entry.ogImage || !entry.ogImageAlt) {
      issues.push(`Canonical public route needs social image metadata: ${entry.path}`)
    }
  }
}

/** Every English page needs its French twin, or the language switch breaks. */
for (const entry of manifest) {
  if (entry.path !== entry.canonical || entry.path === '/fr' || entry.path.startsWith('/fr/')) continue
  const twin = entry.path === '/' ? '/fr' : `/fr${entry.path}`
  if (!routesByPath.has(twin)) issues.push(`Missing French route for ${entry.path}: ${twin}`)
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

const portfolioPageSource = await readFile(join(sourceRoot, 'components', 'PortfolioPage.tsx'), 'utf8')
for (const marker of [
  "page === 'home'",
  "page === 'research'",
  "page === 'writing'",
  "page.startsWith('article:')",
  "page === 'videos'",
  "page === 'about'",
  "page === 'resume'",
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
