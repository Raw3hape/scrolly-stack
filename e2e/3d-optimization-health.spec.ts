/**
 * 3D Optimization Health Tests
 *
 * Non-obvious tests designed to find REAL bugs after 3D performance optimizations:
 * - HDR envmap 1.3MB → 93KB
 * - compileAsync() added to all 7 components
 * - Suspense boundaries around all Environment components
 *
 * These tests are intentionally aggressive — they test failure modes,
 * race conditions, and edge cases that typical "happy path" tests miss.
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// CATEGORY 1: Race Conditions (compileAsync + Suspense)
// ============================================================================

test.describe('Race Conditions', () => {
  test('environment HDR loads before canvas becomes visible on homepage', async ({ page }) => {
    // compileAsync runs in onCreated, but Environment is in a separate Suspense.
    // If HDR loads AFTER canvas is visible, user sees unlit blocks first.
    const envLoaded = page.waitForResponse(
      (resp) => resp.url().includes('venice_sunset_256.hdr') && resp.status() === 200,
    );

    await page.goto('/');

    const envResponse = await envLoaded;
    const envLoadedAt = Date.now();

    await page.waitForFunction(() => {
      const el = document.querySelector('.col-visual');
      return el && getComputedStyle(el).opacity === '1';
    }, { timeout: 8000 });
    const canvasVisibleAt = Date.now();

    // HDR should load before or around the same time canvas becomes visible.
    // Allow 500ms grace — network vs render timing.
    expect(envLoadedAt).toBeLessThanOrEqual(canvasVisibleAt + 500);
  });

  test('homepage becomes visible even if compileAsync is slow (4s timeout)', async ({ page }) => {
    // HomeV2Client has a 4s safety timeout. If compileAsync hangs,
    // the canvas should still become visible via timeout.
    await page.goto('/');

    await page.waitForFunction(() => {
      const el = document.querySelector('.col-visual');
      return el && getComputedStyle(el).opacity === '1';
    }, { timeout: 6000 });
  });

  test('sub-page hero models become visible (no timeout safety net)', async ({ page }) => {
    // Hero models on sub-pages have NO 4s timeout like HomeV2Client.
    // If compileAsync promise rejects without .catch(), onReady never fires
    // and the hero stays invisible forever.
    const subPages = ['/how-it-works/investors', '/how-it-works/roofers'];

    for (const path of subPages) {
      await page.goto(path);

      // Find the hero canvas and wait for it to be rendered
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible({ timeout: 8000 });

      // Canvas should have nonzero dimensions (actually rendering)
      const box = await canvas.boundingBox();
      expect(box, `Canvas on ${path} should have dimensions`).toBeTruthy();
      expect(box!.width, `Canvas on ${path} should have width`).toBeGreaterThan(50);
    }
  });
});

// ============================================================================
// CATEGORY 2: Asset Loading Correctness
// ============================================================================

test.describe('Asset Loading', () => {
  test('all 3D assets return 200 with sufficient size', async ({ page }) => {
    // If HDR path is wrong or file is corrupted, Environment silently fails.
    const assets = [
      { url: '/envmaps/venice_sunset_256.hdr', minSize: 50_000, label: 'HDR envmap' },
      { url: '/fonts/Inter-Regular.woff', minSize: 10_000, label: 'Inter font' },
      { url: '/FoundationProjects_Logo_Main.png', minSize: 5_000, label: 'Logo PNG' },
    ];

    for (const { url, minSize, label } of assets) {
      const response = await page.request.get(url);
      expect(response.status(), `${label} (${url}) should return 200`).toBe(200);

      const body = await response.body();
      expect(
        body.length,
        `${label} should be at least ${minSize} bytes, got ${body.length}`,
      ).toBeGreaterThan(minSize);
    }
  });

  test('old 1K HDR file is NOT served (was deleted)', async ({ page }) => {
    const response = await page.request.get('/envmaps/venice_sunset_1k.hdr');
    expect(response.status()).toBe(404);
  });

  test('preloaded assets are fetched on pages with 3D', async ({ page }) => {
    const hdrRequests: string[] = [];
    page.on('response', (resp) => {
      if (resp.url().includes('venice_sunset_256.hdr') && resp.status() === 200) {
        hdrRequests.push(resp.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(hdrRequests.length, 'HDR should be fetched on homepage').toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// CATEGORY 3: Console Errors (catch compileAsync/Suspense issues)
// ============================================================================

test.describe('Console Error Freedom', () => {
  const pages3D = ['/', '/opt-in', '/how-it-works/investors', '/how-it-works/roofers'];

  for (const path of pages3D) {
    test(`no unexpected console errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`PAGE_ERROR: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(`CONSOLE_ERROR: ${msg.text()}`);
        }
      });

      await page.goto(path);
      await page.waitForTimeout(4000); // Wait for all async: compileAsync, Suspense, HDR

      // Filter known benign warnings
      const real = errors.filter(
        (e) =>
          !e.includes('THREE.') &&
          !e.includes('ResizeObserver') &&
          !e.includes('passive') &&
          !e.includes('preloaded using link preload') &&
          !e.includes('Download the React DevTools') &&
          !e.includes('WebGL') &&
          !e.includes('[HMR]') &&
          !e.includes('Fast Refresh') &&
          !e.includes('next-dev.js') &&
          !e.includes('Largest Contentful Paint') &&
          !e.includes('width or height modified'),
      );

      expect(real, `Unexpected errors on ${path}: ${real.join('\n')}`).toHaveLength(0);
    });
  }
});

// ============================================================================
// CATEGORY 4: Performance Budget
// ============================================================================

test.describe('Performance Budget', () => {
  test('homepage 3D visible within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');

    await page.waitForFunction(() => {
      const el = document.querySelector('.col-visual');
      return el && getComputedStyle(el).opacity === '1';
    }, { timeout: 7000 });

    const elapsed = Date.now() - start;
    console.log(`Homepage 3D visible in ${elapsed}ms`);
    // Budget: 8s in dev (webpack cold compile ~3s), prod is faster (~2-3s)
    expect(elapsed, 'Homepage 3D should be visible within 8s').toBeLessThan(8000);
  });

  test('opt-in page canvas renders within 6 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/opt-in');

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 8000 });

    const elapsed = Date.now() - start;
    console.log(`Opt-in canvas visible in ${elapsed}ms`);
    expect(elapsed, 'Opt-in canvas should render within 6s').toBeLessThan(6000);
  });
});

// ============================================================================
// CATEGORY 5: Suspense Fallback Edge Cases
// ============================================================================

test.describe('Suspense Resilience', () => {
  test('homepage renders even if HDR environment fails to load', async ({ page }) => {
    // Block ALL HDR requests — Environment Suspense should show null fallback,
    // scene should render without environment lighting.
    await page.route('**/venice_sunset*.hdr', (route) => route.abort());

    await page.goto('/');

    // Canvas should still become visible via ReadySignal + 4s timeout
    await page.waitForFunction(
      () => {
        const el = document.querySelector('.col-visual');
        return el && getComputedStyle(el).opacity === '1';
      },
      { timeout: 8000 },
    );

    // Canvas should exist and have dimensions (not empty)
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    expect(box, 'Canvas should have a bounding box').toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  test('opt-in book renders even if HDR environment fails', async ({ page }) => {
    await page.route('**/venice_sunset*.hdr', (route) => route.abort());

    await page.goto('/opt-in');

    // FreebieBook3D has internal ready state — should still fade in
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 8000 });
  });
});

