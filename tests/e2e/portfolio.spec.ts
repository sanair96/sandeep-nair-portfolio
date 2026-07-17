import { expect, test } from '@playwright/test'

test('renders the career narrative before personal projects', async ({ page }) => {
  await page.goto('/')

  const career = page.getByRole('heading', { name: /three projects/i })
  const projects = page.getByRole('heading', { name: /building outside work/i })

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'complex products feel straightforward',
  )
  await expect(career).toBeVisible()
  await expect(projects).toBeVisible()

  const careerBox = await career.boundingBox()
  const projectsBox = await projects.boundingBox()
  expect(careerBox?.y).toBeLessThan(projectsBox?.y ?? 0)
})

test('plays the mobile Queans pipeline once after it enters view', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const pipeline = page.getByRole('list', { name: /Queans.*processing pipeline/i })
  const indicator = pipeline.locator('[data-pipeline-indicator]')
  const upload = pipeline.locator('[data-pipeline-step="upload"]')

  await expect(pipeline).toHaveAttribute('data-playback', 'idle')
  await page.waitForTimeout(700)
  await expect(pipeline).toHaveAttribute('data-active-step', 'upload')

  await pipeline.scrollIntoViewIfNeeded()
  await expect(pipeline).toHaveAttribute('data-playback', 'playing')
  await expect(pipeline).toHaveAttribute('data-active-step', 'ocr', { timeout: 2000 })

  const uploadBox = await upload.boundingBox()
  const indicatorBox = await indicator.boundingBox()
  expect(Math.abs((indicatorBox?.x ?? 0) - (uploadBox?.x ?? 0))).toBeLessThan(2)
  expect(indicatorBox?.y ?? 0).toBeGreaterThan(uploadBox?.y ?? 0)

  await expect(pipeline).toHaveAttribute('data-active-step', 'human-review', { timeout: 5000 })
  await expect(pipeline).toHaveAttribute('data-playback', 'complete')
  await page.evaluate(() => window.scrollTo(0, 0))
  await pipeline.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  await expect(pipeline).toHaveAttribute('data-playback', 'complete')
})

test('supports the evidence interactions with the keyboard', async ({ page }) => {
  await page.goto('/')

  const systemTab = page.getByRole('tab', { name: 'System' })
  await systemTab.focus()
  await systemTab.press('Enter')
  await expect(systemTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText(/Identify/i).first()).toBeVisible()

  const afterTab = page.getByRole('tab', { name: 'After' })
  await afterTab.focus()
  await afterTab.press('Enter')
  await expect(afterTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText(/50%/).first()).toBeVisible()
})

test('keeps Amazon keyboard tabs immediate and pointer tabs restrained', async ({ page }) => {
  await page.goto('/')

  const beforeTab = page.getByRole('tab', { name: 'Before' })
  const afterTab = page.getByRole('tab', { name: 'After' })
  const beforePanelId = await beforeTab.getAttribute('aria-controls')
  const afterPanelId = await afterTab.getAttribute('aria-controls')

  expect(beforePanelId).not.toBeNull()
  expect(afterPanelId).not.toBeNull()

  const beforePanel = page.locator(`[id="${beforePanelId}"]`)
  const afterPanel = page.locator(`[id="${afterPanelId}"]`)
  const motionPanels = beforePanel.locator('..')

  await expect(motionPanels).toHaveAttribute('data-animate', 'false')
  await beforeTab.scrollIntoViewIfNeeded()
  await beforeTab.focus()
  await beforeTab.press('Enter')
  await expect(beforeTab).toHaveAttribute('aria-selected', 'true')
  await expect(motionPanels).toHaveAttribute('data-animate', 'false')
  await page.evaluate(() => new Promise(requestAnimationFrame))
  await beforeTab.press('ArrowRight')

  await expect(afterTab).toHaveAttribute('aria-selected', 'true')
  await expect(afterPanel).toBeVisible()
  await expect(motionPanels).toHaveAttribute('data-animate', 'false')
  await expect
    .poll(() =>
      afterPanel.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0)

  await beforeTab.click()

  await expect(beforeTab).toHaveAttribute('aria-selected', 'true')
  await expect(beforePanel).toBeVisible()
  await expect(motionPanels).toHaveAttribute('data-animate', 'true')
  await expect(beforePanel).toHaveCSS('transition-duration', '0.22s, 0.22s')
})

test('plays the mobile Atlassian task loop once after it enters view', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const loop = page.getByLabel('Identify, verify, and rate repeat as a loop')
  const identify = loop.getByRole('button', { name: 'Identify' })
  const verify = loop.getByRole('button', { name: 'Verify' })
  const rate = loop.getByRole('button', { name: 'Rate' })

  await expect(loop).toHaveAttribute('data-playback', 'idle')
  await page.waitForTimeout(900)
  await expect(identify).toHaveAttribute('aria-pressed', 'true')
  await loop.scrollIntoViewIfNeeded()
  await expect(loop.locator('svg')).toHaveCount(0)
  await expect(loop).toHaveAttribute('data-playback', 'playing')
  await expect(verify).toHaveAttribute('aria-pressed', 'true', { timeout: 2500 })
  await expect(rate).toHaveAttribute('aria-pressed', 'true', { timeout: 3000 })
  await expect(loop).toHaveAttribute('data-playback', 'complete', { timeout: 3500 })
  await expect(identify).toHaveAttribute('aria-pressed', 'true')
})

test('manual Atlassian task selection interrupts autoplay', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const loop = page.getByLabel('Identify, verify, and rate repeat as a loop')
  const rate = loop.getByRole('button', { name: 'Rate' })
  await loop.scrollIntoViewIfNeeded()
  await expect(loop).toHaveAttribute('data-playback', 'playing')
  await rate.click()

  await expect(loop).toHaveAttribute('data-playback', 'manual')
  await expect(rate).toHaveAttribute('aria-pressed', 'true')
  await page.waitForTimeout(1900)
  await expect(rate).toHaveAttribute('aria-pressed', 'true')
})

test('keyboard Atlassian task selection is immediate', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const loop = page.getByLabel('Identify, verify, and rate repeat as a loop')
  const verify = loop.getByRole('button', { name: 'Verify' })
  await loop.scrollIntoViewIfNeeded()
  await verify.focus()
  await verify.press('Enter')
  await page.evaluate(() => new Promise(requestAnimationFrame))

  await expect(loop).toHaveAttribute('data-playback', 'manual')
  await expect(verify).toHaveAttribute('aria-pressed', 'true')
  await expect
    .poll(() =>
      loop.evaluate(
        (element) =>
          element.getAnimations({ subtree: true }).filter((item) => item.playState === 'running')
            .length,
      ),
    )
    .toBe(0)
})

test('keeps the Spacejoy viewer behind an explicit action', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })
  page.on('pageerror', (error) => browserErrors.push(error.message))

  await page.goto('/')

  const activate = page.getByRole('button', { name: /view in 3d/i })
  await expect(activate).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)

  await activate.click()
  await expect(page.getByRole('button', { name: /pause 3d|resume 3d/i })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
  expect(browserErrors).toEqual([])
})

test('provides working public contact links', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: /email me/i })).toHaveAttribute('href', /^mailto:/)
  await expect(page.getByRole('link', { name: /résumé/i }).last()).toHaveAttribute(
    'href',
    '/documents/sandeep-a-nair-resume.pdf',
  )
})
