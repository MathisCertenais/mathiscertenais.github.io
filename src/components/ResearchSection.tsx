import { researchFeature, researchFigures, researchThesis } from '../content'
import { ArrowIcon } from './Icons'

export function ResearchSection() {
  return (
    <section className="home-section research-feature section" id="research">
      <div className="section-heading">
        <h2>{researchFeature.heading}</h2>
        <a href="/research">
          Read the research <ArrowIcon />
        </a>
      </div>

      <div className="research-feature__body">
        <div>
          <p className="section-label">{researchThesis.label}</p>
          <h3 className="research-feature__title">{researchThesis.title}</h3>
          {researchFeature.leads.map((lead) => (
            <p className="research-feature__lead" key={lead.slice(0, 32)}>
              {lead}
            </p>
          ))}
          <a className="button button--primary" href="/research">
            Explore the research <ArrowIcon />
          </a>
        </div>

        <ul className="research-feature__facts">
          {researchFigures.map((figure) => (
            <li key={figure.value}>
              <strong>{figure.value}</strong>
              <span>{figure.label}</span>
            </li>
          ))}
          <li className="research-feature__context">
            <strong>{researchFeature.context.label}</strong>
            <span>{researchFeature.context.text}</span>
          </li>
        </ul>
      </div>
    </section>
  )
}