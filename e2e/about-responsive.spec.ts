/**
 * E2E Tests — About Page V2 (Responsive Layout)
 *
 * Verifies correct layout behavior at key breakpoints.
 * Runs on all 8 viewport projects for comprehensive responsive coverage.
 */

import { test, expect } from '@playwright/test';

test.describe('About Page V2 — Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
  });

  // === No horizontal overflow ===
  test('no horizontal scrollbar at any viewport', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(overflows).toBe(true);
  });

  // === All sections visible when scrolled ===
  test('all 6 sections are scrollable-to', async ({ page }) => {
    const sectionIds = ['about-hero', 'pe-trap', 'solution', 'team', 'proof', 'about-cta'];
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
  });

  // === Sections have non-zero padding ===
  test('all sections have non-zero padding', async ({ page }) => {
    const sections = page.locator('.v2-section');
    const count = await sections.count();
    for (let i = 0; i < count; i++) {
      const padding = await sections
        .nth(i)
        .evaluate((el) => parseFloat(window.getComputedStyle(el).paddingTop));
      // CTA section has 0 padding (wrapper handles it) — skip check
      if (padding === 0) {
        const isCta = await sections.nth(i).evaluate((el) => el.classList.contains('v2-cta'));
        if (!isCta) {
          expect(padding).toBeGreaterThan(0);
        }
      }
    }
  });

  // === Team carousel has correct card count ===
  test('team carousel shows all 6 member cards', async ({ page }) => {
    const cards = page.locator('#team .v2-team-card');
    await expect(cards).toHaveCount(6);
  });

  // === PE Trap cinematic card is visible ===
  test('PE trap cinematic card is visible', async ({ page }) => {
    const peSection = page.locator('#pe-trap');
    await peSection.scrollIntoViewIfNeeded();
    const card = peSection.locator('.v2-cinematic__card');
    await expect(card).toBeVisible();
    const text = await card.textContent();
    expect(text?.length).toBeGreaterThan(10);
  });

  // === Hero editorial image is visible on all viewports ===
  test('hero editorial image is visible', async ({ page }) => {
    const heroImage = page.locator('#about-hero .v2-hero__image-col');
    await expect(heroImage).toBeVisible();
  });

  // === Header stays accessible ===
  test('header is visible at top of page', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  // === Footer visible at bottom ===
  test('footer is visible when scrolled to bottom', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
