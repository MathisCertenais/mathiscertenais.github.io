import { useEffect, useState } from 'react'

const tocByPath: Record<string, Array<[id: string, label: string]>> = {
  '/work/centene-recovery-platform': [
    ['kickoff', 'Kick Off'],
    ['foundation', 'Approach'],
    ['alignment', 'Team Alignment'],
    ['strategy', 'Strategic Focus'],
    ['dualtrack', 'Dual-Track Agile'],
    ['hypothesis', 'Hypothesis'],
    ['designsys', 'Design System'],
    ['slicing', 'Slicing'],
    ['feedback', 'User Feedback'],
    ['outcomes', 'Outcomes'],
    ['design', 'Final Design'],
    ['teamhealth', 'Team Health'],
    ['closing', 'Closing'],
  ],
  '/work/designing-systems-at-scale': [
    ['company', 'Centene'],
    ['problem', 'The Problem'],
    ['goal', 'The Goal'],
    ['kind-of-system', 'Kind of System'],
    ['framework', 'Framework'],
    ['atomic', 'Atomic Principles'],
    ['naming', 'Naming'],
    ['components', 'Components'],
    ['governance', 'Governance'],
    ['pattern-library', 'Pattern Library'],
    ['maturity', 'Maturity'],
    ['patterns', 'Patterns'],
    ['closing', 'Closing'],
  ],
  '/work/daily-noodle': [
    ['intro', 'Overview'],
    ['problem', 'The Problem'],
    ['approach', 'The Approach'],
    ['design', 'Design · Pencil'],
    ['build', 'Build · Claude Code'],
    ['design-calls', 'Design Calls'],
    ['backend', 'Privacy & Data'],
    ['intelligence', 'The AI'],
    ['result', 'The Result'],
    ['validation', 'Validation'],
    ['closing', 'Reflection'],
  ],
}
const emptyToc: Array<[id: string, label: string]> = []

interface CaseStudyTocProps {
  pathname: string
}

export function CaseStudyToc({ pathname }: CaseStudyTocProps) {
  const entries = tocByPath[pathname] ?? emptyToc
  const [activeId, setActiveId] = useState(entries[0]?.[0] ?? '')

  useEffect(() => {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (updates) => {
        updates.forEach((update) => {
          if (update.isIntersecting) visible.add(update.target.id)
          else visible.delete(update.target.id)
        })
        const firstVisible = entries.find(([id]) => visible.has(id))
        if (firstVisible) setActiveId(firstVisible[0])
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0 },
    )

    entries.forEach(([id]) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <aside aria-label="Case study contents" className="case-toc">
      <p className="case-toc-label">On this page</p>
      <ol>
        {entries.map(([id, label]) => (
          <li key={id}>
            <a
              aria-current={activeId === id ? 'true' : undefined}
              href={`#${id}`}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                const section = document.getElementById(id)
                if (!section) return
                event.preventDefault()
                const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth'
                section.scrollIntoView({ behavior, block: 'start' })
                window.history.replaceState({}, '', `${window.location.pathname}#${id}`)
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}
