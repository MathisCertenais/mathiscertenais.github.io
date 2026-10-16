import { useLanguage } from '../language/LanguageProvider'
/* Adresse et profil sont les mêmes dans les deux langues : ils servent à bâtir
   la liste des liens, hors composant, donc hors contexte de langue. */
import { identity as contactIdentity } from '../content/en'
import { ArrowIcon } from './Icons'

interface FooterGroup {
  key: 'elsewhere' | 'navigation'
  columns?: boolean
  links: Array<{
    key: 'about' | 'contact' | 'email' | 'insights' | 'linkedin' | 'profile' | 'research' | 'videos'
    href: string
    newTab?: boolean
  }>
}

const footerGroups: FooterGroup[] = [
  {
    key: 'navigation',
    columns: true,
    links: [
      { href: '/research', key: 'research' },
      { href: '/insights', key: 'insights' },
      { href: '/videos', key: 'videos' },
      { href: '/about', key: 'about' },
      { href: '/contact', key: 'contact' },
      { href: '/resume', key: 'profile' },
    ],
  },
  {
    key: 'elsewhere',
    links: [
      { href: contactIdentity.linkedin, key: 'linkedin', newTab: true },
      { href: `mailto:${contactIdentity.email}`, key: 'email' },
    ],
  },
]

export function SiteFooter() {
  const { content, localeHref, strings } = useLanguage()
  const { identity } = content
  const t = strings

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-cta section">
        <div>
          <p className="section-label">{t.footer.ctaLabel}</p>
          <h2>{t.footer.ctaTitle}</h2>
        </div>
        <div className="footer-cta__actions">
          <a className="button button--primary" href={localeHref('/contact')}>
            {t.footer.getInTouch} <ArrowIcon />
          </a>
          <a
            className="button button--secondary"
            href={identity.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            {t.footer.connectOnLinkedin} <ArrowIcon external />
          </a>
        </div>
      </div>

      <div className="footer-links section">
        <div className="footer-brand">
          <a aria-label={t.footer.brandHome} className="footer-wordmark" href={localeHref('/')}>
            <span aria-hidden="true">M.</span> Mathis Certenais
          </a>
          <p>{t.footer.description}</p>
        </div>

        {footerGroups.map((group) => (
          <nav
            aria-label={t.footer.linksAria[group.key]}
            className={group.columns ? 'footer-group footer-group--columns' : 'footer-group'}
            key={group.key}
          >
            <h3>{t.footer.groups[group.key]}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.key}>
                  <a
                    href={localeHref(link.href)}
                    rel={link.newTab ? 'noreferrer' : undefined}
                    target={link.newTab ? '_blank' : undefined}
                  >
                    {t.nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  )
}
