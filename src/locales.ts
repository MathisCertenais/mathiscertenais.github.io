/**
 * Interface strings. Only the chrome is translated for now — the page copy still
 * comes from `content.ts` in English, and the French translation of that content
 * is the next step.
 *
 * French wording avoids calques: no "Insights" for a section of articles, no
 * "email" where "écrire" reads naturally, and HPC is written out.
 */
export const locales = {
  en: {
    footer: {
      brandHome: 'Mathis Certenais — Home',
      connectOnLinkedin: 'Connect on LinkedIn',
      ctaLabel: "Let's connect",
      ctaTitle: 'Interested in research collaboration?',
      description:
        'Computer scientist researching HPC, data logistics, and cross-facility scientific workflows.',
      getInTouch: 'Get in touch',
      groups: { elsewhere: 'Elsewhere', navigation: 'Navigation' },
      linksAria: { elsewhere: 'Elsewhere links', navigation: 'Navigation links' },
    },
    header: {
      brandHome: 'Mathis Certenais — Home',
      closeMenu: 'Close menu',
      navigationMobile: 'Mobile navigation',
      navigationPrimary: 'Primary navigation',
      navigationSecondary: 'Secondary navigation',
      onLinkedin: 'Mathis Certenais on LinkedIn (opens in new tab)',
      openMenu: 'Open menu',
      skip: 'Skip to main content',
    },
    language: {
      /* Label in the language the button switches to. */
      aria: 'Lire le site en français',
      code: 'FR',
      name: 'Français',
    },
    nav: {
      about: 'About',
      contact: 'Contact',
      email: 'Email',
      home: 'Home',
      insights: 'Insights',
      linkedin: 'LinkedIn',
      profile: 'Profile',
      research: 'Research',
      videos: 'Videos',
    },
    theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
    writing: { allInsights: 'All insights' },
  },
  fr: {
    footer: {
      brandHome: 'Mathis Certenais — accueil',
      connectOnLinkedin: 'Retrouvez-moi sur LinkedIn',
      ctaLabel: 'Prenons contact',
      ctaTitle: 'Un projet de recherche, une collaboration ?',
      description:
        'Chercheur en informatique : calcul haute performance, logistique des données et chaînes de traitement scientifiques réparties entre plusieurs centres.',
      getInTouch: 'M’écrire',
      groups: { elsewhere: 'Ailleurs', navigation: 'Navigation' },
      linksAria: { elsewhere: 'Liens externes', navigation: 'Liens de navigation' },
    },
    header: {
      brandHome: 'Mathis Certenais — accueil',
      closeMenu: 'Fermer le menu',
      navigationMobile: 'Navigation mobile',
      navigationPrimary: 'Navigation principale',
      navigationSecondary: 'Navigation secondaire',
      onLinkedin: 'Mathis Certenais sur LinkedIn (nouvel onglet)',
      openMenu: 'Ouvrir le menu',
      skip: 'Aller au contenu principal',
    },
    language: {
      aria: 'Read the site in English',
      code: 'EN',
      name: 'English',
    },
    nav: {
      about: 'À propos',
      contact: 'Contact',
      email: 'Écrire',
      home: 'Accueil',
      insights: 'Articles',
      linkedin: 'LinkedIn',
      profile: 'Profil',
      research: 'Recherche',
      videos: 'Vidéos',
    },
    theme: { toDark: 'Passer en mode sombre', toLight: 'Passer en mode clair' },
    writing: { allInsights: 'Tous les articles' },
  },
} as const

export type Language = keyof typeof locales
export type NavKey = keyof (typeof locales)['en']['nav']
export type FooterGroupKey = keyof (typeof locales)['en']['footer']['groups']
