import { articleItems, getArticle, videoItems } from '../content'
import { ArrowIcon } from './Icons'
import { PageHero } from './PageHero'
import { WritingSection } from './WritingSection'

export function WritingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow="Writing & updates"
        intro="Notes and recorded moments from research at the intersection of high-performance computing, scientific workflows, and radio astronomy."
        title="Explaining systems through their use."
      />
      <WritingSection heading="Latest entries" showAllLink={false} />
    </main>
  )
}

export function ArticlePage({ articleId }: { articleId: string }) {
  const article = getArticle(articleId)
  if (!article) return null
  const video =
    article.id === 'webinar-hpc-applications-as-a-service'
      ? videoItems.find((item) => item.id === 'hpc-service-webinar')
      : article.id === 'international-hackathon-for-astronomy'
        ? videoItems.find((item) => item.id === 'astronomy-hackathon')
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
              <a className="button button--primary" href="/research/hpc-as-a-service">
                Explore the research area <ArrowIcon />
              </a>
            </div>
          ) : (
            <>
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

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
                  </a>
                </p>
              ) : null}
            </>
          )}
        </div>
      </article>

      <nav aria-label="More writing" className="related-writing section">
        <p className="section-label">More writing</p>
        {articleItems
          .filter((item) => item.id !== article.id)
          .map((item) => (
            <a href={item.href} key={item.id}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </a>
          ))}
      </nav>
    </main>
  )
}
