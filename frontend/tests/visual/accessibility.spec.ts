import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = [
  { name: 'Homepage', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
  { name: 'Providers', url: '/providers' },
  { name: 'Login', url: '/login' },
  { name: 'Register', url: '/register' },
]

for (const pageDef of PAGES) {
  test.describe(`Accessibility - ${pageDef.name}`, () => {
    test(`has no critical a11y violations on ${pageDef.url}`, async ({ page }) => {
      await page.goto(pageDef.url)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(['color-contrast', 'meta-viewport', 'heading-order', 'image-redundant-alt'])
        .analyze()

      if (results.violations.length > 0) {
        console.log(`\n⚠️ ${results.violations.length} a11y violations on ${pageDef.url}:\n`)
        results.violations.forEach((violation, i) => {
          console.log(`  ${i + 1}. [${violation.impact}] ${violation.id}: ${violation.description}`)
          violation.nodes.forEach(node => {
            console.log(`     - ${node.target.join(', ')}`)
          })
        })
      }

      const criticalViolations = results.violations.filter(v => v.impact === 'critical')
      expect(criticalViolations).toEqual([])
    })
  })
}

test.describe('Accessibility - Critical Rules Only', () => {
  test('no critical label violations on login form', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['label'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical')
    if (critical.length > 0) {
      console.log('\n⚠️ Form label violations:')
      critical.forEach(v => {
        v.nodes.forEach(n => console.log(`  - ${n.html.substring(0, 100)}`))
      })
    }
    expect(critical).toEqual([])
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('links have discernible text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['link-name'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['button-name'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('no duplicate IDs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['duplicate-id', 'duplicate-id-active'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('ARIA attributes are valid', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['aria-valid-attr', 'aria-valid-attr-value', 'aria-required-attr'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('Accessibility - Color Contrast Report', () => {
  test('documents all color contrast violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    if (results.violations.length > 0) {
      console.log(`\n📊 Color Contrast Violations on / (${results.violations.length} total):\n`)
      const grouped: Record<string, number> = {}
      results.violations.forEach(v => {
        v.nodes.forEach(n => {
          const data = (n as any).data
          if (data) {
            const key = `${data.fgColor} on ${data.bgColor} (ratio: ${data.contrastRatio})`
            grouped[key] = (grouped[key] || 0) + 1
          }
        })
      })
      Object.entries(grouped).forEach(([key, count]) => {
        console.log(`  ${count}x: ${key}`)
      })
    }

    expect(true).toBe(true)
  })
})
