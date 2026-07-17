# 004 — Standardize restrained pointer feedback

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: MEDIUM
- **Category**: Feedback, easing, accessibility
- **Estimated scope**: 5 CSS files, about 80 lines changed

## Problem

`src/shared/ui/ActionLink.module.css:15-24` uses weak built-in `ease`, lifts on
ungated hover, has no press feedback, and removes all feedback under reduced
motion. Spacejoy and project actions have no consistent pointer response.

## Target

For eligible CTA-like controls:

- Release: `transform 100ms cubic-bezier(0.23, 1, 0.32, 1)`.
- Fine-pointer hover only:
  `transform: translate3d(0, -1px, 0) scale(1)`.
- Pointer press:
  `transform: translate3d(0, 0, 0) scale(0.98)` over `120ms` strong ease-out.
- Background, border, and color transitions: `160ms` strong ease-out.
- Reduced motion: keep color/background/border feedback; remove translation and
  scale.
- Never use `transition: all`.

## Repo conventions to follow

- Use the shared CSS easing and duration tokens from plan 001.
- Prefer CSS for predetermined pointer feedback.
- Gate hover transforms with
  `@media (hover: hover) and (pointer: fine)`.

## Steps

1. Update `ActionLink.module.css` with exact properties, custom easing tokens,
   gated hover movement, subtle press scale, and reduced-motion color feedback.
2. Apply the same vocabulary to Spacejoy primary/secondary actions.
3. Apply the same vocabulary to external project links in Queans and Scldomain.
4. Update navigation/resume hover rules only where they currently transition;
   do not add movement to ordinary text links.
5. Verify focus-visible outlines remain unchanged.

## Boundaries

- Do not animate keyboard focus or keyboard-triggered navigation.
- Do not add hover movement to plain text links.
- Do not add Motion components for this deterministic feedback.

## Verification

- **Mechanical**: lint, format, visual tests, and reduced-motion accessibility
  tests pass.
- **Feel check**:
  - Pointer press feels tactile but does not visibly shrink typography.
  - Hover movement is one pixel and only occurs with a fine pointer.
  - Keyboard focus remains immediate.
  - Reduced motion retains color feedback without positional movement.
- **Done when**: eligible CTAs share one restrained interaction language.
