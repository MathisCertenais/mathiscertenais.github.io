import { articleItems } from '../content'
import { ArrowIcon } from './Icons'

export function WritingSection() {
  return (
    <section className="home-section section writing-section" id="writing">
      <div className="section-heading">
        <h2>Writing</h2>
        <a href="https://nabauer.com/articles">
          All writing <ArrowIcon />
        </a>
      </div>

      <div className="article-list">
        {articleItems.map((article) => (
          <a className="article-row" href={article.href} key={article.number}>
            <span className="article-row__number">{article.number}</span>
            <span className="article-row__copy">
              <span className="article-row__category">{article.category}</span>
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

