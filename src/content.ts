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
    description: 'Specializing in workflow data management, with a focus on governance and cybersecurity in supercomputing environments',
  },
  {
    kind: 'mentor',
    title: 'Published Work',
    description:
      "Author of a full paper titled “Enabling Radio Astronomy to Use French Supercomputers,“ accepted for the Supercomputing Conference",
  },
  {
    kind: 'speaker',
    title: 'Scientific Collaboration',
    description:
      'Working for the NumPEx "Digital for Exascale" research program and the ECLAT joint laboratory to co-design future radio astronomy workflows',
  },
]

export const researchThesis = {
  label: 'Doctoral thesis',
  title: 'Collaborative System of Systems for Scientific Data Logistics',
  context: 'IRISA · Université de Rennes',
  programme: 'NumPEx “Digital for Exascale” · ECLAT joint laboratory',
  summary:
    'Large scientific instruments now emit more data than any single site can receive, process, or keep. Turning those flows into science-ready products means running processing chains that cross instruments, supercomputing centres, storage platforms, and research networks — each under a different administration, in a different country, and under a different law. This thesis studies how to design that data logistics: how to model it, how to optimise it, what metadata it requires, and how to expose it to users without hiding the requirements that keep results secure and reproducible.',
} as const

export interface ResearchChapter {
  heading: string
  label: string
  paragraphs: string[]
}

export interface ResearchPerspective {
  number: string
  text: string
  title: string
}

export interface ResearchFigure {
  label: string
  value: string
}

export interface ResearchChainStep {
  detail: string
  role: string
  site: string
}

export const researchChapters: ResearchChapter[] = [
  {
    label: 'The problem',
    heading: 'Volume is the visible constraint. Governance is the real one.',
    paragraphs: [
      'Scientific instruments and industrial platforms alike — CERN, the SKA, but equally the data flows companies process for their customers — produce continuous streams that have to be transformed: into science-ready data in the first case, into customer answers in the second. Read at the surface, this is a throughput problem. How much data, at what rate, over which links.',
      'It is not. Every site involved in a processing chain applies its own security policy, is hosted in its own country, and is therefore subject to that country’s law. A chain only functions if it can be authorised, traced and trusted from end to end. The logistics of scientific data is first a question of governance, and only then a question of bandwidth.',
    ],
  },
  {
    label: 'Why it matters',
    heading: 'Exascale instruments make the gap impossible to ignore.',
    paragraphs: [
      'The Square Kilometre Array will operate continuously and produce far more data than can be stored. Celestial radio signals have to be turned into science-ready products largely in real time, at rates comparable to a hundred million 4K streams at the very start of the data journey, reduced on the fly to a few thousand streams’ worth, and ultimately archiving on the order of 700 petabytes every year. There is no alternative to processing at scale.',
      'In France, that scale is provided by the national HPC infrastructure coordinated by GENCI: Adastra at CINES, Jean Zay at IDRIS, and Joliot-Curie at TGCC. Because these centres are strategic national assets, they fall under the framework protecting the Nation’s scientific and technical potential (PPST) and under the restrictive zone regime (ZRR).',
      'The consequence is structural rather than technical. Inside a ZRR, access is nominative, personal responsibility cannot be delegated, movements are regulated and traced, and disclosure to unauthorised third parties must be assessed and controlled. Add the ordinary constraints of shared supercomputers — SLURM scheduling, wall-clock limits of 24 hours on Adastra, 100 on Jean Zay and 72 on Joliot-Curie, internet access confined to frontend nodes — and community-driven scientific software runs into a regime it was never designed for. The barrier is not silicon. It is the operating model.',
    ],
  },
]

export const researchFigures: ResearchFigure[] = [
  {
    value: '~700 PB',
    label: 'of SKA science-ready data archived every year',
  },
  {
    value: '3',
    label: 'French national supercomputing centres, all subject to PPST and ZRR',
  },
  {
    value: '~7.9×',
    label: 'measured DDF Pipeline speedup on 24 nodes — 68.9 h down to 8.7 h',
  },
]

