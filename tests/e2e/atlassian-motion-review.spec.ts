import { expect, test, type Locator } from '@playwright/test'

const loopName = 'Identify, verify, and rate repeat as a loop'

async function runningAnimationCount(loop: Locator) {
  return loop.evaluate(
    (element: Element) =>
      element
        .getAnimations({ subtree: true })
        .filter((animation: Animation) => animation.playState === 'running').length,
  )
}

async function runningAnimationStats(loop: Locator) {
  return loop.evaluate((element) => {
    const animations = element
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === 'running')
    const animatedElements = new Set(
      animations.map((animation) => (animation.effect as KeyframeEffect | null)?.target),
    )
    animatedElements.delete(null)
    return { animations: animations.length, elements: animatedElements.size }
  })
}

test('renders an incoming task at its hidden start state before animation', async ({ page }) => {
  await page.goto('/')

  const loop = page.getByLabel(loopName)
  const firstFrame = await loop.evaluate((root) => {
    return new Promise<{ entering?: string; opacity: number; taskId?: string }>((resolve) => {
      const observer = new MutationObserver(() => {
        const activeLayer = root.querySelector<HTMLElement>(
          '[data-task-layer="active"][data-task-id="verify"]',
        )
        if (!activeLayer) return
        observer.disconnect()
        resolve({
          entering: activeLayer.dataset.entering,
          opacity: Number.parseFloat(getComputedStyle(activeLayer).opacity),
          taskId: activeLayer.dataset.taskId,
        })
      })
      observer.observe(root, { childList: true, subtree: true })
      root
        .querySelector<HTMLButtonElement>('[aria-controls][id$="-verify"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    })
  })

  expect(firstFrame.taskId).toBe('verify')
  expect(firstFrame.entering).toBe('true')
  expect(firstFrame.opacity).toBe(0)
})

test('retargets rapid task selections without stacking transitions', async ({ page }) => {
  await page.goto('/')

  const loop = page.getByLabel(loopName)
  const identify = loop.getByRole('button', { name: 'Identify' })
  const verify = loop.getByRole('button', { name: 'Verify' })
  const rate = loop.getByRole('button', { name: 'Rate' })

  await rate.dispatchEvent('click', { detail: 1 })
  await page.waitForTimeout(35)
  await identify.dispatchEvent('click', { detail: 1 })
  await page.waitForTimeout(35)
  await verify.dispatchEvent('click', { detail: 1 })

  let maximumAnimations = 0
  let maximumAnimatedElements = 0
  for (let sample = 0; sample < 12; sample += 1) {
    const stats = await runningAnimationStats(loop)
    maximumAnimations = Math.max(maximumAnimations, stats.animations)
    maximumAnimatedElements = Math.max(maximumAnimatedElements, stats.elements)
    await page.waitForTimeout(16)
  }

  await expect(loop).toHaveAttribute('data-active-task', 'verify')
  await expect(verify).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => runningAnimationCount(loop)).toBe(0)
  expect(maximumAnimatedElements).toBeLessThanOrEqual(3)
  expect(maximumAnimations).toBeLessThanOrEqual(6)
})

test('keeps keyboard Outcome to System activation motion-free', async ({ page }) => {
  await page.goto('/')

  const system = page.getByRole('tab', { name: 'System' })
  const outcome = page.getByRole('tab', { name: 'Outcome' })
  const loop = page.getByLabel(loopName)

  await outcome.click()
  await outcome.focus()
  await outcome.press('ArrowLeft')
  await expect(system).toHaveAttribute('aria-selected', 'true')
  await page.evaluate(() => new Promise(requestAnimationFrame))

  await expect.poll(() => runningAnimationCount(loop)).toBe(0)
  await expect(loop).toHaveAttribute('data-playback', 'complete')
})

test('does not replay a completed loop after leaving and returning to System', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/')

  const system = page.getByRole('tab', { name: 'System' })
  const outcome = page.getByRole('tab', { name: 'Outcome' })
  const loop = page.getByLabel(loopName)
  await loop.scrollIntoViewIfNeeded()
  await expect(loop).toHaveAttribute('data-playback', 'playing')
  await expect(loop).toHaveAttribute('data-playback', 'complete', { timeout: 6000 })

  await outcome.click()
  await system.click()
  await expect(loop).toHaveAttribute('data-playback', 'complete')
  await page.waitForTimeout(800)

  await expect(loop).toHaveAttribute('data-active-task', 'identify')
  await expect.poll(() => runningAnimationCount(loop)).toBe(0)
})
