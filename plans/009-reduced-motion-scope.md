# 009 — Replace the blanket reduced-motion override with scoped alternatives

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: MEDIUM
- **Category**: Accessibility and motion cohesion
- **Estimated scope**: 2 files, about 15 lines changed

## Review finding

`src/styles/base.css` forces every animation and transition to `0.01ms`.
The strict review requires component-scoped alternatives: preserve useful
opacity/color feedback while removing movement. The interactive features now
already provide those scoped behaviors.

## Target

- Keep `scroll-behavior: auto` under reduced motion.
- Remove the universal animation-duration, iteration-count, and
  transition-duration overrides.
- Confirm every remaining transform-based transition or programmatic movement
  has a feature-scoped reduced-motion path.
- Preserve the existing 160ms color/background/border feedback for controls.

## Acceptance checks

1. Reduced motion runs no position-changing Atlassian, Queans, Spacejoy, or CTA
   animation.
2. CTA color feedback still reports the intended 160ms transition.
3. Smooth scrolling becomes immediate.
4. Axe, reduced-motion tests, animation inventory, and formatting pass.
