import { test, expect } from '@playwright/test';

test.describe('UI Primitives Visual Consistency', () => {
  const html = `
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

  test.beforeEach(async ({ page }) => {
    await page.setContent(html, { waitUntil: 'networkidle' });
  });

  test('Buttons render consistently', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page.locator('#test-container')).toHaveScreenshot('ui-primitives-buttons.png', { timeout: 15000 });
  });
});
