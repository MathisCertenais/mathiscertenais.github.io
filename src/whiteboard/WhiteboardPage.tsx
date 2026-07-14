import { useEffect } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function WhiteboardPage() {
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
        components={{ PageMenu: null }}
        options={{ maxPages: 1 }}
        persistenceKey="nabauer-whiteboard"
      />
    </main>
  )
}
