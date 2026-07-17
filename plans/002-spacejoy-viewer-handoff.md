# 002 — Bridge the Spacejoy poster-to-viewer handoff

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: MEDIUM
- **Category**: State indication and preventing a jarring change
- **Estimated scope**: 3 files, about 100 lines changed

## Problem

`src/features/career-evidence/spacejoy/spacejoy-experience.client.tsx:120`
mounts an opaque viewer layer immediately after “View in 3D” is pressed:

```tsx
{
  viewerEnabled && !failed ? (
    <div className={styles.viewerLayer}>
      <DynamicViewer />
    </div>
  ) : null
}
```

The poster disappears behind loading UI before the model is ready, while the
Pause button is exposed prematurely. This rare, explicit state transition is a
valid place for a short visual bridge.

## Target

- Keep the poster visible while the 3D bundle/model loads.
- Show a separate static loading overlay above the poster.
- When `viewerReady` becomes true, reveal the viewer from
  `opacity: 0; transform: scale(0.99)` to
  `opacity: 1; transform: scale(1)` over `220ms` using
  `[0.23, 1, 0.32, 1]`.
- Fade the loading overlay out with opacity over `140ms`.
- On failure, return to the poster over `160ms` ease-out.
- Reduced motion remains static-first: the viewer cannot be started, matching
  the settled product decision.

## Repo conventions to follow

- Reuse `motion/react-mini`, `motionEase`, `motionDuration`, and
  `useReducedMotion` created by plan 001.
- Three.js remains inside the Spacejoy feature only.
- Keep the poster as the initial server-visible/static layer.

## Steps

1. Add `useAnimate` and scope the existing Spacejoy experience.
2. Render a separate loading overlay while `viewerEnabled && !viewerReady`.
3. Keep `.viewerLayer` initially transparent. On `viewerReady`, animate only
   its full transform string and opacity with the exact target above.
4. Disable the secondary action and label it `Loading 3D…` until ready; expose
   Pause/Resume only after readiness.
5. Give primary and secondary actions pointer feedback through plan 004’s CSS
   vocabulary.
6. Add a Playwright assertion that the poster remains visible during loading
   and the canvas settles visibly after readiness.

## Boundaries

- Do not preload or autoplay the Three.js viewer.
- Do not animate perspective-tab changes.
- Do not move or resize the viewer shell.
- Do not animate filter, layout, background, or shadow.

## Verification

- **Mechanical**: Spacejoy tests, typecheck, lint, and production build pass.
- **Feel check**:
  - Throttle network/CPU and press “View in 3D”; the poster remains stable while
    loading.
  - At 10% playback, the canvas replaces the poster without a flash or scale
    jump.
  - Failure restores the poster cleanly.
  - Reduced motion never mounts the canvas.
- **Done when**: the explicit viewer activation feels continuous and retains all
  current WebGL/error fallbacks.
