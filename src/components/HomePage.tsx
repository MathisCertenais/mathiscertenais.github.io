import { Hero } from './Hero'
import { VideoSection } from './VideoSection'
import { WorkSection } from './WorkSection'
import { WritingSection } from './WritingSection'

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <WorkSection />
      <VideoSection />
      <WritingSection />
    </main>
  )
}
