import { identity } from './en.ts'
import type { ArticleId } from './en.ts'

/**
 * Machine-readable editorial records: what each page and each article is about,
 * who wrote it, which works it cites and which institutions and software it
 * names. `siteMetadata.ts` turns these into JSON-LD; nothing here is rendered
 * as prose.
 *
 * Three rules govern the data, and they are the reason some fields are absent
 * rather than filled:
 *
 * - A fact is copied from `en.ts`/`fr.ts`, from the route manifest, or from the
 *   git history of this repository. Nothing is inferred to make a field look
 *   complete.
 * - `sameAs` only repeats a URL that already appears in `src/content/*.ts`, and
 *   only when that URL identifies the same thing (an organisation's own page, a
 *   repository). A paper about an institution is not the institution.
 * - `license` is omitted on every article, so all inherit the site licence:
 *   Creative Commons Attribution 4.0.
 *
 * `dateModified` is the publication date printed on the article, except where a
 * later commit changed the article's own text — then it is that commit's date.
 * The two exceptions are noted inline.
 */

export type Language = 'en' | 'fr'
export type Localised<T> = Record<Language, T>
export type EntityType =
  | 'Organization'
  | 'SoftwareApplication'
  | 'Place'
  | 'Person'
  | 'Event'
  | 'Thing'

export interface Entity {
  name: string
  type: EntityType
  sameAs?: string
}

export interface Citation {
  id: string
  kind: 'doi' | 'arxiv' | 'url'
  value: string
  title?: string
}

export interface Author {
  name: string
  url?: string
}

export interface ArticleRecord {
  id: ArticleId
  schemaType: 'ScholarlyArticle' | 'Article'
  /** ISO YYYY-MM-DD. */
  dateModified: Localised<string>
  authors: Author[]
  keywords: Localised<string[]>
  citations: Citation[]
  entities: Entity[]
  /** 2–3 sentences, not a restatement of the title or the description. */
  aiSummary: Localised<string>
  /** Undefined inherits `site.license`; null means no licence. */
  license?: string | null
}

export interface PageRecord {
  /** English canonical path. */
  path: string
  keywords: Localised<string[]>
  entities: Entity[]
  aiSummary: Localised<string>
  dateModified: Localised<string | null>
}

/**
 * The person, the origin and the default licence of everything on the site.
 *
 * `affiliation` carries the organisation's own URL. `sameAs` lists the
 * identifiers the author supplied: LinkedIn, ORCID, HAL and Google Scholar.
 */
export const site = {
  origin: 'https://mathiscertenais.com',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  person: {
    name: 'Mathis Certenais',
    url: 'https://mathiscertenais.com/',
    affiliation: [
      { name: 'IRISA', url: 'https://irisa.fr/' },
      { name: 'Université de Rennes', url: 'https://www.univ-rennes.fr/' },
    ],
    sameAs: [
      identity.linkedin,
      'https://orcid.org/0009-0005-0659-5951',
      'https://hal.science/cv/mathiscertenais',
      'https://scholar.google.com/citations?user=94DSd4gAAAAJ&hl=en',
    ],
    includeEmail: true,
    email: identity.email,
  },
}

/**
 * No page has a revision date recorded anywhere in the repository. `null` means
 * the builder should omit `dateModified` rather than guess one from a build
 * timestamp or from the last commit to `en.ts`, which would claim every page
 * changed the same day.
 */
const noPageDate: Localised<string | null> = { en: null, fr: null }

