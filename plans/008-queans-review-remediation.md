# 008 — Keep the Queans indicator aligned across live preferences

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: MEDIUM
- **Category**: Live accessibility state and visual polish
- **Estimated scope**: 3 files, about 60 lines changed

## Review findings

The strict review found two polish defects:

- Clearing reduced motion after the pipeline settles on Human review removes
  the CSS final-position override, so the visible indicator returns to Upload
  while the declared state remains Human review.
- The decorative indicator is an ordered-list item and exposes a stray `1.`
  marker at both reference widths.

## Target

- When reduced motion changes back to no preference, place the indicator at
  `activeIndexRef.current` without replaying the pipeline.
- Reset the pipeline list's marker, margin, and padding while retaining
  accessible ordered step semantics.
- Keep the indicator `aria-hidden`, transform-only, one-pass, and stationary on
  Human review under reduced motion.

## Acceptance checks

1. Reduce → no-preference keeps the outline aligned with Human review and does
   not replay.
2. No ordered-list marker is visible beside the indicator at 390px or 1440px.
3. Horizontal and vertical indicator geometry remains correct.
4. Existing pipeline, reduced-motion, Axe, formatting, and file-limit checks
   pass.
