import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** The raw figure data a page keeps while its lightbox is open. */
export interface ImagePreview {
  alt: string
  caption?: string
  src: string
}

interface ImageLightboxProps {
  alt: string
  caption?: ReactNode
  closeLabel: string
  onClose: () => void
  src: string
}

/**
 * Full-screen preview of an article or research figure, opened from the
 * figure's zoom button. Escape, a click on the backdrop, or the close button
 * dismisses it; focus moves to the close button and is restored on exit.
 */
export function ImageLightbox({ alt, caption, closeLabel, onClose, src }: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    const previousInert = appRoot?.inert ?? false

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    if (appRoot) appRoot.inert = true
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      if (appRoot) appRoot.inert = previousInert
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      aria-label={alt}
      aria-modal="true"
      className="figure-lightbox"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
      role="dialog"
    >
      <button
        aria-label={closeLabel}
        className="figure-lightbox__close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        ×
      </button>
      <figure className="figure-lightbox__figure">
        <img alt={alt} src={src} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </div>,
    document.body,
  )
}
