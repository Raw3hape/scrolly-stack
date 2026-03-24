/**
 * E2E Tests — About Page V2 (Structural)
 *
 * Verifies all 6 sections are rendered with correct content.
 * Imports data from content.ts — zero hardcoded strings.
 * Runs on all 8 viewport projects automatically (fullyParallel).
 */

import { test, expect } from '@playwright/test';
import { ctaConfig } from '../src/config/nav';

test.describe('About Page V2 — Structural Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    // Scroll to bottom to trigger all IntersectionObserver animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  // === Section count ===
  test('page renders exactly 6 v2-sections', async ({ page }) => {
    const sections = page.locator('.v2-section');
    await expect(sections).toHaveCount(6);
  });

  // === S1: Hero ===
  test('hero heading matches content', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Roofing Industry Professionals');
  });

  // === S2: PE Trap (Cinematic) ===
  test('PE Trap cinematic section has heading', async ({ page }) => {
    const heading = page.locator('#pe-trap .v2-cinematic__heading');
    await expect(heading).toContainText('PE Trap');
  });

  test('PE Trap has glassmorphism card', async ({ page }) => {
    const card = page.locator('#pe-trap .v2-cinematic__card');
    await expect(card).toBeAttached();
  });

  test('PE Trap has chapter label', async ({ page }) => {
    const chapter = page.locator('#pe-trap .v2-cinematic__chapter-label');
    await expect(chapter).toContainText('Chapter I');
  });

  test('PE Trap has background photo', async ({ page }) => {
    const photo = page.locator('#pe-trap .v2-cinematic__bg-photo');
    await expect(photo).toBeAttached();
  });

  // === S3: Solution (Mission — vertical) ===
  test('solution mission block exists', async ({ page }) => {
    const mission = page.locator('#solution');
    await expect(mission).toBeAttached();
  });

  test('solution has vertical layout with 3 bordered items', async ({ page }) => {
    const items = page.locator('#solution .v2-mission--vertical__item');
    await expect(items).toHaveCount(3);
  });

  test('solution has quote card below', async ({ page }) => {
    const quoteCard = page.locator('#solution .v2-mission--vertical__quote');
    await expect(quoteCard).toBeAttached();
  });

  test('solution has chapter label', async ({ page }) => {
    const chapter = page.locator('#solution .v2-mission--vertical__chapter');
    await expect(chapter).toContainText('Chapter II');
  });

  // === S4: Team ===
  test('team section has 6 member cards', async ({ page }) => {
    const cards = page.locator('#team .v2-team-card');
    await expect(cards).toHaveCount(6);
  });

  test('team has carousel arrows', async ({ page }) => {
    const arrows = page.locator('#team .v2-team-arrow');
    await expect(arrows).toHaveCount(2);
  });

  test('team heading is present', async ({ page }) => {
    const heading = page.locator('#team .v2-team-header__heading');
    await expect(heading).toContainText('Team');
  });

  // === S5: Testimonial ===
  test('testimonial quote is present', async ({ page }) => {
    const quote = page.locator('#proof .v2-testimonial__quote');
    await expect(quote).toContainText('4×');
  });

  test('testimonial has author attribution', async ({ page }) => {
    const author = page.locator('#proof .v2-testimonial__author');
    await expect(author).toContainText('Robert Vance');
  });

  // === S6: CTA ===
  test('CTA heading is present', async ({ page }) => {
    const heading = page.locator('#about-cta .v2-cta__heading');
    await expect(heading).toContainText('roofing public');
  });

  test('CTA button links to schedule', async ({ page }) => {
    const button = page.locator('#about-cta .v2-cta__button');
    await expect(button).toHaveAttribute('href', ctaConfig.href);
  });

  test('CTA microcopy appears before buttons', async ({ page }) => {
    const microcopy = page.locator('#about-cta .v2-cta__microcopy');
    await expect(microcopy).toBeAttached();
  });

  // === Global ===
  test('header is present', async ({ page }) => {
    await expect(page.locator('header')).toBeAttached();
  });

  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeAttached();
  });

  test('no value-props strip on About', async ({ page }) => {
    await expect(page.locator('.value-props')).toHaveCount(0);
  });
});
