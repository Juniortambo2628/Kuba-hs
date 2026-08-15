import { test, expect } from '@playwright/test';

test.describe('UI Primitives Visual Consistency', () => {
  test.beforeEach(async ({ page }) => {
    // We navigate to a dedicated test page or a component library page
    // Assuming there's a /styleguide or similar. If not, we might inject HTML for isolation.
    // For this example, we mock a page with injected components for visual testing.
    await page.goto('/');
    
    // Inject custom HTML structure to render primitives in isolation
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div id="test-container" style="padding: 2rem; background: white;">
          <h2>Buttons</h2>
          <div class="flex gap-4 mb-8">
            <button class="bg-blue-600 text-white px-4 py-2 rounded">Primary</button>
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded">Secondary</button>
            <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded">Outline</button>
            <button class="bg-red-600 text-white px-4 py-2 rounded">Destructive</button>
          </div>
          
          <h2>Inputs</h2>
          <div class="flex flex-col gap-4 mb-8 max-w-sm">
            <input type="text" class="border p-2 rounded" placeholder="Default Input" />
            <input type="text" class="border-red-500 border p-2 rounded" placeholder="Error Input" />
            <input type="text" class="border p-2 rounded bg-gray-100" placeholder="Disabled Input" disabled />
          </div>
          
          <h2>Badges</h2>
          <div class="flex gap-4 mb-8">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>
            <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Warning</span>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Info</span>
          </div>
        </div>
      `;
    });
  });

  test('Buttons render consistently', async ({ page }) => {
    const container = page.locator('#test-container');
    await container.waitFor({ state: 'visible' });
    // Give injected HTML + Tailwind time to settle in CI
    await page.waitForTimeout(1000);
    await expect(container).toHaveScreenshot('ui-primitives-buttons.png', { timeout: 15000 });
  });
});
