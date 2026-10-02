import { Hero } from './Hero'
import { ResearchSection } from './ResearchSection'
import { VideoSection } from './VideoSection'
import { WritingSection } from './WritingSection'

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <ResearchSection />
      <VideoSection />
      <WritingSection />
    </main>
  )
}
