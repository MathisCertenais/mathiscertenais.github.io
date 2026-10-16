import { useLanguage } from '../language/LanguageProvider'

export function NotFoundPage() {
  const { localeHref } = useLanguage()

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="not-found-page">
        <p className="section-label">404</p>
        <h1>Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <a className="button button--primary" href={localeHref('/')}>
          Back to home
        </a>
        <nav aria-label="Suggested pages">
          <span>Or jump to:</span>
          <a className="nav-link" href={localeHref('/research')}>
            Research
          </a>
          <a className="nav-link" href={localeHref('/writing')}>
            Insights
          </a>
          <a className="nav-link" href={localeHref('/about')}>
            About
          </a>
          <a className="nav-link" href={localeHref('/contact')}>
            Contact
          </a>
        </nav>
      </section>
    </main>
  )
}
