import manifest from '../generated/manifest.json'

export interface ReferenceManifestEntry {
  canonical: string
  clientOnly?: boolean
  description: string
  file: string | null
  finalPath: string
  ogDescription?: string
  ogImage?: string
  ogImageAlt?: string
  ogTitle?: string
  path: string
  robots?: string
  title: string
  twitterDescription?: string
  twitterImage?: string
  twitterTitle?: string
}

interface ReferenceManifest {
  generatedAt: string
  origin: string
  pages: ReferenceManifestEntry[]
}

const referenceManifest: ReferenceManifest = manifest
const rawPageModules = import.meta.glob<string>('../generated/pages/*.html', {
  import: 'default',
  query: '?raw',
})

const entriesByPath = new Map(referenceManifest.pages.map((entry) => [entry.path, entry]))

export function getReferenceEntry(pathname: string) {
  return entriesByPath.get(pathname)
}

export async function loadReferenceHtml(file: string) {
  const load = rawPageModules[`../generated/pages/${file}`]
  return load ? load() : undefined
}
