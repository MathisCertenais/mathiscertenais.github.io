import { routeManifest } from '../routeManifest.ts'
import {
  articleItems as englishArticles,
  videoItems as englishVideos,
  type ArticleBlock,
  type ArticleId,
  type ArticleItem,
} from './en.ts'
import { articleItems as frenchArticles, videoItems as frenchVideos } from './fr.ts'
import { readingTimeMinutes } from './readingTime.ts'
import {
  articleRecords,
  pageRecords,
  site,
  type ArticleRecord,
  type Author,
  type Citation,
  type Entity,
  type Language,
  type PageRecord,
} from './siteRecords.ts'

/**
 * The machine-readable layer: one JSON-LD `@graph` per canonical route, one
 * `site-metadata@1` record per canonical route, and `llms.txt`.
 *
 * Everything here is pure: no filesystem, no clock, no locale API, no
 * `import.meta`. The hash of an article body is injected by the build and the
 * validator (`node:crypto`), so the browser bundle never imports a Node module
 * and the client can still render the same JSON-LD on navigation.
 */

export interface BuildOptions {
  /** Hex SHA-256 of a string. Supplied by the build and the validator only. */
  hash?: (value: string) => string
}

export interface ResolvedCitation extends Citation {
  url: string
}

export interface ArticleMetadata {
  id: ArticleId
  number: string
  category: string
  readingTimeMinutes: number
  /** Absent on the client, present in every built artifact. */
  contentHash?: string
  body: ArticleBlock[]
  sourceHref?: string
}

type JsonLdNode = Record<string, unknown>

export interface RouteMetadata {
  id: string
  path: string
  canonical: string
  language: Language
  translations: Record<Language, string>
  kind: 'page' | 'article'
  schemaType: string
  title: string
  headline: string
  description: string
  aiSummary: string
  keywords: string[]
  entities: Entity[]
  authors: Author[]
  datePublished?: string
  dateModified: string | null
  citations: ResolvedCitation[]
  license: string | null
  image: { url: string; alt: string }
  robots: string
  hasPart?: JsonLdNode[]
  article?: ArticleMetadata
}

const SITE_SUFFIX = ' | Mathis Certenais'
const ORIGIN = site.origin.replace(/\/$/, '')
const PERSON_ID = `${ORIGIN}/#person`
const WEBSITE_ID = `${ORIGIN}/#website`

const MONTHS: Record<string, string> = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
}

/** The public JSON file of a canonical route: `/` is `index.json`, the rest append `.json`. */
export function jsonPathFor(path: string): string {
  if (path === '/') return '/index.json'
  return `${path.replace(/\/+$/, '')}.json`
}

/**
 * The page headline: the manifest title without the site suffix. A title that
 * carries a different site suffix is a data error; the two home titles carry no
 * suffix at all and are returned unchanged.
 */
export function stripSiteSuffix(title: string): string {
  const trimmed = title.trim()
  if (trimmed.endsWith(SITE_SUFFIX)) return trimmed.slice(0, -SITE_SUFFIX.length).trim()
  if (trimmed.includes(' | ')) {
    throw new TypeError(`Title does not end with the site suffix: ${title}`)
  }
  return trimmed
}

/**
 * The display date of an article, in the one format the English content uses:
 * `Month D, YYYY` becomes `YYYY-MM-DD`, `Month YYYY` becomes `YYYY-MM`. French
 * display dates are translations, so the English item is the source of truth.
 */
export function parseArticleDate(value: string): string {
  const full = /^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/.exec(value.trim())
  if (full) {
    const month = MONTHS[full[1]]
    if (!month) throw new TypeError(`Unknown month in article date: ${value}`)
    const day = Number(full[2])
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw new TypeError(`Invalid day in article date: ${value}`)
    }
    return `${full[3]}-${month}-${String(day).padStart(2, '0')}`
  }

  const monthOnly = /^([A-Z][a-z]+) (\d{4})$/.exec(value.trim())
  if (monthOnly) {
    const month = MONTHS[monthOnly[1]]
    if (!month) throw new TypeError(`Unknown month in article date: ${value}`)
    return `${monthOnly[2]}-${month}`
  }

  throw new TypeError(`Unparseable article date: ${value}`)
}

/** The schema.org type of a route, from its manifest page id. */
export function schemaTypeFor(pageId: string): string {
  if (pageId === 'home') return 'WebSite'
  if (pageId === 'about' || pageId === 'resume') return 'ProfilePage'
  if (pageId === 'writing' || pageId === 'videos') return 'CollectionPage'
  if (pageId === 'contact') return 'ContactPage'
  if (pageId === 'research' || pageId === 'accessibility') return 'WebPage'
  if (pageId.startsWith('article:')) {
    const articleId = pageId.slice('article:'.length)
    if (!(articleId in articleRecords)) {
      throw new TypeError(`Unknown article record: ${articleId}`)
    }
    return articleRecords[articleId as ArticleId].schemaType
  }
  throw new TypeError(`Unknown page id: ${pageId}`)
}

