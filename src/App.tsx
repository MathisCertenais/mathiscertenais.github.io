import { useEffect, useRef } from 'react'
import { NotFoundPage } from './components/NotFoundPage'
import { PortfolioPage } from './components/PortfolioPage'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { useAppLocation } from './routing'
import { applyPageMetadata, notFoundMetadata } from './metadata'
import { getRouteEntry } from './routeManifest'

function App() {
  const location = useAppLocation()
  const previousPathRef = useRef(location.pathname)
  const route = getRouteEntry(location.pathname)
  const isHome = route?.page === 'home'

  useEffect(() => {
    if (route) {
      applyPageMetadata({
        canonicalPath: route.canonical,
        description: route.description,
        ogImage: route.ogImage,
        ogImageAlt: route.ogImageAlt,
        path: route.path,
        robots: route.robots,
        title: route.title,
      })
    } else {
      applyPageMetadata({ ...notFoundMetadata, path: location.pathname })
    }
  }, [location.pathname, route])

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
      {route ? (
        <PortfolioPage key={location.pathname} page={route.page} />
      ) : (
        <NotFoundPage />
      )}
      <SiteFooter />
    </div>
  )
}

export default App
