import { expect, test } from '@playwright/test'

test('keeps the Spacejoy poster present until the 3D viewer is ready', async ({ page }) => {
  await page.route('**/models/spacejoy-showcase.glb', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    await route.continue()
  })
  await page.goto('/')

  const activate = page.getByRole('button', { name: /view in 3d/i })
  const viewerPanel = page.getByRole('tabpanel', { name: /designer/i })
  await activate.click()

  await expect(page.getByRole('button', { name: 'Loading 3D…' })).toBeDisabled()
  await expect(viewerPanel.locator('img')).toBeVisible()
  await expect(viewerPanel.locator('[data-viewer-loading]')).toBeVisible()

  await expect(page.getByRole('button', { name: 'Pause 3D' })).toBeVisible()
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveAttribute('data-ready', 'true')
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveAttribute(
    'data-activation',
    'pointer',
  )
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveCSS('opacity', '1')
  await expect(viewerPanel.locator('[data-viewer-loading]')).toHaveCSS('opacity', '0')
})

for (const key of ['Enter', 'Space'] as const) {
  test(`starts the Spacejoy viewer immediately with ${key}`, async ({ page }) => {
    await page.goto('/')

    const activate = page.getByRole('button', { name: /view in 3d/i })
    const viewerPanel = page.getByRole('tabpanel', { name: /designer/i })
    await activate.focus()
    await activate.press(key)

    await expect(page.getByRole('button', { name: 'Pause 3D' })).toBeVisible()
    const viewerLayer = viewerPanel.locator('[data-viewer-layer]')
    await expect(viewerLayer).toHaveAttribute('data-activation', 'keyboard')
    await expect(viewerLayer).toHaveCSS('opacity', '1')
    await page.evaluate(() => new Promise(requestAnimationFrame))
    await expect
      .poll(() =>
        viewerPanel.evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
      )
      .toBe(0)
  })
}

test('keeps the Spacejoy 3D enhancement disabled with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const activate = page.getByRole('button', { name: /view in 3d/i })
  await expect(activate).toBeDisabled()
  await expect(page.getByText('Static view shown because reduced motion is enabled.')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('returns a running viewer to the poster when reduced motion changes', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /view in 3d/i }).click()
  await expect(page.getByRole('button', { name: 'Pause 3D' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /view in 3d/i })).toBeDisabled()
  await expect(page.getByText('Static view shown because reduced motion is enabled.')).toBeVisible()
})

test('pauses rendering while offscreen or hidden without overriding user pause', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: /view in 3d/i }).click()
  const viewerPanel = page.getByRole('tabpanel', { name: /designer/i })
  const viewerLayer = viewerPanel.locator('[data-viewer-layer]')
  const pause = page.getByRole('button', { name: 'Pause 3D' })
  await expect(pause).toBeVisible()
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'active')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'paused')
  await viewerPanel.scrollIntoViewIfNeeded()
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'active')

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'hidden',
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'paused')
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'active')

  await pause.click()
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'paused')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await viewerPanel.scrollIntoViewIfNeeded()
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'paused')
})

test('preserves the Spacejoy failure and retry path', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /view in 3d/i }).click()
  await expect(page.getByRole('button', { name: 'Pause 3D' })).toBeVisible()
  await page.locator('canvas').dispatchEvent('webglcontextlost')

  const retry = page.getByRole('button', { name: 'Retry 3D' })
  await expect(retry).toBeVisible()
  await expect(
    page.getByText('The model could not load. The poster remains available.'),
  ).toBeVisible()
  await retry.click()
  await expect(page.getByRole('button', { name: 'Pause 3D' })).toBeVisible()
})
