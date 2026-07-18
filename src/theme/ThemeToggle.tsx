import { useTheme } from './ThemeProvider'

interface ThemeToggleProps {
  className?: string
  tabIndex?: number
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function ThemeToggle({ className, tabIndex }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`

  return (
    <button
      aria-label={label}
      aria-pressed={isDark}
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      data-theme={resolvedTheme}
      onClick={toggleTheme}
      style={{
        alignItems: 'center',
        background: 'transparent',
        border: 0,
        borderRadius: 10,
        color: 'var(--text-dark)',
        cursor: 'pointer',
        display: 'inline-flex',
        flex: '0 0 38px',
        height: 38,
        justifyContent: 'center',
        padding: 0,
        touchAction: 'manipulation',
        width: 38,
      }}
      tabIndex={tabIndex}
      title={label}
      type="button"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
