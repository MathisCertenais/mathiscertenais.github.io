import type {
  ArticleItem,
  ProofPoint,
  ResearchChainStep,
  ResearchChapter,
  ResearchFigure,
  ResearchPerspective,
  VideoItem,
} from './en.ts'
import { articleItems as englishArticles, videoItems as englishVideos } from './en.ts'

/**
 * Contenu français du site.
 *
 * Deux principes : dire les choses en français plutôt que les calquer, et ne
 * rien inventer. « Workflow » devient « chaîne de traitement », « storage »
 * devient « stockage », « HPC » s'écrit « calcul haute performance » dans la
 * prose. Les noms propres, les sigles institutionnels (IRISA, NumPEx, ECLAT,
 * SKA, LOFAR, GENCI, CINES, IDRIS, TGCC) et les titres d'œuvres restent
 * inchangés.
 *
 * Les corps des huit articles ne sont pas encore traduits : ils sont empruntés
 * au module anglais, et leurs routes françaises n'existent pas encore. C'est le
 * prochain lot de la campagne.
 */

export const identity = {
  name: 'Mathis Certenais',
  shortRole: 'Chercheur en informatique · Doctorant',
  headline: ['Logistique des données.', 'Workflows à l’exascale.'],
  description:
    'Chercheur en informatique travaillant sur le calcul haute performance et les chaînes de traitement scientifiques réparties entre plusieurs centres, pour la radioastronomie.',
  location: 'Rennes, Bretagne, France',
  email: 'mathiscertenais@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mathiscertenais/',
} as const

