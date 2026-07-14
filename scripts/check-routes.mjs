import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const generatedRoot = join(projectRoot, 'src', 'generated')
const publicRoot = join(projectRoot, 'public')
const expectedRoutes = new Set([
  '/',
  '/about',
  '/archive',
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
  '/contact',
  '/resources',
  '/resources/mental-models',
  '/resources/other',
  '/resources/portfolio',
  '/resume',
  '/videos',
  '/work',
  '/work/centene-recovery-platform',
  '/work/daily-noodle',
  '/work/designing-systems-at-scale',
])

const manifest = JSON.parse(await readFile(join(generatedRoot, 'manifest.json'), 'utf8'))
const shorts = JSON.parse(
  await readFile(join(projectRoot, 'src', 'data', 'reference-shorts.json'), 'utf8'),
)
const videos = JSON.parse(
  await readFile(join(projectRoot, 'src', 'data', 'reference-videos.json'), 'utf8'),
)
const issues = []
const actualRoutes = new Set(manifest.pages.map((page) => page.path))
const assetPaths = new Set()

for (const route of expectedRoutes) {
  if (!actualRoutes.has(route)) issues.push(`Missing route: ${route}`)
}
for (const route of actualRoutes) {
  if (!expectedRoutes.has(route)) issues.push(`Unexpected route: ${route}`)
}
if (actualRoutes.size !== manifest.pages.length) issues.push('The route manifest contains duplicates')

try {
  const appSource = await readFile(join(projectRoot, 'src', 'App.tsx'), 'utf8')
  const whiteboardSource = await readFile(
    join(projectRoot, 'src', 'whiteboard', 'WhiteboardPage.tsx'),
    'utf8',
  )
  if (!appSource.includes("location.pathname === '/whiteboard'")) {
    issues.push('Missing /whiteboard route registration')
  }
  if (!/<main[^>]+id="main-content"/.test(whiteboardSource)) {
    issues.push('Missing #main-content in WhiteboardPage.tsx')
  }
} catch {
  issues.push('Whiteboard route source is missing')
}

function collectAssets(markup) {
  for (const match of markup.matchAll(/(?:src|poster|href)=(?:"([^"]+)"|'([^']+)')/gi)) {
    const candidate = (match[1] ?? match[2] ?? '').replaceAll('&amp;', '&')
    const pathname = candidate.split(/[?#]/)[0]
    if (/^\/(?:assets|files|images)\//.test(pathname)) assetPaths.add(pathname)
  }
  for (const match of markup.matchAll(/srcset=(?:"([^"]+)"|'([^']+)')/gi)) {
    for (const candidate of (match[1] ?? match[2] ?? '').split(',')) {
      const pathname = candidate.trim().split(/\s+/)[0]?.split(/[?#]/)[0]
      if (pathname?.startsWith('/')) assetPaths.add(pathname)
    }
  }
}

for (const page of manifest.pages) {
  if (!page.title || !page.description) issues.push(`Incomplete metadata: ${page.path}`)
  for (const image of [page.ogImage, page.twitterImage]) {
    if (!image) continue
    if (image.startsWith('/')) assetPaths.add(image.split(/[?#]/)[0])
    if (image.startsWith('https://nabauer.com')) {
      issues.push(`Unlocalized social image metadata: ${page.path}`)
    }
  }
  if (page.clientOnly) continue
  if (!page.file) {
    issues.push(`Missing generated file mapping: ${page.path}`)
    continue
  }

  try {
    const markup = await readFile(join(generatedRoot, 'pages', page.file), 'utf8')
    if (!/<main\b[^>]*id="main-content"/i.test(markup)) {
      issues.push(`Missing #main-content in ${page.file}`)
    }
    if (/https:\/\/nabauer\.com|\/cdn-cgi\/l\/email-protection/.test(markup)) {
      issues.push(`Unlocalized reference URL in ${page.file}`)
    }
    collectAssets(markup)
  } catch {
    issues.push(`Generated page file not found: ${page.file}`)
  }
}

if (shorts.length !== 17) issues.push(`Expected 17 shorts, found ${shorts.length}`)
if (new Set(shorts.map((item) => item.slug)).size !== shorts.length) {
  issues.push('Short slugs are not unique')
}
shorts.forEach((item) => collectAssets(item.html ?? ''))

const playableVideos = videos.filter(
  (item) => item.section === 'vpanel-shorts' || item.section === 'vpanel-sessions',
)
if (playableVideos.length !== 65) issues.push(`Expected 65 videos, found ${playableVideos.length}`)
playableVideos.forEach((item) => {
  if (!item.image) return
  assetPaths.add(item.image)
  const base = item.image.replace(/\.[^.]+$/, '')
  assetPaths.add(`${base}.480.webp`)
  assetPaths.add(`${base}.960.webp`)
})

for (const pathname of [
  '/apple-icon.png',
  '/favicon-dark.png',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.webmanifest',
  '/_redirects',
  ...assetPaths,
]) {
  try {
    await access(join(publicRoot, pathname.slice(1)))
  } catch {
    issues.push(`Missing local asset: ${pathname}`)
  }
}

if (issues.length > 0) {
  console.error(issues.map((issue) => `- ${issue}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `Validated ${actualRoutes.size} reference routes plus /whiteboard, ${shorts.length} shorts, ${playableVideos.length} videos, and ${assetPaths.size} referenced assets.`,
  )
}
