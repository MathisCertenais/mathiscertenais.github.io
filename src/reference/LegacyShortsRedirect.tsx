import { useEffect } from 'react'
import { navigate } from '../routing'

interface LegacyShortsRedirectProps {
  hash: string
}

export function LegacyShortsRedirect({ hash }: LegacyShortsRedirectProps) {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => navigate(`/articles${hash}`, true))
    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  return (
    <main className="route-loading" id="main-content" tabIndex={-1}>
      <p>Opening writing…</p>
    </main>
  )
}
