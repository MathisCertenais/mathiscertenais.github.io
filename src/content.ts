export const identity = {
  name: 'Mathis Certenais',
  shortRole: 'Computer Scientist · PhD Researcher',
  headline: ['Scientific data logistics.', 'Exascale workflows.'],
  description:
    'Computer scientist researching high-performance computing and cross-facility scientific workflows for radio astronomy.',
  location: 'Rennes, Brittany, France',
  email: 'mathis.certenais@irisa.fr',
  linkedin: 'https://www.linkedin.com/in/mathiscertenais/',
} as const

export const sourceLinks = {
  arxiv: 'https://arxiv.org/abs/2509.03075',
  eclatInterview:
    'https://eclat-lab.fr/en/at-the-heart-of-data-logistics-for-astronomy-interview-with-mathis/',
  eclatHackathon:
    'https://eclat-lab.fr/en/international-hackathon-in-rennes-on-ddfacet-and-rims/',
  eclatPartners: 'https://eclat-lab.fr/en/partners/',
  eclatWorkshop: 'https://eclat-lab.fr/en/technical-workshop-2025-and-hackathon/',
  eclatWebinar: 'https://eclat-lab.fr/webinaire-hpc-as-a-service-for-radio-astronomy/',
  linkedin: identity.linkedin,
  numpex: 'https://numpex.org/data-logistics-for-radio-astronomy/',
} as const

export type ProofKind = 'community' | 'mentor' | 'speaker'

export interface ProofPoint {
  description: string
  kind: ProofKind
  title: string
}

export const proofPoints: ProofPoint[] = [
  {
    kind: 'community',
    title: 'Doctoral Research',
    description: 'Data logistics and collaborative systems of systems at IRISA and Université de Rennes',
  },
  {
    kind: 'mentor',
    title: 'Published Work',
    description: 'Co-author of a 2025 technical description and performance profile of the DDF Pipeline',
  },
  {
    kind: 'speaker',
    title: 'Scientific Collaboration',
    description: 'Working across HPC, radio astronomy, NumPEx, ECLAT, and the YoungPEx community',
  },
]

export type ResearchProjectId = 'ddf-pipeline' | 'hpc-as-a-service' | 'cross-facility-workflows'

export interface ResearchProject {
  challenge: string
  description: string
  eyebrow: string
  href: string
  id: ResearchProjectId
  image: string
  imageAlt: string
  number: string
  outcome: string
  sourceHref: string
  sourceLabel: string
  tags: string[]
  title: string
}

