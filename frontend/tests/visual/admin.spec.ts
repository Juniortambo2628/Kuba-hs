import { test, expect, type Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.VISUAL_ADMIN_EMAIL || 'admin@kuba.com'
const ADMIN_PASSWORD = process.env.VISUAL_ADMIN_PASSWORD || 'admin123'
const BACKEND_ORIGIN = process.env.VISUAL_BACKEND_ORIGIN || 'http://localhost:8000'

/**
 * Opens an authenticated admin session without driving the login form.
 *
 * The form's first step is `GET /sanctum/csrf-cookie`, and Laravel answers it
 * with a bodiless 204 plus three stray bytes after `Connection: close`. PHP's
 * built-in dev server does that, and every Node HTTP client (the `next dev`
 * proxy and Playwright's own request context alike) rejects the response as
 * "Data after `Connection: close`". A redirect (302) parses fine, so we seed
 * the XSRF + session cookies from one of those and then POST the credentials
 * from inside the page - same-origin, so the proxy forwards the browser's
 * Origin and Sanctum treats the login as stateful and binds it to the session.
 */
async function loginAsAdmin(page: Page) {
  let lastStatus = 0
  let lastProbe = 'no attempt'

  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.request.get(`${BACKEND_ORIGIN}/`)

    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    lastStatus = await page.evaluate(
      async ({ email, password }) => {
        const xsrf = document.cookie
          .split('; ')
          .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
        const token = xsrf
          ? decodeURIComponent(xsrf.split('=').slice(1).join('='))
          : ''
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': token,
          },
          body: JSON.stringify({ email, password }),
        })
        return response.status
      },
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    )
    if (lastStatus !== 200) continue

    lastProbe = await page.evaluate(async () => {
      const response = await fetch('/api/user', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      let role: string | null = null
      try {
        const payload = await response.json()
        role = (payload.data ?? payload).role ?? null
      } catch {
        role = null
      }
      return `${response.status}/${role}`
    })
    if (lastProbe === '200/admin') return
  }

  throw new Error(
    `admin session never took (login=${lastStatus}, /api/user=${lastProbe})`
  )
}

const ADMIN_PAGES: Array<[string, string]> = [
  ['dashboard', '/admin'],
  ['bookings', '/admin/bookings'],
  ['payments', '/admin/payments'],
  ['settings', '/admin/settings'],
]

const BACKEND_SKIP_REASON =
  'Laravel backend not reachable - the CI visual job only starts the Next dev server'

let backendUp = false

test.describe('Admin visual regression - admin-content-area', () => {
  test.beforeAll(async () => {
    try {
      const response = await fetch(`${BACKEND_ORIGIN}/`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(5000),
      })
      backendUp = response.status < 500
    } catch {
      backendUp = false
    }
  })

  test.beforeEach(async ({ page }) => {
    test.skip(!backendUp, BACKEND_SKIP_REASON)

    // The cookie sheet slides in 2s after mount unless consent is already
    // stored, so pre-seed it to keep that banner out of the admin shots.
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'all')
    })

    await loginAsAdmin(page)
  })

  for (const [name, path] of ADMIN_PAGES) {
    test(`admin ${name} page`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('.admin-content-area')).toHaveCount(1)
      await expect(page).toHaveScreenshot(`admin-${name}-full.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
        timeout: 30000,
      })
    })
  }

  test('admin settings form controls', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForLoadState('networkidle')

    const cards = page.locator('.admin-content-area [data-slot="card"]')
    await expect(cards.first().locator('input').first()).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, 0))

    const boxes = (
      await Promise.all(
        [0, 1, 2].map((index) => cards.nth(index).boundingBox())
      )
    ).filter((box): box is NonNullable<typeof box> => box !== null)
    if (boxes.length === 0) {
      throw new Error('expected the settings cards to render')
    }

    // Clip only the cards that share the first card's row. On mobile the
    // stack runs long enough to reach the floating environment badge, and
    // fixed chrome inside a clip is a flake generator.
    const firstTop = boxes[0].y
    const row = boxes.filter((box) => Math.abs(box.y - firstTop) < 4)
    const left = Math.min(...row.map((box) => box.x))
    const top = Math.min(...row.map((box) => box.y))
    const right = Math.max(...row.map((box) => box.x + box.width))
    const bottom = Math.max(...row.map((box) => box.y + box.height))

    await expect(page).toHaveScreenshot('admin-settings-controls.png', {
      clip: {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      },
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      timeout: 30000,
    })
  })
})