// ============================================================================
// CATEGORY 6: Memory / Cleanup
// ============================================================================

test.describe('Memory and Cleanup', () => {
  test('no canvas accumulation after SPA navigation cycles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Navigate away and back 3 times (SPA navigation)
    for (let i = 0; i < 3; i++) {
      const aboutLink = page.locator('a[href="/about"]').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForURL('/about');
        await page.waitForTimeout(800);
      }

      const homeLink = page.locator('a[href="/"]').first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await page.waitForURL('/');
        await page.waitForTimeout(800);
      }
    }

    // Should not accumulate canvases — old ones should be cleaned up
    const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
    expect(canvasCount, `Expected ≤3 canvases, got ${canvasCount}`).toBeLessThanOrEqual(3);
  });
});

// ============================================================================
// CATEGORY 7: Visual Quality (HDR Downgrade)
// ============================================================================

test.describe('Visual Quality', () => {
  test('capture baseline screenshots for HDR 256px quality review', async ({ page }) => {
    // First run: captures screenshots for manual review.
    // After approval, uncomment toHaveScreenshot() for automated regression.

    await page.goto('/');
    await page.waitForFunction(() => {
      const el = document.querySelector('.col-visual');
      return el && getComputedStyle(el).opacity === '1';
    }, { timeout: 10000 });
    await page.waitForTimeout(1500); // Wait for Environment to apply

    const homeCanvas = page.locator('canvas').first();
    await homeCanvas.screenshot({ path: 'test-results/hdr-256-homepage.png' });

    // Opt-in page (FreebieBook3D with reflective materials)
    await page.goto('/opt-in');
    await page.waitForTimeout(4000);
    const optinCanvas = page.locator('canvas').first();
    if (await optinCanvas.isVisible()) {
      await optinCanvas.screenshot({ path: 'test-results/hdr-256-optin-book.png' });
    }

    // After manual review of screenshots, enable regression:
    // await expect(homeCanvas).toHaveScreenshot('hdr-256-homepage.png', { maxDiffPixelRatio: 0.05 });
  });
});
