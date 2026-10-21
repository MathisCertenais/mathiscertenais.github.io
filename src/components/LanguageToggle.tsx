import { useLanguage } from '../language/LanguageProvider'

interface LanguageToggleProps {
  className?: string
  tabIndex?: number
}

/**
 * Sits beside the theme control. It shows the language it switches to, the way
 * the theme control shows the mode it switches to, and carries its label in that
 * language so a screen reader announces it correctly either way.
 */
export function LanguageToggle({ className, tabIndex }: LanguageToggleProps) {
  const { language, strings, toggleLanguage } = useLanguage()

  return (
    <button
      className={['language-toggle', className].filter(Boolean).join(' ')}
      data-language={language}
      lang={language === 'fr' ? 'en' : 'fr'}
      onClick={toggleLanguage}
      style={{
        alignItems: 'center',
        background: 'transparent',
        border: 0,
        borderRadius: 10,
        color: 'var(--text-dark)',
        cursor: 'pointer',
        display: 'inline-flex',
        flex: '0 0 38px',
        fontSize: 13,
        fontWeight: 600,
        height: 38,
        justifyContent: 'center',
        letterSpacing: '0.06em',
        padding: 0,
        touchAction: 'manipulation',
        width: 38,
      }}
      tabIndex={tabIndex}
      title={strings.language.aria}
      type="button"
    >
      {strings.language.code}
      <span className="visually-hidden"> — {strings.language.aria}</span>
    </button>
  )
}
