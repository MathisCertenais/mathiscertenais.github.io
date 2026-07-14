import { workItems } from '../content'
import { ArrowIcon } from './Icons'

export function WorkSection() {
  return (
    <section className="home-section section" id="work">
      <div className="section-heading">
        <h2>Selected work</h2>
        <a href="https://nabauer.com/work">
          All case studies <ArrowIcon />
        </a>
      </div>

      <div className="work-list">
        {workItems.map((item) => (
          <a
            className={`work-card work-card--image-${item.imageSide}`}
            href={item.href}
            key={item.number}
          >
            <div className="work-card__media">
              <img alt={item.imageAlt} loading="lazy" src={item.image} />
            </div>
            <div className="work-card__content">
              <div className="work-card__intro">
                <p className="work-card__eyebrow">
                  <span>{item.number}</span>
                  {item.eyebrow}
                </p>
                <h3>{item.title}</h3>
                <p className="work-card__description">{item.description}</p>
              </div>

              <div className="work-card__footer">
                <ul aria-label="Project disciplines" className="tag-list">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <span className="work-card__link">
                  Read case study <ArrowIcon />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