export const researchPerspectives: ResearchPerspective[] = [
  {
    number: '01',
    title: 'Data logistics modelling',
    text: 'Describe the whole chain — instrument, transport, HPC and HPDA resources, storage, laboratories — as a single system whose stages can be reasoned about, staged and placed, instead of a series of unrelated site problems.',
  },
  {
    number: '02',
    title: 'Multi-criteria optimisation',
    text: 'Placement decisions trade off storage constraints, network and infrastructure capacity (topology, latency, transfer protocols), energy expenditure, and the difficulty of writing, deploying and debugging applications. Any one of these criteria alone gives the wrong answer.',
  },
  {
    number: '03',
    title: 'Security, governance and sovereignty',
    text: 'PPST and ZRR rules decide not only what may run, but who may operate it. The Globus question — why a service widely used in the United States cannot manage identities or data flows inside a restrictive zone — is the sharpest illustration that a technical choice can be a legal impossibility.',
  },
  {
    number: '04',
    title: 'Traceability, provenance and FAIR metadata',
    text: 'Operations, actors and data must all be attributable. Metadata attached to data and to processes is the lever that makes the other perspectives decidable rather than merely discussable, and it is what turns a collection of runs into reusable science.',
  },
  {
    number: '05',
    title: 'Usability as a research object',
    text: 'If the interface demands cluster administration, the astronomy community will not cross it. Scientific applications have to be exposed as services, so that operational complexity lives behind the interface while scientific and security requirements stay visible in front of it.',
  },
]

export const researchChain: ResearchChainStep[] = [
  {
    role: 'Instrument',
    site: 'SURFsara',
    detail:
      'The Dutch national HPC centre and LOFAR reference site, where the telescope data lands.',
  },
  {
    role: 'Processing',
    site: 'Jean Zay · Adastra · Joliot-Curie',
    detail:
      'The three French national supercomputers, operated by IDRIS, CINES and TGCC within their ZRR perimeters.',
  },
  {
    role: 'Storage and sharing',
    site: 'EOSC',
    detail:
      'The European Open Science Cloud, a distributed research network available to European research users.',
  },
]

export const researchMethods: ResearchChapter = {
  label: 'How the perspectives articulate',
  heading: 'One workflow, three jurisdictions.',
  paragraphs: [
    'These perspectives are not independent research programmes. They meet in a concrete cross-facility workflow: the DDF Pipeline, the self-calibration and imaging software of the LOFAR radio telescope and an SKA precursor, running over heterogeneous, geo-distributed HPC and storage sites.',
    'Between those points, every stage has to answer the same question in a different administrative language. Where should this step run, under whose authority, with which metadata recorded, and who is accountable for it? That translation is the system of systems the thesis proposes to model.',
  ],
}

export const researchCase: ResearchChapter = {
  label: 'Methods',
  heading: 'A demanding pipeline as the stress test.',
  paragraphs: [
    'The DDF Pipeline is a good ground case precisely because it is both a genuine community need and a hard systems problem. A LoTSS data release consumed around sixteen million core-hours; a single run reaches hundreds of gigabytes of peak memory, image sizes spanning five to twenty thousand pixels per side, between one and twenty-four frequency sub-bands, and runtimes measured in days.',
    'The work describes and profiles that software, then proposes the operational model that makes it usable at scale: application microservices and ephemeral buffers to move data without direct shell access, a runner that pulls jobs from inside the secure zone rather than pushing them in, and a named service account that reconciles ZRR traceability with a shared community tool.',
    'Provenance is captured formally rather than narratively — structured knowledge maps of the application and of the runtime environment, and performance indicators recorded for each execution — so that a run can be compared, reproduced, and eventually predicted.',
  ],
}

export const researchContribution: ResearchChapter = {
  label: 'Contribution',
  heading: 'What the thesis adds.',
  paragraphs: [
    'A data-logistics model in which governance and security are constraints of the same rank as capacity and cost, rather than a layer applied once the architecture is already fixed.',
    'A specification of the metadata required to make large-scale workflow deployment operable: enough to support traceability of operations and the FAIR principles, and enough to feed multi-criteria placement decisions.',
    'A demonstrated alternative to per-user HPC accounts — scientific applications as a service — validated with the DDF Pipeline on Jean Zay and Adastra, with the named service account model under discussion with French security stakeholders.',
    'A quantified demand on infrastructure: what these logistics imply for storage, network, energy and emissions in a data-centric scientific landscape.',
  ],
}

