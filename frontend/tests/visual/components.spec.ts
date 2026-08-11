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

  test('NotificationBadge Visual Consistency', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div id="badge-container" style="padding: 2rem; display: flex; gap: 2rem; background: #f3f4f6;">
          <div style="position: relative; width: 40px; height: 40px; background: #fff; border-radius: 50%;">
            <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">3</span>
          </div>
          <div style="position: relative; width: 40px; height: 40px; background: #fff; border-radius: 50%;">
            <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">99+</span>
          </div>
        </div>
      `;
    });
    const container = page.locator('#badge-container');
    await expect(container).toHaveScreenshot('notification-badge.png');
  });

  test('ServiceMegamenu Visual Consistency', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div id="megamenu-container" style="padding: 2rem; background: #fff; min-height: 400px;">
          <nav>
            <ul class="flex gap-4">
              <li class="relative group">
                <button class="font-medium text-gray-700">Services</button>
                <div class="absolute left-0 mt-2 w-screen max-w-md bg-white shadow-xl rounded-lg border p-4 opacity-100 visible">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-bold mb-2">Cleaning</h4>
                      <ul class="space-y-1">
                        <li><a href="#" class="text-sm text-gray-600 hover:text-blue-600">Deep Clean</a></li>
                        <li><a href="#" class="text-sm text-gray-600 hover:text-blue-600">Standard Clean</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-bold mb-2">Plumbing</h4>
                      <ul class="space-y-1">
                        <li><a href="#" class="text-sm text-gray-600 hover:text-blue-600">Leak Repair</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      `;
    });
    const container = page.locator('#megamenu-container');
    await expect(container).toHaveScreenshot('service-megamenu.png');
  });
})
