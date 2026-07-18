export interface PageMetadata {
  canonicalPath?: string
  description: string
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

function ensureNamedMeta(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.append(meta)
  }
  meta.content = content
}

function ensurePropertyMeta(property: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.append(meta)
  }
  meta.content = content
}

function removeNamedMeta(name: string) {
  document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.remove()
}

function removePropertyMeta(property: string) {
  document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.remove()
}

function ensureCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.append(link)
  }
  link.href = href
}

export function applyPageMetadata(metadata: PageMetadata) {
  const configuredSiteUrl: unknown = import.meta.env.VITE_SITE_URL
  const siteOrigin =
    typeof configuredSiteUrl === 'string' && /^https?:\/\//.test(configuredSiteUrl.trim())
      ? configuredSiteUrl.trim().replace(/\/$/, '')
      : window.location.origin
  const canonical = new URL(metadata.canonicalPath || metadata.path, `${siteOrigin}/`).href
  const ogTitle = metadata.ogTitle || metadata.title
  const ogDescription = metadata.ogDescription || metadata.description
  const twitterTitle = metadata.twitterTitle || ogTitle
  const twitterDescription = metadata.twitterDescription || ogDescription

  document.title = metadata.title
  ensureCanonical(canonical)
  ensureNamedMeta('description', metadata.description)
  ensureNamedMeta('robots', metadata.robots || 'index, follow')
  ensureNamedMeta('twitter:card', 'summary_large_image')
  ensureNamedMeta('twitter:title', twitterTitle)
  ensureNamedMeta('twitter:description', twitterDescription)
  ensurePropertyMeta('og:title', ogTitle)
  ensurePropertyMeta('og:description', ogDescription)
  ensurePropertyMeta('og:site_name', 'Mathis Certenais')
  ensurePropertyMeta('og:locale', 'en_US')
  ensurePropertyMeta('og:type', 'website')
  ensurePropertyMeta('og:url', canonical)

  if (metadata.ogImage) {
    ensurePropertyMeta('og:image', new URL(metadata.ogImage, `${siteOrigin}/`).href)
    ensureNamedMeta(
      'twitter:image',
      new URL(metadata.twitterImage || metadata.ogImage, `${siteOrigin}/`).href,
    )
  } else {
    removePropertyMeta('og:image')
    removeNamedMeta('twitter:image')
  }
  if (metadata.ogImageAlt) {
    ensurePropertyMeta('og:image:alt', metadata.ogImageAlt)
    ensureNamedMeta('twitter:image:alt', metadata.ogImageAlt)
  } else {
    removePropertyMeta('og:image:alt')
    removeNamedMeta('twitter:image:alt')
  }
}

export const homeMetadata: PageMetadata = {
  path: '/',
  title: 'Mathis Certenais | HPC & Scientific Workflows',
  description:
    'Mathis Certenais is a computer scientist and PhD researcher working on HPC, data logistics, and cross-facility scientific workflows.',
  ogImage: '/images/mathis/social-card.svg',
  ogImageAlt: 'Mathis Certenais — HPC and scientific workflows',
}

export const notFoundMetadata: PageMetadata = {
  path: '/404',
  title: 'Page not found | Mathis Certenais',
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: 'noindex',
}
