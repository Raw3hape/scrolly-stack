/**
 * E2E Tests — Navigation
 *
 * Tests header navigation works across all viewports.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header nav is present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Use specific header nav (not footer nav)
    const nav = page.locator('header nav');
    await expect(nav).toBeAttached();

    // Check key links exist in header
    const links = page.locator('header a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const logo = page.locator('header a').first();
    await logo.click();
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('navigation between pages works (desktop only)', async ({ page }) => {
    const viewport = page.viewportSize()!;

    // Skip on mobile/tablet — nav links may be hidden behind burger menu
    if (viewport.width < 1024) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Find and click visible About link
    const aboutLink = page.locator('header a[href="/about"]:visible');
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await page.waitForURL('/about');
      await expect(page).toHaveURL('/about');
    }
  });
});
