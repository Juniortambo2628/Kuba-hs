import { test, expect } from '@playwright/test'

test.describe('Layout Consistency - Navbar', () => {
  test('navbar renders correctly on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const nav = page.locator('nav').first()
    await expect(nav).toHaveScreenshot('navbar-homepage.png', {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    })
  })

  test('navbar renders correctly on services page', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    const nav = page.locator('nav').first()
    await expect(nav).toHaveScreenshot('navbar-services.png', {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    })
  })
})

test.describe('Layout Consistency - Footer', () => {
  test('footer renders correctly on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const footer = page.locator('footer').first()
    await expect(footer).toHaveScreenshot('footer-homepage.png', {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    })
  })
})

test.describe('Layout Consistency - Dark Mode', () => {
  test('homepage renders correctly in dark mode', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('services page renders correctly in dark mode', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page).toHaveScreenshot('services-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('Layout Consistency - Responsive', () => {
  test('homepage mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('homepage tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})
