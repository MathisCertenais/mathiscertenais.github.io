import type { ProofKind } from '../content'

export function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <span aria-hidden="true" className={external ? 'external-arrow' : 'cta-arrow'}>
      {external ? '↗' : '→'}
    </span>
  )
}

export function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="11" viewBox="0 0 11 11" width="11">
      <path d="M3 8 8 3M4 3h4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  )
}

export function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 22 22" width="22">
      <path d="m5 5 12 12M17 5 5 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 22 22" width="22">
      <path d="M3 6.5h16M3 11h16M3 15.5h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

export function ProofIcon({ kind }: { kind: ProofKind }) {
  if (kind === 'community') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <path d="M1.5 15.75v-1.5a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3v1.5M6.75 8.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15 15.75v-1.5a3 3 0 0 0-2.25-2.9M12 2.35a3 3 0 0 1 0 5.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
      </svg>
    )
  }

  if (kind === 'mentor') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <path d="m1.5 6 7.5-3.75L16.5 6 9 9.75 1.5 6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
        <path d="M4.5 7.5v4.25c2.5 2 6.5 2 9 0V7.5M16.5 6v5.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <rect height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.2" width="4.5" x="6.75" y=".75" />
      <path d="M3.75 7.5v.75a5.25 5.25 0 0 0 10.5 0V7.5M9 13.5v3.75M6.75 17.25h4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  )
}

export function YouTubeIcon() {
  return (
    <svg aria-hidden="true" height="56" viewBox="0 0 68 48" width="56">
      <path d="M66.52 7.5a8.5 8.5 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.48 1.5a8.5 8.5 0 0 0-6 6C0 12.82 0 24 0 24s0 11.18 1.48 16.5a8.5 8.5 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.52-1.5a8.5 8.5 0 0 0 6-6C68 35.18 68 24 68 24s0-11.18-1.48-16.5Z" fill="red" />
      <path d="m27 34 18-10-18-10v20Z" fill="#fff" />
    </svg>
  )
}