export const researchProjects: ResearchProject[] = [
  {
    id: 'ddf-pipeline',
    number: '01',
    eyebrow: 'Radio-astronomy data processing',
    title: 'Understanding the DDF Pipeline',
    description:
      'Describing and profiling a composite imaging and calibration pipeline designed for LOFAR and considered for future SKA data processing.',
    challenge:
      'Next-generation radio telescopes create data volumes that demand careful characterization of scientific software before it can move reliably onto large computing facilities.',
    outcome:
      'The published profile documents a 68.87-hour execution over 134.4 GB of decompressed input data, producing 594 GB of output and a clear baseline for future HPC deployment work.',
    tags: ['HPC', 'Performance profiling', 'Radio astronomy'],
    image: '/images/mathis/ddf-pipeline.svg',
    imageAlt: 'Diagram of radio telescope data flowing through calibration and imaging stages',
    href: '/research/ddf-pipeline',
    sourceHref: sourceLinks.arxiv,
    sourceLabel: 'Read the paper on arXiv',
  },
  {
    id: 'hpc-as-a-service',
    number: '02',
    eyebrow: 'Making supercomputers usable',
    title: 'HPC applications as a service',
    description:
      'Exploring service-oriented access to scientific applications so domain researchers can use HPC without carrying every operational detail themselves.',
    challenge:
      'Supercomputers offer fast I/O and massive parallelism, but machine-specific constraints and operating models remain a barrier for many radio-astronomy researchers.',
    outcome:
      'The approach combines application services with data logistics and uses the DDF Pipeline as a practical cross-facility deployment scenario, including work around the Jean Zay supercomputer.',
    tags: ['HPC as a Service', 'Data logistics', 'Scientific workflows'],
    image: '/images/mathis/hpc-as-a-service.svg',
    imageAlt: 'Diagram showing a service layer connecting researchers with an HPC system',
    href: '/research/hpc-as-a-service',
    sourceHref: sourceLinks.eclatWebinar,
    sourceLabel: 'View the ECLAT webinar page',
  },
  {
    id: 'cross-facility-workflows',
    number: '03',
    eyebrow: 'Federated scientific infrastructure',
    title: 'Cross-facility workflows',
    description:
      'Designing methods and tools that coordinate instruments, storage, data centers, and computing facilities as one scientific workflow.',
    challenge:
      'Scientific processes increasingly span heterogeneous and federated infrastructure. Moving data and computation between those environments must remain understandable, secure, and reproducible.',
    outcome:
      'The research connects HPC with the broader digital continuum and contributes practical use cases through ECLAT, NumPEx, the DDF Pipeline, and collaborative research networks.',
    tags: ['Distributed systems', 'Exascale', 'Federated infrastructure'],
    image: '/images/mathis/cross-facility-workflows.svg',
    imageAlt: 'Network diagram connecting an instrument, storage, and multiple computing facilities',
    href: '/research/cross-facility-workflows',
    sourceHref: sourceLinks.numpex,
    sourceLabel: 'Read the NumPEx research profile',
  },
]

export type VideoKind = 'iframe' | 'video'

export interface VideoItem {
  description: string
  externalHref: string
  id: string
  image: string
  kind: VideoKind
  src: string
  title: string
}

export const videoItems: VideoItem[] = [
  {
    id: 'eclat-interview',
    title: 'At the heart of data logistics for astronomy',
    description: 'An ECLAT interview about Mathis’s path, doctoral research, and multidisciplinary work.',
    kind: 'video',
    src: 'https://eclat-lab.fr/wp-content/uploads/2025/09/ECLAT-interview-matthis-2025-Website-v3.mp4',
    externalHref: sourceLinks.eclatInterview,
    image: '/images/mathis/videos/interview.jpg',
  },
  {
    id: 'hpc-service-webinar',
    title: 'HPC Applications as a Service',
    description: 'A webinar on data logistics, intensive imaging, and large-scale workflow orchestration.',
    kind: 'iframe',
    src: 'https://astrotube.obspm.fr/videos/embed/35dTv8mmaSdm36uEFtCnZz',
    externalHref: sourceLinks.eclatWebinar,
    image: '/images/mathis/videos/webinar.jpg',
  },
  {
    id: 'astronomy-hackathon',
    title: 'International Hackathon for Astronomy',
    description: 'Highlights from a collaborative ECLAT research event in Rennes.',
    kind: 'video',
    src: 'https://eclat-lab.fr/wp-content/uploads/2026/04/ECLAT-hackathon-Rennes-2026.mp4',
    externalHref: sourceLinks.eclatHackathon,
    image: '/images/mathis/videos/hackathon.jpg',
  },
]

export type ArticleId =
  | 'webinar-hpc-applications-as-a-service'
  | 'international-hackathon-for-astronomy'
  | 'hpc-applications-as-a-service'
  | 'exascale-astronomy-cybersecurity'

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'figure'; image: string; alt: string; caption?: string }

export interface ArticleItem {
  body: ArticleBlock[]
  category: string
  date: string
  description: string
  href: string
  id: ArticleId
  image: string
  imageAlt: string
  number: string
  sourceHref?: string
  status?: 'coming-soon'
  title: string
}

