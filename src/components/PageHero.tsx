import type { ReactNode } from 'react'

interface PageHeroProps {
  actions?: ReactNode
  eyebrow: string
  illustration?: {
    alt: string
    src: string
  }
  intro: string
  title: string
}

export function PageHero({ actions, eyebrow, illustration, intro, title }: PageHeroProps) {
  return (
    <section className={`page-hero section${illustration ? ' page-hero--with-art' : ''}`}>
      <div className="page-hero__copy">
        <p className="section-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__intro">{intro}</p>
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </div>
      {illustration ? (
        <img alt={illustration.alt} className="page-hero__art" src={illustration.src} />
      ) : null}
    </section>
  )
}
