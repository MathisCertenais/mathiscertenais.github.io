import { getResearchProject, researchProjects } from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'
import { WorkSection } from './WorkSection'

export function ResearchPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Research"
        illustration={{
          alt: 'Network connecting a scientific instrument, shared data, and computing facilities',
          src: '/images/mathis/cross-facility-workflows.svg',
        }}
        intro="Methods and tools for moving scientific applications and data across heterogeneous, federated infrastructure — with radio astronomy as a demanding real-world setting."
        title="HPC for connected science."
      />
      <WorkSection
        heading="Research areas"
        intro="Three connected threads structure the work: understanding an important radio-astronomy pipeline, reducing the complexity of HPC access, and coordinating workflows across facilities."
        showAllLink={false}
      />
    </main>
  )
}

export function ResearchDetailPage({ projectId }: { projectId: string }) {
  const project = getResearchProject(projectId)

  if (!project) return null
  const currentIndex = researchProjects.findIndex((item) => item.id === project.id)
  const previous = researchProjects[(currentIndex + researchProjects.length - 1) % researchProjects.length]
  const next = researchProjects[(currentIndex + 1) % researchProjects.length]

  return (
    <main className="detail-page" id="main-content" tabIndex={-1}>
      <section className="detail-hero section">
        <div className="detail-hero__copy">
          <p className="section-label">
            Research {project.number} · {project.eyebrow}
          </p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <ul aria-label="Research themes" className="tag-list">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <img alt={project.imageAlt} className="detail-hero__art" src={project.image} />
      </section>

      <div className="detail-body section">
        <aside className="detail-aside">
          <p className="detail-aside__label">In context</p>
          <p>IRISA · Université de Rennes</p>
          <p>NumPEx · ECLAT</p>
          <a href={project.sourceHref} rel="noreferrer" target="_blank">
            {project.sourceLabel} <ArrowIcon external />
          </a>
        </aside>

        <article className="detail-prose">
          <section id="challenge">
            <p className="section-label">The challenge</p>
            <h2>Scientific computing spans more than one machine.</h2>
            <p>{project.challenge}</p>
          </section>
          <section id="approach">
            <p className="section-label">Research approach</p>
            <h2>Connect computation, data movement, and domain practice.</h2>
            <p>{project.description}</p>
            <p>
              The work treats infrastructure as part of the scientific workflow: instruments,
              applications, storage, security constraints, and computing facilities must cooperate
              without hiding the requirements that make results reproducible.
            </p>
          </section>
          <figure className="detail-figure">
            <img alt={project.imageAlt} loading="lazy" src={project.image} />
            <figcaption>A visual model of the research area and its connected systems.</figcaption>
          </figure>
          <section id="evidence">
            <p className="section-label">Evidence & direction</p>
            <h2>Ground the systems question in a real scientific application.</h2>
            <p>{project.outcome}</p>
            <a className="button button--secondary" href={project.sourceHref} rel="noreferrer" target="_blank">
              Open primary source <ArrowIcon external />
            </a>
          </section>
        </article>
      </div>

      <nav aria-label="Research pagination" className="detail-pagination section">
        <a href={previous?.href}>
          <span>Previous research</span>
          <strong>← {previous?.title}</strong>
        </a>
        <a href={next?.href}>
          <span>Next research</span>
          <strong>{next?.title} →</strong>
        </a>
      </nav>
    </main>
  )
}
