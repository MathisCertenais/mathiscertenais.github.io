import { resources, sourceLinks } from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'

const resourceDetails = {
  publications: {
    eyebrow: 'Publications',
    title: 'Research and technical writing',
    intro: 'Selected public material documenting the DDF Pipeline and its role in future radio-astronomy computing.',
    items: [
      {
        label: '2025 · Preprint',
        title: 'A description of the radio astronomy data processing tool DDF Pipeline',
        description: 'A software description and coarse-grain performance profile co-authored by Mathis Certenais, François Bodin, and Laurent Morin.',
        href: sourceLinks.arxiv,
      },
      {
        label: 'Research profile',
        title: 'Data logistics for radio astronomy',
        description: 'NumPEx’s overview of Mathis’s doctoral work, ECLAT collaboration, and YoungPEx involvement.',
        href: sourceLinks.numpex,
      },
    ],
  },
  talks: {
    eyebrow: 'Talks & media',
    title: 'Explaining infrastructure through practice',
    intro: 'Recorded conversations and presentations connecting data logistics, radio astronomy, and HPC.',
    items: [
      {
        label: 'February 2026 · Webinar',
        title: 'HPC as a Service for Radio Astronomy',
        description: 'A practical DDF software case study presented by Mathis for ECLAT.',
        href: sourceLinks.eclatWebinar,
      },
      {
        label: 'December 2025 · Technical workshop',
        title: 'HPC Software as a Service',
        description: 'A data-logistics approach with the DDF Pipeline as a practical deployment scenario.',
        href: sourceLinks.eclatWorkshop,
      },
      {
        label: '2025 · Interview',
        title: 'At the heart of data logistics for astronomy',
        description: 'Mathis discusses his path, research focus, and multidisciplinary work within ECLAT.',
        href: sourceLinks.eclatInterview,
      },
    ],
  },
  network: {
    eyebrow: 'Research network',
    title: 'Institutions and collaborations',
    intro: 'The research sits inside a connected public-science ecosystem rather than a single isolated project.',
    items: [
      {
        label: 'Research institute',
        title: 'IRISA',
        description: 'The French research institute where Mathis conducts his doctoral work.',
        href: 'https://www.irisa.fr/en',
      },
      {
        label: 'University',
        title: 'Université de Rennes',
        description: 'Mathis’s university context for doctoral research and earlier engineering education in Rennes.',
        href: 'https://www.univ-rennes.fr/en',
      },
      {
        label: 'Joint laboratory',
        title: 'ECLAT',
        description: 'A multidisciplinary setting for future astronomical instrumentation and SKAO-related computing.',
        href: sourceLinks.eclatPartners,
      },
      {
        label: 'French exascale program',
        title: 'NumPEx and YoungPEx',
        description: 'A national research program and its community of early-career contributors.',
        href: sourceLinks.numpex,
      },
    ],
  },
} as const

export function ResourcesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Resources"
        intro="A compact directory of public research material, talks, and institutions connected to Mathis’s work."
        title="Follow the work to its sources."
      />
      <section className="resource-grid section">
        {resources.map((resource, index) => (
          <a href={resource.href} key={resource.href}>
            <span>0{index + 1}</span>
            <p className="section-label">{resource.label}</p>
            <h2>{resource.title}</h2>
            <p>{resource.description}</p>
            <strong>
              Explore <ArrowIcon />
            </strong>
          </a>
        ))}
      </section>
    </main>
  )
}

export function ResourceDetailPage({ resourceId }: { resourceId: string }) {
  const detail = resourceDetails[resourceId as keyof typeof resourceDetails]
  if (!detail) return null

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero eyebrow={detail.eyebrow} intro={detail.intro} title={detail.title} />
      <section className="resource-list section">
        {detail.items.map((item, index) => (
          <a href={item.href} key={item.title} rel="noreferrer" target="_blank">
            <span>0{index + 1}</span>
            <div>
              <p className="section-label">{item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <strong aria-hidden="true">↗</strong>
          </a>
        ))}
      </section>
    </main>
  )
}

export function ArchivePage() {
  const entries = [
    ['June 18, 2026', 'HPC Applications as a Service', 'Forthcoming research note'],
    ['April 1, 2026', 'International Hackathon for Astronomy', 'Research event and video'],
    ['February 26, 2026', 'HPC Applications as a Service', 'Webinar and replay'],
    ['December 2025', 'HPC Software as a Service', 'ECLAT technical workshop presentation'],
    ['September 2025', 'DDF Pipeline software description', 'Public preprint'],
    ['2025', 'Data logistics for radio astronomy', 'ECLAT interview'],
  ] as const

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Archive"
        intro="A concise chronology of verified publications, talks, interviews, and research updates."
        title="Research in progress."
      />
      <section className="archive-list section">
        {entries.map(([date, title, kind]) => (
          <article key={`${date}-${title}`}>
            <time>{date}</time>
            <h2>{title}</h2>
            <p>{kind}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
