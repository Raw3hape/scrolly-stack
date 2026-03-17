/**
 * E2E Tests — Responsive Layout for All Marketing Pages
 *
 * Tests all pages at 3 viewport sizes: desktop (1280×720), tablet (768×1024), mobile (375×667).
 * Verifies layout, content visibility, and no horizontal overflow.
 */

import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
] as const;

const CONTENT_PAGES = [
  { path: '/about', name: 'About' },
  { path: '/how-it-works/roofers', name: 'Roofers' },
  { path: '/how-it-works/investors', name: 'Investors' },
  { path: '/schedule', name: 'Schedule' },
  { path: '/3b-opt-in', name: 'Opt-In' },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}×${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const page_ of CONTENT_PAGES) {
      test(`${page_.name} — no horizontal overflow`, async ({ page }) => {
        await page.goto(page_.path, { waitUntil: 'domcontentloaded' });
        
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // 1px tolerance
      });

      test(`${page_.name} — h1 is visible`, async ({ page }) => {
        await page.goto(page_.path, { waitUntil: 'domcontentloaded' });
        
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
      });

      test(`${page_.name} — header is visible`, async ({ page }) => {
        await page.goto(page_.path, { waitUntil: 'domcontentloaded' });
        
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
      });

      test(`${page_.name} — footer exists`, async ({ page }) => {
        await page.goto(page_.path, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);
        
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
      });
    }

    // Specific tests for Roofers step cards layout
    test('Roofers — step cards layout is correct', async ({ page }) => {
      await page.goto('/how-it-works/roofers', { waitUntil: 'domcontentloaded' });
      
      const grid = page.locator('.step-cards');
      await expect(grid).toBeVisible();

      const cards = page.locator('.step-card');
      const count = await cards.count();
      expect(count).toBe(3);

      // All cards should be visible
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toBeVisible();
      }
    });

    // Specific tests for About comparison columns
    test('About — comparison columns visible', async ({ page }) => {
      await page.goto('/about', { waitUntil: 'domcontentloaded' });
      
      const comparison = page.locator('.comparison');
      await expect(comparison).toBeVisible();

      const columns = page.locator('.comparison__column');
      await expect(columns).toHaveCount(2);
    });

    // Opt-in form responsive check
    test('Opt-In — form fields visible and usable', async ({ page }) => {
      await page.goto('/3b-opt-in', { waitUntil: 'domcontentloaded' });
      
      const firstName = page.locator('#firstName');
      const email = page.locator('#email');
      const submit = page.locator('.opt-in__submit');
      
      await expect(firstName).toBeVisible();
      await expect(email).toBeVisible();
      await expect(submit).toBeVisible();

      // Check inputs are not clipped
      const inputBox = await firstName.boundingBox();
      expect(inputBox).toBeTruthy();
      expect(inputBox!.width).toBeGreaterThan(100);
    });
  });
}
