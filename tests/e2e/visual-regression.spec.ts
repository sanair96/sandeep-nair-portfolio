import { expect, test } from '@playwright/test'

test('matches the desktop reference composition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ height: 1000, width: 1440 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('portfolio-desktop.png', { fullPage: true })
})

test('matches the mobile reference composition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('portfolio-mobile.png', { fullPage: true })
})

test('matches the mobile Atlassian task-card treatment', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const panel = page.getByRole('tabpanel', { name: 'System' })
  const loop = page.getByLabel('Identify, verify, and rate repeat as a loop')
  const identify = loop.getByRole('button', { name: 'Identify' })
  await panel.scrollIntoViewIfNeeded()
  await expect(loop).toHaveAttribute('data-playback', 'reduced')
  await expect(identify).toHaveAttribute('aria-pressed', 'true')

  await expect(panel).toHaveScreenshot('atlassian-mobile-task.png')
})
