import { useEffect, useState } from 'react'

export interface AppLocation {
  hash: string
  pathname: string
}

function normalizePathname(pathname: string) {
  if (pathname.length <= 1) return '/'
  return pathname.replace(/\/+$/, '')
}

function readLocation(): AppLocation {
  return {
    pathname: normalizePathname(window.location.pathname),
    hash: window.location.hash,
  }
}

function locationIsAFile(pathname: string) {
  return /\/[^/]+\.[a-z0-9]+$/i.test(pathname)
}

export function navigate(href: string, replace = false) {
  const url = new URL(href, window.location.href)
  const nextHref = `${url.pathname}${url.search}${url.hash}`

  if (replace) window.history.replaceState({}, '', nextHref)
  else window.history.pushState({}, '', nextHref)

  window.dispatchEvent(new Event('app:navigate'))
}

/**
 * The offset of a navigation that must not send the reader back to the top,
 * recorded here and consumed by the route effect in `App`. In memory on purpose:
 * the value describes one navigation in the running tab, not a page state worth
 * surviving a reload.
 */
let preservedScrollY: number | null = null

/**
 * The same page under another address: switching language keeps the reader where
 * they were reading, so the offset is recorded before the route changes and the
 * route effect restores it instead of scrolling to the top.
 */
export function navigatePreservingScroll(href: string) {
  preservedScrollY = window.scrollY
  navigate(href)
}

/**
 * Reads and clears the offset. Clearing happens on every call, whether the
 * reader ends up needing it or not: an offset that is never restored must not
 * leak into the next navigation and displace a page the reader did not ask for.
 */
export function takePreservedScroll(): number | null {
  const scrollY = preservedScrollY
  preservedScrollY = null
  return scrollY
}

export function useAppLocation() {
  const [location, setLocation] = useState<AppLocation>(readLocation)

  useEffect(() => {
    const updateLocation = () => setLocation(readLocation())
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (locationIsAFile(url.pathname) || url.pathname.startsWith('/cdn-cgi/')) return
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash
      ) {
        return
      }

      event.preventDefault()
      navigate(`${url.pathname}${url.search}${url.hash}`)
    }

    window.addEventListener('popstate', updateLocation)
    window.addEventListener('app:navigate', updateLocation)
    document.addEventListener('click', handleDocumentClick)

    return () => {
      window.removeEventListener('popstate', updateLocation)
      window.removeEventListener('app:navigate', updateLocation)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return location
}
