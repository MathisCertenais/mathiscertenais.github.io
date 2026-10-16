import { useLanguage } from '../language/LanguageProvider'
import { PageHero } from './PageHero'
import { VideoSection } from './VideoSection'

export function VideosPage() {
  const { content } = useLanguage()
  const { videosPage } = content

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
