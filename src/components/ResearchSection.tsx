import { researchFigures, researchThesis } from '../content'
import { ArrowIcon } from './Icons'

export function ResearchSection() {
  return (
    <section className="home-section research-feature section" id="research">
      <div className="section-heading">
        <h2>Research</h2>
        <a href="/research">
          Read the research <ArrowIcon />
        </a>
      </div>

      <div className="research-feature__body">
        <div>
          <p className="section-label">{researchThesis.label}</p>
          <h3 className="research-feature__title">{researchThesis.title}</h3>
          <p className="research-feature__lead">
            Scientific instruments produce more data than any single site can receive, process, or
            keep. Turning those flows into science-ready products means running chains that cross
            instruments, supercomputers, storage platforms, and research networks — each under a
            different administration and a different law.
          </p>
          <p className="research-feature__lead">
            That is a governance problem before it is a bandwidth problem. The thesis models this
            data logistics, optimises it against competing criteria, specifies the metadata it
            needs, and exposes it to scientists without hiding the requirements that keep results
            secure and reproducible.
          </p>
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
            <strong>Radio astronomy</strong>
            <span>
              Grounded in the DDF Pipeline for LOFAR, an SKA precursor, running across the French
              national supercomputers and European research storage.
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}