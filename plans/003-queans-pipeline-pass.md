# 003 — Demonstrate the Queans review pipeline once

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: LOW
- **Category**: Explanation
- **Estimated scope**: 3 files, about 180 lines changed

## Problem

The five Queans stages in
`src/features/personal-projects/queans-project.tsx:26-42` are readable but
completely static. Because this is a rare marketing explanation, one restrained
pass can clarify that uncertain OCR output moves toward human review.

## Target

Replace only the pipeline list with a client leaf that:

- Renders all five stages statically and accessibly.
- Adds one independent, `aria-hidden` outline indicator.
- Starts when at least 50% of the pipeline enters view.
- Moves Upload → OCR → Extract → Confidence → Human review once.
- Uses `240ms` strong ease-in-out per handoff and `480ms` dwell.
- Rests on Human review and never replays while mounted.
- Animates a full transform string only.
- Uses horizontal translation above 720px and vertical translation at or below
  720px; do not animate dimensions during the breakpoint change.
- With reduced motion, skips autoplay and renders the stationary indicator on
  Human review with no translation.

## Repo conventions to follow

- Reuse Motion mini and shared motion hooks/constants from plan 001.
- Keep all project copy in `src/content/projects/queans.ts`.
- The current pipeline styling remains in the Queans feature.

## Steps

1. Add `queans-pipeline.client.tsx`, accepting the readonly steps and aria label.
2. Move the existing `<ol>` markup into the client component.
3. Add a single indicator element inside the list. Give it stable
   `data-pipeline-indicator` and `data-playback` attributes.
4. Use CSS to size the indicator to one of five equal cells. Use direct full
   transform strings for each horizontal or vertical position.
5. Start once through the shared in-view hook, set the final active index to
   Human review, and stop.
6. Preserve the existing Confidence and Human review visual tones under the
   moving outline.
7. Add reduced-motion and viewport-entry Playwright coverage.

## Boundaries

- Do not move, fade, or delay the readable task cards themselves.
- Do not add a page-wide reveal or animate the technology tags.
- Do not use shared-layout/domMax; Motion mini is sufficient.
- Do not replay or loop.

## Verification

- **Mechanical**: project tests, typecheck, lint, and file-size checks pass.
- **Feel check**:
  - The indicator starts only after scrolling the pipeline into view.
  - At 10% playback speed, each handoff follows the same path without a jump.
  - Mobile movement is vertical and does not overlap labels.
  - Reduced motion renders the final Human review emphasis immediately.
- **Done when**: one concise pass explains the workflow without moving readable
  content or becoming ambient decoration.
