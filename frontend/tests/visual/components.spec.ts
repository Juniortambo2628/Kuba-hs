import { test, expect } from '@playwright/test'

test.describe('UI Components Visual Regression', () => {
  test('buttons', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = `
      <div style="padding: 20px; display: flex; gap: 12px; flex-wrap: wrap; background: var(--background);">
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Default</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">Destructive</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Outline</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">Secondary</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Ghost</button>
        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors text-primary underline-offset-4 hover:underline h-10 px-4 py-2">Link</button>
      </div>
    `
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    const container = page.locator('div').first()
    await expect(container).toHaveScreenshot('buttons.png', {
      maxDiffPixelRatio: 0.10,
      timeout: 10000,
    })
  })

  test('badges', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = `
      <div style="padding: 20px; display: flex; gap: 8px; flex-wrap: wrap; background: var(--background);">
        <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">Default</span>
        <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">Secondary</span>
        <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground">Destructive</span>
        <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-outline">Outline</span>
      </div>
    `
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    const container = page.locator('div').first()
    await expect(container).toHaveScreenshot('badges.png', {
      maxDiffPixelRatio: 0.10,
      timeout: 10000,
    })
  })

  test('cards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = `
      <div style="padding: 20px; display: flex; gap: 16px; flex-wrap: wrap; background: var(--background);">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" style="width: 300px; padding: 24px;">
          <h3 class="text-2xl font-semibold leading-none tracking-tight">Card Title</h3>
          <p class="text-sm text-muted-foreground mt-2">Card description goes here with some details.</p>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm" style="width: 300px; padding: 24px;">
          <h3 class="text-2xl font-semibold leading-none tracking-tight">Another Card</h3>
          <p class="text-sm text-muted-foreground mt-2">Different content for comparison.</p>
        </div>
      </div>
    `
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    const container = page.locator('div').first()
    await expect(container).toHaveScreenshot('cards.png', {
      maxDiffPixelRatio: 0.10,
      timeout: 10000,
    })
  })

  test('form inputs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const html = `
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px; max-width: 400px; background: var(--background);">
        <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground" placeholder="Default input" />
        <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground" value="Filled input" />
        <input class="flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm placeholder:text-muted-foreground" placeholder="Error state" />
      </div>
    `
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    const container = page.locator('div').first()
    await expect(container).toHaveScreenshot('form-inputs.png', {
      maxDiffPixelRatio: 0.10,
      timeout: 10000,
    })
  })
})
