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
  numpexYoungpex: 'https://numpex.org/youngpex/',
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
    label: 'measured DDF Pipeline speedup on 24 nodes — 68.8 h down to 8.7 h',
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
    image: '/images/mathis/videos/interview.webp',
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
    image: '/images/mathis/international-hackathon-for-astronomy/cover.webp',
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
  | 'youngpex'
  | 'predicting-for-sizing'
  | 'webinar-hpc-applications-as-a-service'
  | 'international-hackathon-for-astronomy'
  | 'rennes-hackathon-for-astronomy'
  | 'exascale-astronomy-cybersecurity'
  | 'mcp-server-software-ontology'

export type ArticleListItem = string | { id?: string; text: string }

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: ArticleListItem[] }
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
    id: 'youngpex',
    number: '01',
    category: 'Community',
    date: 'October 12, 2026',
    title: 'YoungPEx: The New Generation of Digital for Exascale',
    description:
      'Inside YoungPEx, the NumPEx working group that connects young researchers across the French exascale programme — its first General Assembly in Toulouse, its workshops on the environmental impact of HPC and on inequalities in academia, and what comes next.',
    body: [
      {
        type: 'paragraph',
        text: 'YoungPEx is the working group of young researchers inside **NumPEx**, the French research programme for exascale computing. With **53 members on its Discord server** and **27 participants at its first General Assembly**, it brings together interns, doctoral students, postdocs, engineers, young contract staff and permanent staff — anyone, at any stage, who wants to take part. Its members discuss the questions that matter to their generation: the environmental impact of computing, interdisciplinarity, and the use of AI in scientific research.',
      },
      {
        type: 'paragraph',
        text: 'NumPEx — "Numérique pour l’Exascale" — was launched in 2023 to develop the skills and infrastructure needed for exascale computing, at the scale of a quintillion (10¹⁸) operations per second. Its research is organised into five targeted projects:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Exa-MA (PC1)** — methods and algorithms for exascale computing',
          '**Exa-SofT (PC2)** — software and tools for HPC',
          '**Exa-DoST (PC3)** — data-oriented tools and software',
          '**Exa-AToW (PC4)** — tools and architectures for large-scale workflows',
          '**Exa-DI (PC5)** — development and integration of tools through applications',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'What is YoungPEx?',
      },
      {
        type: 'paragraph',
        text: 'Uniting junior researchers in a working group is an innovative initiative within the programme. The goal is to give them room to express their own original ideas: by creating a network of young researchers, new research dynamics emerge across NumPEx. The objectives are to **stimulate exchanges between the different targeted projects**, to **create synergies between researchers**, and to **prepare future collaborations**.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Meet peers** from across the programme, beyond one’s own project and laboratory.',
          '**Discuss scientific challenges** so that exchanges and collaborations between centres and projects are easier to start.',
          '**Talk about the academic world** — how it works, and what careers look like.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The group discusses whatever its members want to bring: the environmental impact of research, the societal impact and acceptability of HPC, social and gender inequalities in academia, academic life and careers, and AI.',
      },
      {
        type: 'paragraph',
        text: 'The working group held a kick-off session during the NumPEx General Assembly in March, ran its first General Assembly in Toulouse in November, took part in the Trans’Numériques events in Rennes, and published an overview in the Matapli review.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The first General Assembly, in Toulouse',
      },
      {
        type: 'paragraph',
        text: 'The group’s main event of 2025 was its first General Assembly. **Twenty-seven young researchers** from laboratories across France met from **12 to 14 November 2025** at INP-ENSEEIHT in Toulouse. Across four half-days, the programme combined a workshop on the environmental impact of HPC, a general assembly to discuss the group’s next actions, and a workshop on social and gender inequalities in research.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The environmental impact of HPC',
      },
      {
        type: 'paragraph',
        text: 'The workshop was led by **Georges Da Costa** (IRIT, Exa-SofT), professor of computer science at the Université de Toulouse, answering a strong interest among young researchers in the environmental impact of their work.',
      },
      {
        type: 'paragraph',
        text: 'The introduction made clear that energy production and consumption are a **collective** question rather than an individual one. French energy consumption and emissions are tied to those of its neighbours: European energy resources form an interconnected network. The emissions attributed to a person are not limited to their direct consumption — they include those generated by the public services they benefit from, by imports, and by digital uses such as cloud services, whose carbon footprint is often underestimated. Geopolitical issues also weigh on the Internet itself: strategic infrastructure such as submarine cables conditions digital sovereignty and the security of states, and the dependence on lithium produced outside Europe illustrates the vulnerability of supply chains for materials critical to energy-transition technologies.',
      },
      {
        type: 'paragraph',
        text: 'Software is not exempt. The growing complexity of applications makes global optimisation of energy consumption harder, while the absence of a clear architecture generates dead code and superfluous costs. Removing obsolete features and documenting code rigorously allows it to be "recycled" — rewritten more efficiently, which reduces both debugging time and the resources consumed by CI/CD pipelines. The conclusion was that a **systemic approach** is required: optimise resources, secure infrastructure, and rethink software design for a more sustainable future.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hands-on: measuring energy consumption',
      },
      {
        type: 'paragraph',
        text: 'Doctoral students in the programme working on the energy consumption of supercomputers sparked real curiosity among their peers, so Georges Da Costa continued the workshop with a presentation of tools to **measure** the energy consumption of computations in computing centres.',
      },
      {
        type: 'paragraph',
        text: '**MOJITO/S** is a set of open-source tools for monitoring energy and network usage at the operating-system level, available on [gitlab.irit.fr](https://gitlab.irit.fr/sepia-pub/mojitos). The session also recalled that the French scientific community has the **Grid’5000** environment ([grid5000.fr](https://www.grid5000.fr)) to carry out research in distributed parallel computing, HPC, Big Data and AI — a set of experimental platforms offering great freedom to users, in particular essential access to the wattmeters attached to computing resources.',
      },
      {
        type: 'paragraph',
        text: 'Mathis Certenais closed the workshop with a presentation of **Impacts-HPC**, a tool developed in the Exa-AToW project with the EcoInfo research group. It is a [Python library](https://impacthpc-cc8227.pages.in2p3.fr/index.html) that evaluates the impact of use for the extraction, production and distribution phases, with a full life-cycle assessment to come. The tool computes environmental impact along three criteria: global warming potential, abiotic resource depletion, and primary energy consumption. Impacts-HPC complements the indicators provided by the DARI web portal used to allocate resources on the IDRIS, CINES and TGCC HPC centers; the portal’s information relies on the method of the [Labos 1point5](https://labos1point5.org/les-rapports/estimation-empreinte-calcul) collective.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Questions and ideas from the participants',
      },
      {
        type: 'paragraph',
        text: 'The workshop ended with the participants’ own questions about HPC use — questions the tools above could help answer:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Getting **metrics on the environmental impact** of the simulations carried out — which depends on where the electricity comes from at the moment of execution, nuclear or coal for instance — through meaningful information such as financial cost.',
          'Having an idea of **how to size jobs** according to actual needs (number of nodes, and so on).',
          'Finding a **balance between computational cost and the impact of the research**, with interdisciplinary expert advice.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The slides used during the workshop are available on the NumPEx website ([numpex.org](https://numpex.org/the-first-youngpex-general-meeting/)).',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Community activities',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feedback from YoungPEx on the use of LLMs for coding',
      },
      {
        type: 'paragraph',
        text: 'For the 55th edition of the ORAP forum, on the theme "IA générative pour le HPC : une nouvelle rupture ?", the YoungPEx committee surveyed the working group about its use of LLMs in programming. The results were presented on **28 November 2025**, and the session is described on [orap.irisa.fr](https://orap.irisa.fr/les-grands-modeles-de-langage-une-rupture-de-pratique-pour-le-developpement-de-codes-hpc/).',
      },
      {
        type: 'paragraph',
        text: 'A 12-question questionnaire, sent by email, showed that **18 of 25** respondents use these models. Among the 18 users, **16 use GPT models** and **72% combine models from different providers**; half use them daily, mainly to understand, generate and debug code. Of those 18, **16 feel that LLMs improve their productivity** and **7 report an improvement in their programming skills**. Satisfaction with the quality of the generated code is more mixed: only **7 are satisfied**, 6 find it average and 4 insufficient. The main challenges identified are **inconsistent results** and a **lack of contextual understanding**.',
      },
      {
        type: 'figure',
        image: '/images/mathis/youngpex/ai-models.webp',
        alt: 'Excerpt from the YoungPEx presentation on the use of LLMs for coding, covering the models used by members.',
        caption:
          'Excerpt from the YoungPEx presentation on the use of LLMs for coding: the models used by members.',
      },
      {
        type: 'figure',
        image: '/images/mathis/youngpex/ai-challenges.webp',
        alt: 'Excerpt from the YoungPEx presentation on the use of LLMs for coding, covering the challenges reported by members.',
        caption:
          'Excerpt from the YoungPEx presentation on the use of LLMs for coding: the challenges reported by members.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Social and gender inequalities in academia',
      },
      {
        type: 'paragraph',
        text: 'Long confined to a narrow social circle, academic research has gradually opened up, notably to women and gender minorities. Aware that there is still a way to go, the group dedicated a morning to raising awareness of social and gender inequalities, hoping to contribute, at its own scale, to a more inclusive workplace.',
      },
      {
        type: 'paragraph',
        text: 'Yasmina Asso presented the results of studies by the **Observatoire des inégalités** ([inegalites.fr](https://www.inegalites.fr/)). The organisation offers an adaptation of the famous Monopoly game that makes real inequalities tangible: it is built on data from its studies of inequalities in France, linked in particular to gender, disability, resources and origins. The activity closed with a collective discussion of what participants had observed, and of how economic rules shape social positions and starting inequalities.',
      },
      {
        type: 'figure',
        image: '/images/mathis/youngpex/general-assembly-monopoly.webp',
        alt: 'Participants playing the Monopoly of inequalities during the YoungPEx General Assembly.',
        caption: 'A session of the Monopoly of inequalities during the General Assembly.',
      },
      {
        type: 'paragraph',
        text: 'The exchanges then turned to academia — mathematics and computer science in particular. Julie Lesthelle (Université de Bordeaux) presented her master’s thesis, ["Les études en licence de mathématiques sous le prisme du genre"](https://inria.hal.science/hal-05368894), grounding the definition of the **leaky pipeline**: minorities are less represented in positions of responsibility than in others — fewer research directors than research fellows, for instance.',
      },
      {
        type: 'paragraph',
        text: 'Her work highlights two brakes on young women in science: the **fear of making mistakes** — in fields where experimentation and voicing doubts are essential to learning — and gendered socialisation, such as later contact with computer science than male peers. Teachers play a decisive role: reading students’ body language lets them value error as a constructive step and anticipate implicit questions. For the young researchers present, **the fight against inequalities is a collective responsibility that requires continuous mobilisation**.',
      },
      {
        type: 'figure',
        image: '/images/mathis/youngpex/general-assembly-back.webp',
        alt: 'Julie Lesthelle speaking in front of the YoungPEx group during the General Assembly.',
        caption: 'Julie Lesthelle speaking in front of YoungPEx.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Publications',
      },
      {
        type: 'paragraph',
        text: 'YoungPEx also writes. The group contributed an overview to **MATAPLI**, the newsletter of the Société de Mathématiques Appliquées et Industrielles, in [issue 139](https://www.ceremade.dauphine.fr/~chupin/Matapli/139/Matapli139.pdf).',
      },
      {
        type: 'figure',
        image: '/images/mathis/youngpex/matapli.webp',
        alt: 'Cover of the YoungPEx overview in the MATAPLI newsletter, issue 139.',
        caption: 'The YoungPEx overview in MATAPLI, issue 139.',
      },
      {
        type: 'paragraph',
        text: 'A poster presenting the group — its context and issues, its objectives, and its current advances — was displayed at the [Trans’Numériques 2026](https://numpex.org/trans-numeriques-2026/) event, from 2 to 5 February 2026.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Learn more',
      },
      {
        type: 'paragraph',
        text: 'The official YoungPEx page is at [numpex.org/youngpex](https://numpex.org/youngpex/), and the first General Assembly has its own write-up and slides at [numpex.org/the-first-youngpex-general-meeting](https://numpex.org/the-first-youngpex-general-meeting/).',
      },
    ],
    image: '/images/mathis/youngpex/general-assembly-front.webp',
    imageAlt: 'Group photo of YoungPEx participants in the hall of INP-ENSEEIHT, Toulouse.',
    href: '/writing/youngpex',
    sourceHref: sourceLinks.numpexYoungpex,
  },
  {
    id: 'predicting-for-sizing',
    number: '02',
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
        image: '/images/mathis/predicting-for-sizing/ddf-workflow.webp',
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
        text: 'Add a **multi-site dimension** and the problem compounds. In cross-facility workflows, resource sizing drives task placement decisions: disk space, queue wait times, and where a job can go all depend on the footprint you predict. Hardware constraints differ from site to site — **768 GB per node** on Adastra, **192 GB of memory per node** on Jean Zay, **228 GB per node** on Joliot-Curie — so a configuration that fits one machine may be hopeless on another.',
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
        image: '/images/mathis/predicting-for-sizing/job-ontology.webp',
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
    number: '03',
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
    number: '04',
    category: 'Publication',
    date: 'September 13, 2026',
    title:
      'Exascale Astronomy vs. Cybersecurity: Unlocking French Supercomputers for the Radio Astronomy Community',
    description:
      'How a service-based access model can unlock French national supercomputers for radio astronomy without compromising cybersecurity.',
    body: [
      {
        type: 'paragraph',
        text: 'Next-generation radio telescopes, such as the **Square Kilometre Array** (SKA) [1], will generate **exascale data volumes** that no local cluster can absorb. Processing them requires the parallel architectures of national high-performance computing (HPC) systems — and in France, that means the machines coordinated by **GENCI** [2]: Adastra at **CINES** [3], Jean Zay at **IDRIS** [4], and Joliot-Curie at **TGCC** [5], where the first French exascale supercomputer, Alice Recoque, is currently being installed.',
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/ska.webp',
        alt: 'The Square Kilometre Array radio telescope. Credit: SKAO.',
        caption: 'The Square Kilometre Array radio telescope. Credit: SKAO.',
      },
      {
        type: 'paragraph',
        text: 'For the radio astronomy community, the path to these machines is blocked — not by a lack of hardware, but by a systemic conflict between scientific collaboration and national security. This is the tension the work we present at the **SC26 Workshops** sets out to resolve: how to let a scientific community share a common application across French HPC systems without breaking the accountability rules those systems are built on.',
      },
      {
        type: 'paragraph',
        text: 'This is not a new problem. The **Low-Frequency Array (LOFAR)** [6] is a European network of radio telescopes and a pathfinder to the SKA; the **LOFAR as a service** platform [7] demonstrated the viability of a portal-based approach for on-demand access to computing resources. It enables the radio astronomy community to process LOFAR data through dedicated pipelines deployed on distributed data and compute infrastructures co-located with the LOFAR Long-Term Archive sites, including **SURFsara**, the Dutch national e-infrastructure [8]. But this model was designed for grid environments and did not account for the accountability requirements imposed by the cybersecurity regulations associated with ZRR status.',
      },
      {
        type: 'paragraph',
        text: 'Recent empirical work [9] identifies barriers to HPC usage in radio astronomy — limited accessibility, heterogeneous systems, gaps in advanced computing expertise, and increasing software complexity. Though this study focuses on commercial HPC in an Australian context, these barriers are relevant to publicly funded national infrastructures, and in the French HPC ecosystem the added cybersecurity rules imposed by the ZRR further widen the gap between radio astronomy practice and HPC operational models.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Friction: Science vs. ZRR',
      },
      {
        type: 'paragraph',
        text: 'In France, because supercomputers are classified as **national strategic assets**, the HPC centers that host them operate within the French framework for the protection of the Nation’s scientific and technical potential (**PPST**) [10]. Established by French regulations and described in further detail in recommendations published by **ANSSI** [11], this framework aims to prevent the loss, sabotage, or appropriation of sensitive knowledge and technologies by foreign powers or malicious actors. **GENCI’s access rules** [12] specify how these requirements are implemented in the terms and conditions governing access to national HPC resources.',
      },
      {
        type: 'paragraph',
        text: 'To enforce the PPST, a computing center — or part of its infrastructure — is classified as a **Zone à Régime Restrictif (ZRR)** by ministerial order [13]. The ZRR places physical and logical access barriers around sensitive resources, and imposes a set of operational restrictions on their use:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Nominative access** — access is granted individually to a named person, which means each HPC user must deploy, configure, and maintain their own application stack.',
          '**Personal responsibility** — access is tied to a specific individual, so delegated or shared use of a single HPC account is incompatible with the regime.',
          '**Traceability** — physical and logical access, and any circulation inside the ZRR, must be regulated and traced.',
          '**Controlled data transfers** — disclosure or transfer of information to unauthorized third parties must be assessed and traceable.',
        ],
      },
      {
        type: 'paragraph',
        text: 'On top of those regulatory constraints come the ordinary constraints of shared supercomputers: SLURM scheduling [14], execution time limits of **24 hours on Adastra, 100 hours on Jean Zay, and 72 hours on Joliot-Curie**, and internet access confined to frontend nodes. Together, they make community-driven applications — a single pipeline maintained by a few experts and used by dozens of researchers — very difficult to operate on French machines.',
      },
      {
        type: 'paragraph',
        text: '**The result is a scalability nightmare.** Where a community model relies on a few experts to maintain a pipeline for dozens of researchers, the nominative rule forces **every single researcher** to independently deploy, configure, and maintain the entire stack on every supercomputer they use. Because each center requires its own nominative registration, the burden multiplies with every machine.',
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
        text: 'Why Existing Solutions Don’t Fit',
      },
      {
        type: 'paragraph',
        text: 'Several families of tools already address parts of this problem, but none of them satisfies the ZRR’s personal-responsibility requirement while still serving a whole community:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Workflow management systems** such as Pegasus [15], Nextflow [16], or Snakemake [17] orchestrate directed acyclic graphs across Cloud and HPC and can submit through a local batch scheduler. But they remain, by nature, **per-user engines**: each individual installs, configures, and maintains their own instance under a nominative account, and the deployment is never exposed as a shared, operated service.',
          '**Web portals and science gateways** [18], [19] hide HPC complexity behind an interface and satisfy nominative access by mapping each portal user to their own HPC account — but they do not remove the operational burden: every user still deploys and maintains the scientific application stack.',
          '**Grid-era middleware** such as GlideinWMS [20], PanDA [21], or DIRAC [22] combine pilot-based execution with Virtual Organization identities — short-lived proxy certificates issued by VOMS [23]. The incompatibility with the ZRR lies in the **executing identity** — a collective credential — rather than in the pull dispatch mode itself.',
          '**Programmatic access layers** such as Globus Compute (originally funcX) [24] and FirecREST [25] are the closest to our approach: they expose APIs to submit and monitor tasks on remote supercomputers. In their standard user-facing deployments, however, they authenticate users individually and associate each job with the requesting user’s HPC identity — and provide no centrally operated catalog of validated scientific applications exposed as a community service.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The ZRR requires **personal responsibility and traceability for every action** performed on the system. The rule that the user and the executor must be the same identity is one way to meet that requirement — and it currently prohibits an HPC account from executing jobs on behalf of a third party.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The "Globus Question": Why not use existing standards?',
      },
      {
        type: 'paragraph',
        text: 'For many researchers, especially in the US, Globus is the gold standard for HPC data movement and identity management, and it looks like the obvious answer. So why isn\'t Globus used in French HPC centers subject to PPST and ZRR regulations?',
      },
      {
        type: 'paragraph',
        text: 'The answer lies in the externalization of operational metadata.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**The infrastructure**: Globus services are hosted on Amazon Web Services and operated by Globus, while storage and computing endpoints remain operated by subscribing organizations.',
          '**What is stored** [26]: research files are not shared with Globus, but its services store task-related information, temporary credentials, filenames, and directory paths.',
          '**The French mandate**: any logical access to information protected by the PPST regime is strictly subject to authorization by the supervising Ministry. Externalizing that operational metadata may raise PPST and ZRR compliance concerns — including potential exposure to U.S. legal processes under **18 U.S.C. § 2713** [27]. At the time of writing, we found no publicly documented Globus Compute endpoint operated by a French national HPC center.',
        ],
      },
      {
        type: 'paragraph',
        text: 'In short: where Globus offers convenience through cloud-based orchestration, the ZRR requires sovereign control over operational data. This is precisely why our approach does not rely on Globus: it leverages an existing framework for scientific applications as a service, made of **Application Microservices** (AM) for application deployment and **Ephemeral Buffers** (EB) for transient data logistics — providing Globus-like functionality while remaining compliant with French national security law.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Solution: Scientific Applications as a Service',
      },
      {
        type: 'paragraph',
        text: 'To bridge this gap, we propose **decoupling the identity of the user from the identity of the executor**, in a framework that exposes scientific applications as a service [28]. Instead of forcing every astronomer to become an HPC system administrator, we mutualize the use of supercomputers around a small set of precise roles:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Users** are identified by a recognized authentication federation (e.g. **EduGAIN**), may be transient, and need not be familiar with HPC systems.',
          '**Maintainers** are HPC experts from the scientific community who deploy scientific applications and their runtime on a target supercomputer and assume operational responsibility for the jobs executed there. Their responsibility is decoupled from development: they need not belong to the project that writes the software, but they validate every version they deploy.',
          '**A named service account** is an HPC account owned by a maintainer, through which users submit jobs without holding individual credentials. Limiting it to a single predefined scientific application simplifies the audit process for the center’s cybersecurity service.',
          '**A user whitelist** is defined for each named service account. Managed by the maintainer, it lists the users authorized to use the account’s resources, satisfying the ZRR requirement for controlled data transfers.',
          '**A job** is a submission of data for processing with fixed, pre-installed software. Once submitted, it is pulled and executed automatically by the maintainer’s runtime, which attributes execution responsibility to the maintainer and thereby satisfies the ZRR’s personal-responsibility requirement.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The required derogation is narrow: authorizing the maintainer to execute jobs that process data submitted by a third party, where that third party is identified through an authentication federation. This proposal is currently under discussion with French HPC security stakeholders.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Architecture: How it Works',
      },
      {
        type: 'paragraph',
        text: 'The framework is a **single point of entry** for launching scientific application jobs on supercomputers, without direct access to the underlying HPC centers. It wraps complex HPC workflows into a seamless service:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Application Microservices (AM)** [29] — the catalog of available scientific applications, exposed as microservices. AM orchestrates execution through job and runtime entities; because submission and execution are decoupled, users do not need a persistent connection, enabling a **launch-and-forget** experience for jobs that may run for several days.',
          '**Ephemeral Buffers (EB)** [30] — a transient data logistics layer providing temporary storage and a data exchange point between users and HPC systems. They are not mandatory, but they ease transfers and are accessible with only a user identity.',
          '**The Runner** — a Python script (runner.py), executed by a maintainer, that periodically polls AM for pending jobs and executes them on the target HPC system over SSH [31], [32]. This **pull-based** design — rather than a web service pushing jobs into the secure zone — satisfies accountability and traceability, and it enforces the user whitelist before any execution.',
        ],
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/architecture.webp',
        alt: 'The scientific applications as a service architecture: users and developers, the API with its Application Microservices and Ephemeral Buffers, maintainers, and the HPC centers, each under its own governance domain.',
        caption: 'Scientific applications as a service architecture. Each actor operates under a distinct governance domain — users and developers under their laboratory’s policy, the API under IRISA’s, and HPC centers under their internal policy and the ZRR regulations — while maintainers sit at the intersection of the API and each center.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Lifecycle of a Job',
      },
      {
        type: 'paragraph',
        text: 'From the user’s perspective, a global job is a single object to watch from submission to completion:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Authentication** — the user authenticates against the AM API and receives an authenticated client in return.',
          '**Application selection** — the user lists the available applications, optionally filtered by name, then requests the chosen application’s contract describing its expected inputs and outputs.',
          '**Global job submission** — based on that contract, the user prepares the job locally, describing its inputs in JSON, and submits it. The API registers it for execution.',
          '**Monitoring loop** — the user polls the global job status after submission, without waiting for the execution to start.',
          '**Runner task** — meanwhile the maintainer’s runner picks up the pending job, marks it running, prepares the working directory, stages the inputs, and submits a job to SLURM.',
          '**SLURM job** — the global job and the SLURM job are distinct: the first is managed by the AM API, the second by the scheduler that runs the computation. The runner monitors the SLURM job until it ends, then collects the results.',
          '**Outputs retrieval** — the runner writes the collected results back to the API and marks the global job completed; the user then downloads the outputs through the API, without ever connecting to the HPC system.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The four lifespans are **nested**: the SLURM job runs inside the runner task, which runs inside the global job, which the user monitors.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Proof of Concept: The DDF Pipeline on Jean Zay',
      },
      {
        type: 'paragraph',
        text: 'We instantiated this architecture with the **DDF Pipeline** [33], [34], a community-driven radio astronomy application whose memory footprint, multi-day runtime, and reliance on external LOFAR datasets make it a demanding test case for French supercomputers under the ZRR regime.',
      },
      {
        type: 'paragraph',
        text: 'The DDF Pipeline is a composite application integrating **DDFacet** [35], a direction-dependent facets imaging package, and **killMS** [36], a calibration package for radio interferometry. It processes Measurement Sets (MS), a standardized format for interferometer visibilities, and produces sky images in FITS format. Originally a CPU-based, shared-memory application, it requires roughly **400 GB of RAM** to process LOFAR datasets: a representative run over 24 MS input files — 38.72 GB compressed — generated **594 GB of output** after **68.8 hours** on a single node [37].',
      },
      {
        type: 'paragraph',
        text: 'Memory per node shapes what can run where: **Adastra** [38] offers 768 GB per node and is well suited to the pipeline, **Jean Zay** [39] has 192 GB per node and requires limiting the size of the generated sky image (GPU partitions with at least 512 GB can also be used), and **Joliot-Curie** [40] has 228 GB per node — with only 7 fat nodes large enough. A configuration that fits one machine may be hopeless on another.',
      },
      {
        type: 'paragraph',
        text: 'To prepare for SKA data volumes, we co-developed a **parallel version** of the DDF Pipeline with partners from the **ECLAT joint laboratory** [41], integrating the multi-core, multi-node parallelization of DDFacet [42] with a parallel implementation of killMS. This is the version used for the results below.',
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/ddf-workflow.webp',
        alt: 'The DDF Pipeline workflow: download data, run the pipeline, upload results',
        caption: 'The DDF Pipeline workflow — three stages, each exposed as a distinct microservice.',
      },
      {
        type: 'paragraph',
        text: 'A complete experiment is expressed as three stages, each a specific microservice:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Download data** — inputs are MS files given by local path or URL, a target supercomputer, and its identifier. The microservice checks compatibility with the supercomputer by verifying that the URL domain appears on the user whitelist assigned to the named service account; local paths are staged through ebuffers. The output is a global job identifier.',
          '**Run DDF Pipeline** — inputs are a configuration file or specific options (e.g. image size) and the global job identifier. The microservice validates the configuration and access to the input data, prepares the execution directory, and submits a job to SLURM, returning the global job identifier so the user can poll its status.',
          '**Upload results** — inputs are the destination (local path or URL) and the global job identifier. The microservice uploads the data using ebuffers for a local path or via the API for a remote repository.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Results',
      },
      {
        type: 'paragraph',
        text: 'The workflow was exercised on the Jean Zay supercomputer to validate the architecture. We measured three things: where the data can live, how the pipeline scales, and what the service layer costs.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Data access** — for the LOFAR LoTSS L234026 8-hour integration dataset, **SURFsara** delivered the highest average download throughput (**137.9 MB/s**, though with the largest variability) ahead of **EOSC** [43] (51.85 MB/s) and **CNRS Drive** (52.36 MB/s). Upload favored EOSC (**28.73 MB/s**, coefficient of variation 34.3%) over CNRS Drive (13.81 MB/s, 84.7%), making SURFsara and EOSC the viable endpoints for this experiment.',
          '**Scalability** — elapsed time fell from **68.8 hours on 1 node to 8.7 hours on 24 nodes** (≈7.9× speedup), passing through 14.4 hours on 6 nodes and 10.2 hours on 12 nodes. Average CPU utilization decreased from 63.5% to 31%, primarily because unparallelized DDFacet deconvolution steps limit scaling efficiency — parallelizing them is ongoing work.',
          '**Service overhead** — job submission through the API added only **0.25 to 0.96 seconds** for configurations of 0 (baseline), 1, and 5 ebuffers. This is negligible against workflow executions that range from several hours to several days.',
        ],
      },
      {
        type: 'figure',
        image: '/images/mathis/exascale-astronomy/sequence-diagram.webp',
        alt: 'Sequence diagram of a global job: the user authenticates, selects an application, submits the job and monitors it, while the maintainer’s runner pulls it, submits it to SLURM and retrieves the results.',
        caption: 'Job submission sequence diagram. The four lifespans are nested: the SLURM job (gray) runs inside the runner task (yellow), which runs inside the global job (blue) monitored by the user (purple).',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The Road Ahead: Beyond the Proof of Concept',
      },
      {
        type: 'paragraph',
        text: 'The central limitation of this work is not technical but **regulatory**: the proposed decoupling requires a formal derogation from an explicit ZRR prohibition, and its acceptance by French HPC security authorities remains the next milestone toward full deployment.',
      },
      {
        type: 'paragraph',
        text: 'Operating the DDF Pipeline as a service on national infrastructure also surfaced three practical consequences:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '**Quality of service** — SLURM prioritizes accounts with low recent usage. With all users accessing resources through a single account, this creates significant allocation delays, so the fair-share policy for the named service account will need to be adapted.',
          '**Storage** — a single run generates hundreds of gigabytes, while supercomputer quotas are limited. Results must be transferred to an external source and working directories cleared after each run, which also limits how many jobs can run in parallel and motivates distributing jobs across multiple HPC systems.',
          '**Reproducibility** — step-level reproducibility is impractical for pipelines generating hundreds of gigabytes of intermediate products per run. We instead target **full-workflow reproducibility**, preserving input references, execution parameters, and environment specifications.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Cross-center executions of the DDF Pipeline between **Jean Zay and Adastra** have been validated, motivating future integration of cross-facility deployment [44] within the EB/AM framework. The named service account model remains under discussion with French HPC stakeholders, and future work will extend deployment to additional French supercomputers — **Adastra and Joliot-Curie**.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Conclusion',
      },
      {
        type: 'paragraph',
        text: 'Security should be an enabler of science, not a barrier. By shifting from a "user-access" model to a "service-access" model — and by separating the user’s identity from the executor’s identity — we can reconcile the ZRR’s accountability requirements with the way scientific communities actually work, and open French supercomputers to the radio astronomy community that needs them most.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'References',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          {
            id: 'ref-1',
            text: 'P. E. Dewdney, P. J. Hall, R. T. Schilizzi, and T. J. L. W. Lazio, [“The Square Kilometre Array,”](https://ieeexplore.ieee.org/abstract/document/5136190) Proc. IEEE, vol. 97, no. 8, pp. 1482–1496, Aug. 2009.',
          },
          {
            id: 'ref-2',
            text: 'GENCI, [“Grand Equipement National de Calcul Intensif (GENCI).”](https://www.genci.fr/connaitre-genci/notre-ecosysteme)',
          },
          {
            id: 'ref-3',
            text: 'CINES, [“Centre Informatique National de l’Enseignement Supérieur (CINES).”](https://www.genci.fr/centre-informatique-national-de-lenseignement-superieur-cines)',
          },
          {
            id: 'ref-4',
            text: 'CNRS, [“Institut du Développement et des Ressources en Informatique Scientifique (IDRIS).”](http://www.idris.fr/)',
          },
          {
            id: 'ref-5',
            text: 'CEA, [“Très Grand Centre de Calcul (TGCC).”](https://www-hpc.cea.fr/fr/TGCC.html)',
          },
          {
            id: 'ref-6',
            text: 'M. P. van Haarlem, M. W. Wise, A. W. Gunst, G. Heald, J. P. McKean, J. W. T. Hessels, et al., [“LOFAR: The LOw-Frequency ARray,”](https://www.aanda.org/articles/aa/abs/2013/08/aa20873-12/aa20873-12.html) Astron. Astrophys., vol. 556, p. A2, Aug. 2013.',
          },
          {
            id: 'ref-7',
            text: 'A. P. Mechev, J. B. R. Oonk, A. Plaat, A. Danezi, and T. W. Shimwell, [“Building LOFAR as a Service,”](https://www.aspbooks.org/a/volumes/article_details/?paper_id=39335) in Proc. Astronomical Data Anal. Softw. Syst. XXVIII (ADASS), vol. 523, San Francisco, CA, USA: Astronomical Society of the Pacific, 2019, p. 677.',
          },
          {
            id: 'ref-8',
            text: 'J. Templon and J. Bot, [“The Dutch National e-Infrastructure,”](https://pos.sissa.it/270/020) in Proc. Int. Symp. Grids Clouds (ISGC 2016), vol. 270, Taipei, Taiwan: SISSA Medialab, Jan. 2017, p. 020.',
          },
          {
            id: 'ref-9',
            text: 'I. P. Kemp, S. J. Tingay, S. D. Midgely, and D. A. Mitchell, [“Experiences of commercial supercomputing in radio astronomy data processing,”](https://www.sciencedirect.com/science/article/pii/S2213133725000861) Astron. Comput., vol. 54, p. 101013, Jan. 2026.',
          },
          {
            id: 'ref-10',
            text: 'Légifrance, [“Protection du Potentiel Scientifique et Technique (PPST),”](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049535465) Décret n° 2024-430 du 14 mai 2024.',
          },
          {
            id: 'ref-11',
            text: 'ANSSI, [“Protection du Potentiel Scientifique et Technique de la Nation (PPST),”](https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/protection-information-sensible-diffusion-restreinte/protection-du-potentiel-scientifique-et-technique-de-la-nation-ppst/) Agence nationale de la sécurité des systèmes d’information.',
          },
          {
            id: 'ref-12',
            text: 'GENCI, [“Modalités d’accès aux ressources nationales,”](https://www.genci.fr/sites/default/files/brique/fichier/09-2023/Modalitesdacces_1.pdf) Réf. CD230106, version 1.15, May 2023.',
          },
          {
            id: 'ref-13',
            text: 'Légifrance, [“Zones à Régime Restrictif (ZRR),”](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024750719/) Code pénal, Art. R413-5-1, 2025.',
          },
          {
            id: 'ref-14',
            text: 'A. B. Yoo, M. A. Jette, and M. Grondona, [“SLURM: Simple Linux Utility for Resource Management,”](https://link.springer.com/chapter/10.1007/10968987_3) in Proc. Workshop Job Scheduling Strategies for Parallel Processing (JSSPP), vol. 2862, Berlin, Germany: Springer, Jun. 2003, pp. 44–60.',
          },
          {
            id: 'ref-15',
            text: 'E. Deelman et al., [“The Evolution of the Pegasus Workflow Management Software,”](https://ieeexplore.ieee.org/abstract/document/8725518) Comput. Sci. Eng., vol. 21, no. 4, pp. 22–36, Jul. 2019.',
          },
          {
            id: 'ref-16',
            text: 'P. Di Tommaso, M. Chatzou, E. W. Floden, P. P. Barja, E. Palumbo, and C. Notredame, [“Nextflow enables reproducible computational workflows,”](https://www.nature.com/articles/nbt.3820) Nat. Biotechnol., vol. 35, no. 4, pp. 316–319, Apr. 2017.',
          },
          {
            id: 'ref-17',
            text: 'J. Köster and S. Rahmann, [“Snakemake—a scalable bioinformatics workflow engine,”](https://doi.org/10.1093/bioinformatics/bts480) Bioinformatics, vol. 28, no. 19, pp. 2520–2522, Oct. 2012.',
          },
          {
            id: 'ref-18',
            text: 'P. Calegari, M. Levrier, and P. Balczynski, [“Web Portals for High-performance Computing: A Survey,”](https://dl.acm.org/doi/10.1145/3197385) ACM Trans. Web, vol. 13, no. 1, pp. 5:1–5:36, Feb. 2019.',
          },
          {
            id: 'ref-19',
            text: 'M. Barker et al., [“The global impact of science gateways, virtual research environments and virtual laboratories,”](https://www.sciencedirect.com/science/article/pii/S0167739X18314018) Future Generation Computer Systems, vol. 95, pp. 240–248, Jun. 2019.',
          },
          {
            id: 'ref-20',
            text: 'I. Sfiligoi, [“glideinWMS—a generic pilot-based workload management system,”](https://doi.org/10.1088/1742-6596/119/6/062044) J. Phys.: Conf. Ser., vol. 119, no. 6, p. 062044, Jul. 2008.',
          },
          {
            id: 'ref-21',
            text: 'T. Maeno, [“PanDA: distributed production and distributed analysis system for ATLAS,”](https://doi.org/10.1088/1742-6596/119/6/062036) J. Phys.: Conf. Ser., vol. 119, no. 6, p. 062036, Jul. 2008.',
          },
          {
            id: 'ref-22',
            text: 'A. Casajus, R. Graciani, S. Paterson, A. Tsaregorodtsev, and LHCb DIRAC Collaboration, [“DIRAC pilot framework and the DIRAC Workload Management System,”](https://doi.org/10.1088/1742-6596/219/6/062049) J. Phys.: Conf. Ser., vol. 219, no. 6, p. 062049, Apr. 2010.',
          },
          {
            id: 'ref-23',
            text: 'R. Alfieri et al., [“From gridmap-file to VOMS: managing authorization in a Grid environment,”](https://www.sciencedirect.com/science/article/pii/S0167739X04001682) Future Gener. Comput. Syst., vol. 21, no. 4, pp. 549–558, Apr. 2005.',
          },
          {
            id: 'ref-24',
            text: 'R. Chard et al., [“funcX: A Federated Function Serving Fabric for Science,”](https://dl.acm.org/doi/10.1145/3369583.3392683) in Proc. 29th Int. Symp. High-Perform. Parallel Distrib. Comput. (HPDC ’20), Stockholm, Sweden, Jun. 2020, pp. 65–76.',
          },
          {
            id: 'ref-25',
            text: 'F. A. Cruz et al., [“FirecREST: a RESTful API to HPC systems,”](https://ieeexplore.ieee.org/abstract/document/9308083) in Proc. IEEE/ACM Int. Workshop Interoperability Supercomput. Cloud Technol. (SuperCompCloud), Nov. 2020, pp. 21–26.',
          },
          {
            id: 'ref-26',
            text: 'Globus, [“High Assurance Security Overview,”](https://docs.globus.org/guides/overviews/security/high-assurance-overview/) Globus documentation, University of Chicago.',
          },
          {
            id: 'ref-27',
            text: 'U.S. Code, [“Required preservation and disclosure of communications and records,”](https://www.law.cornell.edu/uscode/text/18/2713) 18 U.S.C. 2713, Legal Information Institute, Cornell Law School, Mar. 2018.',
          },
          {
            id: 'ref-28',
            text: 'L. Morin, F. Bodin, and G. Nyastikor, [“HPC Software as a Service: A Flexible Approach to Data Logistics,”](https://exatow.fenix.rudi-univ-rennes1.fr/storage/download/7c1d28c2-e963-45e4-b677-4253dfca0e0e) presented at the 3rd Int. Workshop on Scalable Compute Continuum (WSCC 2025), Dresden, Germany, Aug. 2025.',
          },
          {
            id: 'ref-29',
            text: 'L. Morin and G. Nyastikor, [“Application Microservices (AM),”](https://ebservice.aqmo.org/docs/ui) Online API documentation.',
          },
          {
            id: 'ref-30',
            text: 'L. Morin and G. Nyastikor, [“Ephemeral Buffers (EB),”](https://ebuffer.aqmo.org/docs/ui) Online API documentation.',
          },
          {
            id: 'ref-31',
            text: 'CINES, [“Adastra supercomputer user documentation.”](https://dci.dci-gitlab.cines.fr/webextranet/user_support/index.html)',
          },
          {
            id: 'ref-32',
            text: 'IDRIS, [“SSH access to the Jean Zay supercomputer.”](http://www.idris.fr/docs/jean-zay/gestion-compte/connexion-ssh/)',
          },
          {
            id: 'ref-33',
            text: 'C. Tasse et al., [“The LOFAR Two-meter Sky Survey: Deep Fields Data Release 1 - I. Direction-dependent calibration and imaging,”](https://www.aanda.org/articles/aa/abs/2021/04/aa38804-20/aa38804-20.html) Astron. Astrophys., vol. 648, p. A1, Apr. 2021.',
          },
          {
            id: 'ref-34',
            text: 'M. Hardcastle, T. Shimwell, C. Tasse, and W. Williams, [“DDF Pipeline source code,”](https://github.com/mhardcastle/ddf-pipeline) GitHub repository.',
          },
          {
            id: 'ref-35',
            text: 'C. Tasse, [“DDFacet source code: A facet-based radio imaging package,”](https://github.com/saopicc/DDFacet) GitHub repository.',
          },
          {
            id: 'ref-36',
            text: 'C. Tasse, [“killMS source code: A Wirtinger-based direction-dependent radio interferometric calibration package,”](https://github.com/saopicc/killMS) GitHub repository.',
          },
          {
            id: 'ref-37',
            text: 'M. Certenais, F. Bodin, and L. Morin, [“A description of the radio astronomy data processing tool DDF Pipeline,”](https://arxiv.org/abs/2509.03075) arXiv:2509.03075, Sep. 2025.',
          },
          {
            id: 'ref-38',
            text: 'CINES, [“Adastra supercomputer architecture.”](https://dci.dci-gitlab.cines.fr/webextranet/architecture/index.html)',
          },
          {
            id: 'ref-39',
            text: 'IDRIS-CNRS, [“Jean Zay supercomputer architecture.”](http://www.idris.fr/docs/jean-zay/jean-zay/jean-zay-hardware)',
          },
          {
            id: 'ref-40',
            text: 'TGCC-CEA, [“TGCC Public Documentation,”](https://www-hpc.cea.fr/tgcc-public/en/latex/tgcc-public.pdf) Sep. 2026.',
          },
          {
            id: 'ref-41',
            text: 'ECLAT, [“Extreme Computing Lab for Astronomical Telescopes (ECLAT).”](https://eclat-lab.fr/)',
          },
          {
            id: 'ref-42',
            text: 'N. Monnier et al., [“Multi-core multi-node parallelization of the radio interferometric imaging pipeline DDFacet,”](https://ieeexplore.ieee.org/document/9919239) in Proc. IEEE Workshop Signal Process. Syst. (SiPS), Rennes, France, Nov. 2022, pp. 1–6.',
          },
          {
            id: 'ref-43',
            text: 'P. Budroni, J.-C. Burgelman, and M. Schouppe, [“Architectures of Knowledge: The European Open Science Cloud,”](https://doi.org/10.1515/abitech-2019-2006) ABI Technik, vol. 39, no. 2, pp. 130–141, Jul. 2019.',
          },
          {
            id: 'ref-44',
            text: 'K. B. Antypas et al., [“Enabling discovery data science through cross-facility workflows,”](https://ieeexplore.ieee.org/document/9671421/) in Proc. IEEE Int. Conf. Big Data (Big Data), Orlando, FL, USA, Dec. 2021, pp. 3671–3680.',
          },
        ],
      },
    ],
    image: '/images/mathis/exascale-astronomy/ska.webp',
    imageAlt: 'The Square Kilometre Array radio telescope',
    href: '/writing/exascale-astronomy-cybersecurity',
  },

  {
    id: 'webinar-hpc-applications-as-a-service',
    number: '05',
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
    number: '06',
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
    image: '/images/mathis/international-hackathon-for-astronomy/cover.webp',
    imageAlt: 'Participants in the international DDF Pipeline and RIMS hackathon in Rennes',
    href: '/writing/international-hackathon-for-astronomy',
    sourceHref: sourceLinks.eclatHackathon,
  },
  {
    id: 'rennes-hackathon-for-astronomy',
    number: '07',
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
