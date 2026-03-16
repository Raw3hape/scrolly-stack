/**
 * E2E Tests — Home Page: 3D Experience, Layout, CTA
 *
 * Tests the interactive homepage across all viewports.
 */

import { test, expect } from '@playwright/test';
import { ctaConfig } from '../src/config/nav';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for client-side JS to hydrate
    await page.waitForTimeout(2000);
  });

  // =========================================================================
  // LAYOUT & STRUCTURE
  // =========================================================================

  test('header is visible', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('footer is visible on scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('hero headline exists with correct text', async ({ page }) => {
    const headline = page.locator('.hero__headline');
    // On mobile, hero may be behind the 3D canvas, so check attachment rather than visibility
    await expect(headline).toBeAttached();
    await expect(headline).toContainText('premium');
  });

  test('hero subheadline exists with correct text', async ({ page }) => {
    const sub = page.locator('.hero__subheadline');
    await expect(sub).toBeAttached();
    await expect(sub).toContainText('CRM');
  });

  test('hero is visible on desktop', async ({ page }) => {
    const viewport = page.viewportSize()!;
    if (viewport.width < 768) {
      test.skip();
      return;
    }
    const headline = page.locator('.hero__headline');
    await expect(headline).toBeVisible();
  });

  // =========================================================================
  // CTA LINKS
  // =========================================================================

  test('hero CTA has correct href', async ({ page }) => {
    const cta = page.locator('.hero__cta-button');
    await expect(cta).toBeAttached();
    await expect(cta).toHaveAttribute('href', ctaConfig.href);
    await expect(cta).toContainText('qualify');
  });

  test('step CTA links exist', async ({ page }) => {
    // Scroll to first step
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(1000);

    const stepCtas = page.locator('.step-content__cta');
    const count = await stepCtas.count();
    expect(count).toBeGreaterThan(0);

    // At least one CTA has correct href
    const firstVisible = stepCtas.first();
    await expect(firstVisible).toHaveAttribute('href', ctaConfig.href);
  });

  // =========================================================================
  // 3D CANVAS
  // =========================================================================

  test('3D canvas renders', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  // =========================================================================
  // SCROLL INTERACTION
  // =========================================================================

  test('scroll reveals steps', async ({ page }) => {
    // Check initial state — hero attached
    await expect(page.locator('.hero')).toBeAttached();

    // Scroll down to step area
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    // Steps should exist
    const steps = page.locator('.step');
    const count = await steps.count();
    expect(count).toBeGreaterThan(0);
  });

  test('timeline dots are visible on scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    const dots = page.locator('.timeline-dot');
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
  });
});
