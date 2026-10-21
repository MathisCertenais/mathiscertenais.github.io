import { AboutPage, ResumePage } from './ProfilePages'
import { ResearchPage } from './ResearchPages'
import { ArticlePage, WritingPage } from './WritingPages'
import { AccessibilityPage } from './AccessibilityPage'
import { ContactPage } from './ContactPage'
import { HomePage } from './HomePage'
import { VideosPage } from './VideosPage'

export function PortfolioPage({ page }: { page: string }) {
  if (page === 'home') return <HomePage />
  if (page === 'research') return <ResearchPage />
  if (page === 'writing') return <WritingPage />
  if (page.startsWith('article:')) return <ArticlePage articleId={page.slice(8)} />
  if (page === 'videos') return <VideosPage />
  if (page === 'about') return <AboutPage />
  if (page === 'resume') return <ResumePage />
  if (page === 'contact') return <ContactPage />
  if (page === 'accessibility') return <AccessibilityPage />
  return null
}
