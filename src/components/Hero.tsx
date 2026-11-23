import { useLanguage } from '../language/LanguageProvider'
import { ContactLinks } from './ContactLinks'
import { ArrowIcon, ProofIcon } from './Icons'
import { NewTabHint } from './NewTabHint'

export function Hero() {
  const { content, localeHref, strings } = useLanguage()
  const { identity, proofPoints } = content

  return (
    <section className="hero section">
      <div className="hero__stage">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <strong>{identity.name}</strong>
            <span> · {identity.shortRole}</span>
          </p>

          <h1 className="hero__title">
            <span className="hero-highlight">{identity.headline[0]}</span>
            <br />
            <span className="hero-highlight">{identity.headline[1]}</span>
          </h1>

          <p className="hero__description">{identity.description}</p>

          <div className="availability-pill">
            <span aria-hidden="true" className="availability-pill__dot" />
            <span>{strings.pages.availability}{identity.location}</span>
          </div>

          <div className="hero__actions">
            <a className="button button--primary" href={localeHref('/research')}>
              {strings.pages.viewResearch} <ArrowIcon />
            </a>
            <a className="button button--secondary" href={localeHref('/resume')}>
              {strings.pages.viewProfile} <ArrowIcon />
            </a>
          </div>

          <div className="hero__contact">
            <ContactLinks />
          </div>
        </div>

        <img
          alt="Illustrated portrait of Mathis Certenais"
          className="hero__portrait"
          height="525"
          src="/images/mathis/mathis-portrait.webp"
          width="480"
        />
      </div>

      <div className="proof-strip">
        {proofPoints.map((proof) => (
          <article className="proof-item" key={proof.title}>
            <span className="proof-item__icon">
              <ProofIcon kind={proof.kind} />
            </span>
            <div>
              <h2>{proof.title}</h2>
              <p>{proof.description}</p>
              {proof.links?.length ? (
                <div className="proof-item__links">
                  {proof.links.map((link) => (
                    <a
                      className="contact-link"
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label} <ArrowIcon external />
                      <NewTabHint label={strings.a11y.newTab} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
