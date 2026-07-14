import generatedShorts from '../data/reference-shorts.json'
import generatedVideos from '../data/reference-videos.json'

export interface ReferenceShort {
  html: string
  slug: string
  title: string
}

interface GeneratedVideo {
  alt: string | null
  href: string
  image: string | null
  section: string
  text: string
}

export interface ReferenceVideo {
  alt: string
  description: string
  duration: string
  href: string
  image: string
  kind: 'live' | 'short'
  title: string
}

export const referenceShorts: ReferenceShort[] = generatedShorts.map((item) => {
  const lines = item.text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const labelIndex = lines.indexOf('SHORT')

  return {
    html: item.html,
    slug: item.slug,
    title: lines[labelIndex + 1] ?? item.slug.replaceAll('-', ' '),
  }
})

export const referenceShortsBySlug = new Map(referenceShorts.map((item) => [item.slug, item]))

export const referenceVideos: ReferenceVideo[] = (generatedVideos as GeneratedVideo[])
  .filter(
    (item): item is GeneratedVideo & { image: string } =>
      item.section === 'vpanel-shorts' || item.section === 'vpanel-sessions',
  )
  .map((item) => {
    const isLive = item.section === 'vpanel-sessions'
    const lines = item.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    return {
      alt: item.alt ?? lines.at(-1) ?? 'Video',
      description: isLive ? lines.slice(2).join(' ') : '',
      duration: isLive ? (lines[0] ?? '') : '',
      href: item.href,
      image: item.image,
      kind: isLive ? 'live' : 'short',
      title: isLive ? (lines[1] ?? 'Feedback Friday') : item.text.trim(),
    }
  })
