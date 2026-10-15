import { videosPage } from '../content'
import { PageHero } from './PageHero'
import { VideoSection } from './VideoSection'

export function VideosPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow={videosPage.eyebrow}
        intro={videosPage.intro}
        title={videosPage.title}
      />
      <VideoSection heading={videosPage.sectionHeading} showAllLink={false} />
    </main>
  )
}
