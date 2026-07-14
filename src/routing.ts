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
