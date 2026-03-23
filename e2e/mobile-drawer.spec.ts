/**
 * E2E Tests — Mobile Drawer Navigation
 *
 * Tests the hamburger menu, drawer open/close, navigation, scroll lock,
 * and escape key handling. Only runs on mobile viewports.
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Drawer', () => {
  test.beforeEach(async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (vw > 768) {
      test.skip();
      return;
    }
    // Use /about to avoid 3D TransitionLoader blocking
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
  });

  test('burger button opens the drawer', async ({ page }) => {
    const burger = page.locator('.v2-header__burger');
    await expect(burger).toBeVisible();

    await burger.click();
    await page.waitForTimeout(400); // Wait for slide animation

    const drawer = page.locator('.v2-drawer');
    await expect(drawer).toBeVisible();

    // Drawer should have the --open class
    const hasOpen = await drawer.evaluate(el => el.classList.contains('v2-drawer--open'));
    expect(hasOpen).toBe(true);
  });

  test('drawer shows navigation links', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const links = page.locator('.v2-drawer__link');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // All links should be visible
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toBeVisible();
    }
  });

  test('drawer shows CTA button', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const cta = page.locator('.v2-drawer__cta');
    await expect(cta).toBeVisible();
  });

  test('clicking a drawer link navigates and closes drawer', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const firstLink = page.locator('.v2-drawer__link').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();

    await firstLink.click();
    await page.waitForURL(href!, { timeout: 5000 });

    // Drawer should be closed
    const drawer = page.locator('.v2-drawer');
    const hasOpen = await drawer.evaluate(el => el.classList.contains('v2-drawer--open'));
    expect(hasOpen).toBe(false);
  });

  test('clicking overlay closes the drawer', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    // Click on the overlay (outside the drawer)
    const overlay = page.locator('.v2-header__overlay');
    await overlay.click({ position: { x: 10, y: 200 } });
    await page.waitForTimeout(400);

    const drawer = page.locator('.v2-drawer');
    const hasOpen = await drawer.evaluate(el => el.classList.contains('v2-drawer--open'));
    expect(hasOpen).toBe(false);
  });

  test('Escape key closes the drawer', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    const drawer = page.locator('.v2-drawer');
    const hasOpen = await drawer.evaluate(el => el.classList.contains('v2-drawer--open'));
    expect(hasOpen).toBe(false);
  });

  test('body scroll is locked when drawer is open', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
  });

  test('body scroll is restored when drawer is closed', async ({ page }) => {
    // Open
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);
    // Close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('');
  });

  test('burger animates to X when open', async ({ page }) => {
    const burger = page.locator('.v2-header__burger');
    await burger.click();
    await page.waitForTimeout(400);

    const hasOpenClass = await burger.evaluate(
      el => el.classList.contains('v2-header__burger--open')
    );
    expect(hasOpenClass).toBe(true);
  });

  test('drawer links have sufficient touch target size', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const links = page.locator('.v2-drawer__link');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('drawer does not overflow viewport width', async ({ page }) => {
    await page.locator('.v2-header__burger').click();
    await page.waitForTimeout(400);

    const drawer = page.locator('.v2-drawer');
    const box = await drawer.boundingBox();
    const vw = page.viewportSize()!.width;

    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThanOrEqual(vw);
  });
});
