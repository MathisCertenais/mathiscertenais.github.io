# Mathis Certenais — research portfolio

A production-ready React and TypeScript portfolio for computer scientist and PhD researcher Mathis
Certenais. The site presents verified work in high-performance computing, scientific data
logistics, cross-facility workflows, and radio astronomy while retaining the established visual
system and interaction quality of the original UI.

## Stack

- React 19 and TypeScript
- Vite 8
- Plain CSS with light, dark, and system-aware themes
- Static metadata shells for every public route and compatibility alias

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 10.28.2

## Local development

```bash
pnpm install
pnpm dev
```

Vite serves every route through the client-side router. The theme control persists the visitor's
explicit preference in local storage and otherwise follows the operating system.

## Content and routes

Verified profile, research, writing, video, and resource data is centralized in `src/content.ts`.
Route metadata and legacy inbound URL mappings live in `src/data/route-manifest.json`.

`/research` is a single narrative page rather than a list of project entries. Its content is
modelled in `src/content.ts` as an explicit thesis structure — problem, context, figures,
perspectives, processing chain, methods, contribution, and applications — so the argument can be
revised in one place instead of being spread across separate overview pages.

The same thesis summary is surfaced on the home page through `src/components/ResearchSection.tsx`,
so the research is legible from the portfolio root without visiting `/research`.

Canonical sections include:

- `/research`
- `/insights` and nine article pages
- `/videos`, `/about`, `/resume`, and `/contact`

Legacy portfolio URLs remain available as `noindex, follow` compatibility aliases. Each alias
points directly to a relevant Mathis canonical route, so existing inbound links keep working
without creating duplicate search results. The former `/work/*` aliases resolve to `/research`.

## Self-hosted QR code

`public/images/mathis/qr/mathiscertenais-com.svg` is the QR code shown on the business card on
`/contact`. It encodes `https://mathiscertenais.com` and is served from this origin, so no
third-party QR service ever sees the URL or the visitors who scan it. The asset is committed as a
plain SVG, so the site makes no request to a QR provider at build time or at runtime.

Regenerate it with the dependency-free encoder in `scripts/generate-qr.mjs`:

```bash
pnpm qr:generate
pnpm qr:generate https://mathiscertenais.com/contact --ecc Q
```

The generator implements ISO/IEC 18004 byte mode directly, defaults to error-correction level M and
the smallest version that fits, and writes to `public/images/mathis/qr/<host>.svg`. `--version` and
`--out` are available when a fixed symbol size or destination is needed. Keep the file name stable
or update the reference on the contact page, since the route validator rejects unreferenced public
assets.

## Business card

The card on `/contact` is HTML and CSS rather than an exported bitmap: it stays sharp at any zoom,
reuses the portrait and the QR code the site already serves, and keeps its own colours so it stays
readable in the dark theme. Its geometry is driven by a single `--u` unit — one percent of the card
width on screen, 0.85 mm once printed — so the screen version and the printed version are the same
layout, at the same proportions. Copy and contacts live in `businessCard` in `src/content.ts`.

Printing `/contact` from a browser yields the card alone, on a 91 × 61 mm page: the standard
85 × 55 mm card plus the 3 mm of bleed a print shop asks for. Two commands write the files shops ask
for, one for each kind:

```bash
pnpm card:pdf   # mathis-certenais-card.pdf — 91 × 61 mm, vector text
pnpm card:jpg   # mathis-certenais-card.jpg — 1376 × 924 px, 384 dpi, sRGB
```

`--format both` writes the two of them in a single pass. The export starts Vite itself and drives a
local Chromium build over the DevTools protocol (set `CHROME_PATH` to choose one), then writes the
files named by the first argument, or `mathis-certenais-card.<ext>` in the project root. Because both
files come from the same markup and stylesheet as the page, the card in the browser and the card on
paper cannot drift apart. The phone number on the card is also rendered as text on the page, so it is
publicly readable there.

## Search indexing

`public/robots.txt` allows crawling and points at the sitemap. `sitemap.xml` is not committed: the
build writes it from `src/data/route-manifest.json`, listing only the canonical routes that are
meant to be indexed — today 34 of them. The 33 legacy aliases (`noindex, follow`) are deliberately
left out, because asking Google to index a noindex page sends a contradictory signal. `pnpm check:dist` fails if the sitemap and the manifest ever disagree.

