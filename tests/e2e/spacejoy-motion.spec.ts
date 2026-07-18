import { expect, test } from '@playwright/test'

test('keeps the Spacejoy poster present until the 3D viewer is ready', async ({ page }) => {
  let modelRequests = 0
  await page.route('**/models/spacejoy-showcase.glb', async (route) => {
    modelRequests += 1
    await new Promise((resolve) => setTimeout(resolve, 700))
    await route.continue()
  })
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(modelRequests).toBe(0)
  await viewerPanel.scrollIntoViewIfNeeded()

  await expect(page.getByRole('button', { name: 'Loading 3D…' })).toBeDisabled()
  await expect(viewerPanel.locator('img')).toBeVisible()
  await expect(viewerPanel.locator('[data-viewer-loading]')).toBeVisible()
  await expect.poll(() => modelRequests).toBe(1)

  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveAttribute('data-ready', 'true')
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveAttribute(
    'data-activation',
    'automatic',
  )
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveCSS('opacity', '1')
  await expect(viewerPanel.locator('[data-viewer-loading]')).toHaveCSS('opacity', '0')
})

test('automatically builds the Spacejoy room and supports keyboard replay', async ({ page }) => {
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  const viewerLayer = viewerPanel.locator('[data-viewer-layer]')
  await viewerPanel.scrollIntoViewIfNeeded()

  await expect(page.getByRole('button', { name: /view in 3d/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await expect(viewerLayer).toHaveAttribute('data-activation', 'automatic')
  await expect(viewerLayer).toHaveAttribute('data-build', 'assembling')
  await expect(viewerLayer).toHaveAttribute('data-rendering', 'active')

  const replay = page.getByRole('button', { name: 'Replay room build' })
  await expect(viewerLayer).toHaveAttribute('data-build', 'complete', { timeout: 15_000 })
  await expect(replay).toBeVisible()
  await replay.focus()
  await replay.press('Enter')

  const pause = page.getByRole('button', { name: 'Pause room build' })
  await expect(pause).toBeVisible()
  await expect(pause).toBeFocused()
  await expect(viewerLayer).toHaveAttribute('data-build', 'assembling')
})

test('keeps the Spacejoy 3D enhancement disabled with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByRole('button', { name: /view in 3d/i })).toHaveCount(0)
  await expect(page.getByText('Static view shown because reduced motion is enabled.')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(
    page.getByRole('region', { name: /spacejoy 3d room build/i }).locator('img'),
  ).toBeVisible()
})

test('keeps the Spacejoy poster when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'WebGLRenderingContext', {
      configurable: true,
      value: undefined,
    })
  })
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await expect(page.getByText('Static view shown because WebGL is unavailable.')).toBeVisible()
  await expect(viewerPanel.locator('img')).toBeVisible()
  await expect(viewerPanel.locator('[data-viewer-layer]')).toHaveCount(0)
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('returns a running viewer to the poster when reduced motion changes', async ({ page }) => {
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await viewerPanel.scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByText('Static view shown because reduced motion is enabled.')).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'no-preference' })

  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})

test('pauses rendering while offscreen or hidden without overriding user pause', async ({
  page,
}) => {
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await viewerPanel.scrollIntoViewIfNeeded()
  const viewerLayer = viewerPanel.locator('[data-viewer-layer]')
  const pause = page.getByRole('button', { name: 'Pause room build' })
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

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await viewerPanel.scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await page.locator('canvas').dispatchEvent('webglcontextlost')

  const retry = page.getByRole('button', { name: 'Retry 3D' })
  await expect(retry).toBeVisible()
  await expect(
    page.getByText('The model could not load. The poster remains available.'),
  ).toBeVisible()
  await retry.click()
  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
})

test('recovers from a transient Spacejoy model download failure', async ({ page }) => {
  let modelRequests = 0
  await page.route('**/models/spacejoy-showcase.glb', async (route) => {
    modelRequests += 1
    if (modelRequests === 1) await route.abort('failed')
    else await route.continue()
  })
  await page.goto('/')

  const viewerPanel = page.getByRole('region', { name: /spacejoy 3d room build/i })
  await viewerPanel.scrollIntoViewIfNeeded()
  const retry = page.getByRole('button', { name: 'Retry 3D' })
  await expect(retry).toBeVisible()
  await retry.click()

  await expect.poll(() => modelRequests).toBe(2)
  await expect(page.getByRole('button', { name: 'Pause room build' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})
