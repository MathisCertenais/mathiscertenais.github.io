import { useEffect } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import type { ResolvedTheme } from '../theme/ThemeProvider'

export default function WhiteboardPage({ resolvedTheme }: { resolvedTheme: ResolvedTheme }) {
  useEffect(() => {
    document.documentElement.classList.remove('wb-leaving')
    document.documentElement.classList.add('wb-active')

    return () => {
      document.documentElement.classList.remove('wb-active')
    }
  }, [])

  return (
    <main className="whiteboard-page" id="main-content" tabIndex={-1}>
      <Tldraw
        colorScheme={resolvedTheme}
        components={{ PageMenu: null }}
        options={{ maxPages: 1 }}
        persistenceKey="mathis-certenais-whiteboard"
      />
    </main>
  )
}
