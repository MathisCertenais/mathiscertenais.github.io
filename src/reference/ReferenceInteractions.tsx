import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { navigate } from '../routing'
import {
  referenceShorts,
  referenceShortsBySlug,
  referenceVideos,
  type ReferenceShort,
  type ReferenceVideo,
} from './referenceContent'
import { sanitizeReferenceHtml } from './sanitizeReferenceHtml'

interface LightboxItem {
  alt: string
  src: string
  zoomable?: boolean
}

interface VideoItem {
  id: string
  isPortrait: boolean
  title: string
}

let openModalLayers = 0
let initialAppInert = false
let initialBodyOverflow = ''

function useModalAccessibility(
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    const appRoot = document.getElementById('root')
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const handleKeydown = (event: KeyboardEvent) => {
      const openLightbox = document.querySelector<HTMLElement>('.lightbox-backdrop[aria-modal="true"]')
      if (openLightbox && openLightbox !== dialog) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    if (openModalLayers === 0) {
      initialAppInert = appRoot?.inert ?? false
      initialBodyOverflow = document.body.style.overflow
    }
    openModalLayers += 1
    if (appRoot) appRoot.inert = true
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    const focusFrame = window.requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>('[data-modal-close], .short-modal-close')?.focus()
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', handleKeydown)
      openModalLayers = Math.max(0, openModalLayers - 1)
      if (openModalLayers === 0) {
        document.body.style.overflow = initialBodyOverflow
        if (appRoot) appRoot.inert = initialAppInert
      }
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [dialogRef])
}

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [showHint] = useState(() => window.sessionStorage.getItem('lightbox-hint-shown') !== 'true')
  useModalAccessibility(dialogRef, onClose)

  useEffect(() => {
    window.sessionStorage.setItem('lightbox-hint-shown', 'true')
  }, [])

  return createPortal(
    <div
      aria-label={`Image preview: ${item.alt}`}
      aria-modal="true"
      className="lightbox-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
      ref={dialogRef}
      role="dialog"
    >
      <button
        aria-label="Close image preview"
        className="lightbox-close"
        data-modal-close
        onClick={onClose}
        type="button"
      >
        ×
      </button>
      {showHint ? (
        <p aria-hidden="true" className="lightbox-hint">
          {item.zoomable ? 'Esc to close · scroll to zoom' : 'Esc or click to close'}
        </p>
      ) : null}
      <div
        className="lightbox-zoom-area"
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onClose()
        }}
        onWheel={(event) => {
          if (!item.zoomable) return
          event.preventDefault()
          setZoom((current) => Math.min(4, Math.max(1, current + (event.deltaY < 0 ? 0.25 : -0.25))))
        }}
      >
        <img
          alt={item.alt}
          className="lightbox-img"
          src={item.src}
          style={{ transform: `scale(${zoom})`, transition: 'transform 120ms ease-out' }}
        />
      </div>
      {item.zoomable ? (
        <div aria-label="Image zoom controls" className="lightbox-toolbar" role="toolbar">
          <button
            aria-label="Zoom out"
            className="lightbox-tool-btn"
            disabled={zoom <= 1}
            onClick={() => setZoom((current) => Math.max(1, current - 0.5))}
            type="button"
          >
            −
          </button>
          <button
            aria-label="Reset zoom"
            className="lightbox-tool-btn"
            onClick={() => setZoom(1)}
            type="button"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            aria-label="Zoom in"
            className="lightbox-tool-btn"
            disabled={zoom >= 4}
            onClick={() => setZoom((current) => Math.min(4, current + 0.5))}
            type="button"
          >
            +
          </button>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}

function VideoModal({ item, onClose }: { item: VideoItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useModalAccessibility(dialogRef, onClose)

  return createPortal(
    <div
      aria-label={`Video: ${item.title}`}
      aria-modal="true"
      className="video-modal-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
      ref={dialogRef}
      role="dialog"
    >
      <div className={`video-modal-panel${item.isPortrait ? ' is-portrait' : ''}`}>
        <button
          aria-label="Close video"
          className="video-modal-close"
          data-modal-close
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <div className={`video-frame ${item.isPortrait ? 'is-portrait' : 'is-landscape'}`}>
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.id)}?autoplay=1&rel=0`}
            tabIndex={-1}
            title={item.title}
          />
        </div>
        <div className="video-modal-caption">
          <p className="video-modal-title">{item.title}</p>
          <a
            className="video-modal-link"
            href={`https://www.youtube.com/watch?v=${encodeURIComponent(item.id)}`}
            rel="noreferrer"
            target="_blank"
          >
            Watch on YouTube ↗
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ShortModal({
  isObscured,
  item,
  onClose,
  onImage,
  onNavigate,
  restoreScrollTop,
}: {
  isObscured: boolean
  item: ReferenceShort
  onClose: () => void
  onImage: (item: LightboxItem) => void
  onNavigate: (slug: string) => void
  restoreScrollTop: number
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousSlugRef = useRef(item.slug)
  const sanitizedHtml = useMemo(() => sanitizeReferenceHtml(item.html), [item.html])
  useModalAccessibility(dialogRef, onClose)

  useLayoutEffect(() => {
    if (dialogRef.current) dialogRef.current.innerHTML = sanitizedHtml
  }, [sanitizedHtml])

  useLayoutEffect(() => {
    const panel = dialogRef.current?.querySelector<HTMLElement>('.short-modal-panel')
    if (panel && restoreScrollTop > 0) panel.scrollTop = restoreScrollTop
  }, [isObscured, restoreScrollTop])

  const wasObscuredRef = useRef(isObscured)
  useEffect(() => {
    const wasObscured = wasObscuredRef.current
    wasObscuredRef.current = isObscured
    if (!wasObscured || isObscured) return

    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('.short-modal-close')?.focus()
    })
    return () => window.cancelAnimationFrame(focusFrame)
  }, [isObscured])

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('.short-modal-panel')?.scrollTo({ top: 0 })
    const itemChanged = previousSlugRef.current !== item.slug
    previousSlugRef.current = item.slug
    const focusFrame = itemChanged
      ? window.requestAnimationFrame(() => {
          dialogRef.current?.querySelector<HTMLElement>('.short-modal-close')?.focus()
        })
      : null

    const handleArrowNavigation = (event: KeyboardEvent) => {
      if (document.querySelector('.lightbox-backdrop')) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const currentIndex = referenceShorts.findIndex((candidate) => candidate.slug === item.slug)
      const nextItem = referenceShorts[currentIndex + (event.key === 'ArrowLeft' ? -1 : 1)]
      if (!nextItem) return
      event.preventDefault()
      onNavigate(nextItem.slug)
    }

    window.addEventListener('keydown', handleArrowNavigation)
    return () => {
      if (focusFrame !== null) window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', handleArrowNavigation)
    }
  }, [item, onNavigate])

  return createPortal(
    <>
      <p aria-live="polite" className="sr-only" role="status">
        Viewing short: {item.title}
      </p>
      <div
        aria-hidden={isObscured || undefined}
        aria-label={`Short article: ${item.title}`}
        aria-modal={isObscured ? undefined : true}
        className="short-modal-backdrop"
        onClick={(event) => {
          const target = event.target
          if (!(target instanceof Element)) return
          const closeButton = target.closest<HTMLButtonElement>('.short-modal-close')
          if (closeButton) {
            event.preventDefault()
            onClose()
            return
          }

          const imageButton = target.closest<HTMLButtonElement>('button[aria-label^="Enlarge"]')
          const image = imageButton?.querySelector<HTMLImageElement>('img')
          if (imageButton && image) {
            event.preventDefault()
            onImage({ src: image.currentSrc || image.src, alt: image.alt })
            return
          }

          const navigationButton = target.closest<HTMLButtonElement>(
            'button[aria-label^="Previous short"], button[aria-label^="Next short"]',
          )
          if (!navigationButton || navigationButton.getAttribute('aria-disabled') === 'true') return
          const currentIndex = referenceShorts.findIndex((candidate) => candidate.slug === item.slug)
          const direction = navigationButton.getAttribute('aria-label')?.startsWith('Previous')
            ? -1
            : 1
          const nextItem = referenceShorts[currentIndex + direction]
          if (nextItem) {
            event.preventDefault()
            onNavigate(nextItem.slug)
          }
        }}
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onClose()
        }}
        inert={isObscured}
        ref={dialogRef}
        role="dialog"
      />
    </>,
    document.body,
  )
}

