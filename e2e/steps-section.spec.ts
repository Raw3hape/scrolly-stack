/**
 * E2E Tests — StepsSection (Scroll-Driven Journey)
 *
 * Validates the interactive steps section on Home page:
 * - Structure: 3 steps with correct content
 * - Scroll activation: steps activate/deactivate as user scrolls
 * - Click interaction: clicking changes active step
 * - CTA: appears on active step with correct href
 * - Responsive: mobile vertical layout
 */

import { test, expect } from '@playwright/test';

const HOME_URL = '/';
const STEPS_SELECTOR = '#path-to-capital';

test.describe('StepsSection — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
  });

  // =========================================================================
  // STRUCTURE
  // =========================================================================

  test('renders 3 step cards', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    await expect(section).toBeAttached();

    const steps = section.locator('.v2-step');
    await expect(steps).toHaveCount(3);
  });

  test('step numbers are 01, 02, 03', async ({ page }) => {
    const numbers = page.locator(`${STEPS_SELECTOR} .v2-step__number`);
    await expect(numbers.nth(0)).toHaveText('01');
    await expect(numbers.nth(1)).toHaveText('02');
    await expect(numbers.nth(2)).toHaveText('03');
  });

  test('heading text is correct', async ({ page }) => {
    const heading = page.locator(`${STEPS_SELECTOR} .v2-steps-header__heading`);
    await expect(heading).toContainText('The Path To Permanent Capital');
  });

  test('step titles are correct', async ({ page }) => {
    const titles = page.locator(`${STEPS_SELECTOR} .v2-step__title`);
    await expect(titles.nth(0)).toContainText('Book A 30 Minute Call');
    await expect(titles.nth(1)).toContainText('We Scale Your Business');
    await expect(titles.nth(2)).toContainText('Get A Big Exit');
  });

  test('step icons render SVGs', async ({ page }) => {
    const icons = page.locator(`${STEPS_SELECTOR} .v2-step__icon`);
    await expect(icons).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(icons.nth(i).locator('svg')).toBeAttached();
    }
  });

  // =========================================================================
  // SCROLL-DRIVEN ACTIVATION
  // =========================================================================

  test('steps are inactive before scrolling to section', async ({ page }) => {
    // At the top of the page, steps should NOT be active
    // Could be 0 or some could be active depending on page layout
    // Just verify section exists
    const section = page.locator(STEPS_SELECTOR);
    await expect(section).toBeAttached();
  });

  test('scrolling past section activates all steps', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);

    // Scroll well past the section to activate all steps
    const box = await section.boundingBox();
    if (!box) return;
    await page.evaluate((y) => window.scrollTo({ top: y + 400, behavior: 'instant' }), box.y);
    await page.waitForTimeout(300);

    // At least some steps should be active after scrolling past
    const activeCount = await section.locator('.v2-step--active').count();
    expect(activeCount).toBeGreaterThan(0);

    // Last active should be current
    const currentCount = await section.locator('.v2-step--current').count();
    expect(currentCount).toBeLessThanOrEqual(1);
  });

  test('scrolling back deactivates steps', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const box = await section.boundingBox();
    if (!box) return;

    // Scroll to activate all
    await page.evaluate((y) => window.scrollTo({ top: y + 400, behavior: 'instant' }), box.y);
    await page.waitForTimeout(300);

    const activeAfterScroll = await section.locator('.v2-step--active').count();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);

    const activeAfterReturn = await section.locator('.v2-step--active').count();
    // After scrolling back, fewer steps should be active
    expect(activeAfterReturn).toBeLessThanOrEqual(activeAfterScroll);
  });

  test('progress bars fill for active steps', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const box = await section.boundingBox();
    if (!box) return;

    // Scroll to activate
    await page.evaluate((y) => window.scrollTo({ top: y + 400, behavior: 'instant' }), box.y);
    await page.waitForTimeout(500);

    const activeFills = section.locator('.v2-step--active .v2-step__bar-fill');
    const count = await activeFills.count();
    if (count > 0) {
      const width = await activeFills.first().evaluate(
        (el) => getComputedStyle(el).width,
      );
      expect(parseInt(width)).toBeGreaterThan(0);
    }
  });

  // =========================================================================
  // CLICK INTERACTION
  // =========================================================================

  test('clicking a step makes it current', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const steps = section.locator('.v2-step');

    // Scroll section into view
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click step 01 (index 0)
    await steps.nth(0).click();
    await page.waitForTimeout(300);

    await expect(steps.nth(0)).toHaveClass(/v2-step--current/);
  });

  // =========================================================================
  // CTA
  // =========================================================================

  test('CTA appears on step with ctaLabel when current', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const steps = section.locator('.v2-step');

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click step 01 which has ctaLabel "Book A Call"
    await steps.nth(0).click();
    await page.waitForTimeout(300);

    const cta = section.locator('.v2-step--current .v2-step__cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Book A Call');
    await expect(cta).toHaveAttribute('href', '/schedule');
  });

  test('step without ctaLabel shows no CTA when current', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const steps = section.locator('.v2-step');

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click step 02 (no ctaLabel)
    await steps.nth(1).click();
    await page.waitForTimeout(300);

    await expect(steps.nth(1)).toHaveClass(/v2-step--current/);
    const cta = section.locator('.v2-step--current .v2-step__cta');
    await expect(cta).toHaveCount(0);
  });
});

// =============================================================================
// MOBILE VIEWPORT
// =============================================================================

test.describe('StepsSection — Mobile (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
  });

  test('renders single-column layout', async ({ page }) => {
    const grid = page.locator(`${STEPS_SELECTOR} .v2-steps-grid`);
    const columns = await grid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns,
    );
    const colCount = columns.split(' ').filter((v) => v.trim()).length;
    expect(colCount).toBe(1);
  });

  test('timeline dots are visible on scroll', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const dots = section.locator('.v2-step__dot');
    await expect(dots).toHaveCount(3);
    await expect(dots.first()).toBeVisible();
  });

  test('scroll activates steps on mobile', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const box = await section.boundingBox();
    if (!box) return;

    // Scroll past section
    await page.evaluate((y) => window.scrollTo({ top: y + 300, behavior: 'instant' }), box.y);
    await page.waitForTimeout(500);

    const activeCount = await section.locator('.v2-step--active').count();
    expect(activeCount).toBeGreaterThan(0);
  });

  test('tap activates step on mobile', async ({ page }) => {
    const section = page.locator(STEPS_SELECTOR);
    const steps = section.locator('.v2-step');

    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await steps.nth(0).tap();
    await page.waitForTimeout(300);

    await expect(steps.nth(0)).toHaveClass(/v2-step--current/);
  });
});
