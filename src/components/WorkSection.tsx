import { researchProjects } from '../content'
import { ArrowIcon } from './Icons'

interface WorkSectionProps {
  heading?: string
  intro?: string
  showAllLink?: boolean
}

export function WorkSection({
  heading = 'Selected research',
  intro,
  showAllLink = true,
}: WorkSectionProps) {
  return (
    <section className="home-section section" id="research-projects">
      <div className="section-heading">
        <h2>{heading}</h2>
        {showAllLink ? (
          <a href="/research">
            All research <ArrowIcon />
          </a>
        ) : null}
      </div>
      {intro ? <p className="section-intro">{intro}</p> : null}

      <div className="work-list">
        {researchProjects.map((item, index) => (
          <a
            className={`work-card work-card--image-${index % 2 === 0 ? 'left' : 'right'}`}
            href={item.href}
            key={item.id}
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
                <ul aria-label="Research themes" className="tag-list">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <span className="work-card__link">
                  Read research overview <ArrowIcon />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
