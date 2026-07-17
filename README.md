# Sandeep A Nair — Portfolio

A static-first engineering portfolio built from a career narrative across
Atlassian, Amazon, and Spacejoy, followed by selected personal projects.

The application is intentionally small:

- Next.js App Router with strict TypeScript
- Server Components by default and focused client interaction leaves
- CSS Modules backed by global design and motion tokens
- Motion mini for scoped, interruptible explanatory animation
- React Three Fiber only inside the opt-in Spacejoy case study
- Playwright visual, interaction, and accessibility coverage

## Local development

Requirements:

- Node.js 24
- pnpm 11

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` only when you need to override the canonical
site URL or run Playwright against an external deployment. Never commit
`.env.local` or Vercel’s `.vercel/` metadata.

## Quality commands

```bash
pnpm check
pnpm build
pnpm test:e2e
pnpm test:visual
pnpm verify
```

The project also enforces a 300 non-blank-line ceiling for handwritten
TypeScript, TSX, and CSS files. The committed visual baselines are calibrated
for macOS Chromium; Linux CI runs the same suite with snapshot comparisons
ignored while retaining all interaction and accessibility assertions.

## Motion and accessibility

Motion exists to explain state and preserve continuity, not decorate every
section. The portfolio includes:

- A one-run, interruptible Atlassian task-loop explanation
- A restrained Queans workflow demonstration
- A poster-first transition into the explicitly requested Spacejoy 3D viewer
- Immediate keyboard navigation
- Reduced-motion alternatives that remove autoplay and positional movement

Automated checks use Playwright and `@axe-core/playwright`. Visual references
cover the 1440px desktop and 390px mobile compositions.

## Deployment

The application is configured for Vercel:

```bash
vercel --prod
```

Vercel supplies `VERCEL_PROJECT_PRODUCTION_URL` automatically. Set `SITE_URL`
only when a different canonical domain should be used.

## Asset and usage notice

The source repository is public for portfolio transparency, but no open-source
license is granted. Personal copy, résumé content, portrait imagery, case-study
artwork, and generated visual assets remain copyright of Sandeep A Nair. Do not
reuse those materials without permission.
