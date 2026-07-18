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

Canonical sections include:

- `/research` and three research detail pages
- `/writing` and three update/detail pages
- `/videos`, `/about`, `/resume`, `/resources`, `/archive`, and `/contact`
- `/whiteboard`, which is deliberately excluded from search indexing

Legacy portfolio URLs remain available as `noindex, follow` compatibility aliases. Each alias
points directly to a relevant Mathis canonical route, so existing inbound links keep working
without creating duplicate search results.

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
