import { ArrowIcon } from './Icons'
import { identity } from '../content'

interface FooterGroup {
  title: string
  links: Array<{
    label: string
    href: string
    newTab?: boolean
  }>
}

const footerGroups: FooterGroup[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'Research', href: '/research' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Profile', href: '/resume' },
    ],
  },
  {
    title: 'Reading',
    links: [
      { label: 'Writing', href: '/writing' },
      { label: 'Archive', href: '/archive' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'LinkedIn ↗', href: identity.linkedin, newTab: true },
      { label: 'Email', href: `mailto:${identity.email}` },
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
            Interested in research
            <br />
            collaboration?
          </h2>
        </div>
        <div className="footer-cta__actions">
          <a className="button button--primary" href="/contact">
            Get in touch <ArrowIcon />
          </a>
          <a
            className="button button--secondary"
            href={identity.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            Connect on LinkedIn <ArrowIcon external />
          </a>
        </div>
      </div>

      <div className="footer-links section">
        <div className="footer-brand">
          <a aria-label="Mathis Certenais — Home" className="footer-wordmark" href="/">
            <span aria-hidden="true">M.</span> Mathis Certenais
          </a>
          <p>
            Computer scientist researching HPC, data logistics, and cross-facility scientific workflows.
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
                    rel={link.newTab ? 'noreferrer' : undefined}
                    target={link.newTab ? '_blank' : undefined}
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