function setWritingFilter(root: HTMLElement, selectedLabel: string) {
  const selectedType = selectedLabel.toLowerCase()
  const filterButtons = root.querySelectorAll<HTMLButtonElement>('[aria-label="Filter by type"] button')
  const cards = root.querySelectorAll<HTMLAnchorElement>('a[href^="/articles"]')

  filterButtons.forEach((button) => {
    const isSelected = button.textContent?.trim().toLowerCase().startsWith(selectedType) ?? false
    button.setAttribute('aria-pressed', String(isSelected))
    button.classList.toggle('border-btn-bg', isSelected)
    button.classList.toggle('bg-btn-bg', isSelected)
    button.classList.toggle('font-medium', isSelected)
    button.classList.toggle('text-btn-text', isSelected)
    button.classList.toggle('border-border', !isSelected)
    button.classList.toggle('bg-transparent', !isSelected)
    button.classList.toggle('font-normal', !isSelected)
    button.classList.toggle('text-text-mid', !isSelected)
  })

  cards.forEach((card) => {
    if (card.getAttribute('href') === '/articles') return
    const cardType = [...card.querySelectorAll('span')]
      .map((element) => element.textContent?.trim().toLowerCase())
      .find((text) => text === 'article' || text === 'short')
    card.hidden = selectedType !== 'all' && cardType !== selectedType.slice(0, -1)
  })
}

