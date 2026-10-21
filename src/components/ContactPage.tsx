import { useState, type FormEvent } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { BusinessCard } from './BusinessCard'
import { NewTabHint } from './NewTabHint'
import { PageHero } from './PageHero'

type FormStatus = 'error' | 'idle' | 'sending' | 'success'

type FormField = 'email' | 'message' | 'name'
type FormErrors = Partial<Record<FormField, string>>

/**
 * Where a submitted message actually goes.
 *
 * `web3forms` posts to the hosted form service, which emails the message to
 * Mathis: the site has no server of its own, so a hosted transport is what makes
 * the form deliver rather than merely prepare. `endpoint` is the same contract
 * against a URL he controls, and `mailto` is the last resort — it hands the
 * visitor a prefilled draft instead of pretending the site sent anything.
 */
type Transport =
  | { kind: 'web3forms'; accessKey: string }
  | { kind: 'endpoint'; endpoint: string }
  | { kind: 'mailto' }

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/** Trimmed, non-empty string, or null. The env values are `any` in the Vite types. */
function configured(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function resolveTransport(): Transport {
  const accessKey = configured(import.meta.env.VITE_WEB3FORMS_KEY)
  if (accessKey) return { kind: 'web3forms', accessKey }

  const endpoint = configured(import.meta.env.VITE_CONTACT_ENDPOINT)
  if (endpoint && /^https?:\/\//.test(endpoint)) return { kind: 'endpoint', endpoint }

  return { kind: 'mailto' }
}

function readField(data: FormData, field: string): string {
  const value = data.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

export function ContactPage() {
  const { content, strings } = useLanguage()
  const { contactPage, identity } = content
  const [status, setStatus] = useState<FormStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [mailtoHref, setMailtoHref] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const clearError = (field: FormField) => {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = readField(data, 'name')
    const replyTo = readField(data, 'email')
    const message = readField(data, 'message')
    const nextErrors: FormErrors = {}

    if (!name) nextErrors.name = strings.pages.errorRequired
    if (!replyTo) nextErrors.email = strings.pages.errorRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) nextErrors.email = strings.pages.errorEmail
    if (!message) nextErrors.message = strings.pages.errorRequired

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstField = (['name', 'email', 'message'] as const).find((field) => nextErrors[field])
      if (firstField) form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus()
      return
    }

    setErrors({})
    void sendForm(form)
  }

  const sendForm = async (form: HTMLFormElement) => {
    const data = new FormData(form)
    const name = readField(data, 'name')
    const replyTo = readField(data, 'email')
    const message = readField(data, 'message')
    const subject = `Portfolio message from ${name}`

    // Whether no transport is configured or the request failed, the sender keeps
    // a way to deliver the same message, so a submission is never silently lost.
    const offerDraft = () => {
      const body = `${message}\n\nFrom: ${name}\nReply to: ${replyTo}`
      setMailtoHref(
        `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      )
    }

    setStatus('sending')
    setStatusMessage(strings.pages.statusSending)
    setMailtoHref(null)

    const transport = resolveTransport()

    if (transport.kind === 'mailto') {
      offerDraft()
      setStatus('success')
      setStatusMessage(strings.pages.statusReady)
      return
    }

    try {
      let response: Response
      if (transport.kind === 'web3forms') {
        // Sent as form data with no headers on purpose: that keeps it a simple
        // request, so the browser skips the CORS preflight. The preflight is what
        // fails here — the service answers the OPTIONS with a Cloudflare challenge
        // instead of CORS headers, and a JSON body with a `Content-Type` header
        // would drag the submission into exactly that failure.
        const payload = new FormData()
        payload.set('access_key', transport.accessKey)
        payload.set('name', name)
        payload.set('email', replyTo)
        payload.set('message', message)
        payload.set('subject', subject)
        payload.set('from_name', 'mathiscertenais.com')
        payload.set('replyto', replyTo)
        // Honeypot: the field is off-screen, so only a bot fills it, and a filled
        // one tells the service to drop the submission.
        if (readField(data, 'botcheck')) payload.set('botcheck', 'true')

        response = await fetch(WEB3FORMS_ENDPOINT, { body: payload, method: 'POST' })
      } else {
        response = await fetch(transport.endpoint, {
          body: data,
          headers: { Accept: 'application/json' },
          method: 'POST',
        })
      }

      if (!response.ok) throw new Error(`Contact transport returned ${response.status}`)

      form.reset()
      setStatus('success')
      setStatusMessage(strings.pages.statusSent)
    } catch {
      offerDraft()
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
            <NewTabHint label={strings.a11y.newTab} />
          </a>
        </div>

        <form className="contact-form" noValidate onSubmit={submitForm}>
          <div className="contact-form__field">
            <label htmlFor="contact-name">
              {strings.pages.formName}{' '}
              <span aria-hidden="true" className="contact-form__required">
                *
              </span>
            </label>
            <input
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              aria-invalid={errors.name ? true : undefined}
              autoComplete="name"
              id="contact-name"
              name="name"
              onChange={() => clearError('name')}
              required
              type="text"
            />
            {errors.name ? (
              <p className="contact-form__error" id="contact-name-error">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-email">
              {strings.pages.formEmail}{' '}
              <span aria-hidden="true" className="contact-form__required">
                *
              </span>
            </label>
            <input
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              aria-invalid={errors.email ? true : undefined}
              autoComplete="email"
              id="contact-email"
              name="email"
              onChange={() => clearError('email')}
              required
              type="email"
            />
            {errors.email ? (
              <p className="contact-form__error" id="contact-email-error">
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-message">
              {strings.pages.formMessage}{' '}
              <span aria-hidden="true" className="contact-form__required">
                *
              </span>
            </label>
            <textarea
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              aria-invalid={errors.message ? true : undefined}
              id="contact-message"
              name="message"
              onChange={() => clearError('message')}
              required
              rows={7}
            />
            {errors.message ? (
              <p className="contact-form__error" id="contact-message-error">
                {errors.message}
              </p>
            ) : null}
          </div>
          <p className="contact-form__note">{strings.pages.requiredNote}</p>
          {/*
            Honeypot. Off-screen and out of the tab order, so no visitor reaches
            it; its label is deliberately untranslated because no visitor reads
            it — it only has to look like a field worth filling to a bot.
          */}
          <label aria-hidden="true" className="contact-form__trap">
            <span>Company</span>
            <input autoComplete="off" name="botcheck" tabIndex={-1} type="checkbox" />
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
              {mailtoHref ? (
                <a href={mailtoHref}>
                  {strings.pages.openMailApp} <ArrowIcon external />
                </a>
              ) : null}
            </div>
          ) : null}
        </form>

        {/*
          Kept out of the visible page but still in the document: the print and
          social export (`pnpm card:pdf`, `card:jpg`, `social:png`) capture the
          card from this markup. `display: none` on screen keeps it off the
          contact page while the print stylesheet still finds it.
        */}
        <div aria-hidden="true" className="contact-card">
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
