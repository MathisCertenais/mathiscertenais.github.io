import { PageHero } from './PageHero'
import { VideoSection } from './VideoSection'

export function VideosPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Videos"
        intro="Interviews, webinars, and collaborative research events from Mathis’s work with ECLAT and the radio-astronomy community."
        title="Research, explained in context."
      />
      <VideoSection heading="Watch & listen" showAllLink={false} />
    </main>
  )
}
