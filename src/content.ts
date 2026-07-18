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
    image: '/images/mathis/interview.svg',
  },
  {
    id: 'hpc-service-webinar',
    title: 'HPC Applications as a Service',
    description: 'A webinar on data logistics, intensive imaging, and large-scale workflow orchestration.',
    kind: 'iframe',
    src: 'https://astrotube.obspm.fr/videos/embed/35dTv8mmaSdm36uEFtCnZz',
    externalHref: sourceLinks.eclatWebinar,
    image: '/images/mathis/webinar.svg',
  },
  {
    id: 'astronomy-hackathon',
    title: 'International Hackathon for Astronomy',
    description: 'Highlights from a collaborative ECLAT research event in Rennes.',
    kind: 'video',
    src: 'https://eclat-lab.fr/wp-content/uploads/2026/04/ECLAT-hackathon-Rennes-2026.mp4',
    externalHref: sourceLinks.eclatWorkshop,
    image: '/images/mathis/hackathon.svg',
  },
]

export type ArticleId =
  | 'webinar-hpc-applications-as-a-service'
  | 'international-hackathon-for-astronomy'
  | 'hpc-applications-as-a-service'

export interface ArticleItem {
  body: string[]
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
    id: 'webinar-hpc-applications-as-a-service',
    number: '01',
    category: 'Webinar',
    date: 'February 26, 2026',
    title: 'Webinar: HPC Applications as a Service',
    description:
      'How service-oriented access can connect radio-astronomy workloads with high-performance computing.',
    body: [
      'Radio-astronomy applications increasingly need the throughput, fast I/O, and parallelism of national supercomputers. Accessing those machines, however, still requires operational knowledge that many domain researchers should not need to reproduce for every run.',
      'This webinar presents HPC applications as a service through a practical DDF Pipeline scenario. The focus is on integrating scientific data logistics, intensive imaging, and distributed workflow orchestration while keeping the researcher-facing interface understandable.',
    ],
    image: '/images/mathis/webinar.svg',
    imageAlt: 'Abstract illustration of a webinar connecting a researcher to an HPC service',
    href: '/writing/webinar-hpc-applications-as-a-service',
    sourceHref: sourceLinks.eclatWebinar,
  },
  {
    id: 'international-hackathon-for-astronomy',
    number: '02',
    category: 'Collaboration',
    date: 'April 1, 2026',
    title: 'International Hackathon for Astronomy',
    description:
      'A research event bringing computer scientists and astrophysicists together around shared technical challenges.',
    body: [
      'Scientific software becomes more useful when the people who build infrastructure and the people who interpret astronomical data can work on the same problems together.',
      'The international hackathon in Rennes created space for that collaboration: participants worked across disciplines on radio-astronomy data processing, portability, distributed storage, and the practical constraints of multiple computing facilities.',
    ],
    image: '/images/mathis/hackathon.svg',
    imageAlt: 'Abstract illustration of an international scientific hackathon',
    href: '/writing/international-hackathon-for-astronomy',
    sourceHref: sourceLinks.eclatWorkshop,
  },
  {
    id: 'hpc-applications-as-a-service',
    number: '03',
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
