import { proofPoints } from '../content'
import { ArrowIcon, ProofIcon } from './Icons'

export function Hero() {
  return (
    <section className="hero section" id="about">
      <div className="hero__stage">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <strong>Nate Bauer</strong>
            <span> · Lead Product Designer</span>
          </p>

          <h1 className="hero__title">
            <span className="hero-highlight">Enterprise healthcare.</span>
            <br />
            <span className="hero-highlight">Agile design.</span>
          </h1>

          <p className="hero__description">
            15 years of product design — leading $40M agile teams and consulting across distributed
            product orgs.
          </p>

          <div className="availability-pill">
            <span aria-hidden="true" className="availability-pill__dot" />
            <span>Open to lead and principal product design roles — based in Seattle, available remote</span>
          </div>

          <div className="hero__actions">
            <a className="button button--primary" href="#work">
              View work <ArrowIcon />
            </a>
            <a className="button button--secondary" href="https://nabauer.com/resume">
              View résumé <ArrowIcon />
            </a>
          </div>
        </div>

        <img
          alt="Illustrated portrait of Nate Bauer"
          className="hero__portrait"
          height="525"
          src="/assets/portrait.webp"
          width="480"
        />
      </div>

      <div className="proof-strip">
        {proofPoints.map((proof) => (
          <article className="proof-item" key={proof.title}>
            <span className="proof-item__icon">
              <ProofIcon kind={proof.kind} />
            </span>
            <div>
              <h2>{proof.title}</h2>
              <p>{proof.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