function setVideoFilter(root: HTMLElement, selectedLabel: string) {
  const normalizedLabel = selectedLabel.toLowerCase()
  const selectedType = normalizedLabel.startsWith('shorts')
    ? 'shorts'
    : normalizedLabel.startsWith('live')
      ? 'live'
      : 'all'
  const tabs = root.querySelectorAll<HTMLButtonElement>('.videos-tab')
  const sections = [...root.querySelectorAll<HTMLElement>('main > section')]
  const shortsSection = sections.find((section) => section.querySelector('h2')?.textContent?.trim() === 'Quick takes')
  const liveSection = sections.find((section) => section.querySelector('h2')?.textContent?.trim() === 'Live sessions')

  tabs.forEach((tab) => {
    const selected = tab.textContent?.trim().toLowerCase().startsWith(selectedType) ?? false
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })
  if (shortsSection) shortsSection.hidden = selectedType === 'live'
  if (liveSection) liveSection.hidden = selectedType === 'shorts'
}

function createShortFromCard(anchor: HTMLAnchorElement) {
  const slug = new URL(anchor.href, window.location.href).hash.slice(1)
  return referenceShortsBySlug.get(slug)
}

function expandVideoGrid(root: HTMLElement, kind: ReferenceVideo['kind']) {
  const grid = root.querySelector<HTMLElement>(
    kind === 'short' ? '.videos-shorts-grid' : '.videos-sessions-grid',
  )
  const template = grid?.querySelector<HTMLAnchorElement>('a')
  if (!grid || !template) return

  const existingHrefs = new Set(
    [...grid.querySelectorAll<HTMLAnchorElement>('a[href]')].map((anchor) => anchor.href),
  )
  const fragment = document.createDocumentFragment()

  referenceVideos
    .filter((item) => item.kind === kind && !existingHrefs.has(item.href))
    .forEach((item) => {
      const card = template.cloneNode(true) as HTMLAnchorElement
      card.href = item.href
      card.dataset.expandedVideo = kind
      const image = card.querySelector<HTMLImageElement>('img')
      const source = card.querySelector<HTMLSourceElement>('source')
      const base = item.image.replace(/\.[^.]+$/, '')
      if (image) {
        image.src = item.image
        image.alt = item.alt
      }
      if (source) source.srcset = `${base}.480.webp 480w, ${base}.960.webp 960w`
      const heading = card.querySelector<HTMLElement>('h3')
      if (heading) heading.textContent = item.title
      const description = card.querySelector<HTMLElement>('p')
      if (description) description.textContent = item.description
      const duration = card.querySelector<HTMLElement>('.video-duration')
      if (duration) duration.textContent = item.duration
      fragment.append(card)
    })

  grid.append(fragment)
}

