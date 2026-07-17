# 001 — Replace the Atlassian loop with an interruptible task spotlight

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: HIGH
- **Category**: Purpose, interruptibility, performance, accessibility
- **Estimated scope**: 9 files, about 450 lines changed

## Problem

The Atlassian system view currently uses three independent delayed keyframes:

```css
/* src/features/career-evidence/atlassian/atlassian-views.module.css:197 — current */
@keyframes mobileTaskHighlight {
  0%,
  30% {
    background: var(--color-cobalt);
    border-color: var(--color-cobalt);
    box-shadow: 0 0.5rem 1.25rem rgb(49 89 217 / 18%);
    color: var(--color-white);
    transform: translateY(-1px);
  }
}

/* src/features/career-evidence/atlassian/atlassian-views.module.css:261 — current */
.specialist {
  animation: mobileTaskHighlight 4.8s ease-in-out infinite;
  will-change: background-color, border-color, box-shadow, transform;
}
```

The animation starts while offscreen, repeats forever, snaps each incoming card
directly to its active state, repaints three cards, and cannot be interrupted by
task selection. Desktop also runs an infinite painted SVG dash animation.

## Target

Replace the SVG and three animated cards with one client component containing:

- Three normal task buttons: Identify, Verify, Rate.
- One static cobalt indicator layer that moves with a full `transform` string.
- One focus card with overlapping content layers for task descriptions.
- One viewport-triggered cycle: Identify → Verify → Rate → Identify, then rest.
- Manual task selection that immediately cancels autoplay.
- Keyboard selection that is immediate and does not animate.
- Reduced motion with no autoplay or translation; controls stay usable.

Use `motion/react-mini` and `useAnimate`. Install `motion` with pnpm.

Exact motion:

```ts
export const motionEase = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
}

export const motionDuration = {
  press: 0.14,
  release: 0.1,
  exit: 0.14,
  enter: 0.22,
  move: 0.26,
}
```

- Indicator Identify → Verify and Verify → Rate: `260ms`, strong ease-in-out.
- Old content exit: opacity `1 → 0` and full transform
  `translate3d(0, 0, 0) → translate3d(0, -4px, 0)`, `140ms`, strong ease-out.
- New content entry: opacity `0 → 1` and full transform
  `translate3d(0, 4px, 0) → translate3d(0, 0, 0)`, `220ms`, strong ease-out.
- Autoplay wrap Rate → Identify: indicator exits right to
  `translate3d(300%, 0, 0)` plus opacity `0` in `140ms`, resets invisibly to
  `translate3d(-100%, 0, 0)`, then enters Identify in `220ms`.
- Manual Rate → Identify: direct interruptible `260ms` retarget.
- Initial dwell `700ms`; subsequent task dwell `1400ms`.
- IntersectionObserver threshold `0.6`; play once per mount.
- Pointer-only press feedback: full `transform: scale(0.97)` in `140ms`, release
  in `100ms`. Keyboard-generated activation (`event.detail === 0`) is immediate.
- Animate only `transform` and `opacity`. No permanent `will-change`.

## Repo conventions to follow

- Editable copy stays in `src/content`.
- Only interactive files use the `.client.tsx` suffix.
- Feature styling remains next to the feature.
- Shared motion vocabulary belongs under `src/shared/motion`, not a generic
  utility folder.
- Handwritten TypeScript, TSX, and CSS must remain below 300 non-blank lines;
  client interaction files should target fewer than 180 lines.

Add CSS tokens to `src/styles/tokens.css`:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--duration-press: 140ms;
--duration-release: 100ms;
--duration-enter: 220ms;
--duration-exit: 140ms;
--duration-move: 260ms;
--transition-fast: var(--duration-press) var(--ease-out);
--transition-medium: var(--duration-move) var(--ease-in-out);
```

## Steps

1. Run `pnpm add motion` from the portfolio root.
2. Add `src/shared/motion/motion.constants.ts` with the exact JS easing arrays
   and durations above.
3. Add `src/shared/motion/use-reduced-motion.client.ts` using
   `useSyncExternalStore` and `matchMedia`.
4. Add `src/shared/motion/use-once-in-view.client.ts` using
   IntersectionObserver with a caller-supplied threshold and a once-only result.
5. Add descriptions for Identify, Verify, and Rate plus
   `loopLabel: "Repeat until the result is ready for review."` in
   `src/content/career/atlassian.ts`. Extend `AtlassianStory` in
   `src/content/content.types.ts` with readonly `loopLabel`.
6. Add `atlassian-task-loop.client.tsx`. Expose stable
   `data-active-task` and `data-playback="idle|playing|complete|manual|reduced"`
   attributes for testing. Use a labelled group of normal buttons with
   `aria-pressed`; do not nest another tablist.
7. Add `atlassian-task-loop.module.css` for the segmented rail, one indicator,
   focus-card layers, loop label, and responsive treatment.
8. Replace the SVG/list in `SystemView` with the new component. Remove
   `.loopArrows`, `.specialists`, `.specialist`, `traceLoop`, and
   `mobileTaskHighlight` from `atlassian-views.module.css`.
9. Remove the reduced-motion rule that hides the Atlassian tabs and panel.
   Preserve the noscript fallback, but keep the interactive model available.
10. Replace the old mobile cycling test with deterministic start-on-view,
    ordered completion, manual interruption, keyboard-immediate, and
    reduced-motion tests.

## Boundaries

- Do not animate the Interface/System/Outcome tab switch.
- Do not reintroduce moving SVG arrows.
- Do not autoplay more than once per mount.
- Do not announce autoplay changes through `aria-live`.
- Do not animate background, border, shadow, color, or layout properties.
- Do not import Three.js or Spacejoy modules.

## Verification

- **Mechanical**: `pnpm run format:check`, `pnpm run lint`,
  `pnpm run typecheck`, `pnpm run check:file-limits`, and the Atlassian
  Playwright tests all pass.
- **Feel check**:
  - Wait two seconds before scrolling to the diagram; it must still show Identify
    with `data-playback="idle"`.
  - Scroll until at least 60% is visible; observe one ordered cycle ending on
    Identify with `data-playback="complete"`.
  - At 10% playback speed, confirm no incoming card snaps and no double-exposed
    copy remains after transitions.
  - Tap Rate mid-cycle; autoplay stops and Rate remains selected.
  - Activate Verify with the keyboard; the state changes immediately with no
    running subtree animation.
  - With reduced motion enabled, there is no autoplay or positional movement,
    but all controls and descriptions remain available.
- **Done when**: no infinite Atlassian animation remains, only transform and
  opacity animate, and the strict animation review approves the interaction.