export const businessCard = {
  affiliation: 'Doctorant · IRISA, Université de Rennes · Ingénieur diplômé',
  tagline: 'Calcul haute performance · Chaînes de traitement · Logistique des données · IA',
  phone: '+33 6 48 22 83 30',
  phoneHref: 'tel:+3364822830',
  linkedinLabel: 'linkedin.com/in/mathiscertenais',
  website: 'https://mathiscertenais.com',
  websiteLabel: 'mathiscertenais.com',
  portrait: '/images/mathis/mathis-portrait.webp',
  qr: '/images/mathis/qr/mathiscertenais-com.svg',
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

export const proofPoints: ProofPoint[] = [
  {
    kind: 'community',
    title: 'Recherche doctorale',
    description:
      'Spécialisé dans la gestion des données des chaînes de traitement, avec un accent sur la gouvernance et la cybersécurité dans les environnements de calcul intensif.',
  },
  {
    kind: 'mentor',
    title: 'Travaux publiés',
    description:
      'Auteur d’un article complet intitulé « Enabling Radio Astronomy to Use French Supercomputers », accepté à la Supercomputing Conference.',
  },
  {
    kind: 'speaker',
    title: 'Collaboration scientifique',
    description:
      'Travaille pour le programme de recherche NumPEx « Digital for Exascale » et le laboratoire commun ECLAT à la conception des futures chaînes de traitement de la radioastronomie.',
  },
]

export const researchThesis = {
  label: 'Thèse de doctorat',
  title: 'Systèmes de systèmes collaboratifs pour la logistique des données scientifiques',
  context: 'IRISA · Université de Rennes',
  programme: 'NumPEx « Digital for Exascale » · laboratoire commun ECLAT',
  summary:
    'Les grands instruments scientifiques produisent aujourd’hui plus de données qu’un site unique ne peut en recevoir, en traiter ou en conserver. Transformer ces flux en produits exploitables suppose des chaînes de traitement qui traversent des instruments, des centres de calcul, des plateformes de stockage et des réseaux de recherche — chacun sous une administration différente, dans un pays différent et sous une loi différente. Cette thèse étudie la conception de cette logistique des données : comment la modéliser, comment l’optimiser, de quelles métadonnées elle a besoin, et comment l’exposer aux utilisateurs sans masquer les exigences qui garantissent des résultats sûrs et reproductibles.',
} as const

export const researchChapters: ResearchChapter[] = [
  {
    label: 'Le problème',
    heading: 'Le volume est la contrainte visible. La gouvernance est la vraie.',
    paragraphs: [
      'Les instruments scientifiques comme les plateformes industrielles — le CERN, le SKA, mais tout autant les flux que les entreprises traitent pour leurs clients — produisent des flux continus qu’il faut transformer : en données exploitables dans le premier cas, en réponses pour les clients dans le second. Lu en surface, c’est un problème de débit. Combien de données, à quelle cadence, sur quelles liaisons.',
      'Ce n’est pas le cas. Chaque site engagé dans une chaîne de traitement applique sa propre politique de sécurité, est hébergé dans son propre pays, et relève donc de la loi de ce pays. Une chaîne ne fonctionne que si elle peut être autorisée, tracée et digne de confiance de bout en bout. La logistique des données scientifiques est d’abord une question de gouvernance, et seulement ensuite une question de bande passante.',
    ],
  },
  {
    label: 'Pourquoi cela compte',
    heading: 'Les instruments exascale rendent l’écart impossible à ignorer.',
    paragraphs: [
      'Le Square Kilometre Array fonctionnera en continu et produira bien plus de données qu’on ne peut en stocker. Les signaux radio célestes doivent être transformés en produits exploitables largement en temps réel, à des débits comparables à cent millions de flux 4K au tout début du parcours, réduits à la volée à l’équivalent de quelques milliers de flux, pour archiver in fine de l’ordre de 700 pétaoctets chaque année. Il n’existe pas d’alternative au traitement à grande échelle.',
      'En France, cette échelle est assurée par l’infrastructure nationale de calcul intensif coordonnée par GENCI : Adastra au CINES, Jean Zay à l’IDRIS et Joliot-Curie au TGCC. Ces centres étant des actifs nationaux stratégiques, ils relèvent du cadre protégeant le potentiel scientifique et technique de la Nation (PPST) et du régime des zones à régime restrictif (ZRR).',
      'La conséquence est structurelle plutôt que technique. Dans une ZRR, l’accès est nominatif, la responsabilité personnelle ne peut être déléguée, les déplacements sont réglementés et tracés, et la divulgation à des tiers non autorisés doit être évaluée et maîtrisée. Ajoutez les contraintes ordinaires des supercalculateurs partagés — ordonnancement SLURM, limites de temps d’exécution de 24 heures sur Adastra, 100 sur Jean Zay et 72 sur Joliot-Curie, accès à Internet restreint aux nœuds de connexion — et les logiciels scientifiques portés par la communauté se heurtent à un régime pour lequel ils n’ont jamais été conçus. La barrière n’est pas le silicium. C’est le modèle d’exploitation.',
    ],
  },
]

export const researchFigures: ResearchFigure[] = [
  {
    value: '~700 Po',
    label: 'de données exploitables du SKA archivées chaque année',
  },
  {
    value: '3',
    label: 'centres nationaux de calcul intensif, tous soumis au PPST et au régime ZRR',
  },
  {
    value: '~7,9×',
    label: 'accélération mesurée de la chaîne DDF sur 24 nœuds — de 68,8 h à 8,7 h',
  },
]

export const researchPerspectives: ResearchPerspective[] = [
  {
    number: '01',
    title: 'Modélisation de la logistique des données',
    text: 'Décrire la chaîne entière — instrument, transport, ressources de calcul et d’analyse intensive, stockage, laboratoires — comme un seul système dont les étapes peuvent être raisonnées, organisées et placées, plutôt que comme une série de problèmes de sites sans lien.',
  },
  {
    number: '02',
    title: 'Optimisation multicritère',
    text: 'Les décisions de placement arbitrent entre contraintes de stockage, capacité des réseaux et des infrastructures (topologie, latence, protocoles de transfert), dépense énergétique, et difficulté d’écriture, de déploiement et de mise au point des applications. Un seul de ces critères pris isolément donne une mauvaise réponse.',
  },
  {
    number: '03',
    title: 'Sécurité, gouvernance et souveraineté',
    text: 'Les règles PPST et ZRR décident non seulement de ce qui peut s’exécuter, mais de qui peut l’exploiter. La question Globus — pourquoi un service largement utilisé aux États-Unis ne peut gérer les identités ni les flux de données dans une zone à régime restrictif — est l’illustration la plus nette qu’un choix technique peut être une impossibilité juridique.',
  },
  {
    number: '04',
    title: 'Traçabilité et métadonnées FAIR',
    text: 'Les opérations, les acteurs et les données doivent tous être attribuables. Les métadonnées attachées aux données et aux processus sont le levier qui rend les autres perspectives décidables plutôt que seulement discutables, et qui transforme une collection d’exécutions en science réutilisable.',
  },
  {
    number: '05',
    title: 'L’ergonomie comme objet de recherche',
    text: 'Si l’interface exige l’administration d’un cluster, la communauté des astronomes ne la franchira pas. Les applications scientifiques doivent être exposées comme des services, afin que la complexité opérationnelle reste derrière l’interface tandis que les exigences scientifiques et de sécurité restent visibles devant elle.',
  },
]

export const researchChain: ResearchChainStep[] = [
  {
    role: 'Instrument',
    site: 'SURFsara',
    detail:
      'Le centre national néerlandais de calcul intensif et site de référence de LOFAR, où arrivent les données du radiotélescope.',
  },
  {
    role: 'Traitement',
    site: 'Jean Zay · Adastra · Joliot-Curie',
    detail:
      'Les trois supercalculateurs nationaux français, exploités par l’IDRIS, le CINES et le TGCC dans leurs périmètres ZRR.',
  },
  {
    role: 'Stockage et partage',
    site: 'EOSC',
    detail:
      'L’European Open Science Cloud, réseau de recherche distribué ouvert aux utilisateurs européens de la recherche.',
  },
]

export const researchMethods: ResearchChapter = {
  label: 'Comment les perspectives s’articulent',
  heading: 'Une seule chaîne, trois juridictions.',
  paragraphs: [
    'Ces perspectives ne sont pas des programmes de recherche indépendants. Elles se rejoignent dans une chaîne inter-sites concrète : la chaîne DDF, le logiciel d’auto-calibration et d’imagerie du radiotélescope LOFAR, précurseur du SKA, exécuté sur des sites de calcul et de stockage hétérogènes et géodistribués.',
    'Entre ces points, chaque étape doit répondre à la même question dans une langue administrative différente. Où cette étape doit-elle s’exécuter, sous quelle autorité, avec quelles métadonnées enregistrées, et qui en est responsable ? Cette traduction est le système de systèmes que la thèse propose de modéliser.',
  ],
}

export const researchCase: ResearchChapter = {
  label: 'Méthodes',
  heading: 'Une chaîne exigeante comme banc d’essai.',
  paragraphs: [
    'La chaîne DDF est un bon cas d’étude précisément parce qu’elle répond à la fois à un vrai besoin de la communauté et à un problème système difficile. Une publication de données LoTSS a consommé environ seize millions d’heures de calcul ; une seule exécution atteint plusieurs centaines de gigaoctets de mémoire au pic, des images de cinq à vingt mille pixels de côté, entre une et vingt-quatre sous-bandes de fréquence, et des temps d’exécution mesurés en jours.',
    'Le travail décrit et profile ce logiciel, puis propose le modèle d’exploitation qui le rend utilisable à grande échelle : microservices applicatifs et tampons éphémères pour déplacer les données sans accès direct au shell, un exécutant qui tire les tâches depuis l’intérieur de la zone sécurisée plutôt que de les y pousser, et un compte de service nommé qui concilie la traçabilité ZRR avec un outil communautaire partagé.',
    'La traçabilité est capturée formellement plutôt que narrativement — cartes de connaissances structurées de l’application et de l’environnement d’exécution, et indicateurs de performance enregistrés à chaque exécution — afin qu’une exécution puisse être comparée, reproduite et, à terme, prédite.',
  ],
}

export const researchContribution: ResearchChapter = {
  label: 'Contribution',
  heading: 'Ce qu’apporte la thèse.',
  paragraphs: [
    'Un modèle de logistique des données dans lequel la gouvernance et la sécurité sont des contraintes de même rang que la capacité et le coût, et non une couche appliquée une fois l’architecture figée.',
    'Une spécification des métadonnées nécessaires pour rendre opérationnel le déploiement d’une chaîne de traitement à grande échelle : de quoi assurer la traçabilité des opérations et respecter les principes FAIR, et de quoi alimenter des décisions de placement multicritères.',
    'Une alternative démontrée aux comptes de calcul par utilisateur — les applications scientifiques comme service — validée avec la chaîne DDF sur Jean Zay et Adastra, le modèle du compte de service nommé étant en discussion avec les acteurs français de la sécurité.',
    'Une demande quantifiée envers l’infrastructure : ce que cette logistique implique en stockage, en réseau, en énergie et en émissions dans un paysage scientifique centré sur les données.',
  ],
}

export const researchApplications = {
  label: 'Applications',
  heading: 'Au-delà de la radioastronomie.',
  paragraphs: [
    'Le même problème apparaît partout où une chaîne scientifique traverse des administrations, ce qui rend ces méthodes pertinentes pour d’autres communautés instrumentales et pour les infrastructures de recherche intensives en données.',
    'La question du transport dépasse d’ailleurs les réseaux : un axe de travail concret concerne la spécification d’un dispositif de déplacement de données par les réseaux routiers et aériens, où la bande passante, la latence et l’énergie ne se comportent pas du tout comme sur une liaison de centre de données.',
  ],
} as const

/**
 * Les vidéos. Seuls le titre et le chapeau sont traduits : tout le reste —
 * adresse, vignette, type, source — est hérité de l'entrée anglaise, pour qu'il
 * ne puisse pas diverger.
 */
const videoTranslations: Record<string, { description: string; title: string }> = {
  'astronomy-hackathon': {
    description: 'Les temps forts d’un événement de recherche collaboratif d’ECLAT à Rennes.',
    title: 'Événement : hackathon international de radioastronomie',
  },
  'eclat-interview': {
    description:
      'Un entretien ECLAT sur le parcours de Mathis, sa recherche doctorale et son travail multidisciplinaire.',
    title: 'Entretien : au cœur de la logistique des données pour la radioastronomie',
  },
  'hpc-service-webinar': {
    description:
      'Un webinaire sur la logistique des données, l’imagerie intensive et l’orchestration de chaînes de traitement à grande échelle.',
    title:
      'Webinaire : les services applicatifs de calcul haute performance pour la radioastronomie',
  },
  'mcp-demo-video': {
    description:
      'Démonstration du serveur MCP qui expose l’ontologie logicielle de la chaîne DDF.',
    title:
      'Démonstration : un serveur MCP qui expose la carte de connaissances structurée du logiciel DDF Pipeline',
  },
}

export const videoItems: VideoItem[] = englishVideos.map((video) => ({
  ...video,
  ...(videoTranslations[video.id] ?? {}),
}))

/**
 * Les huit articles. Titre, chapeau, rubrique et date sont traduits ; le corps
 * est encore celui de la version anglaise et les adresses pointent vers elle,
 * parce que les routes françaises n'existent pas avant le prochain lot. Le
 * reste — numéro, image, texte alternatif, source — est hérité de l'anglais.
 */
const articleTranslations: Record<
  string,
  { category: string; date: string; description: string; title: string }
> = {
  'eclat-interview': {
    category: 'Entretien',
    date: 'Septembre 2025',
    description:
      'Dans cet entretien pour ECLAT, Mathis Certenais raconte son parcours depuis une école d’ingénieurs à Rennes jusqu’à la recherche doctorale sur la logistique des données — et pourquoi la multidisciplinarité est la clé de la radioastronomie de demain.',
    title: 'Entretien : au cœur de la logistique des données pour la radioastronomie',
  },
  'exascale-astronomy-cybersecurity': {
    category: 'Publication',
    date: '13 septembre 2026',
    description:
      'Comment un modèle d’accès par service peut ouvrir les supercalculateurs nationaux français à la radioastronomie sans compromettre la cybersécurité.',
    title:
      'Astronomie exascale contre cybersécurité : ouvrir les supercalculateurs français à la communauté radioastronomique',
  },
  'international-hackathon-for-astronomy': {
    category: 'Collaboration',
    date: '1er avril 2026',
    description:
      'Un événement de recherche qui réunit informaticiens et astrophysiciens de France, d’Angleterre et d’Afrique du Sud autour des défis techniques communs aux données de la radioastronomie.',
    title: 'Hackathon international de radioastronomie',
  },
  'mcp-server-software-ontology': {
    category: 'Note de recherche',
    date: '16 septembre 2026',
    description:
      'Voyez la documentation de votre logiciel scientifique comme un wiki interactif. Un serveur MCP qui transforme des centaines de paramètres de configuration complexes en réponses en langage naturel pour les chercheurs et les ingénieurs de la communauté.',
    title:
      'Faire parler un logiciel scientifique : un serveur MCP qui explique ses propres paramètres',
  },
  'predicting-for-sizing': {
    category: 'Note de recherche',
    date: '23 septembre 2026',
    description:
      'Un modèle prédictif à apprentissage continu qui estime le temps d’exécution, la mémoire et l’énergie des applications scientifiques sur supercalculateur — pour que les chercheurs dimensionnent leurs allocations au lieu de deviner.',
    title:
      'Prédire pour dimensionner : apprendre aux supercalculateurs leur propre empreinte d’exécution',
  },
  'rennes-hackathon-for-astronomy': {
    category: 'Collaboration',
    date: '1er octobre 2025',
    description:
      'Un événement de recherche technique qui réunit informaticiens et astrophysiciens pour s’attaquer aux défis de la radioastronomie.',
    title:
      'Des supercalculateurs aux travaux pratiques : renforcer la communauté par le partage des savoirs',
  },
  'webinar-hpc-applications-as-a-service': {
    category: 'Webinaire',
    date: '26 février 2026',
    description:
      'Ce webinaire prend la radioastronomie comme exemple pour montrer comment les services applicatifs de calcul haute performance peuvent gérer les données scientifiques, accélérer l’imagerie et accompagner les instruments de nouvelle génération comme le SKA, à travers des architectures et des outils pensés pour les chaînes inter-sites.',
    title:
      'Webinaire : les services applicatifs de calcul haute performance pour la radioastronomie',
  },
  youngpex: {
    category: 'Communauté',
    date: '12 octobre 2026',
    description:
      'Dans les coulisses de YoungPEx, le groupe de travail de NumPEx qui relie les jeunes chercheurs du programme français exascale — sa première assemblée générale à Toulouse, ses ateliers sur l’empreinte environnementale du calcul intensif et sur les inégalités dans la recherche, et la suite.',
    title: 'YoungPEx : la nouvelle génération du numérique pour l’exascale',
  },
}

export const articleItems: ArticleItem[] = englishArticles.map((article) => ({
  ...article,
  ...(articleTranslations[article.id] ?? {}),
}))

export const profileTimeline = [
  {
    label: 'Recherche actuelle',
    title: 'Doctorant · IRISA et Université de Rennes',
    detail:
      'Systèmes de systèmes collaboratifs pour la logistique des données scientifiques, développés dans le cadre de NumPEx et du laboratoire commun ECLAT.',
  },
  {
    label: 'Ingénierie de recherche',
    title: 'Intelligence artificielle · IRISA',
    detail:
      'Travaux d’ingénierie sur des sujets d’intelligence artificielle, notamment les grands modèles de langue et la génération augmentée par recherche.',
  },
  {
    label: 'Formation d’ingénieur',
    title: 'ESIR · Rennes',
    detail:
      'Parcours d’école d’ingénieurs complété par un double diplôme d’un an à l’UQAC, au Canada.',
  },
  {
    label: 'Double diplôme international',
    title: 'UQAC · Canada',
    detail:
      'Cours couvrant l’intelligence artificielle, les objets connectés, l’informatique en nuage et la programmation pour architectures parallèles.',
  },
] as const

export const expertise = [
  'Calcul haute performance',
  'Logistique des données scientifiques',
  'Chaînes de traitement inter-sites',
  'Systèmes distribués et fédérés',
  'Calcul pour la radioastronomie',
  'Recherche exascale',
  'Entrées-sorties rapides et parallélisme massif',
  'Applications de calcul intensif comme service',
] as const

export const aboutPage = {
  eyebrow: 'À propos',
  title: 'Construire des infrastructures par la collaboration.',
  intro:
    'Un informaticien breton qui travaille à la croisée du calcul haute performance, de la logistique des données et de la radioastronomie.',
  story: {
    heading: 'Des architectures parallèles à la logistique des données scientifiques.',
    label: 'Profil de recherche',
    paragraphs: [
      'Mathis étudie les méthodes et les outils des chaînes inter-sites à l’IRISA et à l’Université de Rennes. Sa recherche doctorale s’inscrit dans le programme français exascale NumPEx et prend appui sur les collaborations d’ECLAT en radioastronomie comme contexte pratique exigeant.',
      'Son parcours couvre des études d’ingénieur à l’ESIR, un double diplôme d’un an à l’UQAC au Canada, et des travaux antérieurs d’ingénierie de recherche en intelligence artificielle, notamment sur les grands modèles de langue et la génération augmentée par recherche.',
      'Le fil conducteur : rendre une infrastructure informatique complexe utile à des personnes extérieures à la recherche en systèmes — relier scientifiques, logiciels, données et centres de calcul sans perdre la reproductibilité ni le sens scientifique.',
    ],
  },
  principles: {
    label: 'Principes de travail',
    items: [
      {
        number: '01',
        title: 'Multidisciplinaire par construction',
        text: 'Informaticiens, astrophysiciens, ingénieurs et équipes d’infrastructure résolvent de meilleurs problèmes ensemble.',
      },
      {
        number: '02',
        title: 'La complexité appartient à l’arrière d’une interface utile',
        text: 'Des services de haut niveau réduisent la friction opérationnelle tout en gardant les exigences scientifiques visibles.',
      },
      {
        number: '03',
        title: 'La recherche doit rester responsable',
        text: 'Les échanges de YoungPEx portent sur l’empreinte énergétique, l’interdisciplinarité et une recherche respectueuse de l’environnement.',
      },
    ],
  },
} as const

export const resumePage = {
  eyebrow: 'Profil de recherche',
  intro:
    'Informations professionnelles et académiques vérifiées, issues du site fourni par Mathis, de son profil LinkedIn et des pages publiques de recherche institutionnelles.',
  profile: {
    heading: 'Chercheur en informatique, spécialisé en calcul haute performance et chaînes de traitement scientifiques.',
    label: 'Profil',
    text: 'Chercheur doctoral à l’IRISA et à l’Université de Rennes, travaillant sur la logistique des données et les systèmes de systèmes collaboratifs dans le contexte de NumPEx et d’ECLAT.',
  },
  experienceLabel: 'Expérience et formation',
  certifications: [
    {
      date: 'Octobre 2025 · EOSC Association',
      title: 'Bulk Data Transfer Service · attestation de suivi',
    },
    {
      date: 'Octobre 2025 · EOSC Association',
      title: 'Starting Guide · attestation de suivi',
    },
  ],
  presentations: [
    {
      date: 'Février 2026 · webinaire ECLAT',
      text: 'Une étude de cas pratique avec le logiciel DDF.',
      title: 'Le calcul haute performance comme service pour la radioastronomie',
    },
    {
      date: 'Décembre 2025 · atelier technique ECLAT',
      text: 'Une approche de logistique des données avec la chaîne DDF comme scénario de déploiement concret.',
      title: 'Le logiciel de calcul intensif comme service',
    },
  ],
  publication: {
    authors: 'Mathis Certenais, François Bodin et Laurent Morin.',
    date: '2025 · prépublication',
    href: 'https://arxiv.org/abs/2509.03075',
    label: 'Publication sélectionnée',
    linkLabel: 'arXiv:2509.03075',
    title: 'A description of the radio astronomy data processing tool DDF Pipeline',
  },
} as const

export const contactPage = {
  intro:
    'Mathis est basé à Rennes, en France, et travaille à la croisée de l’informatique, du calcul haute performance et de la radioastronomie.',
} as const

export const researchFeature = {
  heading: 'Recherche',
  leads: [
    'Les instruments scientifiques produisent plus de données qu’aucun site ne peut en recevoir, en traiter ou en conserver. Transformer ces flux en produits exploitables suppose des chaînes qui traversent des instruments, des supercalculateurs, des plateformes de stockage et des réseaux de recherche — chacun sous une administration différente et une loi différente.',
    'C’est un problème de gouvernance avant d’être un problème de bande passante. La thèse modélise cette logistique des données, l’optimise selon des critères concurrents, spécifie les métadonnées nécessaires et l’expose aux scientifiques sans masquer les exigences qui garantissent des résultats sûrs et reproductibles.',
  ],
  context: {
    label: 'Radioastronomie',
    text: 'Ancré dans la chaîne DDF pour LOFAR, précurseur du SKA, exécutée sur les supercalculateurs nationaux français et le stockage de recherche européen.',
  },
} as const

export const writingPage = {
  eyebrow: 'Articles',
  intro:
    'Notes et moments enregistrés d’une recherche à la croisée du calcul haute performance, des chaînes de traitement scientifiques et de la radioastronomie.',
  sectionHeading: 'Derniers articles',
  title: 'Expliquer les systèmes par leur usage.',
} as const

export const videosPage = {
  eyebrow: 'Vidéos',
  intro:
    'Entretiens, webinaires et événements de recherche collaboratifs issus du travail de Mathis avec ECLAT et la communauté radioastronomique.',
  sectionHeading: 'À regarder et à écouter',
  title: 'La recherche, expliquée en contexte.',
} as const
