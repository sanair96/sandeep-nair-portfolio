# 005 — Remove keyboard-triggered evidence-panel motion

- **Status**: DONE
- **Commit**: UNBORN
- **Severity**: HIGH
- **Category**: Purpose and frequency
- **Estimated scope**: 2 files, about 35 lines changed

## Problem

Amazon’s arrow-key tab navigation calls `selectTab` in
`src/features/career-evidence/amazon/amazon-workflow.client.tsx:51-59`, while
both panels always transition for `260ms`:

```css
/* amazon-workflow.module.css:62 — current */
.activePanel,
.inactivePanel {
  transition:
    opacity var(--transition-medium),
    transform var(--transition-medium);
}
```

Keyboard-initiated actions must be immediate. Adding more Motion here would
make a frequent navigation path feel slower.

## Target

- Keyboard tab changes have no animation.
- Pointer clicks may retain the existing restrained panel bridge using
  `opacity` and a full transform string over `220ms` strong ease-out.
- Reduced motion remains on the settled static fallback.

## Repo conventions to follow

- Reuse shared CSS motion tokens from plan 001.
- Keep Amazon logic inside the Amazon feature.

## Steps

1. Add local interaction-modality state to AmazonWorkflow.
2. Pointer click sets modality to pointer before selecting.
3. Keyboard selection sets modality to keyboard before selecting.
4. Add `data-animate` to `.motionPanels`.
5. Apply transitions only when `data-animate="true"`; default and keyboard
   state changes are immediate.
6. Add a Playwright test that arrow-key selection leaves no running panel
   animation, while pointer selection still reaches the correct panel.

## Boundaries

- Do not animate Atlassian or Spacejoy tab navigation.
- Do not add Motion to the Amazon tabs.
- Do not change workflow copy or layout.

## Verification

- **Mechanical**: keyboard interaction, accessibility, lint, and typecheck pass.
- **Feel check**:
  - Arrow repeatedly between Before and After; content follows immediately.
  - Click between states; the short bridge is crisp and interruptible.
  - No panel remains hidden from assistive technology incorrectly.
- **Done when**: keyboard changes are animation-free and pointer changes remain
  restrained.
