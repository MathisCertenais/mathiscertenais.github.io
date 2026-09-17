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
  {
    id: 'mcp-demo-video',
    title: 'MCP Server Demo',
    description: 'Demo of the MCP server exposing the software ontology for DDF Pipeline.',
    kind: 'video',
    src: '/images/mathis/videos/ddf-mcp-demo.mp4',
    externalHref: '/writing/mcp-server-software-ontology',
    image: '/images/mathis/mcp-server-software-ontology/cover.webp',
  },
]

export type ArticleId =
  | 'webinar-hpc-applications-as-a-service'
  | 'international-hackathon-for-astronomy'
  | 'hpc-applications-as-a-service'
  | 'exascale-astronomy-cybersecurity'
  | 'mcp-server-software-ontology'

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
    id: 'mcp-server-software-ontology',
    number: '01',
    category: 'Research note',
    date: 'September 16, 2026',
    title:
      'Make Scientific Software Speak: An MCP Server That Explains Its Own Parameters',
    description:
      'Think of your scientific software documentation as an interactive wiki. An MCP server that transforms hundreds of complex configuration settings into natural-language answers for researchers and engineers in the community.',
    body: [
      {
        type: 'heading',
        level: 2,
        text: 'The Silent Software Problem',
      },
      {
        type: 'paragraph',
        text: 'Behind every complex scientific application lies a **labyrinth of configuration parameters** — often understood only by a handful of main developers. This is particularly true for the **DDF Pipeline**, a self-calibration and imaging software designed for the **LOFAR** (Low Frequency Array) radio telescope. Here, a single run involves **hundreds of configuration parameters**, and changing just one can alter weeks of computing costs or the final scientific result.',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/ddf-sourcecode.webp',
        alt: 'Screenshot of the DDF Pipeline source code repository',
        caption: 'The DDF Pipeline source code — today, the only place where the meaning of these hundreds of parameters truly lives.',
      },
      {
        type: 'paragraph',
        text: 'For the developers who maintain the software, these settings are familiar companions. For the community who use it, they are a challenge. The “right” configuration is never **fixed**: it depends on the **volume of input data**, the **computing system** that will perform the processing, and, above all, the **user’s specific needs**. **Documentation alone cannot capture this context.** As a result, this critical knowledge rarely leaves the source code — [github.com/mhardcastle/ddf-pipeline](https://github.com/mhardcastle/ddf-pipeline) — leaving powerful software inaccessible to those who need it most.',
      },
      {
        type: 'paragraph',
        text: 'Our approach flips the script. Instead of asking users to memorize hundreds of settings, we build a **conversational interface for the code itself**. We structure the application’s parameter space into a searchable knowledge base, embed it, and expose it through an **MCP** (Model Context Protocol) server. **This transforms the software from a silent tool into an explainable assistant** that researchers can simply ask.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Case Study: What the Parameters Really Control',
      },
      {
        type: 'paragraph',
        text: 'The DDF Pipeline turns LOFAR observations into wide-field sky surveys. Its outputs are the images that illustrate astronomy papers — and every one of them carries the fingerprint of the parameter decisions made upstream: pixel scale, restoring beam, masking, compression, CPU allocation. The figures below come from **LoTSS-DR3**, a data release produced with the very software whose parameters we set out to explain.',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/ddf-survey.webp',
        alt: 'Re-projection of the LoTSS-DR3 mosaic images and corresponding RMS image',
        caption: 'Top: re-projection of the LoTSS-DR3 mosaic images. Bottom: the corresponding RMS image. The yellow and blue outlines show the LoTSS-DR1 and LoTSS-DR2 areas, covering 2% and 27% of the northern sky, respectively; the black outline shows the LoTSS-DR3 coverage of 88%. The small grey dots mark the 3168 LoTSS pointings, of which 2551 are included in this release.',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/ddf-image.webp',
        alt: 'Example 45-deg2 region of the extragalactic sky from LoTSS-DR3',
        caption: 'Example 45-deg2 region of the extragalactic sky from LoTSS-DR3 — typically around 30,000 sources detected above 4.5×RMS. Prominent are the radio galaxies NGC 315 (bottom) and 3C 31 (lower centre left), and the spiral galaxy M 31 (top).',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/ddf-supernova.webp',
        alt: 'Region of the Galactic plane with the highest density of known supernova remnants in LoTSS-DR3',
        caption: 'Region of the Galactic plane with the highest density of known supernova remnants in LoTSS-DR3: 190 deg2 centred at a Galactic longitude of 43.5°, including G054.4-00.3, G049.2-00.7, G043.9+01.6, G039.7-02.0, and G034.7-00.4.',
      },
      {
        type: 'paragraph',
        text: 'These images are the stakes. Every pixel in them is conditioned by parameters that today only a few maintainers fully master.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Solution: Giving the Software a Voice',
      },
      {
        type: 'paragraph',
        text: 'How do we teach an AI about our software? We don’t just feed it raw code. We build a structured knowledge map (or ontology) of the parameter space. Think of it as giving the AI a precise **table of contents** and a **technical glossary** for the software. This ensures it never hallucinates a parameter that doesn’t exist, since every answer is based on the actual codebase.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step one — Structure the Knowledge',
      },
      {
        type: 'paragraph',
        text: 'Building this structured map is a **multidisciplinary exercise** . We work with developers to represent the application faithfully, and with end-users to keep it legible. The key information is harvested from the codebase and converted into a standardized format (Turtle/TTL) that machines can understand.',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/ddf-ontology.webp',
        alt: 'Visualization of the DDF Pipeline knowledge structure',
        caption: 'Visualization of the DDF Pipeline knowledge structure: parameters grouped into sections, with their data types, default values, units, and descriptions.',
      },
      {
        type: 'paragraph',
        text: 'This structured data is then turned into a **vector database** — a representation that a lightweight embedding model (here, all-MiniLM-L6-v2) can search in natural language.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step two — Expose it through MCP',
      },
      {
        type: 'paragraph',
        text: '**MCP**, the Model Context Protocol, is the open standard that lets AI assistants such as Claude Code and OpenCode connect to external tools and data sources. It becomes the bridge between researchers and this knowledge base: the server hosts the embedding model, communicates with the database, and exposes a REST API that answers natural-language queries with the main nodes of the structure.',
      },
      {
        type: 'figure',
        image: '/images/mathis/mcp-server-software-ontology/mcp-swagger.webp',
        alt: 'API documentation of the MCP server exposing the knowledge base',
        caption: 'The MCP server’s API documentation: query the knowledge base in natural language, receive structured nodes in return.',
      },
      {
        type: 'paragraph',
        text: 'Ask "How can I change the image size in pixels?" and the server answers with ranked nodes drawn from the structure:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**image.imsize** — section **image**, data type **int**, default **20000**, "Image size in pixels", unit **pixel**.',
          '**image.cellsize** — data type **float**, default **1.5**, "Pixel size in arcsec", unit **arcsec**.',
          '**machine.NCPU_DDF** — "Number of CPUs to use for DDF", **auto-selected** when left unset.',
          '**masking.tgss_radius** — "TGSS mask radius in pixels", default **8.0**, unit **pixel**.',
        ],
      },
      {
        type: 'paragraph',
        text: 'No guesswork and no hallucinated parameters: every answer is anchored in the real codebase, through this structured knowledge.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step three — A sovereign conversational interface',
      },
      {
        type: 'paragraph',
        text: 'The final piece is the interface where researchers actually ask. We use **Ragarenn**, a sovereign platform hosting large language models accessed through the **eduGAIN** identity federation — a setup designed for **data privacy**, where nothing leaves a trusted perimeter. It exposes a standard OpenAI-compatible API, and we connect **OpenCode** (or Claude Code) to both the model and the MCP server, so the conversation happens inside the coding interface researchers already use.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Result: From Documentation to Dialogue',
      },
      {
        type: 'paragraph',
        text: 'Connect the MCP server to your interface of choice and the software finally answers for itself. The decisive strength is **modularity**.',
      },
      {
        type: 'paragraph',
        text: 'You can operate in a **strict mode**, where the model answers only from the real information contained in the structured knowledge base. In this mode, if a parameter isn’t defined in the map, the AI won’t invent it. Every parameter it mentions truly exists in the code.',
      },
      {
        type: 'paragraph',
        text: 'Alternatively, you can enrich those grounded answers with a **web-connected model** to bring in additional external context (like best practices from similar projects). Both modes share the same critical guarantee: **the source of truth is the software itself, not the AI’s training data.**',
      },
      {
        type: 'paragraph',
        text: 'Documentation assumes a reader who is willing to dig through pages of text. This system assumes a conversation. By exposing the hidden parameter space of scientific software as something an AI can read and explain, we turn a silent tool into a colleague who knows the codebase — and let scientists spend their time looking at the sky, not at the parameters.',
      },
    ],
    image: '/images/mathis/mcp-server-software-ontology/cover.webp',
    imageAlt: 'A conversation between a researcher and an AI assistant about scientific software parameters',
    href: '/writing/mcp-server-software-ontology',
    sourceHref: 'https://github.com/mhardcastle/ddf-pipeline',
  },
  {
    id: 'exascale-astronomy-cybersecurity',
    number: '02',
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
        alt: 'The Square Kilometre Array radio telescope. Credit: SKAO.',
        caption: 'The Square Kilometre Array radio telescope. Credit: SKAO.',
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
        alt: 'The Jean Zay supercomputer. Credit: CNRS, Cyril Frésillon.',
        caption: 'The Jean Zay supercomputer. Credit: CNRS, Cyril Frésillon.',
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
    number: '03',
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
    number: '04',
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
    number: '05',
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
