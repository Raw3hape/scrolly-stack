/**
 * Timeline Section — Layout & Interaction E2E Tests
 *
 * Verifies the "Our Investment Lifecycle" section on the Investors page:
 * - Proper spacing between steps (no overlaps)
 * - Elements visible and correctly positioned after scroll
 * - KPI cards visible and non-overlapping
 * - Mobile layout integrity
 * - Sequential reveal order
 */

import { test, expect } from '@playwright/test';

const PAGE = '/how-it-works/investors';
const SECTION_ID = '#investment-lifecycle';

// ─── Helper: scroll an element into view + wait for reveal animations ─────
async function scrollToTimeline(page: import('@playwright/test').Page) {
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  // Wait for section to exist
  await page.waitForSelector(SECTION_ID, { timeout: 10_000 });

  // Scroll to section
  await page.locator(SECTION_ID).scrollIntoViewIfNeeded();
  // Give parallax/IO time to fire
  await page.waitForTimeout(600);
}

// ─── Helper: scroll through timeline step by step ─────────────────────────
async function scrollThroughTimeline(page: import('@playwright/test').Page) {
  const steps = page.locator('.v2-timeline__step');
  const count = await steps.count();

  for (let i = 0; i < count; i++) {
    await steps.nth(i).scrollIntoViewIfNeeded();
    // Wait for reveal animations (stagger: up to ~400ms)
    await page.waitForTimeout(800);
  }
}

// ===========================================================================
// DESKTOP TESTS
// ===========================================================================

test.describe('Timeline Section — Desktop Layout', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('section renders with heading and divider', async ({ page }) => {
    await scrollToTimeline(page);

    const heading = page.locator('.v2-timeline__heading');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Our Investment Lifecycle');

    const divider = page.locator('.v2-timeline__divider');
    await expect(divider).toBeVisible();
  });

  test('all 3 timeline steps are visible after scrolling through', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const steps = page.locator('.v2-timeline__step');
    await expect(steps).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      await expect(steps.nth(i)).toBeVisible();
    }
  });

  test('steps have sufficient vertical spacing (no overlaps)', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const steps = page.locator('.v2-timeline__step');
    const boxes: { top: number; bottom: number }[] = [];

    for (let i = 0; i < 3; i++) {
      const box = await steps.nth(i).boundingBox();
      expect(box).not.toBeNull();
      boxes.push({ top: box!.y, bottom: box!.y + box!.height });
    }

    // Each step should start BELOW the previous step's bottom
    for (let i = 1; i < boxes.length; i++) {
      const gap = boxes[i].top - boxes[i - 1].bottom;
      // Minimum 40px gap between steps (generous spacing)
      expect(gap).toBeGreaterThanOrEqual(40);
    }
  });

  test('content and KPI card do not overlap in 2-column grid', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const steps = page.locator('.v2-timeline__step');

    for (let i = 0; i < 3; i++) {
      const content = steps.nth(i).locator('.v2-timeline__content');
      const kpiCard = steps.nth(i).locator('.v2-timeline__kpi-card');

      const contentBox = await content.boundingBox();
      const kpiBox = await kpiCard.boundingBox();

      expect(contentBox).not.toBeNull();
      expect(kpiBox).not.toBeNull();

      // Content and KPI should not overlap horizontally on desktop
      const contentRight = contentBox!.x + contentBox!.width;
      const kpiLeft = kpiBox!.x;

      // They should be in separate columns (either content < kpi or kpi < content)
      const noOverlap =
        contentRight <= kpiLeft + 5 || kpiBox!.x + kpiBox!.width <= contentBox!.x + 5;
      expect(noOverlap).toBe(true);
    }
  });

  test('KPI cards have consistent widths', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const kpiCards = page.locator('.v2-timeline__kpi-card');
    const widths: number[] = [];

    for (let i = 0; i < 3; i++) {
      const box = await kpiCards.nth(i).boundingBox();
      expect(box).not.toBeNull();
      widths.push(box!.width);
    }

    // All KPI cards should have similar widths (within 20% tolerance)
    const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
    for (const w of widths) {
      expect(Math.abs(w - avgWidth) / avgWidth).toBeLessThan(0.2);
    }
  });

  test('no dot elements are rendered', async ({ page }) => {
    await scrollToTimeline(page);

    const dots = page.locator('.v2-timeline__dot');
    await expect(dots).toHaveCount(0);
  });

  test('center line elements exist', async ({ page }) => {
    await scrollToTimeline(page);

    const line = page.locator('.v2-timeline__line');
    await expect(line).toBeVisible();

    const lineActive = page.locator('.v2-timeline__line-active');
    await expect(lineActive).toBeAttached();
  });

  test('reveal items are visible after scroll activation', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    // Check first step reveal items have data-revealed
    const firstStep = page.locator('.v2-timeline__step').first();
    const revealItems = firstStep.locator('.v2-timeline__reveal-item');
    const count = await revealItems.count();

    expect(count).toBe(3); // number, title, text

    for (let i = 0; i < count; i++) {
      await expect(revealItems.nth(i)).toHaveAttribute('data-revealed', 'true');
    }

    // KPI card should also be revealed
    const kpiCard = firstStep.locator('.v2-timeline__kpi-card');
    await expect(kpiCard).toHaveAttribute('data-revealed', 'true');
  });

  test('step alternation: even steps left-aligned, odd steps right-aligned', async ({ page }) => {
    await scrollToTimeline(page);

    const steps = page.locator('.v2-timeline__step');

    // Step 0 (even) — not reversed
    await expect(steps.nth(0)).not.toHaveClass(/v2-timeline__step--reverse/);

    // Step 1 (odd) — reversed
    await expect(steps.nth(1)).toHaveClass(/v2-timeline__step--reverse/);

    // Step 2 (even) — not reversed
    await expect(steps.nth(2)).not.toHaveClass(/v2-timeline__step--reverse/);
  });
});

