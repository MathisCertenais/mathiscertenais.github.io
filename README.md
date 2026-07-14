# Mathis personal website

A responsive React and TypeScript portfolio built with Vite. The current identity, content, links,
and visual assets intentionally mirror the supplied Nate Bauer reference; shared page content is
centralized in `src/content.ts` for a later identity/content pass.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 10.28.2

## Local development

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The project targets Node.js 24 and is maintained on the `dev` branch.

## Deployment

The production build uses root-relative asset paths and is ready for a root-domain deployment.
Configure Vite's `base` option before deploying it under a repository subpath such as GitHub Pages.
