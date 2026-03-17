/**
 * E2E Tests — Mosaic Transition
 *
 * Tests the 3-phase scroll-driven mosaic transition:
 * blocks fly from the 3D stack into a flat grid as the user scrolls
 * past the scrolly-experience steps.
 *
 * Runs on desktop only — mosaic is a visual enhancement best tested at larger viewports.
 */

import { test, expect } from '@playwright/test';

// Only run on desktop projects (canvas needs reasonable size)
const DESKTOP_ONLY = ['desktop-1920', 'desktop-1440', 'tablet-landscape'];

test.describe('Mosaic Transition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for 3D canvas hydration
    await page.waitForTimeout(3000);
  });

  // ===========================================================================
  // TRIGGER ZONE EXISTS
  // ===========================================================================

  test('mosaic trigger zone is present in DOM', async ({ page }) => {
    const triggerZone = page.locator('.mosaic-trigger-zone');
    await expect(triggerZone).toBeAttached();
    await expect(triggerZone).toHaveAttribute('aria-hidden', 'true');
  });

  test('mosaic trigger zone has height', async ({ page }) => {
    const triggerZone = page.locator('.mosaic-trigger-zone');
    // Scroll to trigger zone — it's far below the fold
    await triggerZone.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const box = await triggerZone.boundingBox();
    // Trigger zone should have meaningful height (60vh ≈ 600+ px on desktop)
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThan(100);
  });

  // ===========================================================================
  // TRIGGER ZONE POSITION (after steps)
  // ===========================================================================

  test('trigger zone comes after all steps', async ({ page }) => {
    // The trigger zone should be the last child of .overlay or right after .steps-container
    const overlay = page.locator('.overlay');
    const lastChild = overlay.locator('> :last-child');
    await expect(lastChild).toHaveClass(/mosaic-trigger-zone/);
  });

  // ===========================================================================
  // CANVAS PERSISTS THROUGH SCROLL
  // ===========================================================================

  test('3D canvas remains visible during full scroll', async ({ page }) => {
    const projectName = test.info().project.name;
    if (!DESKTOP_ONLY.includes(projectName)) {
      test.skip();
      return;
    }

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    // Scroll through all steps
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();

    // Scroll into trigger zone area
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 8));
    await page.waitForTimeout(500);
    await expect(canvas).toBeVisible();

    // Canvas should still have valid dimensions
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  // ===========================================================================
  // SCROLL TO BOTTOM AND BACK
  // ===========================================================================

  test('full scroll down and back does not crash', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    // Scroll all the way down (triggers mosaic)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Verify no errors: canvas still present
    await expect(canvas).toBeVisible();

    // Scroll back to top (reverses mosaic)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Hero should still be accessible
    const hero = page.locator('.hero');
    await expect(hero).toBeAttached();

    // Canvas still alive
    await expect(canvas).toBeVisible();
  });

  // ===========================================================================
  // STEPS CONTAINER COMPLETE BEFORE TRIGGER
  // ===========================================================================

  test('all 15 steps render before trigger zone', async ({ page }) => {
    const steps = page.locator('.step');
    const count = await steps.count();
    expect(count).toBe(15);
  });

  // ===========================================================================
  // TRIGGER ZONE IS NOT INTERACTIVE
  // ===========================================================================

  test('trigger zone has pointer-events none', async ({ page }) => {
    const triggerZone = page.locator('.mosaic-trigger-zone');
    const pointerEvents = await triggerZone.evaluate(
      (el) => window.getComputedStyle(el).pointerEvents
    );
    expect(pointerEvents).toBe('none');
  });

  // ===========================================================================
  // INCREMENTAL SCROLL (simulates real user behavior)
  // ===========================================================================

  test('incremental scroll through trigger zone is smooth', async ({ page }) => {
    const projectName = test.info().project.name;
    if (!DESKTOP_ONLY.includes(projectName)) {
      test.skip();
      return;
    }

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    // Get the trigger zone position
    const triggerZone = page.locator('.mosaic-trigger-zone');
    const triggerBox = await triggerZone.boundingBox();

    if (!triggerBox) {
      // Trigger zone is below fold — scroll to it
      await page.evaluate(() => {
        const el = document.querySelector('.mosaic-trigger-zone');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(500);
    }

    // Scroll incrementally through the trigger zone area
    // This simulates the user slowly scrolling and triggering the mosaic
    const scrollSteps = 5;
    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate((step) => {
        const totalScroll = document.body.scrollHeight;
        const targetScroll = totalScroll * (0.5 + (step / 10));
        window.scrollTo(0, targetScroll);
      }, i);
      await page.waitForTimeout(300);

      // Canvas should remain valid at every point
      await expect(canvas).toBeVisible();
    }
  });

  // ===========================================================================
  // NO CONSOLE ERRORS DURING TRANSITION
  // ===========================================================================

  test('no console errors during mosaic scroll', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    // Full scroll journey: top → bottom → top
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    // Filter out known benign warnings (WebGL, Three.js deprecations)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('THREE.') &&
        !e.includes('WebGL') &&
        !e.includes('Deprecation') &&
        !e.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
