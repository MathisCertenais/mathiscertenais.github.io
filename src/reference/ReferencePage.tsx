import { useEffect, useRef, useState } from 'react'
import { applyPageMetadata } from '../metadata'
import { ReadingProgress } from './ReadingProgress'
import { ReferenceInteractions } from './ReferenceInteractions'
import { CaseStudyToc } from './CaseStudyToc'
import { getReferenceEntry, loadReferenceHtml } from './referenceData'
import { sanitizeReferenceHtml } from './sanitizeReferenceHtml'

interface ReferencePageProps {
  pathname: string
}

export function ReferencePage({ pathname }: ReferencePageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const focusAfterLoadRef = useRef(false)
  const entry = getReferenceEntry(pathname)
  const [html, setHtml] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const showsReadingProgress =
    pathname.startsWith('/work/') ||
    pathname.startsWith('/articles/') ||
    pathname.startsWith('/archive/')

  useEffect(() => {
    if (!entry) return
    applyPageMetadata({ ...entry, path: pathname })
  }, [entry, pathname])

  useEffect(() => {
    let active = true

    if (!entry?.file) return () => undefined
    void loadReferenceHtml(entry.file)
      .then((markup) => {
        if (!active) return
        if (markup === undefined) throw new Error(`Missing generated page module: ${entry.file}`)
        focusAfterLoadRef.current =
          document.activeElement?.classList.contains('route-loading') ?? false
        setHtml(sanitizeReferenceHtml(markup))
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [entry])

  useEffect(() => {
    if (!html || !focusAfterLoadRef.current) return
    focusAfterLoadRef.current = false
    const frame = window.requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLElement>('#main-content')
        ?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [html])

  useEffect(() => {
    if (!html || !window.location.hash) return
    const frame = window.requestAnimationFrame(() => {
      if (pathname === '/articles') {
        window.dispatchEvent(new HashChangeEvent('hashchange'))
        return
      }
      document
        .getElementById(decodeURIComponent(window.location.hash.slice(1)))
        ?.scrollIntoView({ block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [html, pathname])

  if (loadError) {
    return (
      <main className="route-loading route-error" id="main-content" tabIndex={-1}>
        <div>
          <p>This page could not be loaded.</p>
          <button onClick={() => window.location.reload()} type="button">
            Try again
          </button>
        </div>
      </main>
    )
  }

  if (html === null) {
    return (
      <main className="route-loading" id="main-content" tabIndex={-1}>
        <p>Loading page…</p>
      </main>
    )
  }

  if (!html) return null

  return (
    <>
      {showsReadingProgress ? <ReadingProgress /> : null}
      <div
        className="reference-page"
        data-reference-path={pathname}
        dangerouslySetInnerHTML={{ __html: html }}
        ref={rootRef}
      />
      {pathname.startsWith('/work/') ? <CaseStudyToc pathname={pathname} /> : null}
      <ReferenceInteractions pathname={pathname} rootRef={rootRef} />
    </>
  )
}
