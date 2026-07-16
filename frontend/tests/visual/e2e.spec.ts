import { test, expect } from '@playwright/test'

test.describe('E2E - Navigation', () => {
  test('can navigate from homepage to services', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: 'Services' }).first().click()
    await page.waitForURL('**/services', { timeout: 10000 })

    expect(page.url()).toContain('/services')
  })

  test('can navigate from homepage to providers', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: /find professionals|view all professionals/i }).first().click()
    await page.waitForURL('**/providers', { timeout: 10000 })

    expect(page.url()).toContain('/providers')
  })

  test('can navigate from homepage to about', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: /about/i }).first().click()
    await page.waitForURL('**/about', { timeout: 10000 })

    expect(page.url()).toContain('/about')
  })

  test('can navigate from homepage to contact', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: 'Contact' }).first().click()
    await page.waitForURL('**/contact', { timeout: 10000 })

    expect(page.url()).toContain('/contact')
  })

  test('footer links exist', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const footerLinks = page.locator('footer a')
    const count = await footerLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('E2E - Auth Pages', () => {
  test('login page renders form fields', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const emailInput = page.locator('input[type="email"], input[name="email"]')
    const passwordInput = page.locator('input[type="password"], input[name="password"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('register page shows role selection', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    const content = page.locator('text=/client|provider|customer/i')
    const count = await content.count()
    expect(count).toBeGreaterThan(0)
  })

  test('register client page renders form fields', async ({ page }) => {
    await page.goto('/register/client')
    await page.waitForLoadState('networkidle')

    const nameInput = page.locator('input[placeholder*="name" i]')
    const emailInput = page.locator('input[type="email"], input[name="email"]')

    await expect(nameInput.first()).toBeVisible()
    await expect(emailInput).toBeVisible()
  })

  test('login form stays on login page on empty submit', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    await page.waitForTimeout(500)
    expect(page.url()).toContain('/login')
  })

  test('forgot password link works', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const forgotLink = page.locator('a[href="/forgot-password"]')
    if (await forgotLink.isVisible()) {
      await forgotLink.click()
      await page.waitForURL('**/forgot-password', { timeout: 10000 })
      expect(page.url()).toContain('/forgot-password')
    }
  })
})

test.describe('E2E - Contact Form', () => {
  test('contact page renders form', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const form = page.locator('form')
    await expect(form.first()).toBeVisible()
  })

  test('contact form stays on contact page on empty submit', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const submitBtn = page.locator('button[type="submit"]')
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(500)
      expect(page.url()).toContain('/contact')
    }
  })
})

test.describe('E2E - Services', () => {
  test('services page loads and shows content', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('services page has content sections', async ({ page }) => {
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    const content = page.locator('[class*="card"], [class*="grid"], [class*="list"]')
    const count = await content.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('E2E - Providers', () => {
  test('providers page loads and shows content', async ({ page }) => {
    await page.goto('/providers')
    await page.waitForLoadState('networkidle')

    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })
})

test.describe('E2E - Dark Mode', () => {
  test('dark mode toggle changes theme', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')
    const initialClass = await html.getAttribute('class') || ''

    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="dark" i], [aria-label*="mode" i], button:has-text("sun"), button:has-text("moon")')
    if (await themeToggle.first().isVisible()) {
      await themeToggle.first().click()
      await page.waitForTimeout(500)
      const newClass = await html.getAttribute('class') || ''
      expect(newClass).not.toBe(initialClass)
    }
  })
})

test.describe('E2E - Responsive Design', () => {
  test('mobile menu button exists on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const menuBtn = page.locator('[aria-label="Open menu"]')
    await expect(menuBtn).toBeVisible()
  })

  test('content is readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const body = page.locator('body')
    const box = await body.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(375)
  })
})