Both the sitemap and the Open Graph URLs need an absolute origin, which comes from
`VITE_SITE_URL`: the deploy workflow sets it, and a local build that needs to match production passes
it the same way:

```bash
VITE_SITE_URL=https://mathiscertenais.com pnpm build
```

Without it the build skips `dist/sitemap.xml` and emits relative `og:image` paths, which link
previews cannot resolve. `pnpm check` therefore only audits the sitemap when the origin is set.

Link previews also cannot decode SVG, so `og:image` and `twitter:image` point at
`public/images/mathis/social-card.png`: the card's `share` variant — the same design at 1200 × 630,
the 1.905:1 shape LinkedIn and Facebook render — without the QR, which is pointless in a preview
where the reader already has the link, and with the contacts trimmed to the domain. Regenerate it
after any change to the card:

```bash
pnpm social:png
```

The export refuses to write the file if the copy outgrows the card, so a clipped share image fails
loudly instead of shipping.

## Prerendered content

Every indexable route ships its text inside `#root`, written at build time from `src/content.ts` by
`scripts/prerender-routes.mjs`. A client that never runs JavaScript — Google's first pass, Bing, the
crawlers behind answer engines, any plain parser — therefore reads the page instead of an empty div.
React clears `#root` when it mounts, so visitors see the app and only the app.

The fallbacks are generated from the same content the components render, which is why the prose of
the profile pages lives in `content.ts` rather than inside the components. Adding a route means
adding a generator in `prerender-routes.mjs`: the build fails if an indexable canonical route has
none.

`pnpm check:dist` then verifies every shell: expected strings, a minimum amount of readable text and
a minimum number of links, so a fallback that silently loses a section — or a link that got escaped
into plain text — fails the build rather than the search results.

## Configuration

Copy `.env.example` to `.env.local` when local overrides are needed:

```bash
cp .env.example .env.local
```

- `VITE_SITE_URL` sets the deployed origin used for absolute canonical and social URLs.
- `VITE_WEB3FORMS_KEY` makes the contact form deliver: submissions post to the
  Web3Forms service, which emails them to Mathis. The key is public by design — it
  rides in the bundle and only routes a message to the inbox it was issued for — so
  the deploy workflow reads it from the `VITE_WEB3FORMS_KEY` repository secret.
- `VITE_CONTACT_ENDPOINT` is the alternative transport: an endpoint you control,
  which receives the form as multipart form data.

The form prefers `VITE_WEB3FORMS_KEY`, then `VITE_CONTACT_ENDPOINT`. With neither,
or when a delivery fails, it hands the sender a prefilled email draft instead of
losing the message. A submission is only reported as sent once the transport
accepted it. The form also carries an off-screen honeypot field, so a submission
that fills it comes from a bot and is dropped by the service. No private analytics
identifier is bundled.

## Quality checks

```bash
pnpm check
```

The full check runs ESLint, TypeScript, route/content/public-asset validation, the production build,
and a second audit of every prerendered route shell and the final `dist` output. The validator also
protects the repository from stale snapshot content, synthetic portrait watermarks, unfinished
placeholder copy, broken canonical targets, missing social images, and unreferenced public media.

Pushing runs the same checks again, from the hook in `.githooks/`:

```bash
git config core.hooksPath .githooks   # once per clone
```

It refuses a push when `pnpm check` fails, when a file is left out of the commit, or when the
committed `dist` no longer matches a fresh build — three failures this repository has already
produced once. Bypass it with `git push --no-verify` when you know why.

For a faster source-only route and asset audit:

```bash
pnpm check:routes
```

## Production build

```bash
pnpm build
```

The build writes a metadata-correct `index.html` for every manifest route plus `dist/404.html`.
When `VITE_SITE_URL` is configured, canonical, Open Graph, and Twitter image URLs are absolute.
`public/_redirects` provides the not-found fallback for Netlify and Cloudflare Pages; configure the
equivalent behavior when deploying elsewhere. Assets are root-relative, so update Vite's `base`
option before hosting under a domain subpath.

Development and releases are maintained directly on the `dev` branch.
