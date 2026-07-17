# 006 — Make the Atlassian loop flash-free, persistent, and interruptible

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: HIGH
- **Category**: Keyboard frequency, interruptibility, first-frame polish
- **Estimated scope**: 5 files, about 180 lines changed

## Review findings

The strict review blocked the current loop because:

- The replacement task layer renders at full opacity for one frame before its
  entrance keyframes begin.
- Rapid pointer selections stack WAAPI animations instead of retargeting.
- Switching away from System unmounts the loop, so keyboard navigation back to
  System remounts and replays it.

## Target

- Give an entering task layer its hidden start state in the rendered markup or
  CSS before the browser can paint it.
- Cancel tracked/scoped task-loop animations before every new manual pointer
  transition, then animate from the current computed visual state.
- Keep the three Atlassian views mounted and hide inactive panels, or otherwise
  persist the loop's played state above tab mounts.
- Record tab activation modality. Keyboard selection of System must be
  immediate and must never start or restart explanatory motion.
- Preserve the existing one-pass pointer/viewport explanation and stationary
  reduced-motion behavior.

## Acceptance checks

1. Frame sampling shows no fully-visible incoming layer before the transition.
2. Rate → Identify → Verify clicks 35ms apart never leave more than the
   intentional current transition running and settle on Verify.
3. Keyboard Outcome → System reports no running subtree animations.
4. Leaving and returning to System does not replay a completed loop.
5. Existing keyboard, reduced-motion, Axe, and viewport tests remain green.
