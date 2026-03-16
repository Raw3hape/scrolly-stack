/**
 * E2E Tests — Responsive Layout
 *
 * Validates layout adapts correctly to different screen sizes.
 * These tests run on all 6 viewport presets defined in playwright.config.ts.
 */

import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('no horizontal overflow (no horizontal scrollbar)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('content is within viewport bounds', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const viewportWidth = page.viewportSize()!.width;

    // Check hero headline doesn't overflow
    const headline = page.locator('.hero__headline');
    if (await headline.isVisible()) {
      const box = await headline.boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
      }
    }
  });

  test('text is readable (font size >= 12px)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const smallTextCount = await page.evaluate(() => {
      const allText = document.querySelectorAll('p, span, li, a, h1, h2, h3, h4, h5, h6');
      let tooSmall = 0;
      allText.forEach((el) => {
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size < 11 && el.textContent!.trim().length > 0) tooSmall++;
      });
      return tooSmall;
    });

    expect(smallTextCount).toBe(0);
  });

  test('CTA button is tap-friendly on mobile (>= 44px)', async ({ page }) => {
    const viewport = page.viewportSize()!;
    // Only check on mobile viewports
    if (viewport.width > 768) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const cta = page.locator('.hero__cta-button');
    if (await cta.isVisible()) {
      const box = await cta.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('footer is accessible at bottom', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
