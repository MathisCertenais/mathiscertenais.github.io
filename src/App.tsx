import { lazy, Suspense, useEffect, useRef } from 'react'
import { NotFoundPage } from './components/NotFoundPage'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { ReferencePage } from './reference/ReferencePage'
import { getReferenceEntry } from './reference/referenceData'
import { LegacyShortsRedirect } from './reference/LegacyShortsRedirect'
import { useAppLocation } from './routing'
import { applyPageMetadata, homeMetadata, notFoundMetadata } from './metadata'

const WhiteboardPage = lazy(() => import('./whiteboard/WhiteboardPage'))

function App() {
  const location = useAppLocation()
  const previousPathRef = useRef(location.pathname)
  const isHome = location.pathname === '/'
  const isWhiteboard = location.pathname === '/whiteboard'
  const isLegacyShorts = location.pathname === '/articles/shorts'
  const entry = getReferenceEntry(location.pathname)

  useEffect(() => {
    if (isHome) {
      applyPageMetadata(homeMetadata)
    } else if (isWhiteboard) {
      applyPageMetadata({
        path: '/whiteboard',
        title: 'Whiteboard | Nate Bauer',
        description: 'A browser-based whiteboard stored locally in this browser.',
        robots: 'noindex, nofollow',
      })
    } else if (!entry && !isLegacyShorts) {
      applyPageMetadata({ ...notFoundMetadata, path: location.pathname })
    }
  }, [entry, isHome, isLegacyShorts, isWhiteboard, location.pathname])

  useEffect(() => {
    const routeChanged = previousPathRef.current !== location.pathname
    previousPathRef.current = location.pathname

    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        target?.scrollIntoView({ block: 'start' })
      } else if (routeChanged) {
        window.scrollTo({ left: 0, top: 0 })
      }

      if (routeChanged) document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  return (
    <div id={isHome ? 'home' : undefined}>
      <SiteHeader currentPath={location.pathname} />
      <div aria-hidden="true" className="nav-spacer" />
      {isWhiteboard ? (
        <Suspense
          fallback={
            <main className="route-loading" id="main-content" tabIndex={-1}>
              <p>Loading whiteboard…</p>
            </main>
          }
        >
          <WhiteboardPage />
        </Suspense>
      ) : isLegacyShorts ? (
        <LegacyShortsRedirect hash={location.hash} />
      ) : entry?.file ? (
        <ReferencePage key={location.pathname} pathname={location.pathname} />
      ) : (
        <NotFoundPage />
      )}
      {isWhiteboard ? null : <SiteFooter />}
    </div>
  )
}

export default App
