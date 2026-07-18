import { useState, type FormEvent } from 'react'
import { identity } from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'

type FormStatus = 'error' | 'idle' | 'sending' | 'success'

export function ContactPage() {
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
    setStatusMessage('Sending your message…')
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
      setStatusMessage('Your message is ready. Open it in your email app to send it to Mathis.')
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
      setStatusMessage('Thank you — your message has been sent.')
    } catch {
      setStatus('error')
      setStatusMessage(`The form could not send right now. Please email ${identity.email} directly.`)
    }
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Contact"
        intro="For research conversations, collaboration, talks, or questions about HPC and scientific workflows, the simplest route is email or LinkedIn."
        title="Let’s connect the systems."
      />

      <section className="contact-layout section">
        <div className="contact-details">
          <p className="section-label">Direct contact</p>
          <h2>Start a conversation.</h2>
          <p>
            Mathis is based in Rennes, France and works across computer science, HPC, and radio astronomy.
          </p>
          <a href={`mailto:${identity.email}`}>
            {identity.email} <ArrowIcon external />
          </a>
          <a href={identity.linkedin} rel="noreferrer" target="_blank">
            LinkedIn <ArrowIcon external />
          </a>
        </div>

        <form className="contact-form" onSubmit={submitForm}>
          <label>
            <span>Name</span>
            <input autoComplete="name" name="name" required type="text" />
          </label>
          <label>
            <span>Email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" required rows={7} />
          </label>
          <button className="button button--primary" disabled={status === 'sending'} type="submit">
            {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowIcon />
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
      </section>
    </main>
  )
}
