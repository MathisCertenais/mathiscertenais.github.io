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
  /**
   * Accessible name for the zoom action — "Enlarge figure". The image alt
   * follows it, so the button says what it does and what it opens.
   */
  illustrationActionLabel?: string
  intro: string
  /**
   * Makes the hero art open a larger view. Without it the art stays a plain
   * image, which is what every other page expects.
   */
  onIllustrationActivate?: () => void
  title: string
}

export function PageHero({
  actions,
  eyebrow,
  illustration,
  illustrationActionLabel,
  intro,
  onIllustrationActivate,
  title,
}: PageHeroProps) {
  const ratio = illustration?.ratio
  const [ratioWidth, ratioHeight] = ratio?.split('/').map(parseFloat) ?? []
  const isLandscape = ratioWidth > ratioHeight
  const art = illustration ? (
    <img
      alt={illustration.alt}
      className="page-hero__art"
      src={illustration.src}
      style={ratio ? ({ '--hero-art-ratio': ratio } as CSSProperties) : undefined}
    />
  ) : null

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
      {illustration && onIllustrationActivate ? (
        <button
          aria-label={
            illustrationActionLabel
              ? `${illustrationActionLabel} — ${illustration.alt}`
              : illustration.alt
          }
          className="figure-zoom"
          onClick={onIllustrationActivate}
          type="button"
        >
          {art}
        </button>
      ) : (
        art
      )}
    </section>
  )
}
