import { Hero } from './components/Hero'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { VideoSection } from './components/VideoSection'
import { WorkSection } from './components/WorkSection'
import { WritingSection } from './components/WritingSection'

function App() {
  return (
    <div id="home">
      <SiteHeader />
      <div aria-hidden="true" className="nav-spacer" />
      <main id="main-content">
        <Hero />
        <WorkSection />
        <VideoSection />
        <WritingSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