export const pageRecords: PageRecord[] = [
  {
    path: '/',
    keywords: {
      en: [
        'high-performance computing',
        'scientific data logistics',
        'cross-facility workflows',
        'radio astronomy',
        'exascale',
        'research portfolio',
      ],
      fr: [
        'calcul haute performance',
        'logistique des données scientifiques',
        'workflows répartis entre plusieurs centres',
        'radioastronomie',
        'exascale',
        'portfolio de recherche',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'IRISA', type: 'Organization' },
      { name: 'Université de Rennes', type: 'Organization' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'SKA', type: 'Thing' },
      {
        name: 'GENCI',
        type: 'Organization',
        sameAs: 'https://www.genci.fr/connaitre-genci/notre-ecosysteme',
      },
    ],
    aiSummary: {
      en: 'Mathis Certenais is a doctoral researcher at IRISA and Université de Rennes, working on scientific data logistics for radio astronomy. The site gathers his thesis work on workflows that cross instruments, national supercomputers and research storage, twelve written entries in English and French, recorded talks, and a research profile built only from sources it names.',
      fr: 'Mathis Certenais est chercheur doctoral à l’IRISA et à l’Université de Rennes ; il travaille sur la logistique des données scientifiques pour la radioastronomie. Le site rassemble sa thèse sur les workflows qui traversent instruments, supercalculateurs nationaux et stockage de la recherche, douze articles en anglais et en français, des interventions enregistrées et un profil de recherche limité à des sources citées.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/research',
    keywords: {
      en: [
        'scientific data logistics',
        'cross-facility workflows',
        'exascale',
        'governance and security',
        'provenance and FAIR',
        'HPC as a service',
        'radio astronomy',
        'DDF Pipeline',
      ],
      fr: [
        'logistique des données scientifiques',
        'workflows répartis entre plusieurs centres',
        'exascale',
        'gouvernance et sécurité',
        'traçabilité et FAIR',
        'calcul intensif comme service',
        'radioastronomie',
        'DDF Pipeline',
      ],
    },
    entities: [
      { name: 'IRISA', type: 'Organization' },
      { name: 'Université de Rennes', type: 'Organization' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      {
        name: 'GENCI',
        type: 'Organization',
        sameAs: 'https://www.genci.fr/connaitre-genci/notre-ecosysteme',
      },
      {
        name: 'CINES',
        type: 'Organization',
        sameAs:
          'https://www.genci.fr/centre-informatique-national-de-lenseignement-superieur-cines',
      },
      { name: 'IDRIS', type: 'Organization', sameAs: 'http://www.idris.fr/' },
      { name: 'TGCC', type: 'Organization', sameAs: 'https://www-hpc.cea.fr/fr/TGCC.html' },
      { name: 'Alice Recoque', type: 'Thing' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'SKA', type: 'Thing' },
      { name: 'SURFsara', type: 'Organization' },
      { name: 'EOSC', type: 'Organization' },
    ],
    aiSummary: {
      en: 'The thesis, “Collaborative System of Systems for Scientific Data Logistics”, treats governance and security as constraints of the same rank as capacity and cost. It sets out five perspectives — modelling, multi-criteria optimisation, sovereignty, provenance and usability — and tests them on the DDF Pipeline, whose runtime fell from 68.8 hours on one node to 8.7 hours on 24.',
      fr: 'La thèse, « Systèmes de systèmes collaboratifs pour la logistique des données scientifiques », traite la gouvernance et la sécurité comme des contraintes de même rang que la capacité et le coût. Elle expose cinq perspectives — modélisation, optimisation multicritère, souveraineté, traçabilité et ergonomie — et les éprouve sur le DDF Pipeline, dont le temps d’exécution passe de 68,8 heures sur un nœud à 8,7 heures sur 24.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/insights',
    keywords: {
      en: [
        'research notes',
        'high-performance computing',
        'radio astronomy',
        'webinars',
        'research events',
        'scientific software',
      ],
      fr: [
        'notes de recherche',
        'calcul haute performance',
        'radioastronomie',
        'webinaires',
        'événements de recherche',
        'logiciels scientifiques',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'IRISA', type: 'Organization' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'SKA', type: 'Thing' },
    ],
    aiSummary: {
      en: 'Twelve entries, each published in English and French: the paper presented at the SC26 workshops on opening French supercomputers to radio astronomy, research notes on predicting job footprints and on exposing software parameters through an MCP server, plus reports from hackathons, a webinar and SC26 in Chicago. Categories run from Publication and Research note to Interview, Webinar, Event, Community, Collaboration and Side project.',
      fr: 'Douze entrées, publiées en anglais et en français : l’article présenté aux ateliers SC26 sur l’ouverture des supercalculateurs français à la radioastronomie, des notes de recherche sur la prédiction de l’empreinte des tâches et sur l’exposition des paramètres logiciels via MCP, ainsi que des comptes rendus de hackathons, d’un webinaire et de SC26 à Chicago. Les rubriques vont de Publication et Note de recherche à Entretien, Webinaire, Événement, Communauté, Collaboration et Projet personnel.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/videos',
    keywords: {
      en: [
        'ECLAT interview',
        'HPC webinar',
        'hackathon',
        'captions and transcripts',
        'radio astronomy',
      ],
      fr: [
        'entretien ECLAT',
        'webinaire de calcul haute performance',
        'hackathon',
        'sous-titres et transcriptions',
        'radioastronomie',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'SKA', type: 'Thing' },
    ],
    aiSummary: {
      en: 'Four recordings: an ECLAT interview on data logistics, a webinar on HPC application services for radio astronomy, highlights from an international hackathon in Rennes, and a silent demo of the MCP server for the DDF Pipeline. Each carries captions or a text alternative, and the two long talks are hosted outside this site.',
      fr: 'Quatre enregistrements : un entretien ECLAT sur la logistique des données, un webinaire sur les services applicatifs de calcul haute performance pour la radioastronomie, les temps forts d’un hackathon international à Rennes et une démonstration muette du serveur MCP du DDF Pipeline. Chacun dispose de sous-titres ou d’une alternative textuelle, et les deux interventions longues sont hébergées hors de ce site.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/about',
    keywords: {
      en: [
        'research profile',
        'multidisciplinarity',
        'high-performance computing',
        'radio astronomy',
        'IRISA',
        'Université de Rennes',
        'NumPEx',
        'ECLAT',
      ],
      fr: [
        'profil de recherche',
        'multidisciplinarité',
        'calcul haute performance',
        'radioastronomie',
        'IRISA',
        'Université de Rennes',
        'NumPEx',
        'ECLAT',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'IRISA', type: 'Organization' },
      { name: 'Université de Rennes', type: 'Organization' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'ESIR', type: 'Organization' },
      { name: 'UQAC', type: 'Organization' },
    ],
    aiSummary: {
      en: 'The page follows the route from engineering studies at ESIR and a one-year double degree at UQAC to research engineering on language models at IRISA, then to the doctorate within NumPEx and the ECLAT joint laboratory. It states three working principles, among them that complexity belongs behind a useful interface and that research should remain responsible.',
      fr: 'La page retrace le parcours : études d’ingénieur à l’ESIR, un an de double diplôme à l’UQAC, puis ingénierie de recherche sur les modèles de langue à l’IRISA, avant le doctorat au sein de NumPEx et du laboratoire commun ECLAT. Elle énonce trois principes de travail, dont celui que la complexité appartient à l’arrière d’une interface utile et que la recherche doit rester responsable.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/resume',
    keywords: {
      en: [
        'research profile',
        'publications',
        'presentations',
        'certifications',
        'expertise',
        'doctoral research',
      ],
      fr: [
        'profil de recherche',
        'publications',
        'présentations',
        'attestations',
        'expertise',
        'recherche doctorale',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'IRISA', type: 'Organization' },
      { name: 'Université de Rennes', type: 'Organization' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'EOSC Association', type: 'Organization' },
      { name: 'arXiv', type: 'Thing' },
    ],
    aiSummary: {
      en: 'The profile lists the doctoral research at IRISA and Université de Rennes, the arXiv preprint describing the DDF Pipeline, two ECLAT presentations and two EOSC Association certificates. Every item is drawn from a source the page names — the supplied website, the LinkedIn profile or public institutional pages.',
      fr: 'Le profil rassemble la recherche doctorale à l’IRISA et à l’Université de Rennes, la prépublication arXiv qui décrit le DDF Pipeline, deux présentations ECLAT et deux attestations de l’EOSC Association. Chaque élément provient d’une source citée par la page : le site fourni, le profil LinkedIn ou des pages institutionnelles publiques.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/contact',
    keywords: {
      en: ['contact', 'collaboration', 'research', 'Rennes', 'business card'],
      fr: ['contact', 'collaboration', 'recherche', 'Rennes', 'carte de visite'],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'IRISA', type: 'Organization' },
      { name: 'Université de Rennes', type: 'Organization' },
    ],
    aiSummary: {
      en: 'The contact page gives an email address, a LinkedIn profile and a business card carrying the IRISA and Université de Rennes affiliation, printed from the same markup the page displays. It is the route for research questions and collaboration proposals.',
      fr: 'La page de contact donne une adresse électronique, un profil LinkedIn et une carte de visite portant l’affiliation IRISA et Université de Rennes, imprimée depuis le balisage même que la page affiche. C’est le point d’entrée pour les questions de recherche et les propositions de collaboration.',
    },
    dateModified: noPageDate,
  },
  {
    path: '/accessibility',
    keywords: {
      en: [
        'accessibility',
        'RGAA 4.1',
        'WCAG AA',
        'audit',
        'captions',
        'keyboard navigation',
      ],
      fr: [
        'accessibilité',
        'RGAA 4.1',
        'WCAG AA',
        'audit',
        'sous-titres',
        'navigation au clavier',
      ],
    },
    entities: [
      { name: 'Mathis Certenais', type: 'Person', sameAs: identity.linkedin },
      { name: 'RGAA', type: 'Thing' },
      { name: 'WCAG', type: 'Thing' },
      { name: 'axe-core', type: 'SoftwareApplication' },
      { name: 'PeerTube', type: 'SoftwareApplication' },
      { name: 'LinkedIn', type: 'Organization' },
    ],
    aiSummary: {
      en: 'The statement lists what the October 2026 audit verified — contrast, heading structure, keyboard path, forms, reflow and captions — and what remains: a manual screen-reader review and audio description for the webinar. On the 79 applicable RGAA 4.1 criteria it reports 77 compliant, and calls the result a partial audit rather than a certification.',
      fr: 'La déclaration liste ce que l’audit d’octobre 2026 a vérifié — contrastes, structure des titres, parcours au clavier, formulaires, adaptation à la largeur et sous-titres — et ce qui reste à faire : une revue manuelle avec lecteur d’écran et l’audiodescription du webinaire. Sur les 79 critères RGAA 4.1 applicables, 77 sont conformes, et la page parle d’un audit partiel, non d’une certification.',
    },
    dateModified: noPageDate,
  },
]

const mathis: Author = { name: 'Mathis Certenais', url: 'https://mathiscertenais.com/' }

export const articleRecords: Record<ArticleId, ArticleRecord> = {
  'exascale-astronomy-cybersecurity': {
    id: 'exascale-astronomy-cybersecurity',
    schemaType: 'ScholarlyArticle',
    // Published 13 September 2026; the DOI sentence was added to the text on 22
    // November 2026 (commit 17dd9ef), in both languages.
    dateModified: { en: '2026-11-22', fr: '2026-11-22' },
    authors: [mathis],
    keywords: {
      en: [
        'high-performance computing',
        'cybersecurity',
        'ZRR',
        'PPST',
        'radio astronomy',
        'SKA',
        'HPC as a service',
        'scientific workflows',
        'GENCI',
      ],
      fr: [
        'calcul haute performance',
        'cybersécurité',
        'ZRR',
        'PPST',
        'radioastronomie',
        'SKA',
        'calcul intensif comme service',
        'workflows scientifiques',
        'GENCI',
      ],
    },
    citations: [
      {
        id: 'sc26-paper',
        kind: 'doi',
        value: '10.1109/SCW72768.2026.00093',
        title: 'Enabling Radio Astronomy to Use French Supercomputers',
      },
      {
        id: 'arxiv-2509-03075',
        kind: 'arxiv',
        value: '2509.03075',
        title: 'A description of the radio astronomy data processing tool DDF Pipeline',
      },
      {
        id: 'ddf-pipeline-repo',
        kind: 'url',
        value: 'https://github.com/mhardcastle/ddf-pipeline',
        title: 'DDF Pipeline source code',
      },
      {
        id: 'ddfacet-repo',
        kind: 'url',
        value: 'https://github.com/saopicc/DDFacet',
        title: 'DDFacet source code',
      },
      {
        id: 'killms-repo',
        kind: 'url',
        value: 'https://github.com/saopicc/killMS',
        title: 'killMS source code',
      },
    ],
    entities: [
      { name: 'SKA', type: 'Thing' },
      { name: 'LOFAR', type: 'Thing' },
      {
        name: 'GENCI',
        type: 'Organization',
        sameAs: 'https://www.genci.fr/connaitre-genci/notre-ecosysteme',
      },
      {
        name: 'CINES',
        type: 'Organization',
        sameAs:
          'https://www.genci.fr/centre-informatique-national-de-lenseignement-superieur-cines',
      },
      { name: 'IDRIS', type: 'Organization', sameAs: 'http://www.idris.fr/' },
      { name: 'TGCC', type: 'Organization', sameAs: 'https://www-hpc.cea.fr/fr/TGCC.html' },
      { name: 'ANSSI', type: 'Organization' },
      { name: 'SURFsara', type: 'Organization' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'Alice Recoque', type: 'Thing' },
      { name: 'SC26', type: 'Event' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      {
        name: 'DDFacet',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/saopicc/DDFacet',
      },
      {
        name: 'killMS',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/saopicc/killMS',
      },
    ],
    aiSummary: {
      en: 'French national supercomputers are strategic assets inside restrictive zones, where access is nominative and responsibility cannot be delegated, so a community pipeline cannot be operated from one shared account. The paper decouples the user’s identity from the executor’s: a maintainer holds a named service account limited to one validated application and a whitelist of authorised users. Run this way on Jean Zay, the DDF Pipeline falls from 68.8 hours to 8.7 hours across 24 nodes, and the model still awaits a derogation from the ZRR rules.',
      fr: 'En France, les supercalculateurs nationaux sont des actifs stratégiques enfermés dans des zones à régime restrictif : l’accès y est nominatif et la responsabilité ne se délègue pas, si bien qu’un logiciel communautaire ne peut pas s’exploiter depuis un compte partagé. L’article découple l’identité de l’utilisateur de celle de l’exécutant : un mainteneur détient un compte de service nommé, limité à une application validée, avec une liste blanche d’utilisateurs autorisés. Ainsi exécuté sur Jean Zay, le DDF Pipeline passe de 68,8 heures à 8,7 heures sur 24 nœuds ; le modèle attend encore une dérogation au régime ZRR.',
    },
  },

  'sc26-europe': {
    id: 'sc26-europe',
    schemaType: 'Article',
    // Published and last edited on 22 November 2026 (commit 0a1bd6f).
    dateModified: { en: '2026-11-22', fr: '2026-11-22' },
    authors: [mathis],
    keywords: {
      en: [
        'SC26',
        'exascale',
        'EuroHPC',
        'JUPITER',
        'MareNostrum 5',
        'SKA',
        'sovereignty',
        'high-performance computing',
        'radio astronomy',
      ],
      fr: [
        'SC26',
        'exascale',
        'EuroHPC',
        'JUPITER',
        'MareNostrum 5',
        'SKA',
        'souveraineté',
        'calcul haute performance',
        'radioastronomie',
      ],
    },
    citations: [
      {
        id: 'sc26-site',
        kind: 'url',
        value: 'https://sc26.supercomputing.org',
      },
    ],
    entities: [
      { name: 'SC26', type: 'Event', sameAs: 'https://sc26.supercomputing.org' },
      { name: 'EuroHPC Joint Undertaking', type: 'Organization' },
      { name: 'JUPITER', type: 'Thing' },
      { name: 'Forschungszentrum Jülich', type: 'Organization' },
      { name: 'MareNostrum 5', type: 'Thing' },
      { name: 'Barcelona Supercomputing Center', type: 'Organization' },
      { name: 'PSNC', type: 'Organization' },
      {
        name: 'GENCI',
        type: 'Organization',
        sameAs: 'https://www.genci.fr/connaitre-genci/notre-ecosysteme',
      },
      { name: 'Jean Zay', type: 'Thing' },
      { name: 'Adastra', type: 'Thing' },
      { name: 'Joliot-Curie', type: 'Thing' },
      { name: 'Alice Recoque', type: 'Thing' },
      { name: 'SKA', type: 'Thing' },
      { name: 'LOFAR', type: 'Thing' },
    ],
    aiSummary: {
      en: 'Notes from SC26 in Chicago, where France, Spain, Germany and Poland shared one table: Jean Zay, Adastra, Joliot-Curie and Alice Recoque, MareNostrum 5, JUPITER and PSNC. The argument is that pooling investment buys the machine but not the access regime, and that the SKA, at roughly 700 PB of science-ready data a year, is the workload that tests it. Sovereignty is both why Europe builds these systems and the constraint on who may use them.',
      fr: 'Notes prises à SC26, à Chicago, où la France, l’Espagne, l’Allemagne et la Pologne partageaient une même table : Jean Zay, Adastra, Joliot-Curie et Alice Recoque, MareNostrum 5, JUPITER et le PSNC. L’argument : la mise en commun des investissements finance la machine, pas le régime d’accès, et le SKA, avec environ 700 Po de données exploitables par an, est la charge qui l’éprouve. La souveraineté est à la fois la raison de construire ces systèmes et la contrainte sur qui peut les utiliser.',
    },
  },

  'predicting-for-sizing': {
    id: 'predicting-for-sizing',
    schemaType: 'Article',
    // Published 23 September 2026; no later change to the text.
    dateModified: { en: '2026-09-23', fr: '2026-09-23' },
    authors: [mathis],
    keywords: {
      en: [
        'execution time prediction',
        'machine learning',
        'job sizing',
        'energy consumption',
        'SLURM',
        'DDF Pipeline',
        'HPC Application Services',
        'provenance',
      ],
      fr: [
        'prédiction du temps d’exécution',
        'apprentissage automatique',
        'dimensionnement des tâches',
        'consommation d’énergie',
        'SLURM',
        'DDF Pipeline',
        'services applicatifs de calcul haute performance',
        'traçabilité',
      ],
    },
    citations: [],
    entities: [
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'LoTSS', type: 'Thing' },
      { name: 'SLURM', type: 'SoftwareApplication' },
      { name: 'HAPS', type: 'SoftwareApplication' },
      { name: 'JoPInS', type: 'Thing' },
      { name: 'Adastra', type: 'Thing' },
      { name: 'Jean Zay', type: 'Thing' },
      { name: 'Joliot-Curie', type: 'Thing' },
    ],
    aiSummary: {
      en: 'A scheduler asks researchers to declare time, cores and memory before a run, while the DDF Pipeline’s footprint moves by an order of magnitude with image size, input volume and sub-band count. The article describes a loop that measures real executions into a JoPInS record, stores them, and trains a model per application version and runtime environment, exposed as a service inside the ZRR. The target is the allocation that best trades execution time against energy, decided before a core-hour is spent.',
      fr: 'Un ordonnanceur demande aux chercheurs de déclarer temps, cœurs et mémoire avant l’exécution, alors que l’empreinte du DDF Pipeline varie d’un ordre de grandeur selon la taille de l’image, le volume d’entrée et le nombre de sous-bandes. L’article décrit une boucle qui mesure les exécutions réelles dans un enregistrement JoPInS, les stocke, puis entraîne un modèle par version d’application et par environnement d’exécution, exposé comme service à l’intérieur de la ZRR. L’objectif est l’allocation qui arbitre au mieux entre temps d’exécution et énergie, décidée avant la première heure de calcul.',
    },
  },

  'eclat-interview': {
    id: 'eclat-interview',
    schemaType: 'Article',
    // The article prints "September 2025" and the repository records no day, so
    // this is a month anchor, not a verified publication date.
    dateModified: { en: '2025-09-01', fr: '2025-09-01' },
    authors: [mathis],
    keywords: {
      en: [
        'interview',
        'ECLAT',
        'data logistics',
        'radio astronomy',
        'multidisciplinarity',
        'NumPEx',
        'doctoral research',
        'SKA',
      ],
      fr: [
        'entretien',
        'ECLAT',
        'logistique des données',
        'radioastronomie',
        'multidisciplinarité',
        'NumPEx',
        'recherche doctorale',
        'SKA',
      ],
    },
    citations: [
      {
        id: 'eclat-interview',
        kind: 'url',
        value:
          'https://eclat-lab.fr/en/at-the-heart-of-data-logistics-for-astronomy-interview-with-mathis/',
        title: 'Interview: At the Heart of Data Logistics for Radio Astronomy',
      },
    ],
    entities: [
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'IRISA', type: 'Organization' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      {
        name: 'YoungPEx',
        type: 'Organization',
        sameAs: 'https://numpex.org/youngpex/',
      },
      { name: 'SKA', type: 'Thing' },
      { name: 'ESIR', type: 'Organization' },
      { name: 'UQAC', type: 'Organization' },
    ],
    aiSummary: {
      en: 'An ECLAT interview in which Mathis Certenais describes his route from ESIR in Rennes and a double degree at UQAC to research engineering at IRISA, then to a doctorate on collaborative systems of systems. He explains what data logistics means once instruments produce more than one site can absorb, why ECLAT pairs computer scientists with astrophysicists, and what YoungPEx adds to NumPEx.',
      fr: 'Un entretien ECLAT dans lequel Mathis Certenais raconte son parcours, de l’ESIR à Rennes et d’un double diplôme à l’UQAC jusqu’à l’ingénierie de recherche à l’IRISA, puis à une thèse sur les systèmes de systèmes collaboratifs. Il y explique ce que devient la logistique des données quand les instruments produisent plus qu’un site ne peut absorber, pourquoi ECLAT associe informaticiens et astrophysiciens, et ce que YoungPEx apporte à NumPEx.',
    },
  },

  youngpex: {
    id: 'youngpex',
    schemaType: 'Article',
    // Published 12 October 2026; no later change to the text.
    dateModified: { en: '2026-10-12', fr: '2026-10-12' },
    authors: [mathis],
    keywords: {
      en: [
        'YoungPEx',
        'NumPEx',
        'exascale',
        'early-career researchers',
        'environmental impact',
        'Impacts-HPC',
        'LLM survey',
        'academic careers',
      ],
      fr: [
        'YoungPEx',
        'NumPEx',
        'exascale',
        'jeunes chercheurs',
        'empreinte environnementale',
        'Impacts-HPC',
        'enquête sur les LLM',
        'carrières académiques',
      ],
    },
    citations: [
      {
        id: 'youngpex-page',
        kind: 'url',
        value: 'https://numpex.org/youngpex/',
        title: 'YoungPEx',
      },
      {
        id: 'matapli-139',
        kind: 'url',
        value: 'https://www.ceremade.dauphine.fr/~chupin/Matapli/139/Matapli139.pdf',
        title: 'MATAPLI, issue 139',
      },
    ],
    entities: [
      {
        name: 'YoungPEx',
        type: 'Organization',
        sameAs: 'https://numpex.org/youngpex/',
      },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'INP-ENSEEIHT', type: 'Organization' },
      { name: 'IRIT', type: 'Organization' },
      { name: 'Université de Toulouse', type: 'Organization' },
      {
        name: 'Impacts-HPC',
        type: 'SoftwareApplication',
        sameAs: 'https://impacthpc-cc8227.pages.in2p3.fr/index.html',
      },
      { name: 'Grid’5000', type: 'Thing', sameAs: 'https://www.grid5000.fr' },
      { name: 'MATAPLI', type: 'Thing' },
      {
        name: 'Observatoire des inégalités',
        type: 'Organization',
        sameAs: 'https://www.inegalites.fr/',
      },
    ],
    aiSummary: {
      en: 'YoungPEx is the working group of junior researchers inside NumPEx: 53 members on its Discord, 27 at its first General Assembly in Toulouse in November 2025. The account covers that assembly’s two workshops — measuring the environmental impact of computing, with Impacts-HPC and MOJITO/S, and social and gender inequalities in academia — plus a survey of LLM use in coding and an overview in MATAPLI issue 139.',
      fr: 'YoungPEx est le groupe de travail des jeunes chercheurs de NumPEx : 53 membres sur son serveur Discord, 27 à sa première assemblée générale à Toulouse en novembre 2025. Le compte rendu couvre les deux ateliers de cette assemblée — mesurer l’empreinte environnementale du calcul, avec Impacts-HPC et MOJITO/S, et les inégalités sociales et de genre dans la recherche — ainsi qu’une enquête sur les LLM pour le code et un panorama paru dans MATAPLI n° 139.',
    },
  },

  'ai-lab-virtual-running-coach': {
    id: 'ai-lab-virtual-running-coach',
    schemaType: 'Article',
    // Published 26 October 2026; the physiotherapy report section was added on
    // 28 October 2026 (commit bfc8434).
    dateModified: { en: '2026-10-28', fr: '2026-10-28' },
    authors: [mathis],
    keywords: {
      en: [
        'open source',
        'running',
        'AI agents',
        'data logistics',
        'local-first',
        'training load',
        'AGPL-3.0',
        'side project',
      ],
      fr: [
        'open source',
        'course à pied',
        'agents IA',
        'logistique des données',
        'traitement local',
        'charge d’entraînement',
        'AGPL-3.0',
        'projet personnel',
      ],
    },
    citations: [
      {
        id: 'open-running-coach-repo',
        kind: 'url',
        value: 'https://github.com/MathisCertenais/open-running-coach',
        title: 'Open Running Coach source code',
      },
      {
        id: 'engineering-skills',
        kind: 'url',
        value: 'https://www.aihero.dev/skills-grill-me',
        title: 'The engineering skills used to build it',
      },
    ],
    entities: [
      {
        name: 'Open Running Coach',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/MathisCertenais/open-running-coach',
      },
      { name: 'OpenCode', type: 'SoftwareApplication' },
      {
        name: 'OpenTracks',
        type: 'SoftwareApplication',
        sameAs: 'https://f-droid.org/en/packages/de.dennisguse.opentracks.playstore/',
      },
      { name: 'IRISA', type: 'Organization' },
    ],
    aiSummary: {
      en: 'A knee injury and a folder of GPS files led to an open-source virtual running coach that computes VO2max, training load and injury signals on the laptop, with no account and no cloud. The article is also a case study of the method: one orchestrator, eight specialist agents with disjoint ownership, and a cost model that spends the expensive model on decisions and the cheap one on execution. The report it exports for a physiotherapist is what makes the collected data worth keeping.',
      fr: 'Une blessure au genou et un dossier de fichiers GPS ont donné naissance à un coach de course open source qui calcule VO2max, charge d’entraînement et signaux de blessure sur l’ordinateur portable, sans compte ni cloud. L’article est aussi l’étude de cas d’une méthode : un orchestrateur, huit agents spécialisés aux périmètres disjoints, et un modèle de coût qui réserve le modèle cher aux décisions et le moins cher à l’exécution. L’export destiné au kinésithérapeute est ce qui rend ces données dignes d’être conservées.',
    },
  },

  'mcp-server-software-ontology': {
    id: 'mcp-server-software-ontology',
    schemaType: 'Article',
    // Published 16 September 2026; no later change to the text.
    dateModified: { en: '2026-09-16', fr: '2026-09-16' },
    authors: [mathis],
    keywords: {
      en: [
        'MCP',
        'ontology',
        'scientific software',
        'DDF Pipeline',
        'vector database',
        'natural language',
        'knowledge map',
        'LOFAR',
      ],
      fr: [
        'MCP',
        'ontologie',
        'logiciels scientifiques',
        'DDF Pipeline',
        'base vectorielle',
        'langage naturel',
        'carte de connaissances',
        'LOFAR',
      ],
    },
    citations: [
      {
        id: 'ddf-pipeline-repo',
        kind: 'url',
        value: 'https://github.com/mhardcastle/ddf-pipeline',
        title: 'DDF Pipeline source code',
      },
      {
        id: 'lotss-dr3',
        kind: 'url',
        value: 'https://ui.adsabs.harvard.edu/abs/2026A%26A...707A.198S/abstract',
        title: 'LoTSS Data Release 3',
      },
    ],
    entities: [
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'LoTSS', type: 'Thing' },
      { name: 'Model Context Protocol', type: 'Thing' },
      { name: 'Ragarenn', type: 'SoftwareApplication' },
      { name: 'eduGAIN', type: 'Organization' },
      { name: 'OpenCode', type: 'SoftwareApplication' },
      { name: 'Claude Code', type: 'SoftwareApplication' },
    ],
    aiSummary: {
      en: 'The DDF Pipeline takes hundreds of configuration parameters whose meaning lives in the source code and in the heads of a few maintainers. The article describes a structured knowledge map of that parameter space, embedded in a vector database and exposed through a Model Context Protocol server, so a coding assistant answers from the code rather than from its training data. A strict mode refuses any parameter the map does not define.',
      fr: 'Le DDF Pipeline compte des centaines de paramètres de configuration dont le sens vit dans le code source et dans la tête de quelques mainteneurs. L’article décrit une carte de connaissances structurée de cet espace de paramètres, indexée dans une base vectorielle et exposée par un serveur MCP (Model Context Protocol), pour qu’un assistant de programmation réponde depuis le code et non depuis ses données d’entraînement. Un mode strict refuse tout paramètre absent de la carte.',
    },
  },

  'international-hackathon-for-astronomy': {
    id: 'international-hackathon-for-astronomy',
    schemaType: 'Article',
    // Published 1 April 2026; no later change to the text.
    dateModified: { en: '2026-04-01', fr: '2026-04-01' },
    authors: [mathis],
    keywords: {
      en: [
        'hackathon',
        'RIMS Network',
        'DDF Pipeline',
        'radio astronomy',
        'international collaboration',
        'IDRIS',
        'CINES',
        'University of Hertfordshire',
      ],
      fr: [
        'hackathon',
        'RIMS Network',
        'DDF Pipeline',
        'radioastronomie',
        'collaboration internationale',
        'IDRIS',
        'CINES',
        'University of Hertfordshire',
      ],
    },
    citations: [
      {
        id: 'eclat-hackathon',
        kind: 'url',
        value: 'https://eclat-lab.fr/en/international-hackathon-in-rennes-on-ddfacet-and-rims/',
      },
    ],
    entities: [
      { name: 'RIMS Network', type: 'Thing' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'IDRIS', type: 'Organization', sameAs: 'http://www.idris.fr/' },
      {
        name: 'CINES',
        type: 'Organization',
        sameAs:
          'https://www.genci.fr/centre-informatique-national-de-lenseignement-superieur-cines',
      },
      { name: 'University of Hertfordshire', type: 'Organization' },
      { name: 'Bull', type: 'Organization' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
    ],
    aiSummary: {
      en: 'A one-week hackathon in Rennes that brought computer scientists and astrophysicists from France, England and South Africa onto two shared objects: RIMS Network, a distributed store for dynamic spectra and their metadata, and the DDF Pipeline. By the end the parallel pipeline ran on Jean Zay at IDRIS, Adastra at CINES, the University of Hertfordshire and with the industry partner Bull, while RIMS had a general architecture across the three countries and a proof of concept.',
      fr: 'Un hackathon d’une semaine à Rennes, qui a réuni informaticiens et astrophysiciens de France, d’Angleterre et d’Afrique du Sud autour de deux objets communs : RIMS Network, un stockage distribué pour les spectres dynamiques et leurs métadonnées, et le DDF Pipeline. À l’issue de la semaine, le pipeline parallèle tournait sur Jean Zay à l’IDRIS, Adastra au CINES, à l’University of Hertfordshire et chez le partenaire industriel Bull, tandis que RIMS disposait d’une architecture générale entre les trois pays et d’une preuve de concept.',
    },
  },

  'webinar-hpc-applications-as-a-service': {
    id: 'webinar-hpc-applications-as-a-service',
    schemaType: 'Article',
    // Published 13 February 2026; no later change to the text.
    dateModified: { en: '2026-02-13', fr: '2026-02-13' },
    authors: [mathis],
    keywords: {
      en: [
        'webinar',
        'HPC as a service',
        'DDF Pipeline',
        'radio astronomy',
        'SKA',
        'workflow orchestration',
        'data logistics',
      ],
      fr: [
        'webinaire',
        'calcul intensif comme service',
        'DDF Pipeline',
        'radioastronomie',
        'SKA',
        'orchestration de workflows',
        'logistique des données',
      ],
    },
    citations: [
      {
        id: 'eclat-webinar',
        kind: 'url',
        value: 'https://eclat-lab.fr/webinaire-hpc-as-a-service-for-radio-astronomy/',
        title:
          'HPC as a Service for Radio Astronomy: A Practical Case Study with the DDF Software',
      },
    ],
    entities: [
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'SKA', type: 'Thing' },
      { name: 'HPC Application Services', type: 'Thing' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
    ],
    aiSummary: {
      en: 'A webinar that walks through HPC applications as a service using the DDF Pipeline as its case: how data logistics, intensive imaging and workflow orchestration fit together when the machine is a national supercomputer. The premise is that a domain researcher should not have to reproduce operational knowledge for every run, and that the interface has to stay understandable to an astronomer.',
      fr: 'Un webinaire qui présente les applications scientifiques comme service à travers le cas du DDF Pipeline : comment logistique des données, imagerie intensive et orchestration de workflows s’articulent quand la machine est un supercalculateur national. Le point de départ : un chercheur du domaine ne devrait pas avoir à reproduire un savoir opérationnel à chaque exécution, et l’interface doit rester compréhensible pour un astronome.',
    },
  },

  'rennes-hackathon-for-astronomy': {
    id: 'rennes-hackathon-for-astronomy',
    schemaType: 'Article',
    // Published 1 October 2025; no later change to the text.
    dateModified: { en: '2025-10-01', fr: '2025-10-01' },
    authors: [mathis],
    keywords: {
      en: [
        'hackathon',
        'Spack',
        'DDF Pipeline',
        'DDFacet',
        'tutorials',
        'Bull',
        'LOFAR',
        'radio astronomy',
      ],
      fr: [
        'hackathon',
        'Spack',
        'DDF Pipeline',
        'DDFacet',
        'tutoriels',
        'Bull',
        'LOFAR',
        'radioastronomie',
      ],
    },
    citations: [
      {
        id: 'ddfacet-tutorials',
        kind: 'url',
        value: 'https://hackmd.io/l8fw0PYRQv6dm9i6KpZWPA',
        title: 'Tutorials for DDFacet',
      },
    ],
    entities: [
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      { name: 'Spack', type: 'SoftwareApplication' },
      {
        name: 'DDFacet',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/saopicc/DDFacet',
      },
      { name: 'Bull', type: 'Organization' },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
    ],
    aiSummary: {
      en: 'A technical hackathon in Rennes with two goals: getting the DDF Pipeline installed through Spack on supercomputers, and writing tutorials for DDFacet so that astronomers can use it. An engineer from Bull sat with the team to configure Spack instead of sending documentation, which left the team able to maintain the installation itself.',
      fr: 'Un hackathon technique à Rennes avec deux objectifs : installer le DDF Pipeline via Spack sur des supercalculateurs, et écrire des tutoriels pour DDFacet afin que les astronomes puissent s’en servir. Un ingénieur de Bull s’est installé avec l’équipe pour configurer Spack au lieu d’envoyer de la documentation, ce qui a laissé l’équipe capable d’entretenir elle-même l’installation.',
    },
  },

  'autonomous-science-agentic-ai': {
    id: 'autonomous-science-agentic-ai',
    schemaType: 'Article',
    dateModified: { en: '2026-11-23', fr: '2026-11-23' },
    authors: [mathis],
    keywords: {
      en: [
        'agentic AI',
        'autonomous science',
        'scientific workflows',
        'human-in-the-loop',
        'PPST',
        'ZRR',
        'exascale',
        'cross-facility workflows',
      ],
      fr: [
        'IA agentique',
        'science autonome',
        'workflows scientifiques',
        'humain dans la boucle',
        'PPST',
        'ZRR',
        'exascale',
        'workflows inter-sites',
      ],
    },
    citations: [
      {
        id: 'antypas-2021',
        kind: 'url',
        value: 'https://ieeexplore.ieee.org/document/9671421/',
        title: 'Enabling discovery data science through cross-facility workflows',
      },
    ],
    entities: [
      { name: 'IRISA', type: 'Organization' },
      { name: 'GENCI', type: 'Organization' },
      { name: 'IDRIS', type: 'Organization' },
      { name: 'CINES', type: 'Organization' },
      { name: 'TGCC', type: 'Organization' },
      { name: 'EOSC', type: 'Organization' },
      { name: 'SIESTA', type: 'SoftwareApplication' },
      { name: 'CP2K', type: 'SoftwareApplication' },
      { name: 'GROMACS', type: 'SoftwareApplication' },
      { name: 'DDF Pipeline', type: 'SoftwareApplication' },
      { name: 'PPST', type: 'Thing' },
      { name: 'ZRR', type: 'Thing' },
    ],
    aiSummary: {
      en: 'The article describes a framework where an agent turns an experiment into a task board with explicit dependencies, the scientist signs the plan once, and the framework compiles it into jobs across TGCC, IDRIS and CINES. It argues that on French supercomputers the signature is not a formality but the legal act that assigns responsibility under PPST/ZRR, so the human stays in the loop before and during execution. The closing case study splits a SIESTA experiment across the three centres, with a single-centre reference run to check the product.',
      fr: 'L’article décrit un cadre où un agent transforme une expérience en tableau de tâches aux dépendances explicites, où le scientifique signe le plan une fois, et où le framework le compile en jobs sur TGCC, IDRIS et CINES. Il soutient que, sur les supercalculateurs français, la signature n’est pas une formalité mais l’acte juridique qui attribue la responsabilité au titre du PPST et de la ZRR : l’humain reste donc dans la boucle avant et pendant l’exécution. L’étude de cas finale répartit une expérience SIESTA sur les trois centres, avec une exécution de référence sur un seul centre pour contrôler le produit.',
    },
  },

  'astra-ddf-pipeline': {
    id: 'astra-ddf-pipeline',
    schemaType: 'Article',
    dateModified: { en: '2026-11-26', fr: '2026-11-26' },
    authors: [mathis],
    keywords: {
      en: [
        'high-performance computing',
        'DDF Pipeline',
        'SKA',
        'LOFAR',
        'ASTRA',
        'radio astronomy',
        'MPI',
        'profiling',
        'ECLAT',
      ],
      fr: [
        'calcul haute performance',
        'DDF Pipeline',
        'SKA',
        'LOFAR',
        'ASTRA',
        'radioastronomie',
        'MPI',
        'profilage',
        'ECLAT',
      ],
    },
    citations: [
      {
        id: 'arxiv-2509-03075',
        kind: 'arxiv',
        value: '2509.03075',
        title: 'A description of the radio astronomy data processing tool DDF Pipeline',
      },
      {
        id: 'sc26-paper',
        kind: 'doi',
        value: '10.1109/SCW72768.2026.00093',
        title: 'Enabling Radio Astronomy to Use French Supercomputers',
      },
      {
        id: 'ddf-pipeline-repo',
        kind: 'url',
        value: 'https://github.com/mhardcastle/ddf-pipeline',
        title: 'DDF Pipeline source code',
      },
      {
        id: 'astra-site',
        kind: 'url',
        value: 'https://numpex-astra-e5d484.padcpages.obspm.fr/',
      },
    ],
    entities: [
      {
        name: 'ASTRA',
        type: 'Organization',
        sameAs: 'https://numpex-astra-e5d484.padcpages.obspm.fr/',
      },
      { name: 'ECLAT', type: 'Organization', sameAs: 'https://eclat-lab.fr/' },
      { name: 'NumPEx', type: 'Organization', sameAs: 'https://numpex.org/' },
      { name: 'SKA', type: 'Thing' },
      { name: 'LOFAR', type: 'Thing' },
      { name: 'LoTSS', type: 'Thing' },
      {
        name: 'DDF Pipeline',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/mhardcastle/ddf-pipeline',
      },
      {
        name: 'DDFacet',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/saopicc/DDFacet',
      },
      {
        name: 'killMS',
        type: 'SoftwareApplication',
        sameAs: 'https://github.com/saopicc/killMS',
      },
      { name: 'Jean Zay', type: 'Thing' },
      {
        name: 'GENCI',
        type: 'Organization',
        sameAs: 'https://www.genci.fr/connaitre-genci/notre-ecosysteme',
      },
      { name: 'IRISA', type: 'Organization' },
    ],
    aiSummary: {
      en: 'The article locates the DDF Pipeline inside the collaboration hardening it: ECLAT, the joint laboratory for HPC and AI applied to astronomical instrumentation, and ASTRA, the ANR–NumPEx project preparing the French SKA Regional Centre. Read as data logistics, the workflow moves a pointing through five steps, from LOFAR archive sites to a catalogue of four million sources; read as a resource budget, one run consumes 38.72 GB compressed and produces 594 GB in 68.8 hours. The parallel version cuts that to 8.7 hours on 24 Jean Zay nodes at 31 % CPU.',
      fr: 'L’article situe le DDF Pipeline dans la collaboration qui le consolide : ECLAT, le laboratoire commun du calcul haute performance et de l’IA appliqués à l’instrumentation astronomique, et ASTRA, le projet ANR–NumPEx qui prépare le centre régional SKA français. Lu comme une logistique de données, le workflow fait traverser un pointé en cinq étapes, des sites d’archive de LOFAR jusqu’à un catalogue de quatre millions de sources ; lu comme un budget de ressources, une exécution consomme 38,72 Go compressés et produit 594 Go en 68,8 heures. La version parallèle ramène ce temps à 8,7 heures sur 24 nœuds de Jean Zay à 31 % de CPU.',
    },
  },
}
