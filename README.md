# Mathis personal website

A production-ready React and TypeScript recreation of the complete public
[nabauer.com](https://nabauer.com/) portfolio. It includes the homepage, all index and detail pages,
the linked Daily Noodle case study, the legacy Shorts redirect, the hidden whiteboard, responsive
layouts, local reference media, and the original interaction patterns.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 10.28.2

## Local development

```bash
pnpm install
pnpm dev
```

The Vite development server supports every route through the client-side router. Hold the header
logo for 1.5 seconds to open the persistent local whiteboard.

## Configuration

Copy `.env.example` to `.env.local`. Set `VITE_SITE_URL` to the deployed origin for absolute social
and canonical URLs, and set `VITE_CONTACT_ENDPOINT` to an endpoint you control for direct form
delivery. Without a form endpoint, submissions expose a prefilled email-app fallback. The original
site's private form endpoint and analytics identifier are deliberately not reused.

## Quality checks

```bash
pnpm check
```

`pnpm check` runs linting, TypeScript, the 36-reference-route plus whiteboard content/asset integrity
audit, and the production build. The project targets Node.js 24 and is maintained on the `dev`
branch.

## Reference synchronization

The exact long-form page markup and media inventory are generated from the reference site:

```bash
pnpm sync:reference
```

Generated pages live in `src/generated/pages`, while React owns the shared shell, routing,
accessibility, filters, modals, lightboxes, video expansion, reading progress, case-study contents,
contact delivery, and whiteboard. Run synchronization intentionally: it refreshes the checked-in
reference snapshot and locally mirrored media from the configured reference origin.

## Deployment

The production build creates a metadata-correct HTML shell for every route plus `404.html`.
`public/_redirects` maps unknown paths to the 404 shell on Netlify and Cloudflare Pages; configure
the equivalent not-found behavior on other hosts. Assets are root-relative, so configure Vite's
`base` option before deploying below a domain subpath.
