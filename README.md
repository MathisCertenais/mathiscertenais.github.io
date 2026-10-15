# Mathis Certenais — research portfolio

A production-ready React and TypeScript portfolio for computer scientist and PhD researcher Mathis
Certenais. The site presents verified work in high-performance computing, scientific data
logistics, cross-facility workflows, and radio astronomy while retaining the established visual
system and interaction quality of the original UI.

## Stack

- React 19 and TypeScript
- Vite 8
- Plain CSS with light, dark, and system-aware themes
- `tldraw` for the local whiteboard
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
explicit preference in local storage and otherwise follows the operating system. Hold the header
mark for 1.5 seconds to open the browser-local whiteboard.

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
- `/writing` and six update/detail pages
- `/videos`, `/about`, `/resume`, `/resources`, `/archive`, and `/contact`
- `/whiteboard`, which is deliberately excluded from search indexing

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

## Configuration

Copy `.env.example` to `.env.local` when local overrides are needed:

```bash
cp .env.example .env.local
```

- `VITE_SITE_URL` sets the deployed origin used for absolute canonical and social URLs.
- `VITE_CONTACT_ENDPOINT` enables direct contact-form delivery to an endpoint you control.

When no contact endpoint is configured, the form provides a prefilled email-app fallback. No
private analytics identifier or third-party form secret is bundled.

## Quality checks

```bash
pnpm check
```

The full check runs ESLint, TypeScript, route/content/public-asset validation, the production build,
and a second audit of every prerendered route shell and the final `dist` output. The validator also
protects the repository from stale snapshot content, synthetic portrait watermarks, unfinished
placeholder copy, broken canonical targets, missing social images, and unreferenced public media.

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
