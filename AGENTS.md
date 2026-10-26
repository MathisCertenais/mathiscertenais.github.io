# mathiscertenais.github.io

The public portfolio of Mathis Certenais: a React 19 + TypeScript site built with Vite, served
as static files from GitHub Pages. It presents verified work in high-performance computing,
scientific data logistics, cross-facility workflows and radio astronomy, in English and French,
with accessibility (RGAA 4.1 / WCAG 2.2 AA) treated as a product requirement.

Read this file before planning anything. It overrides an agent's general habits. The rules a
reviewer enforces are in `CODING_STANDARDS.md`; the vocabulary is in `GLOSSARY.md`; the
accessibility state is in `docs/rgaa-audit.md`.

## Commands

```bash
pnpm dev                     # Vite dev server, every route through the client router
pnpm build                   # tsc -b && vite build && prerender every route from the manifest
pnpm check                   # lint, types, route manifest, fresh build, dist audit
pnpm check:routes            # route manifest vs content, without building
pnpm check:dist              # audit the built shells in dist/
pnpm preview                 # serve dist/ locally
node scripts/browser-check.mjs --serve http://localhost:4173/research/ \
  --expect "InPEx 2025" --out /tmp/research.png
                             # render in the Chromium already on the machine:
                             # DOM after JS, screenshot, console errors
```

Node 24 (`.nvmrc`), pnpm 10.28.2. `fnm use` selects it; the interactive shell may default to a
newer Node, and `pnpm check` on a newer runtime is not the supported one. The pre-push hook runs
`pnpm check` with `VITE_SITE_URL=https://mathiscertenais.com`, refuses a dirty working tree, and
refuses a committed `dist/` that differs from that build. Bypass only with
`git push --no-verify`.

## Layout

| Path | Responsibility |
| --- | --- |
| `src/content/en.ts` | **Source of truth**: identity, profile, research, articles, videos, card |
| `src/content/fr.ts` | French identity and page copy, article metadata, translated article bodies |
| `src/locales.ts` | Interface chrome strings, both languages |
| `src/data/route-manifest.json` | Every public route: canonical, title, description, `page` id |
| `src/components/` | Pages and sections; one file per page or shared section |
| `src/routing.ts`, `src/App.tsx` | Client router and route table |
| `src/styles.css` | The whole visual system: tokens, themes, layout, print |
| `scripts/prerender-routes.mjs` | Writes a metadata shell per manifest route into `dist/` |
| `scripts/check-routes.mjs` | Validates manifest ↔ content ↔ public assets, in source or in `dist/` |
| `dist/` | **Generated and committed**: never edit by hand |

## Content model

- `ArticleItem` (in `src/content/en.ts`) is the article schema: `id`, `number`, `category`,
  `date`, `title`, `description`, `href`, `image`, `imageAlt`, `body`, optional `sourceHref`
  and `status`. `ArticleId` is a closed union: a new article means a new id there, a new entry
  in `articleItems`, French metadata in `articleTranslations`, and manifest routes.
- Nine articles exist, all with French bodies. A new article means its English body in
  `articleItems`, French metadata in `articleTranslations`, a French body in `articleBodies`, and
  the manifest routes — not a fallback to the English prose.
- `body` blocks are `paragraph`, `heading` (level 2 or 3), `list`, and link variants. Inline
  links are written `[label](url)` inside `text`; never inject raw HTML.
- Every route — canonical, French variant, legacy alias — lives in `src/data/route-manifest.json`
  with its own title and description. Legacy aliases are `noindex, follow` and point at a
  canonical route. `check:routes` fails on a route without content, a content page without a
  route, or an unreferenced public asset.
- French is a translation, not a calque: see the head of `src/content/fr.ts` for the settled
  choices (`workflow` stays, `storage` → `stockage`, HPC written out in prose).

## Hard rules

- **Both languages ship.** Adding a UI string, a page string, a nav item or an article means
  updating `en.ts`/`locales.ts` and `fr.ts`/`locales.ts` in the same change. A half-translated
  pair is a defect, not a follow-up.
- **Never invent a fact.** No citation, date, metric, job title, institution, link or quote that
  is not verifiable in the repository or in a source the user supplied. When a source is missing,
  say so and ask — "unverified" is an acceptable answer, a plausible invention is not.
- **Accessibility is a requirement.** WCAG 2.2 AA / RGAA 4.1: keyboard path, visible focus,
  labels, contrast (4.5:1 body, 3:1 large/UI), no colour-only meaning, alt text on every image,
  meaningful link text, `prefers-reduced-motion`, 320 px and 200 % zoom. New interactive
  components need a keyboard test before they are called done.