function collapseVideoGrid(root: HTMLElement, kind: ReferenceVideo['kind']) {
  root
    .querySelectorAll<HTMLElement>(`[data-expanded-video="${kind}"]`)
    .forEach((element) => element.remove())
}

function decodeCloudflareEmail(encoded: string) {
  if (encoded.length < 4) return ''
  const key = Number.parseInt(encoded.slice(0, 2), 16)
  let value = ''
  for (let index = 2; index < encoded.length; index += 2) {
    value += String.fromCharCode(Number.parseInt(encoded.slice(index, index + 2), 16) ^ key)
  }
  return value
}

function setupCountUp(root: HTMLElement) {
  const elements = [
    ...root.querySelectorAll<HTMLElement>('.case-stat-row dd > span:first-child > span'),
  ]
  if (elements.length === 0) return () => undefined
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined

  const observers: IntersectionObserver[] = []
  const animationFrames = new Set<number>()

  elements.forEach((element) => {
    const finalValue = element.textContent?.trim() ?? ''
    const match = finalValue.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/)
    if (!match) return
    const [, prefix, numericValue, suffix] = match
    const target = Number.parseFloat(numericValue)
    const decimals = numericValue.includes('.') ? numericValue.split('.')[1]?.length ?? 0 : 0
    if (!Number.isFinite(target)) return

    let hasAnimated = false
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (hasAnimated || !entries.some((entry) => entry.isIntersecting)) return
        hasAnimated = true
        element.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`
        frame = window.requestAnimationFrame(() => {
          const startedAt = performance.now()
          const animate = (timestamp: number) => {
            const progress = Math.min(1, (timestamp - startedAt) / 1200)
            const eased = 1 - Math.pow(1 - progress, 3)
            element.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`
            if (progress < 1) {
              frame = window.requestAnimationFrame(animate)
              animationFrames.add(frame)
            } else {
              element.textContent = finalValue
            }
          }
          frame = window.requestAnimationFrame(animate)
          animationFrames.add(frame)
        })
        animationFrames.add(frame)
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(element)
    observers.push(observer)
  })

  return () => {
    observers.forEach((observer) => observer.disconnect())
    animationFrames.forEach((frame) => window.cancelAnimationFrame(frame))
  }
}

function setupResumePrintContact(root: HTMLElement) {
  const contactLine = root.querySelector<HTMLElement>('.print-header p:last-child')
  if (!contactLine) return () => undefined

  const phone = document.createElement('span')
  phone.dataset.printPhone = 'true'
  phone.textContent = '(707) 272-5852 · '
  const showPhone = () => {
    if (!contactLine.querySelector('[data-print-phone]')) contactLine.prepend(phone)
  }
  const hidePhone = () => phone.remove()
  const printQuery = window.matchMedia('print')
  const handlePrintQuery = (event: MediaQueryListEvent) => {
    if (event.matches) showPhone()
    else hidePhone()
  }

  window.addEventListener('beforeprint', showPhone)
  window.addEventListener('afterprint', hidePhone)
  printQuery.addEventListener('change', handlePrintQuery)
  if (printQuery.matches) showPhone()

  return () => {
    window.removeEventListener('beforeprint', showPhone)
    window.removeEventListener('afterprint', hidePhone)
    printQuery.removeEventListener('change', handlePrintQuery)
    hidePhone()
  }
}

function setupCaseStudyBackLink(root: HTMLElement) {
  const backLink = root.querySelector<HTMLAnchorElement>('main a.btn-secondary[href="/work"]')
  if (!backLink || !document.referrer.startsWith(window.location.origin) || window.history.length <= 1) {
    return () => undefined
  }

  let label = 'Back'
  try {
    const referrerPath = new URL(document.referrer).pathname
    if (referrerPath === '/') label = 'Back to homepage'
    else if (referrerPath === '/work') label = 'Back to featured work'
  } catch {
    return () => undefined
  }

  backLink.innerHTML = `<span aria-hidden="true">←</span> ${label}`
  const goBack = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    window.history.back()
  }
  backLink.addEventListener('click', goBack)
  return () => backLink.removeEventListener('click', goBack)
}

