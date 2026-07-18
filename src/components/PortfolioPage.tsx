import { AboutPage, ResumePage } from './ProfilePages'
import { ArchivePage, ResourceDetailPage, ResourcesPage } from './ResourcePages'
import { ResearchDetailPage, ResearchPage } from './ResearchPages'
import { ArticlePage, WritingPage } from './WritingPages'
import { ContactPage } from './ContactPage'
import { HomePage } from './HomePage'
import { VideosPage } from './VideosPage'

export function PortfolioPage({ page }: { page: string }) {
  if (page === 'home') return <HomePage />
  if (page === 'research') return <ResearchPage />
  if (page.startsWith('research:')) return <ResearchDetailPage projectId={page.slice(9)} />
  if (page === 'writing') return <WritingPage />
  if (page.startsWith('article:')) return <ArticlePage articleId={page.slice(8)} />
  if (page === 'videos') return <VideosPage />
  if (page === 'about') return <AboutPage />
  if (page === 'resume') return <ResumePage />
  if (page === 'resources') return <ResourcesPage />
  if (page.startsWith('resource:')) return <ResourceDetailPage resourceId={page.slice(9)} />
  if (page === 'archive') return <ArchivePage />
  if (page === 'contact') return <ContactPage />
  return null
}
