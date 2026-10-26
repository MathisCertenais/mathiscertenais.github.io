# Glossary

One concept, one word, in both languages. When a term is added here, the English and French copy
use it exactly; a synonym in the other language is a defect.

The French column is not a literal translation. It follows the settled choices at the head of
`src/content/fr.ts`: say the thing in French, keep established anglicisms, and write HPC out in
prose.

## Research and site vocabulary

| Concept | English | French | Notes |
| --- | --- | --- | --- |
| The field | high-performance computing (HPC) | calcul haute performance | Write HPC out in prose; keep the acronym in labels and after first mention |
| The thesis subject | scientific data logistics | logistique des données scientifiques | Not "data management" unless the source says management |
| Systems spanning sites | cross-facility workflows | workflows répartis entre plusieurs centres | "Multi-site" only when the source says multi-site |
| The scale | exascale | exascale | Lowercase in prose |
| A chapter of work | research | recherche | Never "recherches" in the nav; the section is `Recherche` |
| An article | insight | article | The English section is "Insights"; the French nav is "Articles" |
| A dated piece about one project | side project | projet personnel | Category label in articles |
| A formal study of the site's work | case study | étude de cas | Used by the AI-lab article's kicker |
| Data on disk | storage | stockage | Not "storage" in French prose |
| A processing chain | pipeline / workflow | workflow | "Workflow" stays; "pipeline" only for the radio-astronomy chain where the source uses it |
| A step in a chain | step | étape | |
| A measurement | metric | indicateur | "Métrique" only when quoting a source |
| Verified | verified | vérifié | Never claim verification the audit does not support |
| Accessibility | accessibility (RGAA / WCAG) | accessibilité (RGAA / WCAG) | Both names stay in Latin script |
| Partial audit | partial RGAA / WCAG AA audit | audit partiel RGAA / WCAG AA | The footer wording; do not upgrade it to "conformant" |
| The role | PhD researcher / doctoral researcher | chercheur doctoral | Not "doctorant" in the English copy, not "PhD student" |
| The discipline | computer scientist | chercheur en informatique | The person, not the degree |
| The card | business card | carte de visite | |
| The printable CV | résumé / profile | profil | Route is `/resume`; French label is "Profil" |

## People, institutions and projects

Spelled identically in both languages: **Mathis Certenais**, **IRISA**, **Université de Rennes**,
**NumPEx**, **ECLAT**, **SKA / SKA-Low / SKA-Mid**, **LOFAR**, **GENCI**, **CINES**, **IDRIS**,
**TGCC**, **SRCNet**, **DDFacet**, **RIMs**, **arXiv**. Do not translate an institution's name;
do not expand an acronym the source leaves unexpanded.

## Agent vocabulary

| Term | Meaning here |
| --- | --- |
| orchestrator | the primary agent that plans, routes and verifies; the user's only interlocutor |
| specialist / subagent | a role launched with fresh context for one piece of work |
| editor | the project-scoped agent for article and bilingual copy (`.opencode/agents/editor.md`) |
| quality | the agent that runs the checks and reports evidence; it never edits |
| acceptance criterion | the one sentence that says when a piece of work is done |

## Route vocabulary

`/insights` (English) and `/fr/insights` (French) are the article sections. `/writing/…` is a
legacy alias, `noindex, follow`, never a canonical link target. `/research`, `/videos`, `/about`,
`/resume`, `/contact`, `/accessibility` exist in both languages unless the manifest says
otherwise. The manifest — not the components — is the list of what exists.
