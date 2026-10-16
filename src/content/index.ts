import * as en from './en.ts'
import * as fr from './fr.ts'

export * from './en.ts'

export type { Language } from '../locales'

/**
 * The content of each language, behind one name so components and the prerender
 * can take it as a value instead of importing one language directly.
 */
export const contentByLanguage = { en, fr } as const

export type SiteContent = (typeof contentByLanguage)[keyof typeof contentByLanguage]
