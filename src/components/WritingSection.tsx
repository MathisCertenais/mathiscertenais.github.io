import { useLanguage } from '../language/LanguageProvider'
import { readingTimeMinutes } from '../content/readingTime'
import { ArrowIcon } from './Icons'

interface WritingSectionProps {
  heading?: string
  showAllLink?: boolean
}

export function WritingSection({ heading, showAllLink = true }: WritingSectionProps) {
  const { content, localeHref, strings } = useLanguage()
  const { articleItems, writingPage } = content
  const sectionHeading = heading ?? writingPage.sectionHeading

  return (
    <section className="home-section section writing-section" id="writing">
      <div className="section-heading">
        <h2>{sectionHeading}</h2>
        {showAllLink ? (
          <a href={localeHref('/writing')}>
            {strings.writing.allInsights} <ArrowIcon />
          </a>
        ) : null}
      </div>

      <div className="article-list">
        {articleItems.map((article) => (
          <a className="article-row" href={localeHref(article.href)} key={article.id}>
            <span className="article-row__number">{article.number}</span>
            <span className="article-row__copy">
              <span className="article-row__category">
                {article.category} · {article.date}
                {article.body.length > 0 ? (
                  <>
                    {' · '}
                    {readingTimeMinutes(article)} {strings.pages.readingTime}
                  </>
                ) : null}
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
