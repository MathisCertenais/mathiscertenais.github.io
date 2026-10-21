import { useId } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import { NewTabHint } from './NewTabHint'

type CardVariant = 'page' | 'share'

/**
 * The business card, drawn in the browser rather than exported as a bitmap: it
 * stays sharp at any zoom, reuses the portrait and the QR code the site already
 * serves, and prints at the exact 85 × 55 mm format from the same markup.
 *
 * The `share` variant is the same design at the shape link previews want —
 * 1200 × 630 — with the QR dropped, since a reader looking at a preview already
 * has the link, and the contacts trimmed to the domain.
 *
 * The card keeps its own colours on purpose. It is a printed object, like the QR
 * plate below it, so it does not follow the light and dark theme tokens.
 */
export function BusinessCard({ variant = 'page' }: { variant?: CardVariant }) {
  const { content, strings } = useLanguage()
  const { businessCard, identity } = content
  const isShare = variant === 'share'
  const nameId = useId()

  return (
    <article
      aria-labelledby={nameId}
      className={`business-card${isShare ? ' business-card--share' : ''}`}
    >
      <img
        alt="Sketch portrait of Mathis Certenais"
        className="business-card__portrait"
        height={1050}
        src={businessCard.portrait}
        width={960}
      />
      <div className="business-card__identity">
        <p className="business-card__name" id={nameId}>
          {identity.name}
        </p>
        <p className="business-card__role">{businessCard.affiliation}</p>
        <span aria-hidden="true" className="business-card__rule" />
        <p className="business-card__tagline">{businessCard.tagline}</p>
        <ul className="business-card__contacts">
          {isShare ? null : (
            <li>
              <a href={businessCard.phoneHref}>{businessCard.phone}</a>
            </li>
          )}
          <li>
            <a href={businessCard.website}>{businessCard.websiteLabel}</a>
          </li>
          {isShare ? null : (
            <>
              <li>
                <a href={`mailto:${identity.email}`}>{identity.email}</a>
              </li>
              <li>
                <a href={identity.linkedin} rel="noreferrer" target="_blank">
                  {businessCard.linkedinLabel}
                  <NewTabHint label={strings.a11y.newTab} />
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      {isShare ? null : (
        <img
          alt="QR code that opens mathiscertenais.com"
          className="business-card__code"
          height={1024}
          src={businessCard.qr}
          width={1024}
        />
      )}
    </article>
  )
}
