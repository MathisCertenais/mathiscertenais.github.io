import type { ArticleBlock, ArticleItem } from './en.ts'

/** Average reading speed for prose, in words per minute. */
const WORDS_PER_MINUTE = 220

/**
 * The opening words of an article, without the inline syntax the article
 * renderer understands: `**bold**` and `[label](url)` keep their words, `[12]`
 * is a reference marker that carries none.
 */
function plainText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\d+\]/g, ' ')
}

/** The prose a block contributes to the count. Alt text and image paths are excluded. */
function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return block.text
    case 'list':
      return block.items
        .map((item) => (typeof item === 'string' ? item : item.text))
        .join(' ')
    case 'figure':
      return block.caption ?? ''
  }
}

/**
 * Estimated reading time of an article, in whole minutes, from the body alone:
 * the hero title, the description and the image alt text are not prose the
 * reader works through. Rounded, never below one minute. Pure, so the
 * page and the prerendered shell cannot disagree.
 */
export function readingTimeMinutes(article: Pick<ArticleItem, 'body'>): number {
  const words = article.body
    .map((block) => plainText(blockText(block)))
    .join(' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
