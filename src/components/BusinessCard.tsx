import { businessCard, identity } from '../content'

const NAME_ID = 'business-card-name'

/**
 * The business card, drawn in the browser rather than exported as a bitmap: it
 * stays sharp at any zoom, reuses the portrait and the QR code the site already
 * serves, and prints at the exact 85 × 55 mm format from the same markup.
 *
 * The card keeps its own colours on purpose. It is a printed object, like the QR
 * plate below it, so it does not follow the light and dark theme tokens.
 */
export function BusinessCard() {
  return (
    <article aria-labelledby={NAME_ID} className="business-card">
      <img
        alt="Sketch portrait of Mathis Certenais"
        className="business-card__portrait"
        height={1050}
        src={businessCard.portrait}
        width={960}
      />
      <div className="business-card__identity">
        <p className="business-card__name" id={NAME_ID}>
          {identity.name}
        </p>
        <p className="business-card__role">{businessCard.affiliation}</p>
        <span aria-hidden="true" className="business-card__rule" />
        <p className="business-card__tagline">{businessCard.tagline}</p>
        <ul className="business-card__contacts">
          <li>
            <a href={businessCard.phoneHref}>{businessCard.phone}</a>
          </li>
          <li>
            <a href={businessCard.website}>{businessCard.websiteLabel}</a>
          </li>
          <li>
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
          </li>
          <li>
            <a href={identity.linkedin} rel="noreferrer" target="_blank">
              {businessCard.linkedinLabel}
            </a>
          </li>
        </ul>
      </div>
      <img
        alt="QR code that opens mathiscertenais.com"
        className="business-card__code"
        height={1024}
        src={businessCard.qr}
        width={1024}
      />
    </article>
  )
}
