import { useState, type ReactNode } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import type { ArticleBlock } from '../content'
import { ArrowIcon } from './Icons'
import { ImageLightbox, type ImagePreview } from './ImageLightbox'
import { NewTabHint } from './NewTabHint'
import { PageHero } from './PageHero'
import { WritingSection } from './WritingSection'

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\[\d+\])/g

function renderInline(text: string, newTabLabel?: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let match: RegExpExecArray | null
  let cursor = 0
  INLINE_TOKEN.lastIndex = 0
  while ((match = INLINE_TOKEN.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))
    const token = match[0]
    const key = nodes.length
    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('[') && !token.includes('](')) {
      nodes.push(
        <a href={`#ref-${token.slice(1, -1)}`} key={key}>
          {token}
        </a>,
      )
    } else {
      const opening = token.indexOf('](')
      nodes.push(
        <a href={token.slice(opening + 2, -1)} key={key} rel="noreferrer" target="_blank">
          {token.slice(1, opening)}
          {newTabLabel ? <NewTabHint label={newTabLabel} /> : null}
        </a>,
      )
    }
    cursor = match.index + token.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

function ArticleBlocks({
  blocks,
  newTabLabel,
  onZoom,
}: {
  blocks: ArticleBlock[]
  newTabLabel?: string
  onZoom: (image: ImagePreview) => void
}) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index}>{renderInline(block.text, newTabLabel)}</p>
          case 'heading':
            return block.level === 2 ? (
              <h2 key={index}>{renderInline(block.text, newTabLabel)}</h2>
            ) : (
              <h3 key={index}>{renderInline(block.text, newTabLabel)}</h3>
            )
          case 'list': {
            const items = block.items.map((item, itemIndex) =>
              typeof item === 'string' ? (
                <li key={itemIndex}>{renderInline(item, newTabLabel)}</li>
              ) : (
                <li id={item.id} key={itemIndex}>
                  {renderInline(item.text, newTabLabel)}
                </li>
              ),
            )
            return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>
          }
          case 'figure':
            return (
              <figure className="article-figure" key={index}>
                <button
                  className="figure-zoom"
                  onClick={() => onZoom({ alt: block.alt, caption: block.caption, src: block.image })}
                  type="button"
                >
                  <img alt={block.alt} loading="lazy" src={block.image} />
                </button>
                {block.caption ? (
                  <figcaption>{renderInline(block.caption, newTabLabel)}</figcaption>
                ) : null}
              </figure>
            )
        }
      })}
    </>
  )
}

export function WritingPage() {
  const { content } = useLanguage()
  const { writingPage } = content

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow={writingPage.eyebrow}
        intro={writingPage.intro}
        title={writingPage.title}
      />
      <WritingSection heading={writingPage.sectionHeading} showAllLink={false} />
    </main>
  )
}

export function ArticlePage({ articleId }: { articleId: string }) {
  const { content, getArticle, localeHref, strings } = useLanguage()
  const { articleItems, videoItems } = content
  const [preview, setPreview] = useState<ImagePreview | null>(null)
  const article = getArticle(articleId)
  if (!article) return null
  const video =
    article.id === 'eclat-interview'
      ? videoItems.find((item) => item.id === 'eclat-interview')
      : article.id === 'webinar-hpc-applications-as-a-service'
        ? videoItems.find((item) => item.id === 'hpc-service-webinar')
        : article.id === 'international-hackathon-for-astronomy'
          ? videoItems.find((item) => item.id === 'astronomy-hackathon')
          : article.id === 'mcp-server-software-ontology'
            ? videoItems.find((item) => item.id === 'mcp-demo-video')
            : undefined

  return (
    <main className="article-page" id="main-content" tabIndex={-1}>
      <article>
        <header className="article-hero section">
          <p className="section-label">
            {article.category} · {article.date}
          </p>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
        </header>

        <div className="article-cover section">
          <img alt={article.imageAlt} src={article.image} />
        </div>

        <div className="article-prose section">
          {article.status === 'coming-soon' ? (
            <div className="coming-soon-card">
              <p className="section-label">Coming soon</p>
              <h2>This research note is still being prepared.</h2>
              <p>
                The supplied source includes the title, date, and topic but no completed article
                body. It is intentionally presented as forthcoming instead of publishing invented
                content under Mathis’s name.
              </p>
              <a className="button button--primary" href={localeHref('/research')}>
                {strings.pages.exploreResearchArea} <ArrowIcon />
              </a>
            </div>
          ) : (
            <>
              <ArticleBlocks
                blocks={article.body}
                newTabLabel={strings.a11y.newTab}
                onZoom={setPreview}
              />

              {video ? (
                <figure className="article-media">
                  {video.kind === 'iframe' ? (
                    <iframe
                      allow="fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      src={video.src}
                      title={video.title}
                    />
                  ) : (
                    <video
                      controls
                      playsInline
                      poster={video.image}
                      preload="metadata"
                      src={video.src}
                    >
                      Your browser does not support the video element.
                    </video>
                  )}
                  <figcaption>{video.description}</figcaption>
                </figure>
              ) : null}

              {article.sourceHref ? (
                <p className="article-source">
                  <a href={article.sourceHref} rel="noreferrer" target="_blank">
                    View the primary source <ArrowIcon external />
                    <NewTabHint label={strings.a11y.newTab} />
                  </a>
                </p>
              ) : null}
            </>
          )}
        </div>
      </article>

      <nav aria-label="More insights" className="related-writing section">
        <p className="section-label">More insights</p>
        {articleItems
          .filter((item) => item.id !== article.id)
          .map((item) => (
            <a href={localeHref(item.href)} key={item.id}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </a>
          ))}
      </nav>

      {preview ? (
        <ImageLightbox
          alt={preview.alt}
          caption={preview.caption ? renderInline(preview.caption, strings.a11y.newTab) : undefined}
          closeLabel={strings.a11y.closeImage}
          onClose={() => setPreview(null)}
          src={preview.src}
        />
      ) : null}
    </main>
  )
}
