import { expect, test, type Page } from '@playwright/test'

const referenceViewports = [
  { height: 844, name: 'mobile', width: 390 },
  { height: 1000, name: 'desktop', width: 1440 },
] as const

async function getFirstFrameDelta(page: Page) {
  return page.evaluate(
    () =>
      new Promise<{ x: number; y: number }>((resolve) => {
        window.requestAnimationFrame(() => {
          const outline = document.querySelector<HTMLElement>('[data-pipeline-indicator]')
          const target = document.querySelector<HTMLElement>('[data-pipeline-step="human-review"]')
          const outlineBox = outline?.getBoundingClientRect()
          const targetBox = target?.getBoundingClientRect()

          resolve({
            x: Math.abs((outlineBox?.x ?? 0) - (targetBox?.x ?? 0)),
            y: Math.abs((outlineBox?.y ?? 0) - (targetBox?.y ?? 0)),
          })
        })
      }),
  )
}

async function expectNoRunningIndicatorMotion(page: Page) {
  const indicator = page.locator('[data-pipeline-indicator]')

  await expect
    .poll(() =>
      indicator.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0)
}

for (const viewport of referenceViewports) {
  test(`keeps the ${viewport.name} Queans indicator aligned after reduced motion clears`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const pipeline = page.getByRole('list', { name: /Queans.*processing pipeline/i })
    const indicator = pipeline.locator('[data-pipeline-indicator]')
    const finalStep = pipeline.locator('[data-pipeline-step="human-review"]')

    await pipeline.scrollIntoViewIfNeeded()
    await expect(pipeline).toHaveAttribute('data-playback', 'reduced')
    await expect(pipeline).toHaveAttribute('data-active-step', 'human-review')
    await expect(indicator).not.toHaveCSS('transform', 'none')

    const initialDelta = await getFirstFrameDelta(page)
    expect(initialDelta.x).toBeLessThan(2)
    expect(initialDelta.y).toBeLessThan(2)

    for (let cycle = 0; cycle < 3; cycle += 1) {
      await page.emulateMedia({ reducedMotion: 'no-preference' })

      const regularDelta = await getFirstFrameDelta(page)
      expect(regularDelta.x).toBeLessThan(2)
      expect(regularDelta.y).toBeLessThan(2)
      await expect(pipeline).toHaveAttribute('data-playback', 'complete')
      await expect(pipeline).toHaveAttribute('data-active-step', 'human-review')
      await expectNoRunningIndicatorMotion(page)

      await page.emulateMedia({ reducedMotion: 'reduce' })

      const reducedDelta = await getFirstFrameDelta(page)
      expect(reducedDelta.x).toBeLessThan(2)
      expect(reducedDelta.y).toBeLessThan(2)
      await expect(pipeline).toHaveAttribute('data-playback', 'reduced')
      await expect(pipeline).toHaveAttribute('data-active-step', 'human-review')
      await expectNoRunningIndicatorMotion(page)
    }

    const indicatorBox = await indicator.boundingBox()
    const finalStepBox = await finalStep.boundingBox()

    expect(Math.abs((indicatorBox?.x ?? 0) - (finalStepBox?.x ?? 0))).toBeLessThan(2)
    expect(Math.abs((indicatorBox?.y ?? 0) - (finalStepBox?.y ?? 0))).toBeLessThan(2)
    await expect(pipeline.locator('[data-pipeline-step]').first()).toHaveCSS(
      'list-style-type',
      'none',
    )
    await expect(pipeline.getByRole('listitem')).toHaveCount(5)
  })
}
