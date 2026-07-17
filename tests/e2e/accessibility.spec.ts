import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})

test('rests the Queans pipeline on human review with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const pipeline = page.getByRole('list', { name: /Queans.*processing pipeline/i })
  const indicator = pipeline.locator('[data-pipeline-indicator]')
  const finalStep = pipeline.locator('[data-pipeline-step="human-review"]')

  await expect(pipeline).toHaveAttribute('data-playback', 'reduced')
  await expect(pipeline).toHaveAttribute('data-active-step', 'human-review')
  const indicatorBox = await indicator.boundingBox()
  const finalStepBox = await finalStep.boundingBox()

  expect(Math.abs((indicatorBox?.x ?? 0) - (finalStepBox?.x ?? 0))).toBeLessThan(2)
  expect(Math.abs((indicatorBox?.y ?? 0) - (finalStepBox?.y ?? 0))).toBeLessThan(2)
  await expect
    .poll(() =>
      indicator.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0)
})

test('keeps the Atlassian task controls usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const loop = page.getByLabel('Identify, verify, and rate repeat as a loop')
  const identify = loop.getByRole('button', { name: 'Identify' })
  const verify = loop.getByRole('button', { name: 'Verify' })
  await loop.scrollIntoViewIfNeeded()

  await expect(loop).toHaveAttribute('data-playback', 'reduced')
  await page.waitForTimeout(2000)
  await expect(identify).toHaveAttribute('aria-pressed', 'true')
  await verify.click()
  await expect(verify).toHaveAttribute('aria-pressed', 'true')
  await expect(loop.getByText(/Check each pattern against ticket context/i)).toBeVisible()
  await expect(page.getByText(/Three\.js viewer \/ contained/i)).toBeVisible()
})
