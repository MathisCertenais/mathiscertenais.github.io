import { ArrowIcon } from './Icons'

interface FooterGroup {
  title: string
  links: Array<{
    label: string
    href: string
    external?: boolean
  }>
}

const footerGroups: FooterGroup[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Résumé', href: 'https://nabauer.com/resume' },
    ],
  },
  {
    title: 'Reading',
    links: [
      { label: 'Writing', href: '#writing' },
      { label: 'Archive', href: 'https://nabauer.com/archive' },
      { label: 'Resources', href: 'https://nabauer.com/resources' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/nabauer/', external: true },
      { label: 'ADPList ↗', href: 'https://adplist.org/mentors/nate-bauer', external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-cta section">
        <div>
          <p className="section-label">Let&apos;s connect</p>
          <h2>
            Interested in working
            <br />
            together?
          </h2>
        </div>
        <div className="footer-cta__actions">
          <a className="button button--primary" href="https://nabauer.com/contact">
            Get in touch <ArrowIcon />
          </a>
          <a
            className="button button--secondary"
            href="https://adplist.org/mentors/nate-bauer"
            rel="noreferrer"
            target="_blank"
          >
            Book a mentoring session <ArrowIcon external />
          </a>
        </div>
      </div>

      <div className="footer-links section">
        <div className="footer-brand">
          <a aria-label="Nate Bauer — Home" href="#home">
            <img alt="" height="24" loading="lazy" src="/assets/logo.webp" width="120" />
          </a>
          <p>
            Lead Product Designer focused on healthcare systems and scalable design infrastructure.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav aria-label={`${group.title} links`} className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    rel={link.external ? 'noreferrer' : undefined}
                    target={link.external ? '_blank' : undefined}
                  >
                    {link.label}
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
