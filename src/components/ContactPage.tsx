import { useState, type FormEvent } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { BusinessCard } from './BusinessCard'
import { PageHero } from './PageHero'

type FormStatus = 'error' | 'idle' | 'sending' | 'success'

export function ContactPage() {
  const { content, strings } = useLanguage()
  const { contactPage, identity } = content
  const [status, setStatus] = useState<FormStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [mailtoHref, setMailtoHref] = useState<string | null>(null)

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    void sendForm(form)
  }

  const sendForm = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    const endpoint: unknown = import.meta.env.VITE_CONTACT_ENDPOINT
    const configuredEndpoint =
      typeof endpoint === 'string' && /^https?:\/\//.test(endpoint.trim()) ? endpoint.trim() : null

    setStatus('sending')
    setStatusMessage(strings.pages.statusSending)
    setMailtoHref(null)

    if (!configuredEndpoint) {
      const readTextField = (fieldName: string) => {
        const value = data.get(fieldName)
        return typeof value === 'string' ? value.trim() : ''
      }
      const name = readTextField('name')
      const replyTo = readTextField('email')
      const message = readTextField('message')
      const subject = encodeURIComponent(`Portfolio message from ${name}`)
      const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${replyTo}`)

      setMailtoHref(`mailto:${identity.email}?subject=${subject}&body=${body}`)
      setStatus('success')
      setStatusMessage(strings.pages.statusReady)
      return
    }

    try {
      const response = await fetch(configuredEndpoint, {
        body: data,
        headers: { Accept: 'application/json' },
        method: 'POST',
      })
      if (!response.ok) throw new Error(`Contact endpoint returned ${response.status}`)
      form.reset()
      setStatus('success')
      setStatusMessage(strings.pages.statusSent)
    } catch {
      setStatus('error')
      setStatusMessage(`${strings.pages.statusError} ${identity.email}.`)
    }
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Contact"
        intro={strings.pages.contactRoutes}
        title={strings.pages.contactTitle}
      />

      <section className="contact-layout section">
        <div className="contact-details">
          <p className="section-label">{strings.pages.directContact}</p>
          <h2>{strings.pages.contactStart}</h2>
          <p>{contactPage.intro}</p>
          <a href={`mailto:${identity.email}`}>
            {identity.email} <ArrowIcon external />
          </a>
          <a href={identity.linkedin} rel="noreferrer" target="_blank">
            LinkedIn <ArrowIcon external />
          </a>
        </div>

        <form className="contact-form" onSubmit={submitForm}>
          <label>
            <span>{strings.pages.formName}</span>
            <input autoComplete="name" name="name" required type="text" />
          </label>
          <label>
            <span>{strings.pages.formEmail}</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            <span>{strings.pages.formMessage}</span>
            <textarea name="message" required rows={7} />
          </label>
          <button className="button button--primary" disabled={status === 'sending'} type="submit">
            {status === 'sending' ? strings.pages.sending : strings.pages.send} <ArrowIcon />
          </button>
          {status !== 'idle' ? (
            <div
              aria-live="polite"
              className={`contact-form-status${status === 'error' ? ' is-error' : ''}${status === 'success' ? ' is-success' : ''}`}
              role="status"
            >
              <p>{statusMessage}</p>
              {mailtoHref ? <a href={mailtoHref}>Open email app <ArrowIcon external /></a> : null}
            </div>
          ) : null}
        </form>

        <div className="contact-card">
          <p className="section-label">{strings.pages.cardLabel}</p>
          <h2>{strings.pages.cardHeading}</h2>
          <p className="contact-card__intro">
            {strings.pages.cardIntro}
          </p>
          <div className="contact-card__frame">
            <BusinessCard />
          </div>
          <div className="share-card">
            <BusinessCard variant="share" />
          </div>
        </div>
      </section>
    </main>
  )
}
