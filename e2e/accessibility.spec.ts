/**
 * E2E Tests — Accessibility
 *
 * Basic a11y checks across viewports.
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('skip-link is present and has correct href', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('skip-link becomes visible on focus (desktop only)', async ({ page }) => {
    const viewport = page.viewportSize()!;
    if (viewport.width < 768) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
  });

  test('main landmark exists', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const main = page.locator('main#main');
    await expect(main).toBeAttached();
  });

  test('html has lang attribute', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const imagesWithoutAlt = page.locator('img:not([alt])');
    const count = await imagesWithoutAlt.count();
    expect(count).toBe(0);
  });

  test('interactive elements are keyboard accessible (desktop only)', async ({ page }) => {
    const viewport = page.viewportSize()!;
    if (viewport.width < 768) {
      test.skip();
      return;
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.keyboard.press('Tab'); // skip-link
    await page.keyboard.press('Tab'); // first nav link or CTA

    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('hero text content exists', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const headline = page.locator('.hero__headline');
    await expect(headline).toBeAttached();
    const text = await headline.textContent();
    expect(text!.length).toBeGreaterThan(10);
  });
});
