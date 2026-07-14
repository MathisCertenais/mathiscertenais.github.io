import { useEffect, useRef, useState } from 'react'
import { videoItems, type VideoItem } from '../content'
import { ArrowIcon, YouTubeIcon } from './Icons'

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const videoTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!activeVideo) return undefined

    const previousOverflow = document.body.style.overflow
    const backgroundElements = [
      document.querySelector<HTMLElement>('.skip-link'),
      document.querySelector<HTMLElement>('.site-header'),
      document.querySelector<HTMLElement>('.mobile-menu'),
      document.querySelector<HTMLElement>('.nav-spacer'),
      ...Array.from(document.querySelectorAll<HTMLElement>('main > :not(.video-modal)')),
      document.querySelector<HTMLElement>('.site-footer'),
    ].filter((element): element is HTMLElement => element !== null)
    const previousInertStates = backgroundElements.map((element) => element.inert)

    const manageModalKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveVideo(null)
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), iframe, a[href]',
        ) ?? [],
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)
      const activeElement = document.activeElement
      const activeElementIsInDialog = focusableElements.some(
        (element) => element === activeElement,
      )

      if (event.shiftKey && (activeElement === firstElement || !activeElementIsInDialog)) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && (activeElement === lastElement || !activeElementIsInDialog)) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    backgroundElements.forEach((element) => {
      element.inert = true
    })
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    window.addEventListener('keydown', manageModalKeyboard)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      backgroundElements.forEach((element, index) => {
        element.inert = previousInertStates[index] ?? false
      })
      window.removeEventListener('keydown', manageModalKeyboard)
      window.requestAnimationFrame(() => videoTriggerRef.current?.focus())
    }
  }, [activeVideo])

  return (
    <>
      <section className="home-section section videos-section" id="videos">
        <div className="section-heading">
          <h2>Videos</h2>
          <a href="https://nabauer.com/videos">
            All videos <ArrowIcon />
          </a>
        </div>

        <p className="videos-section__intro">
          Live portfolio reviews and short takes on design, careers, and craft from the{' '}
          <a href="https://www.youtube.com/@designshaped" rel="noreferrer" target="_blank">
            Design Shaped
          </a>{' '}
          YouTube Channel. Click any video to play it here.{' '}
          <a href="https://www.youtube.com/@designshaped" rel="noreferrer" target="_blank">
            Watch on YouTube <ArrowIcon external />
          </a>
        </p>

        <div className="video-grid">
          {videoItems.map((video) => (
            <button
              aria-label={`Play ${video.title}`}
              className="video-card"
              key={video.id}
              onClick={(event) => {
                videoTriggerRef.current = event.currentTarget
                setActiveVideo(video)
              }}
              type="button"
            >
              <span className="video-card__thumbnail">
                <img alt="" loading="lazy" src={video.image} />
                <span className="video-card__play">
                  <YouTubeIcon />
                </span>
              </span>
              <span className="video-card__title">{video.title}</span>
            </button>
          ))}
        </div>
      </section>

      {activeVideo ? (
        <div
          aria-label={`${activeVideo.title} video player`}
          aria-modal="true"
          className="video-modal"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveVideo(null)
          }}
          role="dialog"
          ref={modalRef}
        >
          <button
            aria-label="Close video"
            className="video-modal__close"
            onClick={() => setActiveVideo(null)}
            ref={closeButtonRef}
            type="button"
          >
            ×
          </button>
          <div className="video-modal__panel">
            <div className="video-modal__frame">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
              />
            </div>
            <div className="video-modal__caption">
              <p>{activeVideo.title}</p>
              <a
                href={`https://www.youtube.com/shorts/${activeVideo.id}`}
                rel="noreferrer"
                target="_blank"
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
