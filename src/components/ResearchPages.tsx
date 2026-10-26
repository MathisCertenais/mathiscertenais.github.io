import { useState } from 'react'
import { useLanguage } from '../language/LanguageProvider'
import { ArrowIcon } from './Icons'
import { ImageLightbox, type ImagePreview } from './ImageLightbox'
import { NewTabHint } from './NewTabHint'
import { PageHero } from './PageHero'

export function ResearchPage() {
  const { content, localeHref, strings } = useLanguage()
  const [preview, setPreview] = useState<ImagePreview | null>(null)
  const {
    researchApplications,
    researchCase,
    researchChapters,
    researchChain,
    researchContribution,
    researchFeature,
    researchFigures,
    researchKeywords,
    researchMethods,
    researchPerspectives,
    researchThesis,
    sourceLinks,
  } = content

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        eyebrow={researchFeature.heading}
        illustration={{
          alt: strings.pages.skaAlt,
          ratio: '2 / 1',
          src: '/images/mathis/ska-processing-chain.webp',
        }}
        illustrationActionLabel={strings.a11y.openFigure}
        intro={researchThesis.summary}
        onIllustrationActivate={() =>
          setPreview({
            alt: strings.pages.skaAlt,
            caption: strings.pages.skaCaption,
            src: '/images/mathis/ska-processing-chain.webp',
          })
        }
        title={researchThesis.title}
      />

      <section className="research-thesis section">
        <p className="section-label">{researchThesis.label}</p>
        <p className="research-thesis__meta">{researchThesis.context}</p>
        <p className="research-thesis__meta">{researchThesis.programme}</p>
        <ul aria-label={strings.pages.researchThemes} className="tag-list">
          {researchKeywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      </section>

      {researchChapters.map((chapter) => (
        <section className="research-story section" key={chapter.label}>
          <div>
            <p className="section-label">{chapter.label}</p>
            <h2>{chapter.heading}</h2>
          </div>
          <div className="research-story__copy">
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="research-figures">
        <div className="section">
          <ul className="research-figures__list">
            {researchFigures.map((figure) => (
              <li key={figure.value}>
                <strong>{figure.value}</strong>
                <span>{figure.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="research-section section">
        <div className="section-heading">
          <p className="section-label">Perspectives</p>
          <h2>{strings.pages.perspectives}</h2>
        </div>
        <div className="research-perspectives">
          {researchPerspectives.map((perspective) => (
            <article key={perspective.number}>
              <span>{perspective.number}</span>
              <h3>{perspective.title}</h3>
              <p>{perspective.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="research-section research-section--surface section">
        <div className="section-heading">
          <p className="section-label">{researchMethods.label}</p>
          <h2>{researchMethods.heading}</h2>
        </div>
        <div className="research-methods">
          <ol className="research-chain">
            {researchChain.map((step) => (
              <li key={step.site}>
                <p className="research-chain__role">{step.role}</p>
                <h3>{step.site}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
          <div className="research-methods__copy">
            {researchMethods.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <figure className="detail-figure">
          <button
            className="figure-zoom"
            onClick={() =>
              setPreview({
                alt: strings.pages.skaAlt,
                caption: strings.pages.skaCaption,
                src: '/images/mathis/ska-processing-chain.webp',
              })
            }
            type="button"
          >
            <img alt={strings.pages.skaAlt} loading="lazy" src="/images/mathis/ska-processing-chain.webp" />
          </button>
          <figcaption>
            {strings.pages.skaCaption}
          </figcaption>
        </figure>
      </section>

      <section className="research-story section">
        <div>
          <p className="section-label">{researchCase.label}</p>
          <h2>{researchCase.heading}</h2>
        </div>
        <div className="research-story__copy">
          {researchCase.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a href={sourceLinks.arxiv} rel="noreferrer" target="_blank">
            {strings.pages.arxivPaper} <ArrowIcon external />
            <NewTabHint label={strings.a11y.newTab} />
          </a>
          <p className="research-story__talk">
            {strings.pages.inpexTalk}{' '}
            <a href={sourceLinks.inpexSlides} rel="noreferrer" target="_blank">
              {strings.pages.inpexSlides} <ArrowIcon external />
              <NewTabHint label={strings.a11y.newTab} />
            </a>
            {' · '}
            <a href={sourceLinks.inpexWorkshop} rel="noreferrer" target="_blank">
              {strings.pages.inpexWorkshop} <ArrowIcon external />
              <NewTabHint label={strings.a11y.newTab} />
            </a>
          </p>
        </div>
      </section>

      <section className="research-contribution section">
        <div className="research-contribution__list">
          <p className="section-label">{researchContribution.label}</p>
          <h2>{researchContribution.heading}</h2>
          <ol>
            {researchContribution.paragraphs.map((paragraph) => (
              <li key={paragraph.slice(0, 32)}>{paragraph}</li>
            ))}
          </ol>
        </div>
        <div className="research-contribution__aside">
          <p className="section-label">{researchApplications.label}</p>
          <h3>{researchApplications.heading}</h3>
          {researchApplications.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a href={sourceLinks.numpex} rel="noreferrer" target="_blank">
            {strings.pages.numpexProfile} <ArrowIcon external />
            <NewTabHint label={strings.a11y.newTab} />
          </a>
        </div>
      </section>

      <section className="research-next section">
        <p className="section-label">{strings.pages.whereThisContinues}</p>
        <h2>{strings.pages.reasoningPublic}</h2>
        <div className="research-next__actions">
          <a className="button button--primary" href={localeHref('/writing')}>
            {strings.pages.readNotes} <ArrowIcon />
          </a>
          <a className="button button--secondary" href={sourceLinks.arxiv} rel="noreferrer" target="_blank">
            {strings.pages.publications} <ArrowIcon external />
            <NewTabHint label={strings.a11y.newTab} />
          </a>
          <a className="button button--secondary" href={localeHref('/contact')}>
            {strings.pages.getInTouch} <ArrowIcon />
          </a>
        </div>
      </section>

      {preview ? (
        <ImageLightbox
          alt={preview.alt}
          caption={preview.caption}
          closeLabel={strings.a11y.closeImage}
          onClose={() => setPreview(null)}
          src={preview.src}
        />
      ) : null}
    </main>
  )
}