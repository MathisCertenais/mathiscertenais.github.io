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
import type { ArticleBlock } from './en.ts'

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

/**
 * Corps déjà traduits. Les autres articles héritent du texte anglais ; chacun
 * quitte cette dépendance en même temps que sa traduction arrive.
 */
const articleBodies: Record<string, ArticleBlock[]> = {
  'webinar-hpc-applications-as-a-service': [
    {
      type: 'paragraph',
      text: 'Les applications de radioastronomie ont de plus en plus besoin du débit, des entrées-sorties rapides et du parallélisme des supercalculateurs nationaux. Accéder à ces machines exige toutefois des connaissances opérationnelles que de nombreux chercheurs de leur domaine ne devraient pas avoir à reproduire à chaque exécution.',
    },
    {
      type: 'paragraph',
      text: 'Ce webinaire présente les applications de calcul intensif comme un service, à travers un scénario concret autour de la chaîne DDF. L’accent est mis sur l’intégration de la logistique des données scientifiques, de l’imagerie intensive et de l’orchestration de chaînes de traitement distribuées, tout en gardant compréhensible l’interface offerte aux chercheurs.',
    },
  ],
  'international-hackathon-for-astronomy': [
    {
      type: 'paragraph',
      text: 'Un logiciel scientifique devient plus utile quand les personnes qui construisent l’infrastructure et celles qui interprètent les données astronomiques travaillent ensemble sur les mêmes problèmes.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Quels sont les objectifs de ce hackathon ?',
    },
    {
      type: 'paragraph',
      text: 'Le hackathon international de Rennes a créé l’espace de cette collaboration : les participants ont travaillé une semaine pour constituer un réseau de recherche participatif, le RIMS Network, et poursuivre le développement du logiciel de traitement de données DDF Pipeline.',
    },
    {
      type: 'paragraph',
      text: 'RIMS Network est un système de stockage distribué qui héberge des spectres dynamiques et leurs métadonnées pour l’étude d’événements rares. Il rend possible une production collaborative de données, accessible aux utilisateurs par un service web.',
    },
    {
      type: 'paragraph',
      text: 'Pour la chaîne DDF, nous avons travaillé à la portabilité de la version parallèle : elle est désormais installée et fonctionnelle sur les supercalculateurs français Jean Zay, hébergé à l’Institut du développement et des ressources en informatique scientifique (IDRIS), Adastra au Centre informatique national de l’enseignement supérieur (CINES), à l’université du Hertfordshire au Royaume-Uni, et chez notre partenaire industriel Bull.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Quel est l’apport de cette collaboration internationale ?',
    },
    {
      type: 'paragraph',
      text: 'Ces événements techniques sont essentiels pour rassembler notre communauté, nous aligner sur des objectifs partagés et les transformer en réalité. Pendant ce hackathon, nous avons validé le déploiement de la chaîne DDF sur les supercalculateurs de tous les partenaires, ce qui clôt cette version stable et nous permet de nous consacrer aux nouvelles fonctionnalités. Pour RIMS, cette rencontre internationale a permis de finaliser collectivement l’architecture distribuée générale entre la France, l’Afrique du Sud et le Royaume-Uni, de nous accorder sur les conditions d’usage et de livrer une preuve de concept validant l’idée.',
    },
  ],
}

