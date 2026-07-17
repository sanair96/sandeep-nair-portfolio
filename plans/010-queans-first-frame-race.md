# 010 — Remove the Queans live-preference first-frame race

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: HIGH
- **Category**: First-frame accessibility state
- **Estimated scope**: 3 files, about 35 lines changed

## Review finding

The second strict runtime gate reproduced a one-frame mismatch when reduced
motion changes to no preference. The media-query rule stops pinning the
indicator before React's subscribed state and layout effect commit, so the
outline can paint at Upload while the declared state remains Human review.

## Target

- Keep the completed Human-review transform inline while reduced motion is
  active instead of removing it.
- Make the reduced-motion CSS fallback use the same origin and final transform
  geometry, so no-JS/first-hydration output remains correct.
- Avoid switching the indicator between left/right or top/bottom positioning;
  the same transform origin must survive a preference change.
- Re-align on resize without replaying.

## Acceptance checks

1. Repeated reduce → no-preference toggles at 390px and 1440px show less than
   2px delta on the very first animation frame.
2. Initial reduced-motion rendering rests on Human review.
3. No positional animation runs during the preference change.
4. The one-pass normal-motion explanation still completes and stays aligned.
5. Focused test passes repeatedly, then full Axe/visual/source gates pass.