function absolute(path: string): string {
  const clean = path === '/' ? '/' : path.replace(/\/+$/, '')
  return clean === '/' ? `${ORIGIN}/` : `${ORIGIN}${clean}/`
}

/** An absolute URL for a file: an image path keeps its extension, no trailing slash. */
function absoluteFile(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

function languageFor(path: string): Language {
  return path === '/fr' || path.startsWith('/fr/') ? 'fr' : 'en'
}

/** The English canonical path behind a French twin. */
function barePath(path: string): string {
  if (path === '/fr') return '/'
  if (path.startsWith('/fr/')) return path.slice(3)
  return path
}

function localisedPath(path: string, language: Language): string {
  if (language === 'en') return path
  return path === '/' ? '/fr' : `/fr${path}`
}

function translationsFor(path: string): Record<Language, string> {
  const bare = barePath(path)
  return {
    en: absolute(bare),
    fr: absolute(localisedPath(bare, 'fr')),
  }
}

function citationUrl(citation: Citation): string {
  if (citation.kind === 'doi') return `https://doi.org/${citation.value}`
  if (citation.kind === 'arxiv') return `https://arxiv.org/abs/${citation.value}`
  return citation.value
}

/** An internal href is resolved through the manifest, so aliases never leak in. */
function absoluteHref(href: string): string {
  if (/^https?:\/\//i.test(href)) return href
  const entry = routeManifest.find((route) => route.path === href)
  if (entry) return absolute(entry.canonical)
  return `${ORIGIN}${href.startsWith('/') ? href : `/${href}`}`
}

function localisedArticle(id: ArticleId, language: Language): ArticleItem {
  const items = language === 'fr' ? frenchArticles : englishArticles
  const item = items.find((article) => article.id === id)
  if (!item) throw new TypeError(`No ${language} article with id ${id}`)
  return item
}

function buildHasPart(bare: string, language: Language): JsonLdNode[] | undefined {
  if (bare === '/insights') {
    const items = language === 'fr' ? frenchArticles : englishArticles
    return items.map((article) => {
      const record: ArticleRecord = articleRecords[article.id]
      return {
        '@type': record.schemaType,
        '@id': `${absolute(localisedPath(article.href, language))}#article`,
        url: absolute(localisedPath(article.href, language)),
        headline: article.title.trim(),
        datePublished: parseArticleDate(localisedArticle(article.id, 'en').date),
      }
    })
  }

  if (bare === '/videos') {
    const items = language === 'fr' ? frenchVideos : englishVideos
    return items.map((video) => ({
      '@type': 'CreativeWork',
      name: video.title,
      description: video.description,
      url: absoluteHref(video.externalHref),
    }))
  }

  return undefined
}

/** The record of one canonical route, in the language of that route. */
export function buildRouteMetadata(
  routePath: string,
  options: BuildOptions = {},
): RouteMetadata {
  const entry = routeManifest.find((route) => route.path === routePath)
  if (!entry) throw new TypeError(`Unknown route: ${routePath}`)
  if (entry.path !== entry.canonical) {
    throw new TypeError(`Not a canonical route: ${routePath}`)
  }
  if (!entry.ogImage || !entry.ogImageAlt) {
    throw new TypeError(`Canonical route without social image metadata: ${routePath}`)
  }

  const language = languageFor(routePath)
  const bare = barePath(routePath)
  const kind: 'page' | 'article' = entry.page.startsWith('article:') ? 'article' : 'page'
  const schemaType = schemaTypeFor(entry.page)
  const image = { url: absoluteFile(entry.ogImage), alt: entry.ogImageAlt }
  const translations = translationsFor(routePath)

  if (kind === 'article') {
    const articleId = entry.page.slice('article:'.length)
    if (!(articleId in articleRecords)) {
      throw new TypeError(`No article record for ${entry.page}`)
    }
    const record = articleRecords[articleId as ArticleId]
    const item = localisedArticle(articleId as ArticleId, language)
    const englishItem = localisedArticle(articleId as ArticleId, 'en')
    const body = item.body

    return {
      id: articleId,
      path: routePath,
      canonical: absolute(routePath),
      language,
      translations,
      kind,
      schemaType,
      title: entry.title,
      headline: item.title.trim(),
      description: entry.description,
      aiSummary: record.aiSummary[language],
      keywords: record.keywords[language],
      entities: record.entities,
      authors: record.authors,
      datePublished: parseArticleDate(englishItem.date),
      dateModified: record.dateModified[language],
      citations: record.citations.map((citation) => ({
        ...citation,
        url: citationUrl(citation),
      })),
      license: record.license === undefined ? site.license : record.license,
      image,
      robots: entry.robots || 'index, follow',
      article: {
        id: articleId as ArticleId,
        number: item.number,
        category: item.category,
        readingTimeMinutes: readingTimeMinutes(item),
        contentHash: options.hash
          ? `sha256:${options.hash(JSON.stringify(body))}`
          : undefined,
        body,
        sourceHref: item.sourceHref,
      },
    }
  }

  const pageRecord: PageRecord | undefined = pageRecords.find(
    (record) => record.path === bare,
  )
  if (!pageRecord) throw new TypeError(`No page record for ${entry.page}`)

  return {
    id: entry.page,
    path: routePath,
    canonical: absolute(routePath),
    language,
    translations,
    kind,
    schemaType,
    title: entry.title,
    headline: stripSiteSuffix(entry.title),
    description: entry.description,
    aiSummary: pageRecord.aiSummary[language],
    keywords: pageRecord.keywords[language],
    entities: pageRecord.entities,
    authors: [{ name: site.person.name, url: site.person.url }],
    dateModified: pageRecord.dateModified[language],
    citations: [],
    license: site.license,
    image,
    robots: entry.robots || 'index, follow',
    hasPart: buildHasPart(bare, language),
  }
}

/** Every canonical route, in manifest order. */
export function buildAllRouteMetadata(options: BuildOptions = {}): RouteMetadata[] {
  return routeManifest
    .filter((entry) => entry.path === entry.canonical)
    .map((entry) => buildRouteMetadata(entry.path, options))
}

function personNode(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.person.name,
    url: site.person.url,
    sameAs: site.person.sameAs,
    affiliation: site.person.affiliation.map(({ name, url }) => ({
      '@type': 'Organization',
      name,
      ...(url ? { url } : {}),
    })),
    ...(site.person.includeEmail ? { email: `mailto:${site.person.email}` } : {}),
  }
}

function websiteNode(metadata: RouteMetadata, isHome: boolean): JsonLdNode {
  const node: JsonLdNode = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: isHome ? metadata.canonical : `${ORIGIN}/`,
    name: site.person.name,
    inLanguage: isHome ? metadata.language : ['en', 'fr'],
    publisher: { '@id': PERSON_ID },
  }

  if (isHome) {
    node.description = metadata.description
    node.keywords = metadata.keywords
    node.about = entityNodes(metadata.entities)
    node.image = imageNode(metadata)
  }

  return node
}