Object.assign(articleBodies, {
  'rennes-hackathon-for-astronomy': [
    {
      type: 'paragraph',
      text: 'On parle souvent de code et de données, mais le meilleur de notre hackathon, ce sont les personnes. C’était l’occasion d’apprendre les uns des autres et de résoudre des problèmes difficiles en face à face. En radioastronomie, les outils sont complexes. Les aborder ensemble permet de mieux les maîtriser.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Maîtriser Spack avec l’aide d’un partenaire industriel',
    },
    {
      type: 'paragraph',
      text: 'L’un de nos objectifs principaux était de faire tourner sans accroc notre logiciel de traitement de données, DDF Pipeline, sur les supercalculateurs grâce à Spack. Spack est un outil puissant pour gérer les logiciels sur les machines de calcul intensif, mais sa prise en main est rude et sa configuration délicate.',
    },
    {
      type: 'paragraph',
      text: 'Notre partenaire chez Bull est venu nous aider. Plutôt que de nous envoyer de la documentation, son ingénieur s’est installé avec nous et nous a montré précisément comment configurer Spack pour nos machines. Cet accompagnement a transformé un obstacle technique en un processus clair et maîtrisable. Nous n’avons pas seulement installé un logiciel : nous avons appris à le maintenir nous-mêmes.',
    },
    {
      type: 'figure',
      image: '/images/mathis/rennes-hackathon/rennes-hackathon-back.webp',
      alt: 'Participants écoutant une présentation',
      caption:
        'Participants écoutant Cyril Tasse présenter les résultats d’un relevé du ciel obtenu en traitant les données du radiotélescope Low Frequency Array (LOFAR) avec la chaîne DDF. Crédit : Jacques Tissot.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Aider les participants avec des tutoriels',
    },
    {
      type: 'paragraph',
      text: 'Nous nous sommes aussi occupés des utilisateurs. Un bon code ne sert à rien si personne ne sait s’en servir. Pendant l’événement, nous avons écrit des [tutoriels détaillés pour DDFacet](https://hackmd.io/l8fw0PYRQv6dm9i6KpZWPA), le logiciel d’imagerie de notre chaîne de traitement.',
    },
    {
      type: 'paragraph',
      text: 'Écrire ces guides, c’était une affaire de clarté et de simplicité. Nous voulions expliquer non seulement les étapes, mais la logique qui les sous-tend. En produisant cette documentation, nous facilitons l’usage de nos outils par d’autres astronomes. Ce soutien dépasse le hackathon et aide la communauté au sens large.',
    },
  ],
  'eclat-interview': [
    {
      type: 'paragraph',
      text: 'Dans cet entretien pour ECLAT, Mathis Certenais — doctorant à l’IRISA spécialisé en logistique des données — raconte son parcours, sa recherche sur les flux d’information du calcul exascale et l’importance de la multidisciplinarité pour la radioastronomie de demain.',
    },
    { type: 'heading', level: 2, text: 'L’entretien' },
    {
      type: 'heading',
      level: 3,
      text: 'Pour commencer, pouvez-vous vous présenter et nous parler un peu de votre parcours ?',
    },
    {
      type: 'paragraph',
      text: 'Je m’appelle Mathis Certenais, j’ai 25 ans. J’ai rejoint l’ESIR, une école d’ingénieurs à Rennes, et j’ai suivi en parallèle un double diplôme d’un an à l’UQAC, au Canada. Ce cursus portait sur l’intelligence artificielle, les objets connectés, l’informatique en nuage et la programmation pour architectures parallèles. De retour en Bretagne, j’ai travaillé au laboratoire IRISA comme ingénieur sur des sujets d’intelligence artificielle, en particulier les grands modèles de langue et la génération augmentée par recherche. Aujourd’hui, je poursuis dans la même équipe en tant que doctorant, sur un sujet lié aux systèmes de systèmes collaboratifs pour la logistique des données scientifiques.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Qu’est-ce que la logistique des données, exactement, et pourquoi est-elle cruciale pour la radioastronomie aujourd’hui ?',
    },
    {
      type: 'paragraph',
      text: 'La **logistique des données** désigne la gestion des flux d’information produits par les instruments scientifiques et les simulations complexes. Elle est indispensable pour passer à l’échelle dans le contexte du calcul exascale. Auparavant, chaque institution gérait ces flux en interne : les données étaient collectées, traitées et analysées localement. Avec la nouvelle génération de radiotélescopes, le volume d’information explose. Il faut donc concevoir cette logistique au sein des chaînes de traitement, mais aussi intégrer les techniques d’imagerie sur les machines de calcul intensif et répartir le traitement de ces flux entre différentes infrastructures.',
    },
    { type: 'heading', level: 3, text: 'Parlons d’ECLAT. Quelle est sa raison d’être ?' },
    {
      type: 'paragraph',
      text: 'L’objectif premier d’ECLAT est de concevoir des systèmes cyber-physiques, autrement dit des chaînes de traitement, pour la radioastronomie de demain, et de répondre ainsi aux besoins du **Square Kilometer Array (SKA)**, un radiotélescope de nouvelle génération. Pour nous, la radioastronomie est un formidable terrain d’essai pour nos outils de logistique des données. C’est un peu comme concevoir des outils — un râteau, une bêche, un seau : le laboratoire ECLAT est notre bac à sable pour construire ensemble et voir ce qui tient.',
    },
    { type: 'heading', level: 3, text: 'D’où vient cette collaboration ?' },
    {
      type: 'paragraph',
      text: 'J’ai découvert ECLAT en lisant un [article du CNRS](https://www.cnrs.fr/fr/actualite/eclat-lalliance-science-industrie-qui-repousse-les-limites-de-lobservation-astronomique) sur ce laboratoire commun qui unit science et industrie pour repousser les limites de l’observation astronomique. Nous les avons contactés, puis nous nous sommes présentés à l’inauguration du laboratoire commun.',
    },
    { type: 'heading', level: 3, text: 'Comment gérez-vous la collaboration avec d’autres disciplines ?' },
    {
      type: 'paragraph',
      text: 'La force d’ECLAT est de réunir des profils très divers — des informaticiens comme moi, des astrophysiciens, des ingénieurs, des chercheurs — pour s’attaquer aux défis de la recherche astrophysique de demain. Nous travaillons main dans la main, en co-développement, pour comprendre leurs sujets et adapter nos outils techniques, tout en veillant à ce que le produit final, une image du ciel par exemple, reste cohérent et scientifiquement valide. Cette approche **multidisciplinaire** est la clé : il s’agit de sortir de notre zone de confort pour innover ensemble.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'ECLAT implique aussi des partenaires privés. Y voyez-vous un avantage ?',
    },
    {
      type: 'paragraph',
      text: 'Oui, tout à fait. Dans ECLAT, il y a des partenaires publics et privés, mais personnellement, nous ne faisons aucune différence. Tout le monde est là pour la science, avec des objectifs personnels mais aussi, et surtout, des objectifs communs : faire avancer la science et relever les défis de la radioastronomie de demain. Cet écosystème complet est nécessaire pour y parvenir.',
    },
    { type: 'heading', level: 3, text: 'Vous participez au projet NumPEx. Pouvez-vous nous en dire plus ?' },
    {
      type: 'paragraph',
      text: 'NumPEx est un programme français qui fait avancer les enjeux informatiques de demain : le numérique pour l’exascale. Je suis actif au sein de **YoungPEx** comme membre du comité, un rassemblement de tous les jeunes impliqués dans NumPEx qui travaillent sur des questions touchant notre génération. Nous nous penchons notamment sur l’empreinte énergétique, la manière de mener une recherche respectueuse de l’environnement, la multidisciplinarité dans la recherche scientifique, l’acceptabilité du calcul haute performance dans la société et l’usage de l’IA dans nos travaux.',
    },
    { type: 'heading', level: 3, text: 'Cela vaut-il la peine de faire une thèse ?' },
    {
      type: 'paragraph',
      text: 'Une thèse, c’est avant tout un **choix de vie**. Il faut une certaine indépendance, parce que nous décidons de nos journées, et bien sûr un minimum de passion pour son sujet. Ce que je trouve incroyable, c’est l’humain et l’échange de savoirs. Travailler avec des spécialistes de domaines aussi différents que les astrophysiciens est une occasion unique d’apprendre des sujets très pointus.',
    },
  ],
  'predicting-for-sizing': [
    { type: 'heading', level: 2, text: 'Le problème du dimensionnement' },
    {
      type: 'paragraph',
      text: 'Toute campagne scientifique sur un supercalculateur commence par un **pari**. Combien de nœuds ? Combien de mémoire ? Combien de temps l’exécution va-t-elle durer ? Pour la **chaîne DDF** — le logiciel d’auto-calibration et d’imagerie du radiotélescope **LOFAR** — l’enjeu est considérable : la dernière publication de données LoTSS (LOFAR Two-metre Sky Survey) a consommé à elle seule **16 millions d’heures de calcul**. Et derrière chacune de ces heures se cache une décision de dimensionnement prise, le plus souvent, à l’aveugle.',
    },
    {
      type: 'paragraph',
      text: 'Les astronomes qui utilisent la chaîne DDF sont des scientifiques, pas des spécialistes du calcul intensif. Ils allouent les précieuses heures de calcul de leur projet par l’intermédiaire de **SLURM**, un ordonnanceur qui leur demande de déclarer leurs besoins à l’avance (--time, --cpus-per-task, --mem) puis applique une **politique d’équité** qui récompense les projets consommant moins que ce qui leur a été accordé. Surdimensionnez, et vous gaspillez des ressources, perdez de la priorité et attendez plus longtemps dans les files ; sous-dimensionnez, et votre tâche échoue. Traduire des paramètres scientifiques en dimensionnement correct relève du jeu de devinettes, avec un coût réel des deux côtés.',
    },
    {
      type: 'figure',
      image: '/images/mathis/predicting-for-sizing/ddf-workflow.webp',
      alt: 'La chaîne DDF : télécharger les données, exécuter la chaîne, déposer les résultats',
      caption:
        'La chaîne DDF — trois étapes pour lesquelles nous aimerions connaître le site le plus adapté à leur exécution.',
    },
    { type: 'heading', level: 2, text: 'Pourquoi deviner coûte si cher' },
    {
      type: 'paragraph',
      text: 'La difficulté ne vient pas d’un manque d’expérience, mais d’un manque de prévisibilité. Les exécutions de la chaîne DDF varient selon **plusieurs dimensions à la fois**, et un seul changement peut déplacer l’empreinte de ressources d’un ordre de grandeur :',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '**Paramètres de l’application.** La résolution de l’image de sortie va de **5 000×5 000 à 20 000×20 000 pixels**, ce qui fait passer la mémoire au pic de **~10 Go à ~400 Go**.',
        '**Volume des données d’entrée.** De quelques centaines de mégaoctets à plusieurs gigaoctets, ce qui étire le temps d’exécution de **quelques minutes à plusieurs jours** sur un seul nœud.',
        '**Structure des données.** Entre **1 et 24 sous-bandes de fréquence**, chacune modifiant la façon dont la charge se répartit — et son efficacité énergétique — sur les nœuds alloués.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Ajoutez une **dimension multi-sites** et le problème se complexifie. Dans les chaînes réparties entre plusieurs centres, le dimensionnement conditionne le placement des tâches : espace disque, attente en file et site d’exécution dépendent tous de l’empreinte que vous avez prédite. Les contraintes matérielles diffèrent d’un site à l’autre — **768 Go par nœud** sur Adastra, **192 Go de mémoire par nœud** sur Jean Zay, **228 Go par nœud** sur Joliot-Curie — et une configuration qui tient sur une machine peut être impossible sur une autre.',
    },
    {
      type: 'paragraph',
      text: 'L’espace des configurations est tout simplement **trop vaste pour être testé exhaustivement**. Ce n’est pas un problème que l’on résout une fois pour toutes : il appelle un modèle qui **continue d’apprendre** à mesure que les exécutions s’accumulent.',
    },
    { type: 'heading', level: 2, text: 'Ce qu’il faut pour y parvenir' },
    {
      type: 'paragraph',
      text: 'Construire un modèle prédictif à apprentissage continu est un travail d’équipe en cinq pièces, chacune portée par un spécialiste différent et conçue pour s’emboîter avec les autres :',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Carte de connaissances structurée** — une description de l’environnement d’exécution propre au supercalculateur, mise en correspondance avec les métriques SLURM.',
        '**Jeu d’indicateurs de performance des tâches, JoPInS** — la structure qui contient les mesures des indicateurs de performance des tâches des applications descripteurs formelles, relativement à leurs exécutions.',
        '**Greffon de supervision** — le collecteur qui capture les preuves des tâches réelles.',
        '**Base de données** — le magasin central où toutes les exécutions s’accumulent au format JoPInS.',
        '**Apprentissage automatique exposé en tant que HAPS** — un modèle entraîné par version d’application et par environnement d’exécution, avec accès aux ressources et aux applications de calcul intensif pour son apprentissage continu.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Première étape — une carte de connaissances structurée de l’environnement d’exécution',
    },
    {
      type: 'paragraph',
      text: 'Avant de pouvoir prédire, il faut pouvoir **décrire**. La carte de connaissances structurée (ou ontologie) formalise l’environnement d’exécution propre au supercalculateur dans lequel les tâches s’exécutent. Sa valeur tient à la mise en correspondance : aligner la **carte de connaissances structurée des tâches** sur les **métriques SLURM** brutes, pour qu’une description conceptuelle — « cette tâche avait besoin d’un nœud à grande mémoire » — devienne une grandeur mesurable et comparable.',
    },
    {
      type: 'figure',
      image: '/images/mathis/predicting-for-sizing/job-ontology.webp',
      alt: 'Visualisation de l’ontologie des tâches décrivant l’environnement d’exécution du supercalculateur',
      caption:
        'La carte de connaissances structurée des tâches — le pont entre la façon dont les chercheurs pensent leurs exécutions et la façon dont SLURM les mesure. Crédit : Gaëlle Richet.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Deuxième étape — décrire chaque exécution avec JoPInS',
    },
    {
      type: 'paragraph',
      text: 'Chaque exécution est capturée par un **jeu d’indicateurs de performance des tâches, JoPInS**. Le descripteur définit les **paramètres d’entrée** — réglages de l’application et choix système — et les **métriques de sortie** — temps, mémoire, énergie — pour chaque tâche. Chaque indicateur est représenté par un triplet : **JoPInS = (valeur, type de valeur, description)**, une structure assez simple pour être collectée à grande échelle et assez riche pour servir à l’apprentissage.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Troisième étape — recueillir les preuves du terrain',
    },
    {
      type: 'paragraph',
      text: 'Une paire de greffons transforme les tâches réelles en données d’apprentissage. Le client en ligne de commande, **cli-monitoring-haps**, collecte les informations sur les tâches d’une application donnée, exposée en tant que HAPS, dans le contexte d’une **campagne de publication de données**. Le collecteur côté serveur, **server-monitoring-haps**, lit les **métriques système** de SLURM (sacct -j <JOB_ID>) et récupère les **métriques propres à l’application** dans la base HAPS. Chaque exécution est ensuite formalisée en JoPInS et envoyée à la base de données.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Quatrième étape — centraliser dans la base de données',
    },
    {
      type: 'paragraph',
      text: 'Tous ces enregistrements JoPInS atterrissent dans la base de données — la source unique de vérité sur le comportement réel des applications sur de vraies machines. C’est la mémoire du système, et le carburant du modèle.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'Cinquième étape — relier l’apprentissage automatique au système',
    },
    {
      type: 'paragraph',
      text: 'La boucle se referme autour de **HAPS** (services applicatifs de calcul intensif), dans un dispositif qui reste **conforme aux exigences de sécurité des ZRR** imposées aux supercalculateurs français, considérés comme des actifs stratégiques nationaux. Étape 1 : exécution de campagnes d’applications scientifiques sur les supercalculateurs. Étape 2 : collecte des données par le greffon de supervision. Étape 3 : entraînement et évaluation du modèle — un **modèle d’apprentissage automatique** est entraîné sur le jeu de données d’une campagne, testé, sa précision mesurée, et seulement alors exposé lui-même en tant que HAPS.',
    },
    { type: 'heading', level: 2, text: 'De l’exécution à la prédiction' },
    {
      type: 'paragraph',
      text: 'Une fois la boucle en marche, les pièces produisent quelque chose de nouveau : un **modèle d’apprentissage automatique exposé comme un service**. Entraînez un modèle expert sur les données d’une campagne, mesurez sa précision, et le modèle devient un oracle qui prédit, pour toute nouvelle configuration, le **temps d’exécution**, la **mémoire utilisée** et la **consommation d’énergie** de l’application. L’objectif est pratique : compte tenu de la variabilité des paramètres et des données d’entrée, identifier les **configurations d’allocation qui offrent le meilleur compromis entre temps d’exécution et consommation d’énergie** — avant qu’une seule heure de calcul ne soit dépensée.',
    },
    { type: 'heading', level: 2, text: 'De la devinette à la connaissance' },
    {
      type: 'paragraph',
      text: 'Un ordonnanceur vous demande de prédire votre propre avenir — et traditionnellement, cette prédiction relevait du jugement personnel. Avec un modèle qui apprend en continu, nourri par les exécutions réelles, la conversation change. Le supercalculateur cesse de demander à ses utilisateurs de deviner et se met à leur dire ce dont ils ont besoin. **Le dimensionnement cesse d’être un pari** — et les scientifiques peuvent consacrer leurs heures de calcul à la science, pas aux intuitions.',
    },
  ],
  'mcp-server-software-ontology': [
    { type: 'heading', level: 2, text: 'Le problème silencieux du logiciel' },
    {
      type: 'paragraph',
      text: 'Derrière chaque application scientifique complexe se cache un **labyrinthe de paramètres de configuration** — souvent compris par une poignée de développeurs principaux seulement. C’est particulièrement vrai pour la **chaîne DDF**, un logiciel d’auto-calibration et d’imagerie conçu pour le radiotélescope **LOFAR** (Low Frequency Array). Une seule exécution y mobilise **des centaines de paramètres**, et en modifier un peut changer des semaines de coûts de calcul ou le résultat scientifique final.',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/ddf-sourcecode.webp',
      alt: 'Capture d’écran du dépôt de code source de la chaîne DDF',
      caption:
        'Le code source de la chaîne DDF — aujourd’hui, le seul endroit où réside réellement la signification de ces centaines de paramètres.',
    },
    {
      type: 'paragraph',
      text: 'Pour les développeurs qui maintiennent le logiciel, ces réglages sont des compagnons familiers. Pour la communauté qui l’utilise, ils sont un obstacle. La « bonne » configuration n’est jamais **figée** : elle dépend du **volume des données d’entrée**, du **système de calcul** qui effectuera le traitement et, surtout, des **besoins propres à l’utilisateur**. **La documentation seule ne peut pas saisir ce contexte.** Résultat : cette connaissance critique quitte rarement le code source — [github.com/mhardcastle/ddf-pipeline](https://github.com/mhardcastle/ddf-pipeline) — ce qui laisse un logiciel puissant inaccessible à ceux qui en ont le plus besoin.',
    },
    {
      type: 'paragraph',
      text: 'Notre approche renverse la perspective. Plutôt que de demander aux utilisateurs de mémoriser des centaines de réglages, nous construisons une **interface conversationnelle pour le code lui-même**. Nous structurons l’espace des paramètres de l’application en une base de connaissances interrogeable, nous la vectorisons, et nous l’exposons par un serveur **MCP** (Model Context Protocol). **Le logiciel cesse d’être un outil muet pour devenir un assistant capable de s’expliquer**, auquel les chercheurs peuvent simplement poser la question.',
    },
    { type: 'heading', level: 2, text: 'Le cas d’étude : ce que les paramètres commandent réellement' },
    {
      type: 'paragraph',
      text: 'La chaîne DDF transforme les observations de LOFAR en relevés du ciel à grand champ. Ses sorties sont les images qui illustrent les articles d’astronomie — et chacune porte l’empreinte des décisions prises en amont sur les paramètres : échelle de pixels, faisceau de restauration, masquage, compression, allocation de processeurs. Les figures ci-dessous proviennent de **LoTSS-DR3**, une publication de données produite avec le logiciel même dont nous voulons expliquer les paramètres.',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/ddf-survey.webp',
      alt: 'Reprojection des images mosaïques de LoTSS-DR3 et image RMS correspondante',
      caption:
        'En haut : reprojection des images mosaïques de LoTSS-DR3. En bas : l’image RMS correspondante. Les contours jaunes et bleus délimitent les zones LoTSS-DR1 et LoTSS-DR2, soit respectivement 2 % et 27 % du ciel boréal ; le contour noir montre la couverture de LoTSS-DR3, 88 %. Les petits points gris marquent les 3168 pointés LoTSS, dont 2551 figurent dans cette publication. Source : [LoTSS Data Release 3](https://ui.adsabs.harvard.edu/abs/2026A%26A...707A.198S/abstract)',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/ddf-image.webp',
      alt: 'Exemple de région de 45 deg² du ciel extragalactique issu de LoTSS-DR3',
      caption:
        'Exemple de région de 45 deg² du ciel extragalactique issu de LoTSS-DR3 — typiquement environ 30 000 sources détectées au-dessus de 4,5×RMS. On y remarque les radiogalaxies NGC 315 (en bas) et 3C 31 (en bas au centre-gauche), ainsi que la galaxie spirale M 31 (en haut).',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/ddf-supernova.webp',
      alt: 'Région du plan galactique où la densité de restes de supernova connus est la plus élevée dans LoTSS-DR3',
      caption:
        'Région du plan galactique où la densité de restes de supernova connus est la plus élevée dans LoTSS-DR3 : 190 deg² centrés sur une longitude galactique de 43,5°, incluant G054.4-00.3, G049.2-00.7, G043.9+01.6, G039.7-02.0 et G034.7-00.4.',
    },
    {
      type: 'paragraph',
      text: 'Ces images sont l’enjeu. Chaque pixel y est conditionné par des paramètres que seuls quelques mainteneurs maîtrisent aujourd’hui entièrement.',
    },
    { type: 'heading', level: 2, text: 'La solution : donner une voix au logiciel' },
    {
      type: 'paragraph',
      text: 'Comment apprendre un logiciel à une intelligence artificielle ? Nous ne lui donnons pas simplement du code brut. Nous construisons une carte de connaissances structurée (ou ontologie) de l’espace des paramètres. Voyez cela comme offrir à l’IA une **table des matières** précise et un **glossaire technique** du logiciel. Chaque réponse s’appuie ainsi sur la base de code réelle, ce qui l’empêche d’inventer un paramètre qui n’existe pas.',
    },
    { type: 'heading', level: 3, text: 'Première étape — structurer la connaissance' },
    {
      type: 'paragraph',
      text: 'Construire cette carte structurée est un **exercice multidisciplinaire**. Nous travaillons avec les développeurs pour représenter l’application fidèlement, et avec les utilisateurs finaux pour qu’elle reste lisible. L’information utile est extraite de la base de code puis convertie dans un format normalisé (Turtle/TTL) que les machines savent comprendre.',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/ddf-ontology.webp',
      alt: 'Visualisation de la structure de connaissances de la chaîne DDF',
      caption:
        'Visualisation de la structure de connaissances de la chaîne DDF : paramètres regroupés en sections, avec leurs types de données, valeurs par défaut, unités et descriptions.',
    },
    {
      type: 'paragraph',
      text: 'Ces données structurées deviennent ensuite une **base de données vectorielle** — une représentation qu’un modèle de plongement léger (ici all-MiniLM-L6-v2) sait interroger en langage naturel.',
    },
    { type: 'heading', level: 3, text: 'Deuxième étape — l’exposer par MCP' },
    {
      type: 'paragraph',
      text: '**MCP**, le Model Context Protocol, est le standard ouvert qui permet à des assistants comme Claude Code et OpenCode de se connecter à des outils et à des sources de données externes. Il devient le pont entre les chercheurs et cette base de connaissances : le serveur héberge le modèle de plongement, dialogue avec la base de données et expose une API REST qui répond à des questions en langage naturel avec les principaux nœuds de la structure.',
    },
    {
      type: 'figure',
      image: '/images/mathis/mcp-server-software-ontology/mcp-swagger.webp',
      alt: 'Documentation d’API du serveur MCP exposant la base de connaissances',
      caption:
        'La documentation d’API du serveur MCP : interroger la base de connaissances en langage naturel, recevoir en retour des nœuds structurés.',
    },
    {
      type: 'paragraph',
      text: 'Demandez « comment changer la taille de l’image en pixels ? » et le serveur répond par des nœuds classés, issus de la structure :',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '**image.imsize** — section **image**, type de donnée **int**, défaut **20000**, « taille de l’image en pixels », unité **pixel**.',
        '**image.cellsize** — type de donnée **float**, défaut **1.5**, « taille du pixel en arcsec », unité **arcsec**.',
        '**machine.NCPU_DDF** — « nombre de processeurs à utiliser pour DDF », **sélectionné automatiquement** si laissé vide.',
        '**masking.tgss_radius** — « rayon du masque TGSS en pixels », défaut **8.0**, unité **pixel**.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Aucune approximation et aucun paramètre inventé : chaque réponse est ancrée dans la base de code réelle, par cette connaissance structurée.',
    },
    { type: 'heading', level: 3, text: 'Troisième étape — une interface conversationnelle souveraine' },
    {
      type: 'paragraph',
      text: 'La dernière pièce est l’interface où les chercheurs posent réellement leurs questions. Nous utilisons **Ragarenn**, une plateforme souveraine hébergeant des grands modèles de langue accessibles par la fédération d’identité **eduGAIN** — un dispositif pensé pour la **confidentialité des données**, où rien ne sort d’un périmètre de confiance. Elle expose une API compatible avec le standard d’OpenAI, et nous connectons **OpenCode** (ou Claude Code) à la fois au modèle et au serveur MCP, pour que la conversation ait lieu dans l’interface de développement que les chercheurs utilisent déjà.',
    },
    { type: 'heading', level: 2, text: 'Le résultat : de la documentation au dialogue' },
    {
      type: 'paragraph',
      text: 'Connectez le serveur MCP à l’interface de votre choix et le logiciel finit par répondre de lui-même. Sa force décisive est la **modularité**.',
    },
    {
      type: 'paragraph',
      text: 'Vous pouvez fonctionner en **mode strict**, où le modèle ne répond qu’à partir des informations réelles contenues dans la base de connaissances structurée. Dans ce mode, si un paramètre n’y est pas défini, l’IA ne l’inventera pas : chaque paramètre qu’elle mentionne existe vraiment dans le code.',
    },
    {
      type: 'paragraph',
      text: 'Vous pouvez aussi enrichir ces réponses ancrées avec un **modèle connecté au web**, pour y ajouter un contexte externe (par exemple les bonnes pratiques de projets similaires). Les deux modes partagent la même garantie essentielle : **la source de vérité est le logiciel lui-même, pas les données d’entraînement de l’IA.**',
    },
    {
      type: 'paragraph',
      text: 'La documentation suppose un lecteur prêt à creuser des pages de texte. Ce système suppose une conversation. En exposant l’espace caché des paramètres d’un logiciel scientifique comme une matière qu’une IA peut lire et expliquer, nous transformons un outil muet en un collègue qui connaît la base de code — et laissons les scientifiques regarder le ciel plutôt que les paramètres.',
    },
  ],
})

export const articleItems: ArticleItem[] = englishArticles.map((article) => ({
  ...article,
  ...(articleTranslations[article.id] ?? {}),
  ...(articleBodies[article.id] ? { body: articleBodies[article.id] } : {}),
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
