import { test, expect } from '@playwright/test'

test.describe('Homepage Visual Regression', () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('hero section', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const hero = page.locator('section').first()
    await expect(hero).toHaveScreenshot('homepage-hero.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('navigation bar', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const nav = page.locator('nav').first()
    await expect(nav).toHaveScreenshot('navbar.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('footer', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const footer = page.locator('footer').first()
    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('Services Page Visual Regression', () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('services-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('About Page Visual Regression', () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('about-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('Contact Page Visual Regression', () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('contact-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('Providers Page Visual Regression', () => {
  test('full page screenshot', async ({ page }) => {
    await page.goto('/providers')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('providers-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})

test.describe('Auth Pages Visual Regression', () => {
  test('login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('login-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })

  test('register page', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('register-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      timeout: 15000,
    })
  })
})
