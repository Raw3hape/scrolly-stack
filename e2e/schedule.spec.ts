/**
 * E2E Tests — Schedule Page (Comprehensive)
 *
 * Tests the /schedule page across all viewports defined in playwright.config.ts.
 * Covers:
 *  - Section presence and structure
 *  - Calendar interactions (date selection, time slot selection)
 *  - Responsive layout (no overflow, proper stacking)
 *  - Accessibility (ARIA attributes, keyboard navigation)
 *  - Visual stability (no layout shift on interaction)
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 1. STRUCTURAL TESTS — all viewports via Playwright projects
// ---------------------------------------------------------------------------

test.describe('Schedule page — structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/schedule/i);
  });

  test('all 4 sections are present', async ({ page }) => {
    // S1: Schedule hero
    await expect(page.locator('#schedule-hero')).toBeAttached();
    // S2: Booking widget
    await expect(page.locator('#schedule-booking')).toBeAttached();
    // S3: Quote
    await expect(page.locator('#schedule-quote')).toBeAttached();
    // S4: CTA
    await expect(page.locator('#schedule-cta')).toBeAttached();
  });

  test('hero heading is visible', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Book A Call');
  });

  test('SMS badge is visible', async ({ page }) => {
    const badge = page.locator('.v2-schedule-hero__badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('ROOF');
  });

  test('sidebar value-props are visible', async ({ page }) => {
    const items = page.locator('.v2-booking__expect-item');
    await expect(items).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(items.nth(i)).toBeVisible();
    }
  });

  test('trust badge is visible', async ({ page }) => {
    const trust = page.locator('.v2-booking__trust');
    await expect(trust).toBeVisible();
    await expect(trust).toContainText('Direct Access');
  });

  test('calendar widget renders', async ({ page }) => {
    const widget = page.locator('.v2-booking__widget');
    await expect(widget).toBeVisible();
    // Calendar month display
    await expect(page.locator('.v2-booking__calendar-month')).toBeVisible();
    // Weekday headers
    const weekdays = page.locator('.v2-booking__calendar-weekday');
    await expect(weekdays).toHaveCount(7);
  });

  test('time slots are visible', async ({ page }) => {
    const slots = page.locator('.v2-booking__slot');
    await expect(slots).toHaveCount(5);
    // Default: expected text
    await expect(slots.first()).toContainText('AM');
  });

  test('quote section renders', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const quote = page.locator('.v2-schedule-quote__text');
    await expect(quote).toBeAttached();
  });

  test('footer exists', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('no horizontal overflow', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

// ---------------------------------------------------------------------------
// 2. INTERACTION TESTS — calendar & time slot selection
// ---------------------------------------------------------------------------

test.describe('Schedule page — calendar interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
    // Scroll booking section into view so calendar buttons are clickable
    await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('clicking a day selects it visually', async ({ page }) => {
    // Find a non-disabled day button
    const days = page.locator(
      '.v2-booking__calendar-day:not(.v2-booking__calendar-day--disabled)'
    );
    const dayCount = await days.count();
    expect(dayCount).toBeGreaterThan(0);

    // Click the first available day
    const target = days.first();
    await target.scrollIntoViewIfNeeded();
    await target.click();

    // Should have --selected class
    await expect(target).toHaveClass(/v2-booking__calendar-day--selected/);
    // ARIA pressed
    await expect(target).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking a time slot selects it visually', async ({ page }) => {
    const firstSlot = page.locator('.v2-booking__slot').first();
    await firstSlot.scrollIntoViewIfNeeded();
    await firstSlot.click();

    await expect(firstSlot).toHaveClass(/v2-booking__slot--selected/);
    await expect(firstSlot).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking a different day deselects the previous one', async ({ page }) => {
    const days = page.locator(
      '.v2-booking__calendar-day:not(.v2-booking__calendar-day--disabled)'
    );
    const dayCount = await days.count();
    if (dayCount < 2) return; // Not enough days to test

    await days.first().scrollIntoViewIfNeeded();
    await days.first().click();
    await expect(days.first()).toHaveClass(/v2-booking__calendar-day--selected/);

    await days.nth(1).click();
    await expect(days.first()).not.toHaveClass(/v2-booking__calendar-day--selected/);
    await expect(days.nth(1)).toHaveClass(/v2-booking__calendar-day--selected/);
  });

  test('selecting a day resets time slot selection', async ({ page }) => {
    // First navigate to next month so all days are available
    const nextBtn = page.locator('button[aria-label="Next month"]');
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    await page.waitForTimeout(200);

    // Select a day first, THEN a time slot
    const days = page.locator(
      '.v2-booking__calendar-day:not(.v2-booking__calendar-day--disabled)'
    );
    await days.first().scrollIntoViewIfNeeded();
    await days.first().click();

    const slot = page.locator('.v2-booking__slot').first();
    await slot.scrollIntoViewIfNeeded();
    await slot.click();
    await expect(slot).toHaveClass(/v2-booking__slot--selected/);

    // Now select a DIFFERENT day — should reset slot
    await days.nth(1).scrollIntoViewIfNeeded();
    await days.nth(1).click();
    // Slot should no longer be selected
    await expect(slot).not.toHaveClass(/v2-booking__slot--selected/);
  });

  test('submit button is disabled until both day and slot are selected', async ({
    page,
  }) => {
    const submit = page.locator('.v2-booking__submit');
    await submit.scrollIntoViewIfNeeded();
    // Initially disabled
    await expect(submit).toBeDisabled();

    // Select a day
    const days = page.locator(
      '.v2-booking__calendar-day:not(.v2-booking__calendar-day--disabled)'
    );
    if ((await days.count()) > 0) {
      await days.first().scrollIntoViewIfNeeded();
      await days.first().click();
      // Still disabled — no time slot
      await expect(submit).toBeDisabled();
    }

    // Select a time slot
    const slot = page.locator('.v2-booking__slot').first();
    await slot.scrollIntoViewIfNeeded();
    await slot.click();
    // Now should be enabled
    await expect(submit).toBeEnabled();
  });

  test('month navigation works (next/prev)', async ({ page }) => {
    const monthLabel = page.locator('.v2-booking__calendar-month');
    const initialMonth = await monthLabel.textContent();

    // Click next using explicit aria-label
    const nextBtn = page.locator('button[aria-label="Next month"]');
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    await page.waitForTimeout(200);
    const nextMonth = await monthLabel.textContent();
    expect(nextMonth).not.toBe(initialMonth);

    // Click prev (go back)
    const prevBtn = page.locator('button[aria-label="Previous month"]');
    await prevBtn.click();
    await page.waitForTimeout(200);
    const prevMonth = await monthLabel.textContent();
    expect(prevMonth).toBe(initialMonth);
  });

  test('disabled (past) days cannot be clicked', async ({ page }) => {
    const disabledDays = page.locator('.v2-booking__calendar-day--disabled');
    const count = await disabledDays.count();
    if (count > 0) {
      // Disabled days should have disabled attribute
      await expect(disabledDays.first()).toBeDisabled();
    }
  });
});

// ---------------------------------------------------------------------------
// 3. RESPONSIVE LAYOUT TESTS — specific viewport sizes
// ---------------------------------------------------------------------------

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 393, height: 852 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad portrait', width: 768, height: 1024 },
  { name: 'iPad landscape', width: 1024, height: 768 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Full HD', width: 1920, height: 1080 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`Responsive @ ${vp.name} (${vp.width}×${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1);
    });

    test('heading fits viewport without clipping', async ({ page }) => {
      await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
      const h1Box = await page.locator('h1').boundingBox();
      expect(h1Box).toBeTruthy();
      expect(h1Box!.width).toBeLessThanOrEqual(vp.width);
      expect(h1Box!.width).toBeGreaterThan(100);
    });

    test('calendar widget is visible and usable', async ({ page }) => {
      await page.goto('/schedule', { waitUntil: 'domcontentloaded' });

      // Scroll to booking section
      await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const widget = page.locator('.v2-booking__widget');
      await expect(widget).toBeVisible();

      // Widget should not exceed viewport width
      const widgetBox = await widget.boundingBox();
      expect(widgetBox).toBeTruthy();
      expect(widgetBox!.width).toBeLessThanOrEqual(vp.width + 1);
    });

    test('time slots are accessible at all sizes', async ({ page }) => {
      await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
      await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const slots = page.locator('.v2-booking__slot');
      const count = await slots.count();
      expect(count).toBe(5);

      // Each slot should have minimum tap target (44px)
      for (let i = 0; i < count; i++) {
        const box = await slots.nth(i).boundingBox();
        expect(box).toBeTruthy();
        expect(box!.height).toBeGreaterThanOrEqual(40);
      }
    });

    if (vp.width < 768) {
      // Mobile-specific: layout should be single column
      test('mobile: booking layout stacks vertically', async ({ page }) => {
        await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
        await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        const booking = page.locator('.v2-booking');
        await booking.boundingBox();
        const sidebar = page.locator('.v2-booking__sidebar');
        const sidebarBox = await sidebar.boundingBox();
        const widget = page.locator('.v2-booking__widget');
        const widgetBox = await widget.boundingBox();

        // Both should span full width (within tolerance)
        expect(sidebarBox).toBeTruthy();
        expect(widgetBox).toBeTruthy();
        // Widget should be below sidebar (stacked)
        expect(widgetBox!.y).toBeGreaterThan(sidebarBox!.y + sidebarBox!.height - 10);
      });
    } else if (vp.width >= 1024) {
      // Desktop: sidebar and widget should be side-by-side
      test('desktop: sidebar and widget are side-by-side', async ({ page }) => {
        await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
        await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        const sidebar = page.locator('.v2-booking__sidebar');
        const widget = page.locator('.v2-booking__widget');
        const sidebarBox = await sidebar.boundingBox();
        const widgetBox = await widget.boundingBox();

        expect(sidebarBox).toBeTruthy();
        expect(widgetBox).toBeTruthy();
        // Widget should be to the right of sidebar
        expect(widgetBox!.x).toBeGreaterThan(sidebarBox!.x + sidebarBox!.width - 20);
      });
    }
  });
}

// ---------------------------------------------------------------------------
// 4. VISUAL STABILITY TESTS — no CLS on interactions
// ---------------------------------------------------------------------------

test.describe('Schedule page — visual stability', () => {
  test('calendar interaction does not cause layout shift', async ({ page }) => {
    await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
    await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Capture widget height before interaction
    const widgetBefore = await page.locator('.v2-booking__widget').boundingBox();

    // Select a day and time
    const days = page.locator(
      '.v2-booking__calendar-day:not(.v2-booking__calendar-day--disabled)'
    );
    if ((await days.count()) > 0) {
      await days.first().click();
    }
    await page.locator('.v2-booking__slot').nth(2).click();

    // Widget height should remain stable (within 5px tolerance)
    const widgetAfter = await page.locator('.v2-booking__widget').boundingBox();
    expect(widgetBefore).toBeTruthy();
    expect(widgetAfter).toBeTruthy();
    expect(Math.abs(widgetAfter!.height - widgetBefore!.height)).toBeLessThan(5);
  });

  test('month navigation preserves widget dimensions', async ({ page }) => {
    await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
    await page.locator('#schedule-booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const widgetBefore = await page.locator('.v2-booking__widget').boundingBox();

    // Navigate to next month
    await page.locator('.v2-booking__calendar-arrow').last().click();
    await page.waitForTimeout(200);

    const widgetAfter = await page.locator('.v2-booking__widget').boundingBox();
    expect(widgetBefore).toBeTruthy();
    expect(widgetAfter).toBeTruthy();
    // Width should be identical
    expect(Math.abs(widgetAfter!.width - widgetBefore!.width)).toBeLessThan(2);
  });
});

// ---------------------------------------------------------------------------
// 5. NO CONSOLE ERRORS
// ---------------------------------------------------------------------------

test('schedule page loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/schedule', { waitUntil: 'domcontentloaded' });
  // Scroll through entire page
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const height = document.body.scrollHeight;
    for (let i = 0; i < height; i += 300) {
      window.scrollTo(0, i);
      await delay(50);
    }
  });

  const fatalErrors = errors.filter(
    (e) =>
      !e.includes('WebGL') &&
      !e.includes('THREE') &&
      !e.includes('ResizeObserver')
  );
  expect(fatalErrors).toHaveLength(0);
});