- **`dist/` is build output.** Run `pnpm build`; never hand-edit a file in `dist/`. To reproduce
  production exactly, build with `VITE_SITE_URL=https://mathiscertenais.com` (the pre-push hook
  does). `sitemap.xml` is generated only when that origin is set.
- **Dependencies**: React, Vite and the dev toolchain are the budget. No CSS framework, no UI
  kit, no router library, no state library. A new dependency needs an explicit decision from the
  user, with what it buys and what it locks in.
- **Secrets**: never read, print, commit or invent `.env*`. `VITE_WEB3FORMS_KEY` is public by
  design (it ships in the bundle); it still comes from the environment, never from a guess.
- **Scratch**: `tasks/` is never committed. The two ~120 MB `.mp4` files at the repository root
  are source material — never open, read or move them; the site references rendered derivatives.
- **No push, tag, release or deploy without explicit approval.** A local build and a diff are
  not a release.
- **The scientist uses the internet.** A claim, a formula or a citation is checked against the
  primary source with `webfetch` — the paper, the institution's page, the official agenda — not
  against a search snippet. Record the URL next to every claim it supports; a claim without a
  reachable source is marked unverified.
- **A UI change is verified in a browser, not in your head.** `node scripts/browser-check.mjs
  --serve <url> --expect "<text>" --out /tmp/<name>.png` renders the built page in the Chromium
  already installed on this machine and prints the checks. Paste the command and its `ok`/`FAIL`
  lines; when a screenshot is produced, say what you saw in it. "It should render" is not
  verification.
- **Commit messages** match the history: `[feat] …` for a capability or an article,
  `fix(scope): …`, `a11y(scope): …`, `docs: …`, `content: …`. Imperative, present tense, no
  period.

## Writing voice

First person, concrete, no adjectives doing the work of evidence. English copy uses British
spelling (`analyse`, `specialising`, `colour`) — match the existing text. French avoids calques
and keeps institutional names (IRISA, NumPEx, ECLAT, SKA, LOFAR, GENCI, CINES, IDRIS, TGCC)
unchanged. The AI-lab article is the reference for a long piece: interview structure, a claim
per paragraph, numbers that can be checked.

## Skills

The Matt Pocock skills are installed globally. Load one when the task matches; do not load two
that cover the same ground in one task.

| Task | Skill |
| --- | --- |
| Before a design or a structural decision | `grilling` |
| Reviewing a branch, a PR or work in progress | `code-review` (Standards + Spec, two parallel reviews) |
| A bug, a crash, a performance regression | `diagnosing-bugs` |
| `src/content/readingTime.ts`, `src/routing.ts`, `scripts/*.mjs` | `tdd` with `node --test` only; the repo has no test framework and does not need one |
| Any user-visible change | `browser-automation`, through `scripts/browser-check.mjs` |
| A fact, a citation or a number in an article or `/research` | `research` — primary sources, captured as a note |
| `GLOSSARY.md`, an ADR, project vocabulary | `domain-modeling` |
| Editing `AGENTS.md` or an agent prompt | `writing-for-agents` |
| Writing a PR body | `pr` |
| A design question that needs code, not an argument | `prototype` |

Not used here: `scaffold-exercises`, `game-development`, `wizard`, `migrate-to-shoehorn`,
`setup-pre-commit` and `git-guardrails-claude-code` (this repo already has its pre-push hook),
`report`, `opencode` (configuration questions only). The wider Matt Pocock set installed in
`~/.agents/skills` — `ask-matt`, `handoff`, `grill-with-docs`, `to-spec`, `to-tickets`, `triage`,
`wayfinder`, `retro`, `teach` — is not exposed to OpenCode; do not call it from here. Those files
set `disable-model-invocation: true`, which OpenCode reads as `opencode/autoinvoke: false`:
registered but never advertised. To advertise one, copy its directory into
`~/.config/opencode/skills/` and replace that flag with `metadata: { opencode/autoinvoke: true }`;
the copy wins by precedence and the upstream checkout stays untouched.

## The team

The orchestrator for this repository is `orchestrator` (`.opencode/agents/`). It delegates to the
generic specialists in `~/.config/opencode/agents/` — `developer`, `ui`, `quality`, `security`,
`writer`, `scientist`, `architect`, `marketing` — and to the project-scoped `editor` for article
and bilingual copy. Every specialist reads this file first.

## Where to look before changing anything

- `README.md` — architecture, routes, deployment, the reasoning behind the build.
- `CODING_STANDARDS.md` — the rules a reviewer enforces on a diff.
- `GLOSSARY.md` — the canonical term for each concept, in both languages.
- `docs/rgaa-audit.md` — what is verified, what is declared partial, what is not covered.
- `src/data/route-manifest.json` — the authoritative list of public routes.
