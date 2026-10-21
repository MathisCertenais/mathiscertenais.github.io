import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import { ThemeToggle } from '../theme/ThemeToggle'
import { ExternalLinkIcon, MenuIcon } from './Icons'
import { LanguageToggle } from './LanguageToggle'

const primaryLinks = [
  { href: '/', key: 'home' },
  { href: '/research', key: 'research' },
  { href: '/insights', key: 'insights' },
  { href: '/videos', key: 'videos' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

const secondaryLinks = [
  { external: false, href: '/resume', key: 'profile' },
  { external: true, href: 'https://www.linkedin.com/in/mathiscertenais', key: 'linkedin' },
] as const

interface SiteHeaderProps {
  currentPath?: string
}

function linkIsCurrent(href: string, currentPath: string) {
  if (href === '/') return currentPath === '/'
  if (href === '/research') {
    return currentPath.startsWith('/research') || currentPath.startsWith('/work')
  }
  if (href === '/insights') {
    return (
      currentPath.startsWith('/insights') ||
      currentPath.startsWith('/writing') ||
      currentPath.startsWith('/articles')
    )
  }
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SiteHeader({ currentPath = '/' }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const restoreMenuFocusRef = useRef(false)
  const { localeHref, strings } = useLanguage()
  const t = strings

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    const menuLinks = Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
    )
    const focusableElements: HTMLElement[] = [...(menuButton ? [menuButton] : []), ...menuLinks]
    const coveredElements = [document.querySelector('main'), document.querySelector('footer')].filter(
      (element): element is HTMLElement => element !== null,
    )
    const previousInertStates = coveredElements.map((element) => element.inert)

    document.body.style.overflow = 'hidden'
    coveredElements.forEach((element) => {
      element.inert = true
    })

    const focusFrame = window.requestAnimationFrame(() => {
      menuLinks[0]?.focus()
    })

    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
    const closeMenuAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        restoreMenuFocusRef.current = false
        setIsOpen(false)
      }
    }

    const manageMenuKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreMenuFocusRef.current = true
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

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
        window.requestAnimationFrame(() => {
          const activeElement = document.activeElement
          if (activeElement instanceof HTMLElement && activeElement.closest('#mobile-navigation')) {
            menuButton?.focus()
          }
        })
      }
    }
  }, [isOpen])

  const closeMenu = () => {
    restoreMenuFocusRef.current = true
    setIsOpen(false)
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.header.skip}
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a
            aria-label={t.header.brandHome}
            className="brand"
            href={localeHref('/')}
            onClick={closeMenu}
            tabIndex={isOpen ? -1 : 0}
          >
            <span aria-hidden="true" className="brand-symbol">
              M.
            </span>
            <span className="brand-name">Mathis Certenais</span>
          </a>

          <nav aria-label={t.header.navigationPrimary} className="desktop-nav desktop-nav--primary">
            {primaryLinks.map((link) => (
              <a
                aria-current={linkIsCurrent(link.href, currentPath) ? 'page' : undefined}
                className="nav-link"
                href={localeHref(link.href)}
                key={link.key}
              >
                {t.nav[link.key]}
              </a>
            ))}
          </nav>

          <div className="desktop-nav desktop-nav--secondary">
            <nav aria-label={t.header.navigationSecondary} className="desktop-nav__links">
              {secondaryLinks.map((link) => (
                <a
                  aria-label={
                    link.external ? t.header.onLinkedin : undefined
                  }
                  aria-current={linkIsCurrent(link.href, currentPath) ? 'page' : undefined}
                  className="nav-link-muted"
                  href={localeHref(link.href)}
                  key={link.key}
                  rel={link.external ? 'noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                >
                  {t.nav[link.key]}
                  {link.external ? <ExternalLinkIcon /> : null}
                </a>
              ))}
            </nav>
            <ThemeToggle className="theme-toggle--desktop" />
            <LanguageToggle className="language-toggle--desktop" />
          </div>

          <ThemeToggle className="theme-toggle--mobile" tabIndex={isOpen ? -1 : 0} />
          <LanguageToggle className="language-toggle--mobile" tabIndex={isOpen ? -1 : 0} />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
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
        <nav aria-label={t.header.navigationMobile} className="mobile-menu__inner">
          <div className="mobile-menu__primary">
            {primaryLinks.map((link) => (
              <a
                aria-current={linkIsCurrent(link.href, currentPath) ? 'page' : undefined}
                href={localeHref(link.href)}
                key={link.key}
                onClick={closeMenu}
                tabIndex={isOpen ? 0 : -1}
              >
                {t.nav[link.key]}
              </a>
            ))}
          </div>
          <div className="mobile-menu__secondary">
            {secondaryLinks.map((link) => (
              <a
                href={localeHref(link.href)}
                key={link.key}
                onClick={closeMenu}
                rel={link.external ? 'noreferrer' : undefined}
                tabIndex={isOpen ? 0 : -1}
                target={link.external ? '_blank' : undefined}
              >
                {t.nav[link.key]} {link.external ? '↗' : ''}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
