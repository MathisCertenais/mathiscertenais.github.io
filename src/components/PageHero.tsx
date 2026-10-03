import type { CSSProperties, ReactNode } from 'react'

interface PageHeroProps {
  actions?: ReactNode
  eyebrow: string
  illustration?: {
    alt: string
    /**
     * Aspect ratio for the art box, as a CSS fraction such as '3 / 2'. The art
     * column is proportioned for a tall portrait, so a landscape asset needs an
     * explicit ratio: left alone it keeps its own shape and collapses into a
     * thin strip beside the copy.
     */
    ratio?: string
    src: string
  }
  intro: string
  title: string
}

export function PageHero({ actions, eyebrow, illustration, intro, title }: PageHeroProps) {
  const ratio = illustration?.ratio
  const [ratioWidth, ratioHeight] = ratio?.split('/').map(parseFloat) ?? []
  const isLandscape = ratioWidth > ratioHeight

  return (
    <section
      className={`page-hero section${illustration ? ' page-hero--with-art' : ''}${
        isLandscape ? ' page-hero--with-landscape-art' : ''
      }`}
    >
      <div className="page-hero__copy">
        <p className="section-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__intro">{intro}</p>
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </div>
      {illustration ? (
        <img
          alt={illustration.alt}
          className="page-hero__art"
          src={illustration.src}
          style={ratio ? ({ '--hero-art-ratio': ratio } as CSSProperties) : undefined}
        />
      ) : null}
    </section>
  )
}