function imageNode(metadata: RouteMetadata): JsonLdNode {
  return {
    '@type': 'ImageObject',
    url: metadata.image.url,
    caption: metadata.image.alt,
  }
}

function entityNodes(entities: Entity[]): JsonLdNode[] {
  return entities.map((entity) => ({
    '@type': entity.type,
    name: entity.name,
    ...(entity.sameAs ? { sameAs: entity.sameAs } : {}),
  }))
}

function pageNode(metadata: RouteMetadata): JsonLdNode {
  const node: JsonLdNode = {
    '@type': metadata.schemaType,
    '@id': `${metadata.canonical}#webpage`,
    url: metadata.canonical,
    name: metadata.headline,
    description: metadata.description,
    inLanguage: metadata.language,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    image: imageNode(metadata),
    keywords: metadata.keywords,
    about: entityNodes(metadata.entities),
  }

  if (metadata.dateModified) node.dateModified = metadata.dateModified
  if (metadata.hasPart) node.hasPart = metadata.hasPart
  return node
}

function articleNode(metadata: RouteMetadata): JsonLdNode {
  const article = metadata.article
  if (!article) throw new TypeError(`Article metadata missing for ${metadata.path}`)

  const node: JsonLdNode = {
    '@type': metadata.schemaType,
    '@id': `${metadata.canonical}#article`,
    headline: metadata.headline,
    description: metadata.description,
    inLanguage: metadata.language,
    datePublished: metadata.datePublished,
    dateModified: metadata.dateModified,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    image: imageNode(metadata),
    url: metadata.canonical,
    mainEntityOfPage: { '@id': metadata.canonical },
    isPartOf: { '@id': WEBSITE_ID },
    keywords: metadata.keywords,
    genre: article.category,
    citation: metadata.citations.map((citation) => ({
      '@type': 'CreativeWork',
      identifier: citation.value,
      url: citation.url,
      ...(citation.title ? { name: citation.title } : {}),
    })),
    about: entityNodes(metadata.entities),
  }

  if (metadata.license !== null) node.license = metadata.license
  return node
}

