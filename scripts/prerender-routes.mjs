import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { locales } from '../src/locales.ts'
import * as contentEn from '../src/content/en.ts'

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

/**
 * The URL a crawler should treat as canonical: the form the host actually
 * serves, which carries a trailing slash on every route but the root. Declaring
 * the slashless form would point the canonical at a URL that redirects.
 */
function canonicalUrl(path) {
  const absolute = absoluteUrl(path)
  if (!absolute || absolute.endsWith('/')) return absolute
  return `${absolute}/`
}

/** An internal link to a route, in the form the host serves it. */
function routeHref(path) {
  return path === '/' ? '/' : `${path}/`
}

/**
 * Only canonical routes that are meant to be indexed belong in the sitemap. The
 * legacy aliases are `noindex, follow`, so listing them would send Search Console a
 * contradictory signal.
 */
function indexableRoutes() {
  return manifest.filter(
    (entry) => entry.path === entry.canonical && !/noindex/i.test(entry.robots || ''),
  )
}

function renderSitemap() {
  const urls = indexableRoutes().map(
    (entry) => `  <url>\n    <loc>${escapeHtml(canonicalUrl(entry.path))}</loc>\n  </url>`,
  )

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
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

/**
 * Static text of a route, written into the shell so a crawler that never runs
 * JavaScript still reads the page: Google in its first pass, Bing, the answer
 * engines behind GPTBot, ClaudeBot and PerplexityBot, and every plain parser.
 *
 * React clears `#root` when it mounts, so visitors see the app and only the app.
 * The markup is deliberately plain — it is the text of the page, generated from
 * the same `src/content.ts` the components read, in the order the page presents
 * it, so the two cannot drift apart.
 */

/** The inline syntax the article components understand: `**bold**`, links, refs. */
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" rel="noreferrer" target="_blank">$1</a>',
    )
    .replace(/\[(\d+)\]/g, '<a href="#ref-$1">[$1]</a>')
}

const label = (text) => `<p class="prerendered__label">${escapeHtml(text)}</p>`
const meta = (text) => `<p class="prerendered__meta">${inline(text)}</p>`
const h1 = (text) => `<h1>${inline(text)}</h1>`
const h2 = (text) => `<h2>${inline(text)}</h2>`
const h3 = (text) => `<h3>${inline(text)}</h3>`
const p = (text) => `<p>${inline(text)}</p>`
const link = (href, text, external = false) =>
  `<a href="${escapeHtml(href)}"${external ? ' rel="noreferrer" target="_blank"' : ''}>${escapeHtml(text)}</a>`

/** A paragraph whose whole content is a link. `p()` escapes, so the anchor is
    built here rather than passed through it. */
const linkParagraph = (href, text) =>
  `<p>${link(href, text)}</p>`

function list(items, ordered = false) {
  const tag = ordered ? 'ol' : 'ul'
  return `<${tag}>\n${items.map((item) => `        <li>${item}</li>`).join('\n')}\n      </${tag}>`
}

/** A chapter of the research narrative: label, heading, paragraphs. */
function chapter({ heading, label: chapterLabel, paragraphs }) {
  return [label(chapterLabel), h2(heading), ...paragraphs.map(p)].join('\n      ')
}

/** A figure with a caption keeps the caption; the image itself is React's job. */
function articleBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return p(block.text)
    case 'heading':
      return block.level === 2 ? h2(block.text) : h3(block.text)
    case 'list':
      return list(
        block.items.map((item) => {
          const text = typeof item === 'string' ? item : item.text
          const id = typeof item === 'string' || !item.id ? '' : ` id="${escapeHtml(item.id)}"`
          return `<li${id}>${inline(text)}</li>`
        }).map((item) => item.replace(/^<li/, '<li')),
        block.ordered,
      )
    case 'figure':
      return block.caption ? `<p class="prerendered__caption">${inline(block.caption)}</p>` : ''
    default:
      return ''
  }
}

