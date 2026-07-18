import { articleItems } from '../content'
import { ArrowIcon } from './Icons'

interface WritingSectionProps {
  heading?: string
  showAllLink?: boolean
}

export function WritingSection({ heading = 'Writing & updates', showAllLink = true }: WritingSectionProps) {
  return (
    <section className="home-section section writing-section" id="writing">
      <div className="section-heading">
        <h2>{heading}</h2>
        {showAllLink ? (
          <a href="/writing">
            All writing <ArrowIcon />
          </a>
        ) : null}
      </div>

      <div className="article-list">
        {articleItems.map((article) => (
          <a className="article-row" href={article.href} key={article.id}>
            <span className="article-row__number">{article.number}</span>
            <span className="article-row__copy">
              <span className="article-row__category">
                {article.category} · {article.date}
              </span>
              <span className="article-row__title">{article.title}</span>
              <span className="article-row__description">{article.description}</span>
            </span>
            <span className="article-row__image">
              <img alt={article.imageAlt} loading="lazy" src={article.image} />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
