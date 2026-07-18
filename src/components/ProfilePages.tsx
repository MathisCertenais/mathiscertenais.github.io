import { expertise, identity, profileTimeline, sourceLinks } from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'

export function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="About"
        illustration={{
          alt: 'Illustrated portrait of Mathis Certenais',
          src: '/images/mathis/mathis-portrait.webp',
        }}
        intro="A computer scientist from Brittany working across high-performance computing, data logistics, and radio astronomy."
        title="Building infrastructure through collaboration."
      />

      <section className="profile-story section">
        <div>
          <p className="section-label">Research profile</p>
          <h2>From parallel architectures to scientific data logistics.</h2>
        </div>
        <div className="profile-story__copy">
          <p>
            Mathis studies methods and tools for cross-facility workflows at IRISA and Université de
            Rennes. His doctoral research sits within the NumPEx French exascale program and uses
            ECLAT’s radio-astronomy collaborations as a demanding practical context.
          </p>
          <p>
            His background spans engineering studies at ESIR, a one-year double-degree program at
            UQAC in Canada, and earlier research-engineering work on artificial intelligence,
            including large language models and retrieval-augmented generation.
          </p>
          <p>
            The common thread is making complex computing infrastructure useful to people outside
            systems research: connecting domain scientists, software, data, and facilities without
            losing reproducibility or scientific meaning.
          </p>
          <a href={sourceLinks.eclatInterview} rel="noreferrer" target="_blank">
            Read the ECLAT interview <ArrowIcon external />
          </a>
        </div>
      </section>

      <section className="profile-section section">
        <div className="section-heading">
          <h2>Background</h2>
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
        <p className="section-label">Working principles</p>
        <div className="principles__grid">
          <article>
            <span>01</span>
            <h2>Multidisciplinary by design</h2>
            <p>Computer scientists, astrophysicists, engineers, and infrastructure teams solve better problems together.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Complexity belongs behind a useful interface</h2>
            <p>High-level services can reduce operational friction while keeping scientific requirements visible.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Research should remain responsible</h2>
            <p>YoungPEx conversations include energy footprints, interdisciplinarity, and environmentally responsible research.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export function ResumePage() {
  return (
    <main className="resume-page" id="main-content" tabIndex={-1}>
      <PageHero
        actions={
          <>
            <button className="button button--primary print-hide" onClick={() => window.print()} type="button">
              Print profile
            </button>
            <a className="button button--secondary" href={`mailto:${identity.email}`}>
              Email Mathis <ArrowIcon external />
            </a>
          </>
        }
        eyebrow="Research profile"
        intro="Verified professional and academic information drawn from Mathis’s supplied website, LinkedIn profile, and public institutional research pages."
        title={identity.name}
      />

      <div className="resume-layout section">
        <aside>
          <section>
            <h2>Contact</h2>
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
            <a href={identity.linkedin} rel="noreferrer" target="_blank">
              LinkedIn ↗
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
            <p className="section-label">Profile</p>
            <h2>Computer scientist researching HPC and scientific workflows.</h2>
            <p>
              Doctoral researcher at IRISA and Université de Rennes working on data logistics and
              collaborative systems of systems in the NumPEx and ECLAT context.
            </p>
          </section>

          <section>
            <p className="section-label">Experience & education</p>
            {profileTimeline.map((entry) => (
              <article className="resume-entry" key={entry.title}>
                <p>{entry.label}</p>
                <h3>{entry.title}</h3>
                <p>{entry.detail}</p>
              </article>
            ))}
          </section>

          <section>
            <p className="section-label">Selected publication</p>
            <article className="resume-entry">
              <p>2025 · Preprint</p>
              <h3>A description of the radio astronomy data processing tool DDF Pipeline</h3>
              <p>Mathis Certenais, François Bodin, and Laurent Morin.</p>
              <a href={sourceLinks.arxiv} rel="noreferrer" target="_blank">
                arXiv:2509.03075 <ArrowIcon external />
              </a>
            </article>
          </section>

          <section>
            <p className="section-label">Selected presentations</p>
            <article className="resume-entry">
              <p>February 2026 · ECLAT webinar</p>
              <h3>HPC as a Service for Radio Astronomy</h3>
              <p>A practical case study with the DDF software.</p>
            </article>
            <article className="resume-entry">
              <p>December 2025 · ECLAT technical workshop</p>
              <h3>HPC Software as a Service</h3>
              <p>A data-logistics approach with the DDF Pipeline as a practical deployment scenario.</p>
            </article>
          </section>

          <section>
            <p className="section-label">Relevant certifications</p>
            <article className="resume-entry">
              <p>October 2025 · EOSC Association</p>
              <h3>Bulk Data Transfer Service · Certificate of Completion</h3>
            </article>
            <article className="resume-entry">
              <p>October 2025 · EOSC Association</p>
              <h3>Starting Guide · Certificate of Completion</h3>
            </article>
          </section>
        </div>
      </div>
    </main>
  )
}
