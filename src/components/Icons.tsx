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