/**
 * The fallbacks, built for one language: `content` is that language's module and
 * every generator reads only from it, so one set of generators serves both.
 * Section headings are still literals here; they move into the locale strings
 * with the French pass.
 */
function createFallbacks(content, t) {
  const {
    aboutPage,
    articleItems,
    businessCard,
    contactPage,
    expertise,
    identity,
    profileTimeline,
    proofPoints,
    researchApplications,
    researchCase,
    researchChain,
    researchChapters,
    researchContribution,
    researchFeature,
    researchFigures,
    researchMethods,
    researchPerspectives,
    researchThesis,
    resumePage,
    sourceLinks,
    videoItems,
    videosPage,
    writingPage,
  } = content

function renderResearch() {
  return `<main class="prerendered" id="main-content">
      ${label(researchThesis.label)}
      ${h1(researchThesis.title)}
      ${meta([researchThesis.context, researchThesis.programme].join(' · '))}
      ${p(researchThesis.summary)}
      ${researchChapters.map(chapter).join('\n      ')}
      ${h2(t.thesisFigures)}
      ${list(researchFigures.map((figure) => `<strong>${escapeHtml(figure.value)}</strong> — ${escapeHtml(figure.label)}`))}
      ${h2(t.thesisPerspectives)}
      ${list(
        researchPerspectives.map(
          (perspective) =>
            `${label(perspective.number)}${h3(perspective.title)}${p(perspective.text)}`,
        ),
        true,
      )}
      ${chapter(researchMethods)}
      ${h2(t.thesisChain)}
      ${list(
        researchChain.map(
          (step) =>
            `<strong>${escapeHtml(step.role)}</strong> — ${escapeHtml(step.site)}: ${escapeHtml(step.detail)}`,
        ),
      )}
      ${chapter(researchCase)}
      ${chapter(researchContribution)}
      ${chapter(researchApplications)}
      ${h2(t.thesisOutro)}
      ${list([
        link(routeHref('/writing'), t.notes),
        `<a href="${escapeHtml(sourceLinks.arxiv)}" rel="noreferrer" target="_blank">${t.publications}</a>`,
        `<a href="${escapeHtml(sourceLinks.numpex)}" rel="noreferrer" target="_blank">${t.numpex}</a>`,
        link(routeHref('/contact'), t.getInTouch),
      ])}
    </main>`
}

function renderHome() {
  return `<main class="prerendered" id="main-content">
      ${meta(`${identity.name} · ${identity.shortRole}`)}
      ${h1(identity.headline.join(' '))}
      ${p(identity.description)}
      ${meta(`${t.researcherAt}${identity.location}`)}
      ${list([
        link(routeHref('/research'), t.viewResearch),
        link(routeHref('/resume'), t.viewProfile),
        link(routeHref('/contact'), 'Get in touch'),
      ])}
      ${h2(researchFeature.heading)}
      ${label(researchThesis.label)}
      ${h3(researchThesis.title)}
      ${researchFeature.leads.map(p).join('\n      ')}
      ${list(
        [
          ...researchFigures.map(
            (figure) => `<strong>${escapeHtml(figure.value)}</strong> — ${escapeHtml(figure.label)}`,
          ),
          `<strong>${escapeHtml(researchFeature.context.label)}</strong> — ${escapeHtml(researchFeature.context.text)}`,
        ],
        false,
      )}
      ${linkParagraph('/research', t.exploreResearch)}
      ${h2(videosPage.sectionHeading)}
      ${list(
        videoItems.map(
          (video) =>
            `<a href="${escapeHtml(video.externalHref)}" rel="noreferrer" target="_blank">${escapeHtml(video.title)}</a> — ${escapeHtml(video.description)}`,
        ),
      )}
      ${linkParagraph('/videos', t.seeVideos)}
      ${h2(writingPage.sectionHeading)}
      ${list(
        articleItems.map(
          (article) =>
            `${link(routeHref(article.href), article.title)} — ${escapeHtml(article.description)}`,
        ),
      )}
      ${linkParagraph('/writing', t.readEntries)}
      ${h2(t.inShort)}
      ${list(proofPoints.map((point) => `<strong>${escapeHtml(point.title)}</strong> — ${escapeHtml(point.description)}`))}
    </main>`
}

function renderWriting() {
  return `<main class="prerendered" id="main-content">
      ${label(writingPage.eyebrow)}
      ${h1(writingPage.title)}
      ${p(writingPage.intro)}
      ${h2(writingPage.sectionHeading)}
      ${list(
        articleItems.map((article) =>
          [
            label(`${article.category} · ${article.date}`),
            h3(article.title),
            p(article.description),
            linkParagraph(article.href, `${t.readArticle} ${article.title}`),
          ].join(''),
        ),
      )}
    </main>`
}

function renderArticle(article) {
  const blocks = article.body.map(articleBlock).filter(Boolean)

  return `<main class="prerendered" id="main-content">
      ${label(`${article.category} · ${article.date}`)}
      ${h1(article.title)}
      ${p(article.description)}
      <figure class="prerendered__figure">
        <img alt="${escapeHtml(article.imageAlt)}" src="${escapeHtml(article.image)}" />
      </figure>
      ${blocks.join('\n      ')}
      ${
        article.sourceHref
          ? `${h2(t.source)}${linkParagraph(article.sourceHref, t.originalPublication)}`
          : ''
      }
      ${h2(t.keepReading)}
      ${list([
        link(routeHref('/writing'), t.allEntries),
        link(routeHref('/research'), t.theResearch),
        link(routeHref('/contact'), 'Get in touch'),
      ])}
    </main>`
}

function renderVideos() {
  return `<main class="prerendered" id="main-content">
      ${label(videosPage.eyebrow)}
      ${h1(videosPage.title)}
      ${p(videosPage.intro)}
      ${h2(videosPage.sectionHeading)}
      ${list(
        videoItems.map(
          (video) =>
            `<a href="${escapeHtml(video.externalHref)}" rel="noreferrer" target="_blank">${escapeHtml(video.title)}</a> — ${escapeHtml(video.description)}`,
        ),
      )}
    </main>`
}

function renderAbout() {
  return `<main class="prerendered" id="main-content">
      ${label(aboutPage.eyebrow)}
      ${h1(aboutPage.title)}
      ${p(aboutPage.intro)}
      ${label(aboutPage.story.label)}
      ${h2(aboutPage.story.heading)}
      ${aboutPage.story.paragraphs.map(p).join('\n      ')}
      ${h2(t.background)}
      ${list(
        profileTimeline.map(
          (entry) => `${label(entry.label)}${h3(entry.title)}${p(entry.detail)}`,
        ),
      )}
      ${h2(t.researchThemes)}
      ${list(expertise.map((item) => escapeHtml(item)))}
      ${linkParagraph(sourceLinks.eclatInterview, t.readInterview)}
      ${label(aboutPage.principles.label)}
      ${list(
        aboutPage.principles.items.map(
          (principle) =>
            `${label(principle.number)}${h3(principle.title)}${p(principle.text)}`,
        ),
      )}
    </main>`
}

function renderResume() {
  return `<main class="prerendered" id="main-content">
      ${label(resumePage.eyebrow)}
      ${h1(identity.name)}
      ${p(resumePage.intro)}
      ${h2(t.contactHeading)}
      ${list([
        `<a href="mailto:${escapeHtml(identity.email)}">${escapeHtml(identity.email)}</a>`,
        `<a href="${escapeHtml(identity.linkedin)}" rel="noreferrer" target="_blank">LinkedIn</a>`,
        escapeHtml(identity.location),
      ])}
      ${h2('Research themes')}
      ${list(expertise.map((item) => escapeHtml(item)))}
      ${h2(resumePage.profile.heading)}
      ${p(resumePage.profile.text)}
      ${h2(resumePage.experienceLabel)}
      ${list(
        profileTimeline.map(
          (entry) => `${label(entry.label)}${h3(entry.title)}${p(entry.detail)}`,
        ),
      )}
      ${h2(resumePage.publication.label)}
      ${list([
        `${label(resumePage.publication.date)}${h3(resumePage.publication.title)}${p(resumePage.publication.authors)}${linkParagraph(resumePage.publication.href, `${resumePage.publication.linkLabel} ${t.publicationLink}`)}`,
      ])}
      ${h2(t.presentations)}
      ${list(
        resumePage.presentations.map(
          (item) => `${label(item.date)}${h3(item.title)}${p(item.text)}`,
        ),
      )}
      ${h2(t.certifications)}
      ${list(
        resumePage.certifications.map((item) => `${label(item.date)}${h3(item.title)}`),
      )}
    </main>`
}

function renderContact() {
  return `<main class="prerendered" id="main-content">
      ${label('Contact')}
      ${h1(t.contactTitle)}
      ${p(contactPage.intro)}
      ${h2(t.contactStart)}
      ${list([
        `<a href="mailto:${escapeHtml(identity.email)}">${escapeHtml(identity.email)}</a>`,
        `<a href="${escapeHtml(identity.linkedin)}" rel="noreferrer" target="_blank">LinkedIn</a>`,
      ])}
      ${p(
        t.contactRoutes,
      )}
      ${h2(t.cardHeading)}
      ${list([
        escapeHtml(businessCard.affiliation),
        `${escapeHtml(businessCard.phone)} — <a href="${escapeHtml(businessCard.phoneHref)}">${t.callLink}</a>`,
        `<a href="${escapeHtml(businessCard.website)}">${escapeHtml(businessCard.websiteLabel)}</a>`,
      ])}
      ${label(t.scan)}
      ${p(
        t.qrNote,
      )}
    </main>`
}

function fallbackFor(routePath) {
  if (routePath === '/') return renderHome()
  if (routePath === '/research') return renderResearch()
  if (routePath === '/writing') return renderWriting()
  if (routePath === '/videos') return renderVideos()
  if (routePath === '/about') return renderAbout()
  if (routePath === '/resume') return renderResume()
  if (routePath === '/contact') return renderContact()

  const article = articleItems.find((item) => item.href === routePath)
  return article ? renderArticle(article) : null
}

  return fallbackFor
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
  const canonical = canonicalUrl(canonicalPath)
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
  html = setCanonical(html, canonical)

  if (entry.path !== '/') html = removeHomePreload(html)

  const fallback = fallbackFor(entry.path)
  if (fallback) {
    const shell = /<div id="root"><\/div>/
    if (!shell.test(html)) {
      throw new TypeError(`The shell for ${entry.path} no longer has an empty #root to fill.`)
    }
    html = html.replace(shell, `<div id="root">${fallback}</div>`)
  } else if (entry.path === entry.canonical && !/noindex/i.test(entry.robots || '')) {
    throw new TypeError(`The indexable route ${entry.path} has no prerendered fallback.`)
  }

  return `${html.trim()}\n`
}

const fallbackFor = createFallbacks(contentEn, locales.en.fallbacks)

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

// A sitemap needs absolute URLs, so it is only written when the deployed origin
// is configured. The deploy workflow sets VITE_SITE_URL for exactly this reason.
if (siteUrl) {
  await writeFile(join(distRoot, 'sitemap.xml'), renderSitemap())
  console.log(`Wrote dist/sitemap.xml listing ${indexableRoutes().length} indexable routes.`)
} else {
  console.warn(
    'VITE_SITE_URL is not set, so dist/sitemap.xml was skipped: a sitemap needs absolute URLs.',
  )
}
