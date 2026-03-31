/**
 * E2E Tests — All Pages Load
 *
 * Verifies every route returns 200 and has correct structure.
 * Runs on all 6 viewport presets (desktop, tablet, mobile).
 */

import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/', title: 'Foundation Projects', hasH1: false },
  { path: '/about', title: 'About', hasH1: true },
  { path: '/how-it-works/roofers', title: 'Roofers', hasH1: true },
  { path: '/how-it-works/investors', title: 'Invest', hasH1: true },
  { path: '/schedule', title: 'Schedule', hasH1: true },
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
      (e) => !e.includes('WebGL') && !e.includes('THREE') && !e.includes('ResizeObserver'),
    );
    expect(fatalErrors).toHaveLength(0);
  });
}

test('404 page renders for unknown routes', async ({ page }) => {
  const response = await page.goto('/nonexistent-page', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toContainText(/not found/i);
});

test('/v2 redirects to /', async ({ page }) => {
  await page.goto('/v2', { waitUntil: 'domcontentloaded' });
  expect(page.url()).toContain('localhost:3000');
  // After redirect, should be at root
  expect(new URL(page.url()).pathname).toBe('/');
});

test('/v1-archive is not publicly routable', async ({ page }) => {
  const response = await page.goto('/v1-archive', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
});
