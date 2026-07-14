const blockedElements =
  'script, style, object, embed, frame, frameset, base, link, meta, foreignObject'
const urlAttributes = new Set(['action', 'formaction', 'href', 'poster', 'src', 'xlink:href'])
const unsafeStyle = /(?:expression\s*\(|javascript\s*:|data\s*:\s*text\/html|@import|-moz-binding)/i

function urlIsSafe(value: string, element: Element, attributeName: string) {
  const normalized = value
    .trim()
    .replace(/\s+/g, '')
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code > 31 && code !== 127
    })
    .join('')
  if (!normalized || normalized.startsWith('#')) return true
  if (attributeName === 'src' && element instanceof HTMLImageElement && normalized.startsWith('data:image/')) {
    return true
  }

  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    return false
  }
}

function normalizeTrustedIframe(iframe: HTMLIFrameElement) {
  try {
    const url = new URL(iframe.src, window.location.origin)
    const isYouTube =
      ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(
        url.hostname,
      ) && url.pathname.startsWith('/embed/')
    if (!isYouTube) {
      iframe.remove()
      return
    }

    url.hostname = 'www.youtube-nocookie.com'
    iframe.src = url.href
    iframe.removeAttribute('srcdoc')
  } catch {
    iframe.remove()
  }
}

export function sanitizeReferenceHtml(markup: string) {
  const documentCopy = new DOMParser().parseFromString(markup, 'text/html')
  documentCopy.body.querySelectorAll(blockedElements).forEach((element) => element.remove())

  documentCopy.body.querySelectorAll('*').forEach((element) => {
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase()
      if (name.startsWith('on') || name === 'srcdoc') {
        element.removeAttribute(attribute.name)
        continue
      }
      if (urlAttributes.has(name) && !urlIsSafe(attribute.value, element, name)) {
        element.removeAttribute(attribute.name)
        continue
      }
      if (name === 'style' && unsafeStyle.test(attribute.value)) {
        element.removeAttribute(attribute.name)
      }
    }

    if (element instanceof HTMLIFrameElement) normalizeTrustedIframe(element)
    if (element.getAttribute('target') === '_blank') {
      const rel = new Set((element.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean))
      rel.add('noopener')
      rel.add('noreferrer')
      element.setAttribute('rel', [...rel].join(' '))
    }
  })

  return documentCopy.body.innerHTML
}