interface ReferenceInteractionsProps {
  pathname: string
  rootRef: RefObject<HTMLDivElement | null>
}

export function ReferenceInteractions({ pathname, rootRef }: ReferenceInteractionsProps) {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)
  const [video, setVideo] = useState<VideoItem | null>(null)
  const [short, setShort] = useState<ReferenceShort | null>(null)
  const shortScrollTopRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const mountedAt = Date.now()
    const cleanupCountUp = pathname === '/work/centene-recovery-platform'
      ? setupCountUp(root)
      : () => undefined
    const cleanupPrintContact = pathname === '/resume'
      ? setupResumePrintContact(root)
      : () => undefined
    const cleanupBackLink = pathname.startsWith('/work/')
      ? setupCaseStudyBackLink(root)
      : () => undefined

    const openShortForHash = (hash: string) => {
      const anchor = [...root.querySelectorAll<HTMLAnchorElement>('a[href^="/articles#"]')].find(
        (candidate) => new URL(candidate.href, window.location.href).hash === hash,
      )
      if (anchor) {
        const item = createShortFromCard(anchor)
        if (item) {
          shortScrollTopRef.current = 0
          setShort(item)
        }
      }
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const enlargeButton = target.closest<HTMLButtonElement>('button[aria-label^="Enlarge"]')
      if (enlargeButton) {
        const image = enlargeButton.querySelector<HTMLImageElement>('img')
        if (image) {
          event.preventDefault()
          setLightbox({
            src: image.currentSrc || image.src,
            alt: image.alt,
            zoomable: pathname === '/resources/mental-models',
          })
          return
        }
      }

      const copyButton = target.closest<HTMLButtonElement>('.copy-btn')
      if (copyButton) {
        event.preventDefault()
        const encoded = root.querySelector<HTMLElement>('[data-cfemail]')?.dataset.cfemail
        const email =
          root.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')?.href.replace('mailto:', '') ||
          (encoded ? decodeCloudflareEmail(encoded) : 'nate@nabauer.com')
        const originalMarkup = copyButton.innerHTML
        void navigator.clipboard.writeText(email).then(() => {
          const liveRegion = copyButton.parentElement?.querySelector<HTMLElement>('[aria-live]')
          if (liveRegion) liveRegion.textContent = 'Email copied to clipboard'
          copyButton.setAttribute('aria-label', 'Email copied to clipboard')
          copyButton.title = 'Copied'
          copyButton.style.color = 'var(--accent)'
          copyButton.innerHTML =
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
          window.setTimeout(() => {
            copyButton.setAttribute('aria-label', 'Copy email to clipboard')
            copyButton.title = 'Copy to clipboard'
            copyButton.style.color = 'var(--text-light)'
            copyButton.innerHTML = originalMarkup
            if (liveRegion) liveRegion.textContent = ''
          }, 1800)
        }).catch(() => undefined)
        return
      }

      if (pathname === '/articles') {
        const filterButton = target.closest<HTMLButtonElement>('[aria-label="Filter by type"] button')
        if (filterButton) {
          event.preventDefault()
          const label = filterButton.textContent?.trim().split(/\s+/)[0] ?? 'All'
          setWritingFilter(root, label)
          return
        }

        const shortAnchor = target.closest<HTMLAnchorElement>('a[href^="/articles#"]')
        if (shortAnchor) {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          const item = createShortFromCard(shortAnchor)
          if (item) {
            window.history.replaceState({}, '', `/articles#${item.slug}`)
            shortScrollTopRef.current = 0
            setShort(item)
          }
          return
        }
      }

      if (pathname === '/videos') {
        const tab = target.closest<HTMLButtonElement>('.videos-tab')
        if (tab) {
          event.preventDefault()
          const label = tab.textContent?.trim().split(/\s+/)[0] ?? 'All'
          setVideoFilter(root, label)
          return
        }

        const showAllButton = target.closest<HTMLButtonElement>('button')
        const showAllLabel = showAllButton?.textContent?.trim() ?? ''
        if (showAllButton && /^Show all (38|27)/.test(showAllLabel)) {
          event.preventDefault()
          const kind = showAllLabel.includes('38') ? 'short' : 'live'
          expandVideoGrid(root, kind)
          showAllButton.textContent = 'Show fewer ↑'
          showAllButton.dataset.videoExpanded = kind
          showAllButton.setAttribute('aria-expanded', 'true')
          return
        }
        if (showAllButton?.dataset.videoExpanded) {
          event.preventDefault()
          const kind = showAllButton.dataset.videoExpanded as ReferenceVideo['kind']
          collapseVideoGrid(root, kind)
          showAllButton.textContent = `Show all ${kind === 'short' ? '38' : '27'} ↓`
          delete showAllButton.dataset.videoExpanded
          showAllButton.setAttribute('aria-expanded', 'false')
          const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth'
          showAllButton.scrollIntoView({ behavior, block: 'center' })
          return
        }

      }

      if (pathname === '/' || pathname === '/videos') {
        const videoAnchor = target.closest<HTMLAnchorElement>('a.card-link[href*="youtube.com"]')
        const image = videoAnchor?.querySelector<HTMLImageElement>('img[src*="/images/videos/"]')
        if (videoAnchor && image) {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          const videoUrl = new URL(videoAnchor.href)
          const id = videoUrl.pathname.startsWith('/shorts/')
            ? videoUrl.pathname.split('/').at(-1) ?? ''
            : videoUrl.searchParams.get('v') ?? ''
          const title =
            videoAnchor.querySelector('h2, h3')?.textContent?.trim() ||
            image.alt ||
            'Video'
          if (id) setVideo({ id, title, isPortrait: videoUrl.pathname.startsWith('/shorts/') })
          return
        }
      }

      if (pathname.startsWith('/resources')) {
        const categoryButton = target.closest<HTMLButtonElement>('button')
        const category = categoryButton?.textContent?.trim()
        const categoryRoutes: Record<string, string> = {
          Education: '/resources',
          'Resume & Portfolio': '/resources/portfolio',
          'Mental Models': '/resources/mental-models',
          Other: '/resources/other',
        }
        if (category && categoryRoutes[category]) {
          event.preventDefault()
          navigate(categoryRoutes[category])
        }
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (pathname !== '/videos' || !(event.target instanceof HTMLButtonElement)) return
      if (!event.target.classList.contains('videos-tab')) return
      const tabs = [...root.querySelectorAll<HTMLButtonElement>('.videos-tab')]
      const currentIndex = tabs.indexOf(event.target)
      if (currentIndex < 0) return

      let nextIndex: number | undefined
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabs.length
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
      } else if (event.key === 'Home') {
        nextIndex = 0
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1
      }

      if (nextIndex === undefined) return
      event.preventDefault()
      tabs[nextIndex]?.focus()
      tabs[nextIndex]?.click()
    }

    const handleSubmit = (event: SubmitEvent) => {
      if (pathname !== '/contact' || !(event.target instanceof HTMLFormElement)) return
      event.preventDefault()
      const form = event.target
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
      const name = form.querySelector<HTMLInputElement>('#name')?.value.trim() ?? ''
      const email = form.querySelector<HTMLInputElement>('#email')?.value.trim() ?? ''
      const message = form.querySelector<HTMLTextAreaElement>('#message')?.value.trim() ?? ''
      const honeypot = form.querySelector<HTMLInputElement>('#website')?.value ?? ''
      if (!name || !email || !message || honeypot) return

      const status = document.createElement('p')
      status.setAttribute('role', 'status')
      status.className = 'contact-form-status'
      form.querySelector('.contact-form-status')?.remove()
      form.append(status)
      form.setAttribute('aria-busy', 'true')
      if (button) {
        button.disabled = true
        button.dataset.originalMarkup = button.innerHTML
        button.textContent = 'Sending…'
      }

      const submit = async () => {
        const waitTime = Math.max(0, 1500 - (Date.now() - mountedAt))
        if (waitTime) await new Promise((resolve) => window.setTimeout(resolve, waitTime))
        const data = new FormData()
        data.set('name', name)
        data.set('email', email)
        data.set('message', message)
        data.set('_subject', `Portfolio message from ${name}`)
        data.set('_gotcha', honeypot)

        const configuredEndpoint: unknown = import.meta.env.VITE_CONTACT_ENDPOINT
        const contactEndpoint =
          typeof configuredEndpoint === 'string' ? configuredEndpoint.trim() : ''
        if (!contactEndpoint) {
          const fallbackEmail =
            root
              .querySelector<HTMLAnchorElement>('a[href^="mailto:"]')
              ?.href.replace(/^mailto:/, '') || 'nate@nabauer.com'
          const mailto = new URLSearchParams({
            subject: `Portfolio message from ${name}`,
            body: `From: ${name} <${email}>\n\n${message}`,
          })
          const emailLink = document.createElement('a')
          emailLink.href = `mailto:${fallbackEmail}?${mailto.toString()}`
          emailLink.textContent = 'Send this message with your email app'
          status.textContent = 'Direct form delivery is not configured. '
          status.append(emailLink, '.')
          form.setAttribute('aria-busy', 'false')
          if (button) {
            button.disabled = false
            button.innerHTML = button.dataset.originalMarkup ?? 'Send message'
          }
          return
        }

        try {
          const response = await fetch(contactEndpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          })
          if (!response.ok) throw new Error(`Formspree returned ${response.status}`)
          form.reset()
          status.textContent = 'Thanks — your message has been sent.'
          status.classList.add('is-success')
        } catch {
          status.textContent = 'Something went wrong. Please try again or connect on LinkedIn.'
          status.classList.add('is-error')
        } finally {
          form.setAttribute('aria-busy', 'false')
          if (button) {
            button.disabled = false
            button.innerHTML = button.dataset.originalMarkup ?? 'Send message'
          }
        }
      }
      void submit()
    }

    root.addEventListener('click', handleClick)
    root.addEventListener('keydown', handleKeydown)
    root.addEventListener('submit', handleSubmit)
    const syncShortToHash = () => {
      if (pathname !== '/articles') return
      if (window.location.hash) openShortForHash(window.location.hash)
      else setShort(null)
    }
    syncShortToHash()
    window.addEventListener('hashchange', syncShortToHash)
    window.addEventListener('popstate', syncShortToHash)

    return () => {
      root.removeEventListener('click', handleClick)
      root.removeEventListener('keydown', handleKeydown)
      root.removeEventListener('submit', handleSubmit)
      window.removeEventListener('hashchange', syncShortToHash)
      window.removeEventListener('popstate', syncShortToHash)
      cleanupCountUp()
      cleanupPrintContact()
      cleanupBackLink()
    }
  }, [pathname, rootRef])

  const closeShort = () => {
    shortScrollTopRef.current = 0
    setShort(null)
    if (window.location.pathname === '/articles' && window.location.hash) {
      window.history.replaceState({}, '', '/articles')
    }
  }

  const navigateShort = useCallback((slug: string) => {
    const nextItem = referenceShortsBySlug.get(slug)
    if (!nextItem) return
    window.history.replaceState({}, '', `/articles#${slug}`)
    shortScrollTopRef.current = 0
    setShort(nextItem)
  }, [])

  const openShortImage = useCallback((item: LightboxItem) => {
    shortScrollTopRef.current =
      document.querySelector<HTMLElement>('.short-modal-panel')?.scrollTop ?? 0
    setLightbox(item)
  }, [])

  const closeLightbox = () => {
    const shortScrollTop = shortScrollTopRef.current
    setLightbox(null)
    if (!short) return
    window.setTimeout(() => {
      const panel = document.querySelector<HTMLElement>('.short-modal-panel')
      if (panel) panel.scrollTop = shortScrollTop
      document.querySelector<HTMLElement>('.short-modal-close')?.focus()
    }, 0)
  }

  return (
    <>
      {lightbox ? <Lightbox item={lightbox} onClose={closeLightbox} /> : null}
      {video ? <VideoModal item={video} onClose={() => setVideo(null)} /> : null}
      {short ? (
        <ShortModal
          isObscured={Boolean(lightbox)}
          item={short}
          onClose={closeShort}
          onImage={openShortImage}
          onNavigate={navigateShort}
          restoreScrollTop={shortScrollTopRef.current}
        />
      ) : null}
    </>
  )
}