export const researchApplications = {
  label: 'Applications',
  heading: 'Beyond radio astronomy.',
  paragraphs: [
    'The same problem appears wherever a scientific chain crosses administrations, which makes the methods relevant to other instrument communities and data-intensive research infrastructures.',
    'The transport question also extends past networks: one concrete line of work concerns the specification of a device for moving data through road and air transportation networks, where bandwidth, latency and energy behave nothing like a datacentre link.',
  ],
} as const

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
    title: 'Interview: At the Heart of Data Logistics for Radio Astronomy',
    description: 'An ECLAT interview about Mathis’s path, doctoral research, and multidisciplinary work.',
    kind: 'video',
    src: 'https://eclat-lab.fr/wp-content/uploads/2025/09/ECLAT-interview-matthis-2025-Website-v3.mp4',
    externalHref: sourceLinks.eclatInterview,
    image: '/images/mathis/videos/interview.jpg',
  },
  {
    id: 'hpc-service-webinar',
    title: 'Webinar: HPC Application Services for Radio Astronomy',
    description: 'A webinar on data logistics, intensive imaging, and large-scale workflow orchestration.',
    kind: 'iframe',
    src: 'https://astrotube.obspm.fr/videos/embed/35dTv8mmaSdm36uEFtCnZz',
    externalHref: sourceLinks.eclatWebinar,
    image: '/images/mathis/videos/webinar.webp',
  },
  {
    id: 'astronomy-hackathon',
    title: 'Event: International Hackathon for Radio Astronomy',
    description: 'Highlights from a collaborative ECLAT research event in Rennes.',
    kind: 'video',
    src: 'https://eclat-lab.fr/wp-content/uploads/2026/04/ECLAT-hackathon-Rennes-2026.mp4',
    externalHref: sourceLinks.eclatHackathon,
    image: '/images/mathis/videos/hackathon.jpg',
  },
  {
    id: 'mcp-demo-video',
    title: 'Demo: MCP Server Exposing the Structured Knowledge Map of the DDF Pipeline Software',
    description: 'Demo of the MCP server exposing the software ontology for DDF Pipeline.',
    kind: 'video',
    src: '/images/mathis/videos/ddf-mcp-demo.mp4',
    externalHref: '/writing/mcp-server-software-ontology',
    image: '/images/mathis/mcp-server-software-ontology/cover.webp',
  },
]

