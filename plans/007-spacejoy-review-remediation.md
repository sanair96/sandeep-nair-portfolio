# 007 — Reconcile Spacejoy modality, visibility, and live motion preference

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: HIGH
- **Category**: Keyboard frequency, accessibility, sustained performance
- **Estimated scope**: 4 files, about 150 lines changed

## Review findings

The strict review blocked the current 3D enhancement because:

- Enter or Space activation receives the same 220ms viewer reveal as a pointer
  click.
- Enabling reduced motion after the viewer starts leaves the auto-rotating
  canvas mounted and running.
- The viewer continues its render loop and rotation while offscreen or while
  the document is hidden.

## Target

- Record action modality from `MouseEvent.detail`.
- Pointer activation keeps the 220ms viewer reveal and 140ms loading exit.
- Keyboard activation applies the final viewer/loading styles immediately and
  reports no running entrance animations.
- A live change to reduced motion cancels scoped animations, unmounts the
  viewer, and returns immediately to the settled poster.
- Pause rendering and auto-rotation when the experience is outside the
  viewport or the document is hidden. Resume only when visible and not
  user-paused.
- Preserve the explicit View in 3D action, loading poster, retry path, and
  WebGL fallback.

## Acceptance checks

1. Enter/Space starts the viewer with zero running entrance animations.
2. Pointer activation retains the approved reveal.
3. Switching to reduced motion after readiness removes the canvas and leaves
   the poster/status in a static state.
4. Scrolling the viewer offscreen or hiding the document pauses the render loop
   and rotation; returning restores it unless the user pressed Pause.
5. Failure/retry, keyboard tabs, Axe, and both reference widths remain green.
