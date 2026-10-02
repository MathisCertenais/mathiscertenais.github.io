import {
  researchApplications,
  researchCase,
  researchChapters,
  researchChain,
  researchContribution,
  researchFigures,
  researchMethods,
  researchPerspectives,
  researchThesis,
  sourceLinks,
} from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'

export function ResearchPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Research"
        illustration={{
          alt: 'Network connecting a scientific instrument, shared data, and computing facilities',
          src: '/images/mathis/cross-facility-workflows.svg',
        }}
        intro={researchThesis.summary}
        title={researchThesis.title}
      />

      <section className="research-thesis section">
        <p className="section-label">{researchThesis.label}</p>
        <p className="research-thesis__meta">{researchThesis.context}</p>
        <p className="research-thesis__meta">{researchThesis.programme}</p>
        <ul aria-label="Research themes" className="tag-list">
          <li>Data logistics</li>
          <li>Cross-facility workflows</li>
          <li>Governance and security</li>
          <li>Provenance and FAIR</li>
          <li>HPC as a service</li>
        </ul>
      </section>

      {researchChapters.map((chapter) => (
        <section className="research-story section" key={chapter.label}>
          <div>
            <p className="section-label">{chapter.label}</p>
            <h2>{chapter.heading}</h2>
          </div>
          <div className="research-story__copy">
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="research-figures">
        <div className="section">
          <ul className="research-figures__list">
            {researchFigures.map((figure) => (
              <li key={figure.value}>
                <strong>{figure.value}</strong>
                <span>{figure.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="research-section section">
        <div className="section-heading">
          <p className="section-label">Perspectives</p>
          <h2>Five perspectives on one logistics problem.</h2>
        </div>
        <div className="research-perspectives">
          {researchPerspectives.map((perspective) => (
            <article key={perspective.number}>
              <span>{perspective.number}</span>
              <h3>{perspective.title}</h3>
              <p>{perspective.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="research-section research-section--surface section">
        <div className="section-heading">
          <p className="section-label">{researchMethods.label}</p>
          <h2>{researchMethods.heading}</h2>
        </div>
        <div className="research-methods">
          <ol className="research-chain">
            {researchChain.map((step) => (
              <li key={step.site}>
                <p className="research-chain__role">{step.role}</p>
                <h3>{step.site}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
          <div className="research-methods__copy">
            {researchMethods.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <figure className="detail-figure">
          <img
            alt="Network connecting a scientific instrument, shared data, and computing facilities"
            loading="lazy"
            src="/images/mathis/cross-facility-workflows.svg"
          />
          <figcaption>
            The processing chain studied throughout the thesis, from the LOFAR reference site to
            national supercomputers and on to European research storage.
          </figcaption>
        </figure>
      </section>

      <section className="research-story section">
        <div>
          <p className="section-label">{researchCase.label}</p>
          <h2>{researchCase.heading}</h2>
        </div>
        <div className="research-story__copy">
          {researchCase.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a href={sourceLinks.arxiv} rel="noreferrer" target="_blank">
            Read the DDF Pipeline paper on arXiv <ArrowIcon external />
          </a>
        </div>
      </section>

      <section className="research-contribution section">
        <div className="research-contribution__list">
          <p className="section-label">{researchContribution.label}</p>
          <h2>{researchContribution.heading}</h2>
          <ol>
            {researchContribution.paragraphs.map((paragraph) => (
              <li key={paragraph.slice(0, 32)}>{paragraph}</li>
            ))}
          </ol>
        </div>
        <div className="research-contribution__aside">
          <p className="section-label">{researchApplications.label}</p>
          <h3>{researchApplications.heading}</h3>
          {researchApplications.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a href={sourceLinks.numpex} rel="noreferrer" target="_blank">
            Read the NumPEx research profile <ArrowIcon external />
          </a>
        </div>
      </section>

      <section className="research-next section">
        <p className="section-label">Where this continues</p>
        <h2>The reasoning is written up in public.</h2>
        <div className="research-next__actions">
          <a className="button button--primary" href="/writing">
            Read research notes <ArrowIcon />
          </a>
          <a className="button button--secondary" href="/resources/publications">
            Publications <ArrowIcon />
          </a>
          <a className="button button--secondary" href="/contact">
            Get in touch <ArrowIcon />
          </a>
        </div>
      </section>
    </main>
  )
}