export type ArticleId =
  | 'predicting-for-sizing'
  | 'webinar-hpc-applications-as-a-service'
  | 'international-hackathon-for-astronomy'
  | 'rennes-hackathon-for-astronomy'
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
    id: 'predicting-for-sizing',
    number: '01',
    category: 'Research note',
    date: 'September 23, 2026',
    title:
      'Predicting for Sizing: Teaching Supercomputers Their Own Execution Footprint',
    description:
      'A continuous-learning predictive model that estimates the execution time, memory, and energy of scientific applications on supercomputers — so researchers can size their allocations instead of guessing.',
    body: [
      {
        type: 'heading',
        level: 2,
        text: 'The Sizing Problem',
      },
      {
        type: 'paragraph',
        text: 'Every scientific campaign on a supercomputer begins with a **bet**. How many nodes? How much memory? How long will this run take? For the **DDF Pipeline** — the self-calibration and imaging software behind the **LOFAR** radio telescope — the stakes are enormous: the latest LoTSS (LOFAR Two-metre Sky Survey) data release alone consumed **16 million core-hours**. And behind every one of those hours hides a sizing decision made, more often than not, in the dark.',
      },
      {
        type: 'paragraph',
        text: 'The astronomers who use DDF Pipeline are scientists, not HPC experts. They allocate their project’s precious computing hours through **SLURM**, a scheduler that asks them to state their needs up front (--time, --cpus-per-task, --mem) and then enforces a **fairness policy** that rewards projects which consume less than they were granted. Over-allocate and you waste resources, lose priority, and wait in longer queues; under-allocate and your job simply fails. Translating scientific parameters into correct sizing is a guessing game with real costs on both sides.',
      },
      {
        type: 'figure',
        image: '/images/mathis/predicting-for-sizing/ddf-workflow.png',
        alt: 'The DDF Pipeline workflow: download data, run the pipeline, upload results',
        caption: 'The DDF Pipeline workflow — three steps for which we would like to know the most suitable site for executing them.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Why Guessing Is So Expensive',
      },
      {
        type: 'paragraph',
        text: 'The difficulty is not a lack of experience — it is a lack of predictability. DDF Pipeline runs vary along **several dimensions at once**, and a single change can move the resource footprint by an order of magnitude:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Application parameters.** The output image resolution can ranges from **5,000×5,000 to 20,000×20,000 pixels**, pulling peak memory from **~10 GB to ~400 GB**.',
          '**Input data volume.** From hundreds of megabytes to several gigabytes, stretching runtime from **minutes to several days** on a single node.',
          '**Data structure.** Between **1 and 24 frequency sub-bands**, each of which changes how the workload scales — and how energy-efficient it is — across the allocated nodes.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Add a **multi-site dimension** and the problem compounds. In cross-facility workflows, resource sizing drives task placement decisions: disk space, queue wait times, and where a job can go all depend on the footprint you predict. Hardware constraints differ from site to site — **768 GB per node** on Adastra, **192 GB of memory per node** on Jean Zay, **228 GB per node** on Irene — so a configuration that fits one machine may be hopeless on another.',
      },
      {
        type: 'paragraph',
        text: 'The configuration space is simply **too large to test exhaustively**. This is not a problem you can solve once: it demands a model that **keeps learning** as executions accumulate.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What We Need to Succeed',
      },
      {
        type: 'paragraph',
        text: 'Building a continuous-learning predictor is a team effort across five pieces, each developed by a different specialist and designed to fit together:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Structured knowledge map** — a description of the supercomputer-specific runtime environment, mapped onto SLURM metrics.',
          '**Job Performance Indicators Set, JoPInS** — the structure containing the measurements of the formal descriptor applications jobs performance indicator relative to their executions.',
          '**Monitoring plugin** — the collector that captures evidence from real jobs.',
          '**Database** — the central store where all executions accumulate in the JoPInS format.',
          '**Machine learning exposed as HAPS** — a model trained by application version and by runtime environment, with access to HPC resources and applications for its continuous learning.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step one — A structured knowledge map of the runtime environment',
      },
      {
        type: 'paragraph',
        text: 'Before we can predict, we must be able to **describe**. The structured knowledge map (or ontology) formalizes the supercomputer-specific runtime environment in which jobs execute. Its value lies in the mapping: aligning the **job structured knowledge map** with the raw **SLURM metrics** so that a conceptual description — “this job needed a large-memory node” — becomes a measurable, comparable quantity.',
      },
      {
        type: 'figure',
        image: '/images/mathis/predicting-for-sizing/job-ontology.png',
        alt: 'Visualization of the Job Ontology describing the supercomputer runtime environment',
        caption: 'The job structured knowledge map — the bridge between how researchers think about their runs and how SLURM measures them. Credit: Gaëlle Richet.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step two — Describing every execution with JKPP',
      },
      {
        type: 'paragraph',
        text: 'Every execution is captured by a set of **Job Performance Indicators, JoPI**. This formalizes both sides of a run: the **input parameters** — application settings and system choices — and the **output metrics** — time, memory, energy. Each measure is structured as a triple: **JoPI = (value, type of value, description)**, a structure simple enough to collect at scale and rich enough to train on.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step three — Collecting evidence from the field',
      },
      {
        type: 'paragraph',
        text: 'A pair of plugins turns real jobs into training data. The command-line client, **cli-monitoring-haps**, collects information about jobs from a specific application, exposed as HAPS, in the context of a **data release campaign**. The server-side collector, **server-monitoring-haps**, reads **system metrics** from SLURM (sacct -j <JOB_ID>), pulls **application-specific metrics** from the HAPS database. Each execution is then formalized into JoPInS and sent to the database.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step four — Centralizing in Database',
      },
      {
        type: 'paragraph',
        text: 'All of those JoPInS records land in the database — the single source of truth for how applications actually behave on real machines. It is the memory of the system, and the fuel for the model.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Step five — Connecting the machine learning to the system',
      },
      {
        type: 'paragraph',
        text: 'The loop is closed around **HAPS** (HPC Application Services), in a setup that remains **compliant with the ZRR security requirements** imposed on French supercomputers, which are considered national strategic assets. Step 1: campaign execution of scientific applications on supercomputers. Step 2: data collection through the monitoring plugin. Step 3: model training and testing — an **machine learning model** is trained on a specific dataset campaign, tested, its accuracy measured, and only then exposed as HAPS itself.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'From Execution to Prediction',
      },
      {
        type: 'paragraph',
        text: 'Once the loop is running, the pieces produce something new: a **machine-learning model exposed as a service**. Train an expert model on a campaign dataset, measure its accuracy, and the model becomes an oracle that predicts, for any new configuration, the **execution time**, **memory usage**, and **energy consumption** of the application. The goal is practical: given the variability of application parameters and input data, identify the **allocation configurations that offer the best trade-off between execution time and energy consumption** — before a single core-hour is spent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'From Guessing to Knowing',
      },
      {
        type: 'paragraph',
        text: 'A scheduler asks you to predict your own future — and traditionally, that prediction has been a judgment call. With a continuously learning model fed by real executions, the conversation changes. The supercomputer stops asking its users to guess and starts telling them what they need. **Sizing stops being a bet** — and scientists can spend their core-hours on science, not on hunches.',
      },
    ],
    image: '/images/mathis/predicting-for-sizing/cover.webp',
    imageAlt: 'A conceptual illustration contrasting the initial phase of "guessing" with the clarity offered by a continuous learning model.',
    href: '/writing/predicting-for-sizing',
  },
  {
    id: 'mcp-server-software-ontology',
    number: '02',
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
        caption: 'Top: re-projection of the LoTSS-DR3 mosaic images. Bottom: the corresponding RMS image. The yellow and blue outlines show the LoTSS-DR1 and LoTSS-DR2 areas, covering 2% and 27% of the northern sky, respectively; the black outline shows the LoTSS-DR3 coverage of 88%. The small grey dots mark the 3168 LoTSS pointings, of which 2551 are included in this release. Source: [LoTSS Data Release 3](https://ui.adsabs.harvard.edu/abs/2026A%26A...707A.198S/abstract)',
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
    number: '03',
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
    ],
    image: '/images/mathis/exascale-astronomy/ska.webp',
    imageAlt: 'The Square Kilometre Array radio telescope',
    href: '/writing/exascale-astronomy-cybersecurity',
  },

  {
    id: 'webinar-hpc-applications-as-a-service',
    number: '04',
    category: 'Webinar',
    date: 'February 26, 2026',
    title: 'Webinar: HPC Application Services for Radio Astronomy',
    description:
      'This webinar uses radio astronomy to demonstrate how HPC Application Services can manage scientific data, accelerate imaging, and support next-generation instruments such as the SKA through architectures and tools for cross-facility workflows.',
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
    image: '/images/mathis/videos/webinar.webp',
    imageAlt: 'Mathis presenting "HPC as a Service for Radio Astronomy: A Practical Case Study with the DDF Pipeline" during the webinar',
    href: '/writing/webinar-hpc-applications-as-a-service',
    sourceHref: sourceLinks.eclatWebinar,
  },
  {
    id: 'international-hackathon-for-astronomy',
    number: '05',
    category: 'Collaboration',
    date: 'April 1, 2026',
    title: 'International Hackathon for Radio Astronomy',
    description:
      'A research event bringing together computer scientists and astrophysicists from France, England, and South Africa to address the shared technical challenges of radio astronomical data.',
    body: [
      {
        type: 'paragraph',
        text: 'Scientific software becomes more useful when the people who build infrastructure and the people who interpret astronomical data can work on the same problems together.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What are the goals of this hackathon?',
      },
      {
        type: 'paragraph',
        text: 'The international hackathon in Rennes created space for that collaboration: participants worked during one week to create a participatory research network called RIMS Network and to continue work on the DDF Pipeline data-processing software.',
      },
      {
        type: 'paragraph',
        text: 'RIMS Network is a distributed storage system that hosts dynamic spectra and their metadata for studying rare events. It enables collaborative data production and can be accessed by users via a web service.',
      },
      {
        type: 'paragraph',
        text: 'For the DDF Pipeline, we worked on portability of the parallel version: it is now installed and running on the French supercomputers Jean Zay hosted at the Institut du Développement et des Ressources en Informatique Scientifique (IDRIS), Adastra at the Centre Informatique National de l`Enseignement Supérieur (CINES), at the University of Hertfordshire (UK), and with our industry partner Bull.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What is the benefit of this international collaboration?',
      },
      {
        type: 'paragraph',
        text: 'These technical events are crucial for bringing our community together to align on shared goals and turn them into reality. During this hackathon, we successfully validated the deployment of the DDF Pipeline on the supercomputers of all participating partners, finalizing this stable version so we can now focus on developing new features. For RIMS, this international gathering allowed us to collectively finalize the general distributed architecture across France, South Africa, and the UK, as well as agree on usage conditions and deliver a proof-of-concept to validate the core idea.',
      },
    ],
    image: '/images/mathis/videos/hackathon.jpg',
    imageAlt: 'Participants in the international DDF Pipeline and RIMS hackathon in Rennes',
    href: '/writing/international-hackathon-for-astronomy',
    sourceHref: sourceLinks.eclatHackathon,
  },
  {
    id: 'rennes-hackathon-for-astronomy',
    number: '06',
    category: 'Collaboration',
    date: 'October 1, 2025',
    title: 'From Supercomputers to Tutorials: Strengthening Our Community Through Shared Expertise ',
    description:
      'A technical research event bringing together computer scientists and astrophysicists to tackle challenges of radio astronomy.',
    body: [
      {
        type: 'paragraph',
        text: 'We often talk about code and data, but the best part of our hackathon was the people. It was a chance to learn from each other and solve hard problems face-to-face. In radio astronomy, tools are complex. Working together makes them easier to master.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Mastering Spack with the Help of an Industrial Partner',
      },
      {
        type: 'paragraph',
        text: 'One of our main goals was to get our data processing software, DDF Pipeline, running smoothly on supercomputers using Spack. Spack is a powerful tool for managing software on high-performance machines, but it has a steep learning curve. It can be tricky to set up correctly.',
      },
      {
        type: 'paragraph',
        text: 'Our partner at Bull stepped in to help. Instead of just sending us documentation, their engineer sat down with us. They showed us exactly how to configure Spack for our machines. This hands-on guidance turned a difficult technical hurdle into a clear, manageable process. We didn’t just get software installed; we learned how to maintain it ourselves.'
      },
      {
        type: 'figure',
        image: '/images/mathis/rennes-hackathon/rennes-hackathon-back.webp',
        alt: 'Participants listening to Cyril',
        caption: 'Participants listening to Cyril Tasse presenting the results of a sky survey obtained by processing data from the Low Frequency Array (LOFAR) radio telescope using the DDF Pipeline. Credit: Jacques Tissot.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Helping Participants with Tutorials',
      },
      {
        type: 'paragraph',
        text: 'We also focused on the users. Good code is useless if people don’t know how to use it. During the event, we wrote detailed [tutorials for DDFacet](https://hackmd.io/l8fw0PYRQv6dm9i6KpZWPA), the imaging software in our pipeline.'
      },
      {
        type: 'paragraph',
        text: 'Writing these guides was about clarity and simplicity. We wanted to explain not just the steps, but the logic behind them. By creating this documentation, we are making it easier for other astronomers to use our tools. This support extends beyond the hackathon, helping the wider community succeed.'
      },
    ],
    image: '/images/mathis/rennes-hackathon/rennes-hackathon-front.webp',
    imageAlt: 'Participants in the hackathon in Rennes',
    href: '/writing/rennes-hackathon-for-astronomy',
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

export function getArticle(id: string) {
  return articleItems.find((article) => article.id === id)
}
