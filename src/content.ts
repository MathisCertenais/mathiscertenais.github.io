export type ProofKind = 'community' | 'mentor' | 'speaker'

export interface ProofPoint {
  kind: ProofKind
  title: string
  description: string
}

export interface WorkItem {
  number: string
  eyebrow: string
  title: string
  description: string
  tags: string[]
  image: string
  imageAlt: string
  href: string
  imageSide: 'left' | 'right'
}

export interface VideoItem {
  id: string
  title: string
  image: string
}

export interface ArticleItem {
  number: string
  category: string
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
}

export const proofPoints: ProofPoint[] = [
  {
    kind: 'community',
    title: 'Non-Profit Founder',
    description:
      '50+ free design education events — lectures, studio tours, and community workshops',
  },
  {
    kind: 'mentor',
    title: 'Design Mentor',
    description:
      '400+ students supported via Discord and ADPList — 100+ 1:1 mentorship sessions',
  },
  {
    kind: 'speaker',
    title: 'Event Speaker',
    description:
      'Speaker and host at design conferences — sharing perspectives on UX and agile product design',
  },
]

export const workItems: WorkItem[] = [
  {
    number: '01',
    eyebrow: 'When complexity hurts people',
    title: 'Redesigning recovery',
    description:
      'Leading a $40 million initiative enabling hospitals to more effectively communicate with insurance companies and speed up claim processing.',
    tags: ['Strategy', 'Facilitation', 'Team Leadership', 'Product Design'],
    image: '/assets/work/recovery.webp',
    imageAlt:
      'Centene recovery platform — claims dashboard with case list and detail panel',
    href: 'https://nabauer.com/work/centene-recovery-platform',
    imageSide: 'left',
  },
  {
    number: '02',
    eyebrow: 'Enterprise design infrastructure',
    title: 'Designing systems at scale',
    description:
      "Leading the creation of a healthcare-focused design system that unified internal tools, improved consistency, and accelerated delivery across K-T's product ecosystem.",
    tags: ['Design System', 'Strategy', 'Team Leadership'],
    image: '/assets/work/design-system.webp',
    imageAlt: 'K-T design system — sample of buttons, cards, and form components',
    href: 'https://nabauer.com/work/designing-systems-at-scale',
    imageSide: 'right',
  },
  {
    number: '03',
    eyebrow: 'Daily Noodle',
    title: 'Rethinking mental wellbeing and growth with AI',
    description:
      "A self-initiated AI product: daily journaling teaches an AI a person's emotional and behavioral patterns, then reflects them back with suggestions to support mental growth. Designed end to end — and built with AI.",
    tags: ['AI Product Design', 'Applied AI (LLM)', 'Mental Wellbeing'],
    image: '/assets/work/daily-noodle.webp',
    imageAlt:
      'Daily Noodle — a year-long mood heatmap above streak and entry stats on the Reflect page',
    href: 'https://nabauer.com/work/daily-noodle',
    imageSide: 'left',
  },
]

export const videoItems: VideoItem[] = [
  {
    id: '4EM8RMT-txc',
    title: 'Targeting Niches to Reduce Competition for Clients',
    image: '/assets/videos/niches.webp',
  },
  {
    id: 'iB_jACVo1fs',
    title: 'Resume Length: One Page vs. Two Pages',
    image: '/assets/videos/resume-length.webp',
  },
  {
    id: 'teNepEqbhvw',
    title: "Generalist Designers Have the Advantage in Today's Market",
    image: '/assets/videos/generalist.webp',
  },
  {
    id: 'JAC1lsGO_wo',
    title: 'Transitioning Industries: Finance to Healthcare for Product Designers',
    image: '/assets/videos/industries.webp',
  },
  {
    id: 'G-WYa9nZM9c',
    title: "Understanding Your Portfolio's 3 Target Audiences",
    image: '/assets/videos/audiences.webp',
  },
]

export const articleItems: ArticleItem[] = [
  {
    number: '01',
    category: 'Accessibility',
    title: 'AI Will Revolutionize Accessibility',
    description:
      'AI will transform accessibility by making everyday digital products automatically usable for people with impairments.',
    image: '/assets/articles/accessibility.webp',
    imageAlt: 'Illustration of a robot hand pushing a button',
    href: 'https://nabauer.com/articles/ai-will-revolutionize-accessibility',
  },
  {
    number: '02',
    category: 'Process',
    title: 'How UX Fits in an Agile Framework',
    description:
      'How embracing Agile lets UX teams deliver value early through incremental, test-driven iterations.',
    image: '/assets/articles/agile.webp',
    imageAlt:
      'Diagram comparing the Waterfall development cycle with the Agile development cycle',
    href: 'https://nabauer.com/articles/how-ux-fits-in-an-agile-framework',
  },
  {
    number: '03',
    category: 'Design Systems',
    title: 'Why Build Design Systems?',
    description:
      'How design systems manage complexity, improve consistency, and enable faster work as teams scale.',
    image: '/assets/articles/design-systems.webp',
    imageAlt: 'K-T design system component grid',
    href: 'https://nabauer.com/articles/why-build-design-systems',
  },
  {
    number: '04',
    category: 'Process',
    title: 'An Introduction To Slicing',
    description:
      'Breaking down UX work into incremental, stakeholder-aligned “slices” that map cleanly to Agile sprints.',
    image: '/assets/articles/slicing.webp',
    imageAlt: 'Annotated slice document showing a UX flow with developer-handoff notes',
    href: 'https://nabauer.com/articles/slicing',
  },
]

