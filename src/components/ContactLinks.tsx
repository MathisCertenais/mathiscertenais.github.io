import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { NewTabHint } from './NewTabHint'

/**
 * The two direct-contact links, shared by the contact page and the landing page.
 *
 * One component so the email and LinkedIn links cannot drift apart between the
 * places they appear: same order, same labels, same new-tab warning.
 */
export function ContactLinks() {
  const { content, strings } = useLanguage()
  const { identity } = content

  return (
    <>
      <a className="contact-link" href={`mailto:${identity.email}`}>
        {identity.email} <ArrowIcon external />
      </a>
      <a
        className="contact-link"
        href={identity.linkedin}
        rel="noreferrer"
        target="_blank"
      >
        LinkedIn <ArrowIcon external />
        <NewTabHint label={strings.a11y.newTab} />
      </a>
    </>
  )
}
