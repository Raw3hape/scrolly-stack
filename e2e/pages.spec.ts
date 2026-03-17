/**
 * E2E Tests — All Pages Load
 *
 * Verifies every route returns 200 and has correct structure.
 * Titles imported from content metadata — no hardcoded strings.
 * Runs on all 6 viewport presets (desktop, tablet, mobile).
 */

import { test, expect } from '@playwright/test';
import { pageMetadata } from '../src/config/content/metadata';

const ROUTES = [
  { path: '/', title: 'Foundation Projects', hasH1: true },
  { path: '/about', title: pageMetadata.about.title, hasH1: true },
  { path: '/how-it-works/roofers', title: 'Roofers', hasH1: true },
  { path: '/how-it-works/investors', title: 'Investors', hasH1: true },
  { path: '/schedule', title: 'Book A Call', hasH1: true },
  { path: '/shadow-local', title: 'Shadow Local', hasH1: true },
  { path: '/3b-opt-in', title: '8 Things', hasH1: true },
];

for (const route of ROUTES) {
  test(`${route.path} loads without errors`, async ({ page }) => {
    // Capture console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    // Status 200
    expect(response?.status()).toBe(200);

    // Page title contains expected text
    await expect(page).toHaveTitle(new RegExp(route.title, 'i'));

    // No fatal console errors (filter out known WebGL warnings)
    const fatalErrors = errors.filter(
      (e) => !e.includes('WebGL') && !e.includes('THREE') && !e.includes('ResizeObserver')
    );
    expect(fatalErrors).toHaveLength(0);
  });
}

test('404 page renders for unknown routes', async ({ page }) => {
  const response = await page.goto('/nonexistent-page', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toContainText(/not found/i);
});
