import { useEffect, useRef, useState } from 'react'
import { ExternalLinkIcon, MenuIcon } from './Icons'

const primaryLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Writing', href: '#writing' },
  { label: 'Videos', href: '#videos' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const secondaryLinks = [
  { label: 'Résumé', href: 'https://nabauer.com/resume', external: false },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nabauer/',
    external: true,
  },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const restoreMenuFocusRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    const menuLinks = Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
    )
    const focusableElements: HTMLElement[] = [...(menuButton ? [menuButton] : []), ...menuLinks]
    const desktopMediaQuery = window.matchMedia('(min-width: 769px)')
    const coveredElements = [
      document.querySelector<HTMLElement>('.skip-link'),
      document.querySelector<HTMLElement>('main'),
      document.querySelector<HTMLElement>('.site-footer'),
    ].filter((element): element is HTMLElement => element !== null)
    const previousInertStates = coveredElements.map((element) => element.inert)

    const closeMenuAtDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      restoreMenuFocusRef.current = false
      setIsOpen(false)
    }

    const manageMenuKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        restoreMenuFocusRef.current = true
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)
      const activeElement = document.activeElement
      const activeElementIsInLoop = focusableElements.some((element) => element === activeElement)

      if (event.shiftKey && (activeElement === firstElement || !activeElementIsInLoop)) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && (activeElement === lastElement || !activeElementIsInLoop)) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    coveredElements.forEach((element) => {
      element.inert = true
    })
    const focusFrame = window.requestAnimationFrame(() => menuLinks[0]?.focus())
    desktopMediaQuery.addEventListener('change', closeMenuAtDesktop)
    window.addEventListener('keydown', manageMenuKeyboard)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      coveredElements.forEach((element, index) => {
        element.inert = previousInertStates[index] ?? false
      })
      desktopMediaQuery.removeEventListener('change', closeMenuAtDesktop)
      window.removeEventListener('keydown', manageMenuKeyboard)

      if (restoreMenuFocusRef.current) {
        restoreMenuFocusRef.current = false
        window.requestAnimationFrame(() => menuButton?.focus())
      }
    }
  }, [isOpen])

  const closeMenu = (href?: string) => {
    setIsOpen(false)

    if (!href?.startsWith('#')) return

    window.requestAnimationFrame(() => {
      const selector = href === '#home' ? '#main-content' : href
      const target = document.querySelector<HTMLElement>(selector)
      if (!target) return

      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    })
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a
            aria-label="Nate Bauer — Home"
            className="brand"
            href="#home"
            onClick={() => closeMenu('#home')}
            tabIndex={isOpen ? -1 : 0}
          >
            <img alt="" height="28" src="/assets/logo.webp" width="140" />
          </a>

          <nav aria-label="Primary navigation" className="desktop-nav desktop-nav--primary">
            {primaryLinks.map((link, index) => (
              <a
                aria-current={index === 0 ? 'page' : undefined}
                className="nav-link"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Secondary navigation" className="desktop-nav desktop-nav--secondary">
            {secondaryLinks.map((link) => (
              <a
                aria-label={link.external ? `${link.label} (opens in new tab)` : undefined}
                className="nav-link-muted"
                href={link.href}
                key={link.label}
                rel={link.external ? 'noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
              >
                {link.label}
                {link.external ? <ExternalLinkIcon /> : null}
              </a>
            ))}
          </nav>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="menu-button"
            onClick={() => {
              if (isOpen) restoreMenuFocusRef.current = true
              setIsOpen((current) => !current)
            }}
            ref={menuButtonRef}
            type="button"
          >
            <MenuIcon open={isOpen} />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!isOpen}
        className={`mobile-menu${isOpen ? ' mobile-menu--open' : ''}`}
        id="mobile-navigation"
        ref={mobileMenuRef}
      >
        <nav aria-label="Mobile navigation" className="mobile-menu__inner">
          <div className="mobile-menu__primary">
            {primaryLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                onClick={() => closeMenu(link.href)}
                tabIndex={isOpen ? 0 : -1}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mobile-menu__secondary">
            {secondaryLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                onClick={() => closeMenu(link.href)}
                rel={link.external ? 'noreferrer' : undefined}
                tabIndex={isOpen ? 0 : -1}
                target={link.external ? '_blank' : undefined}
              >
                {link.label} {link.external ? '↗' : ''}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
