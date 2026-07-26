import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { videoItems, type VideoItem } from '../content'
import { ArrowIcon, PlayIcon } from './Icons'

interface VideoSectionProps {
  heading?: string
  showAllLink?: boolean
}

export function VideoSection({ heading = 'Videos', showAllLink = true }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const videoTriggerRef = useRef<HTMLButtonElement | null>(null)
  const modalTitleId = useId()

  useEffect(() => {
    if (!activeVideo) return undefined

    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    const previousInert = appRoot?.inert ?? false

    const manageModalKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveVideo(null)
        return
      }

      if (event.key !== 'Tab') return
      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), iframe, video[controls], a[href]',
        ) ?? [],
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)
      const activeElement = document.activeElement
      const activeElementIsInDialog = focusableElements.some((element) => element === activeElement)

      if (event.shiftKey && (activeElement === firstElement || !activeElementIsInDialog)) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && (activeElement === lastElement || !activeElementIsInDialog)) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    window.addEventListener('keydown', manageModalKeyboard)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = previousInert
      window.removeEventListener('keydown', manageModalKeyboard)
      window.requestAnimationFrame(() => videoTriggerRef.current?.focus())
    }
  }, [activeVideo])

  return (
    <>
      <section className="home-section section videos-section" id="videos">
        <div className="section-heading">
          <h2>{heading}</h2>
          {showAllLink ? (
            <a href="/videos">
              All videos <ArrowIcon />
            </a>
          ) : null}
        </div>

        <p className="videos-section__intro">
          Interviews, webinars, and research events exploring scientific data logistics, HPC, and
          radio astronomy. Select a video to watch it here.
        </p>

        <div className="video-grid video-grid--research">
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
                  <PlayIcon />
                </span>
              </span>
              <span className="video-card__title">{video.title}</span>
            </button>
          ))}
        </div>
      </section>

      {activeVideo
        ? createPortal(
            <div
              aria-labelledby={modalTitleId}
              aria-modal="true"
              className="video-modal"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) setActiveVideo(null)
              }}
              ref={modalRef}
              role="dialog"
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
              <div className="video-modal__panel video-modal__panel--landscape">
                <div className="video-modal__frame video-modal__frame--landscape">
                  {activeVideo.kind === 'iframe' ? (
                    <iframe
                      allow="fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="eager"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      src={activeVideo.src}
                      title={activeVideo.title}
                    />
                  ) : (
                    <video
                      autoPlay
                      controls
                      playsInline
                      poster={activeVideo.image}
                      src={activeVideo.src}
                    >
                      Your browser does not support the video element.
                    </video>
                  )}
                </div>
                <div className="video-modal__caption">
                  <div>
                    <p id={modalTitleId}>{activeVideo.title}</p>
                    <small>{activeVideo.description}</small>
                  </div>
                  <a href={activeVideo.externalHref} rel="noreferrer" target="_blank">
                    View source ↗
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
