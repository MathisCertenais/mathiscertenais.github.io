import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'

export function AccessibilityPage() {
  const { content } = useLanguage()
  const { accessibilityPage, identity } = content
  const t = accessibilityPage

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero eyebrow={t.eyebrow} intro={t.intro} title={t.title} />

      <section className="profile-story section">
        <div>
          <p className="section-label">{t.approach.label}</p>
          <h2>{t.approach.heading}</h2>
        </div>
        <div className="profile-story__copy">
          {t.approach.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="profile-story section">
        <div>
          <p className="section-label">{t.verified.label}</p>
          <h2>{t.verified.heading}</h2>
        </div>
        <div className="profile-story__copy">
          <ul className="accessibility-list">
            {t.verified.items.map((item) => (
              <li key={item.slice(0, 32)}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="profile-story section">
        <div>
          <p className="section-label">{t.limitations.label}</p>
          <h2>{t.limitations.heading}</h2>
        </div>
        <div className="profile-story__copy">
          <ul className="accessibility-list">
            {t.limitations.items.map((item) => (
              <li key={item.slice(0, 32)}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="profile-story section">
        <div>
          <p className="section-label">{t.audit.label}</p>
          <h2>{t.audit.heading}</h2>
        </div>
        <div className="profile-story__copy">
          {t.audit.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="profile-story section">
        <div>
          <p className="section-label">{t.contact.label}</p>
          <h2>{t.contact.heading}</h2>
        </div>
        <div className="profile-story__copy">
          <p>
            {t.contact.text}{' '}
            <a href={`mailto:${identity.email}`}>
              {identity.email} <ArrowIcon external />
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