export const articleItems: ArticleItem[] = [
  {
    id: 'exascale-astronomy-cybersecurity',
    number: '01',
    category: 'Publication',
    date: 'September 13, 2026',
    title:
      'Exascale Astronomy vs. Cybersecurity: Unlocking French Supercomputers for the Radio Astronomy Community',
    description:
      'How a service-based access model can unlock French national supercomputers for radio astronomy without compromising cybersecurity.',
    body: [
      {
        type: 'paragraph',
        text: 'The next generation of radio telescopes, such as the **Square Kilometre Array** (SKA), is poised to revolutionize our understanding of the universe. But this scientific leap comes with a daunting technical challenge: **exascale data volumes**.',
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/ska.webp',
        alt: 'The Square Kilometre Array radio telescope',
        caption: 'The Square Kilometre Array radio telescope.',
      },
      {
        type: 'paragraph',
        text: 'Processing this amount of information is impossible on local clusters; it requires the raw power of national High-Performance Computing (HPC) infrastructures. However, for the radio astronomy community, the path to these supercomputers is blocked—not by a lack of hardware, but by a systemic conflict between scientific collaboration and national security.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Friction: Science vs. ZRR',
      },
      {
        type: 'paragraph',
        text: 'In France, national supercomputing centers (like IDRIS, CINES, and TGCC) are designated as **Zone à Régime Restrictif (ZRR)**. Because these centers are strategic national assets, they enforce strict cybersecurity regimes:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Nominative Access**: Every single user must be individually authorized and named.',
          '**Personal Responsibility**: Shared or delegated accounts are strictly forbidden.',
          '**Strict Security**: No Docker, mandatory vulnerability scanning, and highly controlled data transfers.',
        ],
      },
      {
        type: 'paragraph',
        text: '**The Result?** A scalability nightmare. In a traditional community-driven model, a few experts maintain a software pipeline for dozens of researchers. Under ZRR rules, **every single researcher** would have to independently deploy, configure, and maintain the entire software stack on every supercomputer they use. This is not just inefficient; it is an insurmountable barrier for most scientists.',
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/jean-zay.webp',
        alt: 'The Jean Zay supercomputer',
        caption: 'The Jean Zay supercomputer.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The "Globus Question": Why not use existing standards?',
      },
      {
        type: 'paragraph',
        text: 'For many researchers, especially in the US, Globus is the gold standard for HPC data movement and identity management. It seems like the obvious solution to the problems we described. So, why isn\'t Globus used in French HPC centers subject to PPST (Protection of National Scientific and Technical Potential) and ZRR regulations?',
      },
      {
        type: 'paragraph',
        text: 'The answer lies in the conflict between U.S. Law and French Sovereignty.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**The Infrastructure**: Globus services are hosted on Amazon Web Services (AWS) and operated by a U.S.-based entity.',
          '**The Legal Conflict**: Under the U.S. CLOUD Act, U.S. law enforcement can compel providers to disclose data within their control, regardless of where that data is physically stored. Furthermore, FISA Section 702 allows the U.S. government to compel U.S. companies to assist in collecting foreign intelligence information on non-U.S. persons.',
          '**The French Mandate**: In France, any logical access to information protected by the PPST regime is strictly subject to authorization by the supervising Ministry. Allowing a third-party U.S. service (subject to the CLOUD Act) to manage identities or orchestrate data flows within a ZRR is legally incompatible with these national security requirements.',
        ],
      },
      {
        type: 'paragraph',
        text: 'In short: Where Globus offers convenience through cloud-based orchestration, the ZRR requires absolute sovereign control. This is precisely why we had to build our own "Application Microservices" (AM) and "Ephemeral Buffers" (EB)—to provide Globus-like functionality while remaining 100% compliant with French national security laws.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Solution: Scientific Applications as a Service',
      },
      {
        type: 'paragraph',
        text: 'To bridge this gap, we proposed a new operational model: **decoupling the identity of the user from the identity of the executor**.',
      },
      {
        type: 'paragraph',
        text: 'Instead of forcing every astronomer to become an HPC system administrator, we introduce the role of the **Maintainer**—an HPC expert who manages the application and assumes technical and legal responsibility for its execution.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Architecture: How it Works',
      },
      {
        type: 'paragraph',
        text: 'We implemented a framework that wraps complex HPC workflows into a seamless service:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Application Microservices (AM)**: A service catalog where users can discover and launch scientific pipelines via a REST API, enabling a "launch-and-forget" experience for jobs that may run for several days.',
          '**Ephemeral Buffers (EB)**: A transient data logistics layer. Users move data into these buffers, and the HPC system pulls from them, removing the need for users to have direct SSH access to the supercomputer.',
          '**The Named Service Account**: A proposed model where a specific HPC account is dedicated to a specific application. The Maintainer governs a **whitelist** of authorized users, satisfying the ZRR\'s need for traceability while maintaining the community\'s need for shared tools.',
          '**The Runner**: A Python-based "pull" system. Rather than the web service "pushing" jobs into the secure zone (which is a security risk), the Runner polls the API from within the HPC environment and executes the tasks.',
        ],
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/architecture.webp',
        alt: 'Architecture of the scientific applications as a service framework',
        caption: 'Scientific applications as a service architecture.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Proof of Concept: The DDF Pipeline on Jean Zay',
      },
      {
        type: 'paragraph',
        text: 'To prove this works, we deployed the DDF Pipeline (a self-calibration imaging tool for the LOFAR telescope) on the Jean Zay and Adastra supercomputers.',
      },
      {
        type: 'paragraph',
        text: 'The DDF Pipeline is a "stress test" for any system: it requires massive memory (~400 GB RAM) and processes huge datasets over multiple days.',
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/ddf-workflow.webp',
        alt: 'The DDF Pipeline workflow',
        caption: 'The DDF Pipeline workflow.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Results:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Massive Scalability**: We observed a significant speedup in execution time, dropping from 68.8 hours on a single node to just 8.7 hours across 24 nodes (~7.9x speedup).',
          '**Zero Friction**: The overhead introduced by the web service layer was negligible—between 0.25 and 0.96 seconds for job submission.',
          '**Efficient Logistics**: We validated that data endpoints like SURFsara (137.9 MB/s download) and EOSC (28.73 MB/s upload) provide the stable, high-speed throughput required for exascale astronomy.',
        ],
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/sequence-diagram.webp',
        alt: 'Sequence diagram of job submission through the service layers',
        caption: 'Job submission sequence diagram.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Road Ahead: Beyond the Proof of Concept',
      },
      {
        type: 'paragraph',
        text: 'While the technical feasibility is validated, the final hurdle is regulatory. The "Named Service Account" model is currently under discussion with French security stakeholders.',
      },
      {
        type: 'paragraph',
        text: 'Our next steps include:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Multi-Center Deployment**: Expanding the service to the Adastra and Irene supercomputers.',
          '**Cross-Facility Workflows**: Enabling a single pipeline to span multiple heterogeneous HPC centers.',
          '**Fair-Share Optimization**: Adapting SLURM scheduling policies to ensure that a community account doesn\'t face unfair allocation delays.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Security should be an enabler of science, not a barrier. By shifting from a "user-access" model to a "service-access" model, we can open the doors of the world\'s most powerful supercomputers to the scientific communities that need them most.',
      },
      {
        type: 'paragraph',
        text: 'Want to dive deeper into the technical details? [Read the full paper accepted at SC26 here](https://supercomputing.org/)',
      },
    ],
    image: '/images/mathis/exascale-astronomy/ska.webp',
    imageAlt: 'The Square Kilometre Array radio telescope',
    href: '/writing/exascale-astronomy-cybersecurity',
  },
  {
    id: 'webinar-hpc-applications-as-a-service',
    number: '02',
    category: 'Webinar',
    date: 'February 26, 2026',
    title: 'Webinar: HPC Applications as a Service',
    description:
      'How service-oriented access can connect radio-astronomy workloads with high-performance computing.',
    body: [
      {
        type: 'paragraph',
        text: 'Radio-astronomy applications increasingly need the throughput, fast I/O, and parallelism of national supercomputers. Accessing those machines, however, still requires operational knowledge that many domain researchers should not need to reproduce for every run.',
      },
      {
        type: 'paragraph',
        text: 'This webinar presents HPC applications as a service through a practical DDF Pipeline scenario. The focus is on integrating scientific data logistics, intensive imaging, and distributed workflow orchestration while keeping the researcher-facing interface understandable.',
      },
    ],
    image: '/images/mathis/videos/webinar.jpg',
    imageAlt: 'Mathis presenting the differences between cloud computing and HPC during the webinar',
    href: '/writing/webinar-hpc-applications-as-a-service',
    sourceHref: sourceLinks.eclatWebinar,
  },
  {
    id: 'international-hackathon-for-astronomy',
    number: '03',
    category: 'Collaboration',
    date: 'April 1, 2026',
    title: 'International Hackathon for Astronomy',
    description:
      'A research event bringing computer scientists and astrophysicists together around shared technical challenges.',
    body: [
      {
        type: 'paragraph',
        text: 'Scientific software becomes more useful when the people who build infrastructure and the people who interpret astronomical data can work on the same problems together.',
      },
      {
        type: 'paragraph',
        text: 'The international hackathon in Rennes created space for that collaboration: participants worked across disciplines on radio-astronomy data processing, portability, distributed storage, and the practical constraints of multiple computing facilities.',
      },
    ],
    image: '/images/mathis/videos/hackathon.jpg',
    imageAlt: 'Participants in the international DDFacet and RIMS hackathon in Rennes',
    href: '/writing/international-hackathon-for-astronomy',
    sourceHref: sourceLinks.eclatHackathon,
  },
  {
    id: 'hpc-applications-as-a-service',
    number: '04',
    category: 'Research note',
    date: 'June 18, 2026',
    title: 'HPC Applications as a Service: Enabling Radio Astronomy',
    description:
      'A forthcoming research note on bridging radio astronomy and French high-performance computing infrastructure.',
    body: [],
    image: '/images/mathis/hpc-as-a-service.svg',
    imageAlt: 'Diagram connecting radio astronomy data to a high-performance computing service',
    href: '/writing/hpc-applications-as-a-service',
    status: 'coming-soon',
  },
]

