import { createHash } from 'node:crypto'
import { access, readFile, readdir } from 'node:fs/promises'
import { basename, extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { articleItems } from '../src/content/en.ts'
import { articleItems as frenchArticles } from '../src/content/fr.ts'
import { articleRecords, pageRecords, site } from '../src/content/siteRecords.ts'
import {
  buildAllRouteMetadata,
  buildRouteMetadata,
  jsonPathFor,
  renderLlmsTxt,
  renderMetadataFile,
  schemaTypeFor,
} from '../src/content/siteMetadata.ts'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const manifestPath = join(projectRoot, 'src', 'data', 'route-manifest.json')
const publicRoot = join(projectRoot, 'public')
const sourceRoot = join(projectRoot, 'src')
const distRoot = join(projectRoot, 'dist')
const includeDist = process.argv.includes('--dist')
const issues = []
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const metadataOptions = { hash: sha256 }

const requiredCanonicalPaths = new Set([
  '/',
  '/about',
  '/accessibility',
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
  '/insights/ai-lab-virtual-running-coach',
  '/insights/sc26-europe',
  '/insights/autonomous-science-agentic-ai',
  '/insights/astra-ddf-pipeline',
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
  '/writing/ai-lab-virtual-running-coach',
  '/writing/sc26-europe',
  '/writing/autonomous-science-agentic-ai',
  '/writing/astra-ddf-pipeline',
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
  'accessibility',
  'article:eclat-interview',
  'article:youngpex',
  'article:predicting-for-sizing',
  'article:international-hackathon-for-astronomy',
  'article:rennes-hackathon-for-astronomy',
  'article:webinar-hpc-applications-as-a-service',
  'article:exascale-astronomy-cybersecurity',
  'article:mcp-server-software-ontology',
  'article:ai-lab-virtual-running-coach',
  'article:sc26-europe',
  'article:autonomous-science-agentic-ai',
  'article:astra-ddf-pipeline',
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
  '/contact': ['Let’s connect the systems.', 'Start a conversation.'],
  '/accessibility': ['Accessibility statement', 'What has been checked.'],
  '/fr': ['Logistique des données', 'En bref'],
  '/fr/research': [
    'Ce que la thèse mesure',
    'Cinq perspectives sur un même problème',
    'Le raisonnement est publié',
  ],
  '/fr/insights': ['Expliquer les systèmes par leur usage.', 'Derniers articles'],
  '/fr/videos': ['La recherche, expliquée en contexte.', 'À regarder et à écouter'],
  '/fr/about': ['Construire des infrastructures par la collaboration.', 'Principes de travail'],
  '/fr/resume': ['Certifications pertinentes', 'Interventions sélectionnées'],
  '/fr/contact': ['Relions les systèmes.', 'Commençons par un message.'],
  '/fr/accessibility': ['Déclaration d’accessibilité', 'Ce qui a été contrôlé.'],
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
  '/accessibility': 1,
  '/resume': 1,
  '/contact': 2,
}

const PRERENDERED_ARTICLE_MIN_LINKS = 3

function expectedPrerenderedMarkers(routePath) {
  if (prerenderedFallbacks[routePath]) return prerenderedFallbacks[routePath]

  const isFrench = routePath === '/fr' || routePath.startsWith('/fr/')
  const bare = routePath === '/fr' ? '/' : isFrench ? routePath.slice(3) : routePath
  const article = (isFrench ? frenchArticles : articleItems).find((item) => item.href === bare)

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
  for (const match of text.matchAll(/(?<![A-Za-z0-9:])\/(?:assets|captions|files|images)\/[^"'`\\\s)>,]+/g)) {
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

function sentenceCount(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean).length
}

function checkSummary(label, summary, descriptions = []) {
  for (const language of ['en', 'fr']) {
    const value = summary[language]
    if (typeof value !== 'string') {
      issues.push(`${label}: missing ${language} aiSummary`)
      continue
    }
    if (value.length < 80 || value.length > 700) {
      issues.push(`${label}: ${language} aiSummary is ${value.length} characters`)
    }
    const sentences = sentenceCount(value)
    if (sentences < 2 || sentences > 3) {
      issues.push(`${label}: ${language} aiSummary has ${sentences} sentences`)
    }
    for (const description of descriptions) {
      if (description && value.trim() === description.trim()) {
        issues.push(`${label}: ${language} aiSummary repeats a description`)
      }
    }
  }
  if (summary.en?.trim() === summary.fr?.trim()) {
    issues.push(`${label}: aiSummary is identical in both languages`)
  }
}

function checkKeywords(label, keywords) {
  for (const language of ['en', 'fr']) {
    const list = keywords[language]
    if (!Array.isArray(list) || list.length < 3 || list.length > 12) {
      issues.push(`${label}: ${language} keyword count ${list?.length}`)
      continue
    }
    const seen = new Set()
    for (const keyword of list) {
      const key = keyword.trim().toLowerCase()
      if (!key) issues.push(`${label}: empty ${language} keyword`)
      if (seen.has(key)) issues.push(`${label}: duplicate ${language} keyword ${keyword}`)
      seen.add(key)
    }
  }
}

function checkEntities(label, entities, contentText) {
  const seen = new Set()
  for (const entity of entities) {
    if (seen.has(entity.name)) issues.push(`${label}: duplicate entity ${entity.name}`)
    seen.add(entity.name)
    if (!entity.name.trim()) issues.push(`${label}: empty entity name`)
    if (entity.sameAs && !contentText.includes(entity.sameAs)) {
      issues.push(`${label}: entity ${entity.name} sameAs is not in src/content: ${entity.sameAs}`)
    }
  }
}

function checkCitations(label, citations, english, french) {
  const ids = new Set()
  const values = new Set()
  const haystack = [
    JSON.stringify(english.body),
    english.sourceHref ?? '',
    french ? JSON.stringify(french.body) : '',
    french?.sourceHref ?? '',
  ].join(' ')

  for (const citation of citations) {
    if (ids.has(citation.id)) issues.push(`${label}: duplicate citation id ${citation.id}`)
    ids.add(citation.id)
    if (values.has(citation.value)) {
      issues.push(`${label}: duplicate citation value ${citation.value}`)
    }
    values.add(citation.value)

    if (citation.kind === 'doi' && !/^10\.\d{4,9}\/\S+$/.test(citation.value)) {
      issues.push(`${label}: malformed DOI ${citation.value}`)
    }
    if (citation.kind === 'arxiv' && !/^\d{4}\.\d{4,5}(?:v\d+)?$/.test(citation.value)) {
      issues.push(`${label}: malformed arXiv identifier ${citation.value}`)
    }
    if (citation.kind === 'url' && !/^https:\/\/\S+$/.test(citation.value)) {
      issues.push(`${label}: malformed citation URL ${citation.value}`)
    }
    if (!haystack.includes(citation.value)) {
      issues.push(`${label}: citation ${citation.id} is not in the body or sourceHref`)
    }
  }
}

function checkLicense(label, license) {
  if (license !== null && !/^https:\/\/\S+$/.test(license)) {
    issues.push(`${label}: license must be null or an absolute https URL`)
  }
}

function collectIds(value) {
  const ids = []
  if (Array.isArray(value)) {
    for (const item of value) ids.push(...collectIds(item))
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === '@id' && typeof child === 'string') ids.push(child)
      else ids.push(...collectIds(child))
    }
  }
  return ids
}

async function auditMetadataSources(manifest) {
  const canonicalEntries = manifest.filter((entry) => entry.path === entry.canonical)
  const canonicalPaths = new Set(canonicalEntries.map((entry) => entry.path))

  const recordsByPath = new Map()
  for (const entry of canonicalEntries) {
    try {
      recordsByPath.set(entry.path, buildRouteMetadata(entry.path, metadataOptions))
    } catch (error) {
      issues.push(`No site metadata for ${entry.path}: ${error.message}`)
    }
  }
  for (const path of canonicalPaths) {
    if (!recordsByPath.has(path)) issues.push(`Missing site metadata record: ${path}`)
  }

  for (const entry of canonicalEntries) {
    const record = recordsByPath.get(entry.path)
    if (!record || !entry.ogImage) continue
    const expectedImage = new URL(entry.ogImage, `${site.origin}/`).href
    if (record.image.url !== expectedImage) {
      issues.push(`${entry.path}: image url ${record.image.url} should be ${expectedImage}`)
    }
    if (record.image.alt !== entry.ogImageAlt) {
      issues.push(`${entry.path}: image alt does not match the manifest`)
    }
  }

  for (const article of articleItems) {
    if (!articleRecords[article.id]) issues.push(`Missing article record: ${article.id}`)
  }
  for (const id of Object.keys(articleRecords)) {
    if (!articleItems.some((article) => article.id === id)) {
      issues.push(`Article record has no article: ${id}`)
    }
  }

  for (const entry of canonicalEntries) {
    try {
      schemaTypeFor(entry.page)
    } catch (error) {
      issues.push(`schemaTypeFor(${entry.page}): ${error.message}`)
    }
  }

  const contentFiles = await listFiles(join(sourceRoot, 'content'))
  const contentText = (
    await Promise.all(
      contentFiles
        .filter((file) => file.endsWith('.ts'))
        .map((file) => readFile(file, 'utf8')),
    )
  ).join('\n')

  const englishById = new Map(articleItems.map((article) => [article.id, article]))
  const frenchById = new Map(frenchArticles.map((article) => [article.id, article]))

  for (const [id, record] of Object.entries(articleRecords)) {
    const english = englishById.get(id)
    const french = frenchById.get(id)
    if (!english) {
      issues.push(`Article record ${id} has no English article`)
      continue
    }
    checkSummary(
      `article ${id}`,
      record.aiSummary,
      [english.description, french?.description].filter(Boolean),
    )
    checkKeywords(`article ${id}`, record.keywords)
    checkEntities(`article ${id}`, record.entities, contentText)
    checkCitations(`article ${id}`, record.citations, english, french)
    checkLicense(
      `article ${id}`,
      record.license === undefined ? site.license : record.license,
    )
    for (const language of ['en', 'fr']) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.dateModified[language])) {
        issues.push(
          `article ${id}: invalid ${language} dateModified ${record.dateModified[language]}`,
        )
      }
    }
  }

  for (const page of pageRecords) {
    checkSummary(`page ${page.path}`, page.aiSummary)
    checkKeywords(`page ${page.path}`, page.keywords)
    checkEntities(`page ${page.path}`, page.entities, contentText)
    checkLicense(`page ${page.path}`, site.license)
    for (const language of ['en', 'fr']) {
      const date = page.dateModified[language]
      if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        issues.push(`page ${page.path}: invalid ${language} dateModified ${date}`)
      }
    }
  }

  for (const record of recordsByPath.values()) {
    if (record.kind === 'article') {
      if (!/^\d{4}-\d{2}(-\d{2})?$/.test(record.datePublished || '')) {
        issues.push(`${record.path}: invalid datePublished ${record.datePublished}`)
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.dateModified || '')) {
        issues.push(`${record.path}: invalid dateModified ${record.dateModified}`)
      } else if (record.datePublished && record.dateModified < record.datePublished) {
        issues.push(`${record.path}: dateModified precedes datePublished`)
      }
    } else if (
      record.dateModified !== null &&
      !/^\d{4}-\d{2}-\d{2}$/.test(record.dateModified)
    ) {
      issues.push(`${record.path}: invalid dateModified ${record.dateModified}`)
    }

    try {
      const text = renderMetadataFile(record)
      const parsed = JSON.parse(text)
      if (`${JSON.stringify(parsed, null, 2)}\n` !== text) {
        issues.push(`${record.path}: metadata record does not round-trip through JSON`)
      }
      if (text.charCodeAt(0) === 0xfeff) {
        issues.push(`${record.path}: metadata record has a BOM`)
      }
    } catch (error) {
      issues.push(`${record.path}: metadata record is not JSON: ${error.message}`)
    }
  }

  const cname = (await readFile(join(publicRoot, 'CNAME'), 'utf8')).trim()
  let originHost = ''
  try {
    originHost = new URL(site.origin).host
  } catch {
    issues.push(`site.origin is not a URL: ${site.origin}`)
  }
  if (originHost !== cname) {
    issues.push(`site.origin ${site.origin} does not match public/CNAME ${cname}`)
  }
  if (!site.origin.startsWith('https://')) issues.push('site.origin must use https')

  for (const record of recordsByPath.values()) {
    if (record.language !== 'fr') continue
    const englishPath = record.path === '/fr' ? '/' : record.path.slice(3)
    if (!canonicalPaths.has(englishPath)) {
      issues.push(`French canonical ${record.path} has no English twin ${englishPath}`)
    }
  }
}

