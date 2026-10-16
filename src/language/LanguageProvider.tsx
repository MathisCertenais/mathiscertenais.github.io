/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { contentByLanguage, type SiteContent } from '../content'
import { locales, type Language } from '../locales'
import { navigate } from '../routing'

export const LANGUAGE_STORAGE_KEY = 'mathis-personal-website:language'

interface LanguageContextValue {
  /** The content of the current language, same shape as the English module. */
  content: SiteContent
  /** An article by id, from the current language. */
  getArticle: (id: string) => SiteContent['articleItems'][number] | undefined
  language: Language
  /** A route in the current language: `/research` becomes `/fr/research`. */
  localeHref: (path: string) => string
  setLanguage: (language: Language) => void
  strings: (typeof locales)[Language]
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'fr'
}

function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

/**
 * A French page lives under /fr, so the path decides the language when it says
 * something — a shared link keeps its language whatever the reader stored
 * before. Everything else falls back to the stored preference, then to English.
 */
function readLanguageFromPath(): Language | null {
  if (typeof window === 'undefined') return null
  return /^\/fr(?:\/|$)/.test(window.location.pathname) ? 'fr' : null
}

/**
 * A route in a given language, in the form the host actually serves: every path
 * but the root carries a trailing slash, which is what the canonical tag and the
 * sitemap declare. One function so links and the toggle cannot disagree.
 *
 * Only site routes are localized. Anything that is not a site-absolute path —
 * an https: address, a mailto:, a bare fragment — is handed back untouched, so
 * the language prefix and the trailing slash never land in an address the site
 * does not serve (`/frhttps://…`, `/frmailto:…`).
 */
export function localizedHref(path: string, language: Language) {
  if (!path.startsWith('/')) return path

  const bare = path === '/' ? '/' : path.replace(/\/+$/, '')

  if (language === 'fr') return bare === '/' ? '/fr/' : `/fr${bare}/`
  return bare === '/' ? '/' : `${bare}/`
}

function persistLanguage(language: Language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // The switch keeps working when storage is unavailable.
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    () => readLanguageFromPath() ?? readStoredLanguage() ?? 'en',
  )

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    persistLanguage(next)
  }, [])

  const toggleLanguage = useCallback(() => {
    const next = language === 'fr' ? 'en' : 'fr'
    setLanguage(next)

    // The URL carries the language, so a French page can be shared as such:
    // /research becomes /fr/research, and back.
    const current = window.location.pathname
    const bare = /^\/fr(\/|$)/.test(current) ? current.replace(/^\/fr/, '') || '/' : current
    const target = localizedHref(bare, next)

    if (target !== current) navigate(target)
  }, [language, setLanguage])

  const content = contentByLanguage[language]

  const localeHref = useCallback((path: string) => localizedHref(path, language), [language])

  const getArticle = useCallback(
    (id: string) => content.articleItems.find((article) => article.id === id),
    [content],
  )

  // Announced to assistive technology and search engines.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      content,
      getArticle,
      language,
      localeHref,
      setLanguage,
      strings: locales[language],
      toggleLanguage,
    }),
    [content, getArticle, language, localeHref, setLanguage, toggleLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