export const profileTimeline = [
  {
    label: 'Current research',
    title: 'PhD researcher · IRISA and Université de Rennes',
    detail:
      'Collaborative systems of systems for scientific data logistics, developed in the context of NumPEx and the ECLAT joint laboratory.',
  },
  {
    label: 'Previous research engineering',
    title: 'Artificial intelligence · IRISA',
    detail:
      'Engineering work on artificial-intelligence topics, including large language models and retrieval-augmented generation.',
  },
  {
    label: 'Engineering education',
    title: 'ESIR · Rennes',
    detail:
      'Engineering-school background complemented by a one-year double-degree program at UQAC in Canada.',
  },
  {
    label: 'International double degree',
    title: 'UQAC · Canada',
    detail:
      'Coursework spanning artificial intelligence, connected objects, cloud computing, and programming for parallel architectures.',
  },
] as const

export const expertise = [
  'High-performance computing',
  'Scientific data logistics',
  'Cross-facility workflows',
  'Distributed and federated systems',
  'Radio-astronomy computing',
  'Exascale research',
  'Fast I/O and massive parallelism',
  'HPC applications as a service',
] as const

export const resources = [
  {
    href: '/resources/publications',
    label: 'Publications',
    title: 'Research and technical writing',
    description: 'Published work, preprints, and documented technical contributions.',
  },
  {
    href: '/resources/talks',
    label: 'Talks',
    title: 'Webinars and presentations',
    description: 'Recorded explanations and conference material about HPC and data logistics.',
  },
  {
    href: '/resources/network',
    label: 'Network',
    title: 'Research context',
    description: 'Institutions, programs, and collaborations surrounding the work.',
  },
] as const

export function getResearchProject(id: string) {
  return researchProjects.find((project) => project.id === id)
}

export function getArticle(id: string) {
  return articleItems.find((article) => article.id === id)
}