// ===========================================================================
// TABLET TESTS
// ===========================================================================

test.describe('Timeline Section — Tablet Portrait', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('2-column grid layout is maintained on tablet', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const steps = page.locator('.v2-timeline__step');
    const firstStep = steps.first();
    const content = firstStep.locator('.v2-timeline__content');
    const kpiWrapper = firstStep.locator('.v2-timeline__kpi-wrapper');

    const contentBox = await content.boundingBox();
    const kpiBox = await kpiWrapper.boundingBox();

    expect(contentBox).not.toBeNull();
    expect(kpiBox).not.toBeNull();

    // Should be side by side (not stacked)
    const sameRow = Math.abs(contentBox!.y - kpiBox!.y) < contentBox!.height;
    expect(sameRow).toBe(true);
  });
});

// ===========================================================================
// MOBILE TESTS
// ===========================================================================

test.describe('Timeline Section — Mobile Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('steps stack in single column on mobile', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const steps = page.locator('.v2-timeline__step');

    for (let i = 0; i < 3; i++) {
      await expect(steps.nth(i)).toBeVisible();
    }

    // Check that content and KPI card are stacked vertically
    const firstStep = steps.first();
    const content = firstStep.locator('.v2-timeline__content');
    const kpiWrapper = firstStep.locator('.v2-timeline__kpi-wrapper');

    const contentBox = await content.boundingBox();
    const kpiBox = await kpiWrapper.boundingBox();

    expect(contentBox).not.toBeNull();
    expect(kpiBox).not.toBeNull();

    // KPI should be below content on mobile (stacked)
    expect(kpiBox!.y).toBeGreaterThanOrEqual(contentBox!.y + contentBox!.height - 5);
  });

  test('steps have left border on mobile', async ({ page }) => {
    await scrollToTimeline(page);

    const firstStep = page.locator('.v2-timeline__step').first();
    const borderLeft = await firstStep.evaluate((el) => getComputedStyle(el).borderLeftStyle);

    expect(borderLeft).toBe('solid');
  });

  test('active step has gold left border on mobile', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const activeStep = page.locator('.v2-timeline__step--active').first();
    await expect(activeStep).toBeVisible();

    const borderColor = await activeStep.evaluate((el) => getComputedStyle(el).borderLeftColor);

    // Should not be the default gray — should be gold
    expect(borderColor).not.toBe('rgb(193, 200, 202)');
  });

  test('center line is hidden on mobile', async ({ page }) => {
    await scrollToTimeline(page);

    const line = page.locator('.v2-timeline__line');
    await expect(line).not.toBeVisible();
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const viewportWidth = 375;

    const steps = page.locator('.v2-timeline__step');
    for (let i = 0; i < 3; i++) {
      const box = await steps.nth(i).boundingBox();
      expect(box).not.toBeNull();
      // Step should not extend beyond viewport
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 5);
    }
  });
});

// ===========================================================================
// SMALL MOBILE TESTS
// ===========================================================================

test.describe('Timeline Section — Small Mobile (375px)', () => {
  test.use({ viewport: { width: 320, height: 568 } });

  test('section fits within 320px viewport without overflow', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const sectionBox = await page.locator(SECTION_ID).boundingBox();
    expect(sectionBox).not.toBeNull();
    expect(sectionBox!.width).toBeLessThanOrEqual(320 + 2);
  });

  test('KPI cards have adequate padding on small screens', async ({ page }) => {
    await scrollToTimeline(page);
    await scrollThroughTimeline(page);

    const kpiCard = page.locator('.v2-timeline__kpi-card').first();
    const padding = await kpiCard.evaluate((el) => getComputedStyle(el).paddingLeft);

    const paddingNum = parseFloat(padding);
    // Should have at least 12px padding
    expect(paddingNum).toBeGreaterThanOrEqual(12);
  });
});
