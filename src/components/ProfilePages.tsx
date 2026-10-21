import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { NewTabHint } from './NewTabHint'
import { PageHero } from './PageHero'

export function AboutPage() {
  const { content, strings } = useLanguage()
  const { aboutPage, expertise, profileTimeline, sourceLinks } = content

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow={aboutPage.eyebrow}
        illustration={{
          alt: 'Illustrated portrait of Mathis Certenais',
          src: '/images/mathis/mathis-portrait.webp',
        }}
        intro={aboutPage.intro}
        title={aboutPage.title}
      />

      <section className="profile-story section">
        <div>
          <p className="section-label">{aboutPage.story.label}</p>
          <h2>{aboutPage.story.heading}</h2>
        </div>
        <div className="profile-story__copy">
          {aboutPage.story.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a href={sourceLinks.eclatInterview} rel="noreferrer" target="_blank">
            {strings.pages.readInterview} <ArrowIcon external />
            <NewTabHint label={strings.a11y.newTab} />
          </a>
        </div>
      </section>

      <section className="profile-section section">
        <div className="section-heading">
          <h2>{strings.pages.background}</h2>
        </div>
        <div className="profile-timeline">
          {profileTimeline.map((entry) => (
            <article key={entry.title}>
              <p className="section-label">{entry.label}</p>
              <h3>{entry.title}</h3>
              <p>{entry.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-section profile-section--surface">
        <div className="section">
          <div className="section-heading">
            <h2>Research themes</h2>
          </div>
          <ul className="expertise-grid">
            {expertise.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="principles section">
        <p className="section-label">{aboutPage.principles.label}</p>
        <div className="principles__grid">
          {aboutPage.principles.items.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h2>{principle.title}</h2>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export function ResumePage() {
  const { content, strings } = useLanguage()
  const { expertise, identity, profileTimeline, resumePage } = content

  return (
    <main className="resume-page" id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <button className="button button--primary print-hide" onClick={() => window.print()} type="button">
              {strings.pages.printProfile}
            </button>
            <a className="button button--secondary" href={`mailto:${identity.email}`}>
              {strings.pages.emailMathis} <ArrowIcon external />
            </a>
          </>
        }
        eyebrow={resumePage.eyebrow}
        intro={resumePage.intro}
        title={identity.name}
      />

      <div className="resume-layout section">
        <aside>
          <section>
            <h2>Contact</h2>
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
            <a href={identity.linkedin} rel="noreferrer" target="_blank">
              LinkedIn ↗
              <NewTabHint label={strings.a11y.newTab} />
            </a>
            <p>{identity.location}</p>
          </section>
          <section>
            <h2>Research themes</h2>
            <ul>
              {expertise.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="resume-content">
          <section>
            <p className="section-label">{resumePage.profile.label}</p>
            <h2>{resumePage.profile.heading}</h2>
            <p>{resumePage.profile.text}</p>
          </section>

          <section>
            <p className="section-label">{resumePage.experienceLabel}</p>
            {profileTimeline.map((entry) => (
              <article className="resume-entry" key={entry.title}>
                <p>{entry.label}</p>
                <h3>{entry.title}</h3>
                <p>{entry.detail}</p>
              </article>
            ))}
          </section>

          <section>
            <p className="section-label">{resumePage.publication.label}</p>
            <article className="resume-entry">
              <p>{resumePage.publication.date}</p>
              <h3>{resumePage.publication.title}</h3>
              <p>{resumePage.publication.authors}</p>
              <a href={resumePage.publication.href} rel="noreferrer" target="_blank">
                {resumePage.publication.linkLabel} <ArrowIcon external />
                <NewTabHint label={strings.a11y.newTab} />
              </a>
            </article>
          </section>

          <section>
            <p className="section-label">{strings.pages.selectedPresentations}</p>
            {resumePage.presentations.map((presentation) => (
              <article className="resume-entry" key={presentation.title}>
                <p>{presentation.date}</p>
                <h3>{presentation.title}</h3>
                <p>{presentation.text}</p>
              </article>
            ))}
          </section>

          <section>
            <p className="section-label">Relevant certifications</p>
            {resumePage.certifications.map((certification) => (
              <article className="resume-entry" key={certification.title}>
                <p>{certification.date}</p>
                <h3>{certification.title}</h3>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
