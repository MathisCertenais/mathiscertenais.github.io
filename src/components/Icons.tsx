export function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <span aria-hidden="true" className={external ? 'external-arrow' : 'cta-arrow'}>
      {external ? '↗' : '→'}
    </span>
  )
}

export function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="11" viewBox="0 0 12 12" width="11">
      <path
        d="M2.5 9.5 9.5 2.5M9.5 2.5H5M9.5 2.5V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function MenuIcon({ open }: { open: boolean }) {
  const transition = 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="22"
    >
      <line
        style={{
          transform: open ? 'rotate(45deg) translateY(6px)' : 'none',
          transformBox: 'view-box',
          transformOrigin: '12px 12px',
          transition,
        }}
        x1="3"
        x2="21"
        y1="6"
        y2="6"
      />
      <line
        style={{ opacity: open ? 0 : 1, transition: 'opacity 160ms ease' }}
        x1="3"
        x2="21"
        y1="12"
        y2="12"
      />
      <line
        style={{
          transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none',
          transformBox: 'view-box',
          transformOrigin: '12px 12px',
          transition,
        }}
        x1="3"
        x2="21"
        y1="18"
        y2="18"
      />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg aria-hidden="true" height="56" viewBox="0 0 56 56" width="56">
      <circle cx="28" cy="28" fill="rgba(255,255,255,.94)" r="27" />
      <path d="m23 18 16 10-16 10V18Z" fill="#31527d" />
    </svg>
  )
}

export function ProofIcon({ kind }: { kind: ProofKind }) {
  if (kind === 'community') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <path
          d="M1.5 15.75v-1.5a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3v1.5M6.75 8.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15 15.75v-1.5a3 3 0 0 0-2.25-2.9M12 2.35a3 3 0 0 1 0 5.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    )
  }

  if (kind === 'mentor') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <path
          d="m1.5 6 7.5-3.75L16.5 6 9 9.75 1.5 6Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
        <path
          d="M4.5 7.5v4.25c2.5 2 6.5 2 9 0V7.5M16.5 6v5.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <rect height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.2" width="4.5" x="6.75" y=".75" />
      <path
        d="M3.75 7.5v.75a5.25 5.25 0 0 0 10.5 0V7.5M9 13.5v3.75M6.75 17.25h4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}
import type { ProofKind } from '../content'