function buildGraph(metadata: RouteMetadata): JsonLdNode[] {
  const isHome = metadata.schemaType === 'WebSite'
  const graph: JsonLdNode[] = [personNode(), websiteNode(metadata, isHome)]
  if (!isHome) {
    graph.push(metadata.kind === 'article' ? articleNode(metadata) : pageNode(metadata))
  }
  return graph
}

/** The JSON-LD text of a route, ready for a `script#page-jsonld` element. */
export function renderJsonLd(metadata: RouteMetadata): string {
  return JSON.stringify(
    { '@context': 'https://schema.org', '@graph': buildGraph(metadata) },
    null,
    2,
  ).replaceAll('<', '\\u003c')
}

/** The `site-metadata@1` file of a route, with a final newline and no BOM. */
export function renderMetadataFile(metadata: RouteMetadata): string {
  const article = metadata.article
  if (metadata.kind === 'article' && !article) {
    throw new TypeError(`Article metadata missing for ${metadata.path}`)
  }

  const record = {
    schema: 'site-metadata@1',
    kind: metadata.kind,
    id: metadata.id,
    language: metadata.language,
    canonical: metadata.canonical,
    translations: metadata.translations,
    title: metadata.title,
    description: metadata.description,
    aiSummary: metadata.aiSummary,
    authors: metadata.authors,
    ...(metadata.datePublished ? { datePublished: metadata.datePublished } : {}),
    dateModified: metadata.dateModified,
    ...(metadata.kind === 'article' && article
      ? { category: article.category, genre: article.category }
      : {}),
    keywords: metadata.keywords,
    entities: metadata.entities,
    citations: metadata.citations,
    license: metadata.license,
    ...(article?.sourceHref ? { sourceHref: article.sourceHref } : {}),
    image: metadata.image,
    ...(metadata.kind === 'article' && article
      ? {
          readingTimeMinutes: article.readingTimeMinutes,
          bodyFormat: 'article-blocks@1',
          contentHash: article.contentHash,
          body: article.body,
        }
      : {}),
    ...(metadata.kind === 'page' ? { schemaType: metadata.schemaType } : {}),
  }

  return `${JSON.stringify(record, null, 2)}\n`
}

const PAGE_ORDER = [
  '/',
  '/research',
  '/insights',
  '/videos',
  '/about',
  '/resume',
  '/contact',
  '/accessibility',
] as const

const PAGE_LABELS: Record<Language, Record<string, string>> = {
  en: {
    '/': 'Home',
    '/research': 'Research',
    '/insights': 'Insights',
    '/videos': 'Videos',
    '/about': 'About',
    '/resume': 'Research profile',
    '/contact': 'Contact',
    '/accessibility': 'Accessibility',
  },
  fr: {
    '/': 'Accueil',
    '/research': 'Recherche',
    '/insights': 'Articles et actualités',
    '/videos': 'Vidéos',
    '/about': 'À propos',
    '/resume': 'Profil de recherche',
    '/contact': 'Contact',
    '/accessibility': 'Accessibilité',
  },
}

function llmsSection(records: RouteMetadata[], language: Language): string[] {
  const byPath = new Map(records.map((record) => [record.path, record]))
  const lines = [`## ${language === 'en' ? 'English' : 'Français'}`, '', '### Pages']

  for (const bare of PAGE_ORDER) {
    const path = localisedPath(bare, language)
    const record = byPath.get(path)
    if (!record) throw new TypeError(`llms.txt has no record for ${path}`)
    lines.push(
      `- [${PAGE_LABELS[language][bare]}](${record.canonical}): ${record.description} ([JSON](${ORIGIN}${jsonPathFor(record.path)}))`,
    )
  }

  lines.push('', '### Articles')
  for (const article of englishArticles) {
    const path = localisedPath(article.href, language)
    const record = byPath.get(path)
    if (!record) throw new TypeError(`llms.txt has no record for ${path}`)
    lines.push(
      `- [${record.headline.trim()}](${record.canonical}): ${record.description} ([JSON](${ORIGIN}${jsonPathFor(record.path)}))`,
    )
  }

  return lines
}

/** `dist/llms.txt`: every canonical route, both languages, no alias. */
export function renderLlmsTxt(records: RouteMetadata[]): string {
  return [
    '# Mathis Certenais',
    '',
    '> Computer scientist and PhD researcher working on high-performance computing, scientific data',
    '> logistics and cross-facility workflows for radio astronomy. Every page below exists in English',
    '> and French; each has a machine-readable record at its `.json` URL (`site-metadata@1`,',
    '> documented in docs/adr/0001-machine-readable-metadata.md).',
    '',
    ...llmsSection(records, 'en'),
    '',
    ...llmsSection(records, 'fr'),
    '',
  ].join('\n')
}
