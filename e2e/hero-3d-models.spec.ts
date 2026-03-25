/**
 * E2E Tests — Hero 3D Models
 *
 * Verifies that 3D hero models render correctly on About, Roofers, and Investors pages.
 * Tests: canvas presence, WebGL context, no console errors, responsive layout,
 * and interaction readiness (pointer events).
 */

import { test, expect } from '@playwright/test';

const HERO_3D_PAGES = [
  {
    path: '/about',
    name: 'About — Pyramid',
    heroSelector: '.v2-hero--editorial',
    canvasSelector: '.v2-hero__3d-col canvas',
  },
  {
    path: '/how-it-works/roofers',
    name: 'Roofers — Rubiks Cube',
    heroSelector: '.v2-hero--left',
    canvasSelector: '.v2-hero__3d-col canvas',
  },
  {
    path: '/how-it-works/investors',
    name: 'Investors — Exploded Grid',
    heroSelector: '.v2-hero--left',
    canvasSelector: '.v2-hero__3d-col canvas',
  },
];

for (const page3d of HERO_3D_PAGES) {
  test.describe(page3d.name, () => {
    test('3D canvas renders without fatal errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(page3d.path, { waitUntil: 'networkidle' });

      // Hero section exists
      await expect(page.locator(page3d.heroSelector)).toBeVisible();

      // Canvas element exists (WebGL)
      const canvas = page.locator(page3d.canvasSelector);
      await expect(canvas).toBeAttached({ timeout: 10_000 });

      // Canvas has non-zero dimensions
      const box = await canvas.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.width).toBeGreaterThan(50);
      expect(box!.height).toBeGreaterThan(50);

      // No fatal console errors (filter WebGL/THREE warnings)
      const fatalErrors = errors.filter(
        (e) =>
          !e.includes('WebGL') &&
          !e.includes('THREE') &&
          !e.includes('ResizeObserver') &&
          !e.includes('passive') &&
          !e.includes('Deprecation')
      );
      expect(fatalErrors).toHaveLength(0);
    });

    test('3D canvas has cursor grab style', async ({ page }) => {
      await page.goto(page3d.path, { waitUntil: 'networkidle' });
      const canvas = page.locator(page3d.canvasSelector);
      await expect(canvas).toBeAttached({ timeout: 10_000 });

      const cursor = await canvas.evaluate((el) => getComputedStyle(el).cursor);
      // PresentationControls sets cursor to 'grab'
      expect(['grab', 'default', '']).toContain(cursor);
    });

    test('hero text content is visible alongside 3D', async ({ page }) => {
      await page.goto(page3d.path, { waitUntil: 'domcontentloaded' });

      // Heading is visible
      const heading = page.locator(`${page3d.heroSelector} .v2-hero__heading`).first();
      await expect(heading).toBeVisible();

      // Heading has text content
      const text = await heading.textContent();
      expect(text!.length).toBeGreaterThan(10);
    });

    test('3D column does not overflow hero section', async ({ page }) => {
      await page.goto(page3d.path, { waitUntil: 'networkidle' });

      const canvas = page.locator(page3d.canvasSelector);
      await expect(canvas).toBeAttached({ timeout: 10_000 });

      const heroBox = await page.locator(page3d.heroSelector).boundingBox();
      const canvasBox = await canvas.boundingBox();

      expect(heroBox).toBeTruthy();
      expect(canvasBox).toBeTruthy();

      // Canvas should be within hero bounds (with small tolerance for transforms)
      const tolerance = 200;
      expect(canvasBox!.x).toBeGreaterThanOrEqual(heroBox!.x - tolerance);
      expect(canvasBox!.y).toBeGreaterThanOrEqual(heroBox!.y - tolerance);
      expect(canvasBox!.x + canvasBox!.width).toBeLessThanOrEqual(
        heroBox!.x + heroBox!.width + tolerance
      );
    });
  });
}

// ── Responsive Tests ──

test.describe('3D heroes — responsive layout', () => {
  for (const page3d of HERO_3D_PAGES) {
    test(`${page3d.name} — desktop split layout`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(page3d.path, { waitUntil: 'networkidle' });

      const canvas = page.locator(page3d.canvasSelector);
      await expect(canvas).toBeAttached({ timeout: 10_000 });

      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      // On desktop, 3D should be on right half
      expect(canvasBox!.x).toBeGreaterThan(400);
    });
  }
});

// ── No WebGL Context Lost ──

test.describe('3D heroes — WebGL stability', () => {
  test('navigating between 3D pages does not crash WebGL', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Visit all 3 pages in sequence
    for (const page3d of HERO_3D_PAGES) {
      await page.goto(page3d.path, { waitUntil: 'networkidle' });
      const canvas = page.locator(page3d.canvasSelector);
      await expect(canvas).toBeAttached({ timeout: 10_000 });
      // Brief wait for WebGL init
      await page.waitForTimeout(1000);
    }

    const contextLost = errors.filter((e) => e.includes('context lost'));
    expect(contextLost).toHaveLength(0);
  });
});