async function auditMetadataOutput(manifest) {
  const records = buildAllRouteMetadata(metadataOptions)
  const recordsByPath = new Map(records.map((record) => [record.path, record]))
  const canonicalEntries = manifest.filter((entry) => entry.path === entry.canonical)

  for (const entry of manifest) {
    const destination = routeDestination(distRoot, entry.path)
    if (!(await pathExists(destination))) continue
    const html = await readFile(destination, 'utf8')
    const tags = [...html.matchAll(/<script\b[^>]*\bid=["']page-jsonld["'][^>]*>/gi)]

    if (entry.path !== entry.canonical) {
      if (tags.length > 0) issues.push(`Legacy alias ${entry.path} carries JSON-LD`)
      continue
    }

    if (tags.length !== 1) {
      issues.push(`Canonical route ${entry.path} carries ${tags.length} page-jsonld scripts`)
      continue
    }

    const match =
      /<script\b[^>]*\bid=["']page-jsonld["'][^>]*>([\s\S]*?)<\/script>/i.exec(html)
    if (!match) {
      issues.push(`page-jsonld in ${entry.path} has no parseable body`)
      continue
    }
    const raw = match[1]
    if (/<\/script/i.test(raw)) {
      issues.push(`page-jsonld in ${entry.path} contains </script>`)
    }

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (error) {
      issues.push(`page-jsonld in ${entry.path} is not JSON: ${error.message}`)
      continue
    }
    if (!Array.isArray(parsed['@graph'])) {
      issues.push(`page-jsonld in ${entry.path} has no @graph array`)
      continue
    }

    const record = recordsByPath.get(entry.path)
    if (!record) {
      issues.push(`No expected metadata record for ${entry.path}`)
      continue
    }

    const node = parsed['@graph'].find(
      (item) => item && typeof item === 'object' && item['@type'] === record.schemaType,
    )
    if (!node) {
      issues.push(`page-jsonld in ${entry.path} lacks @type ${record.schemaType}`)
    } else {
      if (node.url !== record.canonical) {
        issues.push(
          `page-jsonld url in ${entry.path} is ${node.url}, expected ${record.canonical}`,
        )
      }
      if (node.inLanguage !== record.language) {
        issues.push(
          `page-jsonld inLanguage in ${entry.path} is ${node.inLanguage}, expected ${record.language}`,
        )
      }
    }

    for (const id of collectIds(parsed)) {
      if (!/^https:\/\//.test(id)) {
        issues.push(`page-jsonld in ${entry.path} has a relative @id: ${id}`)
      }
    }
  }

  const notFoundPath = join(distRoot, '404.html')
  if (await pathExists(notFoundPath)) {
    const html = await readFile(notFoundPath, 'utf8')
    if (/page-jsonld/.test(html)) issues.push('dist/404.html carries JSON-LD')
  }

  const expectedJsonPaths = new Set()
  for (const entry of canonicalEntries) {
    const record = recordsByPath.get(entry.path)
    if (!record) continue
    const jsonPath = jsonPathFor(entry.path)
    expectedJsonPaths.add(jsonPath)
    const file = join(distRoot, ...jsonPath.split('/').filter(Boolean))
    if (!(await pathExists(file))) {
      issues.push(`Missing metadata file: ${jsonPath}`)
      continue
    }
    const text = await readFile(file, 'utf8')
    if (text !== renderMetadataFile(record)) {
      issues.push(`Metadata file ${jsonPath} does not match the builder`)
    }
    if (text.charCodeAt(0) === 0xfeff) issues.push(`Metadata file ${jsonPath} has a BOM`)

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (error) {
      issues.push(`Metadata file ${jsonPath} is not JSON: ${error.message}`)
      continue
    }

    if (parsed.schema !== 'site-metadata@1') {
      issues.push(`Metadata file ${jsonPath} has schema ${parsed.schema}`)
    }
    if (parsed.kind !== record.kind) {
      issues.push(`Metadata file ${jsonPath} has kind ${parsed.kind}`)
    }
    if (parsed.language !== record.language) {
      issues.push(`Metadata file ${jsonPath} has language ${parsed.language}`)
    }
    if (parsed.canonical !== record.canonical) {
      issues.push(`Metadata file ${jsonPath} has canonical ${parsed.canonical}`)
    }
    if (
      parsed.translations?.en !== record.translations.en ||
      parsed.translations?.fr !== record.translations.fr
    ) {
      issues.push(`Metadata file ${jsonPath} has incorrect translations`)
    }
    if (parsed.title !== record.title) {
      issues.push(`Metadata file ${jsonPath} has incorrect title`)
    }
    if (parsed.description !== record.description) {
      issues.push(`Metadata file ${jsonPath} has incorrect description`)
    }
    if (parsed.aiSummary !== record.aiSummary) {
      issues.push(`Metadata file ${jsonPath} has incorrect aiSummary`)
    }
    if (parsed.dateModified !== record.dateModified) {
      issues.push(`Metadata file ${jsonPath} has incorrect dateModified`)
    }
    if (!Array.isArray(parsed.authors)) issues.push(`Metadata file ${jsonPath} has no authors`)
    if (!Array.isArray(parsed.keywords)) issues.push(`Metadata file ${jsonPath} has no keywords`)
    if (!Array.isArray(parsed.entities)) issues.push(`Metadata file ${jsonPath} has no entities`)
    if (!Array.isArray(parsed.citations)) {
      issues.push(`Metadata file ${jsonPath} has no citations`)
    }
    if (parsed.license !== record.license) {
      issues.push(`Metadata file ${jsonPath} has incorrect license`)
    }
    if (
      parsed.image?.url !== record.image.url ||
      parsed.image?.alt !== record.image.alt
    ) {
      issues.push(`Metadata file ${jsonPath} has incorrect image`)
    }

    if (record.kind === 'article') {
      if (parsed.bodyFormat !== 'article-blocks@1') {
        issues.push(`Metadata file ${jsonPath} has no bodyFormat`)
      }
      if (!Array.isArray(parsed.body)) issues.push(`Metadata file ${jsonPath} has no body`)
      if (parsed.readingTimeMinutes !== record.article?.readingTimeMinutes) {
        issues.push(`Metadata file ${jsonPath} has incorrect readingTimeMinutes`)
      }
      if (
        parsed.category !== record.article?.category ||
        parsed.genre !== record.article?.category
      ) {
        issues.push(`Metadata file ${jsonPath} has incorrect category or genre`)
      }
      if (parsed.contentHash !== `sha256:${sha256(JSON.stringify(parsed.body))}`) {
        issues.push(`Metadata file ${jsonPath} has an incorrect contentHash`)
      }
    } else if (parsed.schemaType !== record.schemaType) {
      issues.push(`Metadata file ${jsonPath} has incorrect schemaType`)
    }
  }

  const llmsPath = join(distRoot, 'llms.txt')
  if (!(await pathExists(llmsPath))) {
    issues.push('Missing dist/llms.txt')
  } else {
    const text = await readFile(llmsPath, 'utf8')
    if (!text.endsWith('\n') || text.endsWith('\n\n')) {
      issues.push('dist/llms.txt must end with exactly one newline')
    }
    if (text !== renderLlmsTxt(records)) {
      issues.push('dist/llms.txt does not match the builder')
    }
    for (const entry of canonicalEntries) {
      const record = recordsByPath.get(entry.path)
      if (!record) continue
      const canonicalCount = text.split(`${record.canonical})`).length - 1
      if (canonicalCount !== 1) {
        issues.push(`llms.txt lists ${record.canonical} ${canonicalCount} times`)
      }
      const jsonUrl = `${site.origin}${jsonPathFor(entry.path)}`
      const jsonCount = text.split(`${jsonUrl})`).length - 1
      if (jsonCount !== 1) {
        issues.push(`llms.txt lists ${jsonUrl} ${jsonCount} times`)
      }
    }
    for (const entry of manifest) {
      if (entry.path === entry.canonical) continue
      if (text.includes(`${site.origin}${entry.path}`)) {
        issues.push(`llms.txt lists the legacy alias ${entry.path}`)
      }
    }
  }

  const jsonFiles = (await listFiles(distRoot)).filter((file) => file.endsWith('.json'))
  for (const file of jsonFiles) {
    const publicPath = `/${relative(distRoot, file).split(sep).join('/')}`
    if (!expectedJsonPaths.has(publicPath)) issues.push(`Orphan JSON file in dist: ${publicPath}`)
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
    // The build writes the served form of a route — with the trailing slash —
    // whether or not an origin is configured, so both branches must expect it.
    const expectedCanonical = siteUrl
      ? withTrailingSlash(new URL(entry.canonical, `${siteUrl}/`).href)
      : withTrailingSlash(entry.canonical)
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
      // The expectations are keyed by the English page, which its French twin renders.
      const barePath =
        entry.path === '/fr' ? '/' : entry.path.startsWith('/fr/') ? entry.path.slice(3) : entry.path
      const minimum = prerenderedMinLinks[barePath] ?? PRERENDERED_ARTICLE_MIN_LINKS
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

  await auditMetadataOutput(manifest)
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
  if (entry.path === entry.canonical) {
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
await auditMetadataSources(manifest)

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
  "page === 'accessibility'",
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
