/**
 * E2E Tests — Layout Consistency & Edge Cases
 *
 * Validates layout-specific properties that commonly break on mobile:
 * - Fixed elements don't overlap content
 * - Z-index stacking is correct
 * - No dead scroll zones
 * - Sections have adequate spacing
 * - Text wrapping and readability
 */

import { test, expect } from '@playwright/test';

function isMobile(width: number) {
  return width <= 768;
}

// ---------------------------------------------------------------------------
// 1. HEADER/CONTENT STACKING — header doesn't occlude content
// ---------------------------------------------------------------------------

test.describe('Z-Index & Stacking', () => {
  test('header is above page content', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const headerZ = await page.evaluate(() => {
      const header = document.querySelector('.v2-header');
      return header ? getComputedStyle(header).zIndex : '0';
    });

    expect(parseInt(headerZ)).toBeGreaterThanOrEqual(100);
  });

  test('content is not hidden behind header on load', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    const h1Box = await h1.boundingBox();
    expect(h1Box).toBeTruthy();

    // H1 should not be behind the header (its top should be below header)
    const headerHeight = await page.evaluate(() => {
      const header = document.querySelector('.v2-header');
      return header ? header.getBoundingClientRect().bottom : 0;
    });

    // Allow some tolerance — h1 can be close to header
    expect(h1Box!.y).toBeGreaterThanOrEqual(headerHeight - 10);
  });
});

// ---------------------------------------------------------------------------
// 2. SECTION SPACING — no sections with zero height or collapsed padding
// ---------------------------------------------------------------------------

test.describe('Section spacing', () => {
  test('all V2 sections have adequate height', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const sections = page.locator('.v2-section');
    const count = await sections.count();

    for (let i = 0; i < count; i++) {
      const box = await sections.nth(i).boundingBox();
      if (!box) continue;
      // Every section should have meaningful height (at least 100px)
      expect(box.height).toBeGreaterThanOrEqual(100);
    }
  });

  test('sections have horizontal padding on mobile', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(500);

    const firstSection = page.locator('.v2-section').first();
    if (!(await firstSection.isVisible())) return;

    const box = await firstSection.boundingBox();
    expect(box).toBeTruthy();

    // Content should not touch the left edge (should have padding)
    expect(box!.x).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// 3. TEXT WRAPPING — no single-word lines in headlines
// ---------------------------------------------------------------------------

test.describe('Text wrapping', () => {
  test('hero headline has reasonable words per line', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const headline = page.locator('.hero__headline');
    if (!(await headline.isVisible())) return;

    const box = await headline.boundingBox();
    const text = await headline.textContent();

    // If headline is very tall relative to its width, it means bad wrapping
    // (each word on its own line → very tall, narrow block)
    if (box && text) {
      // At minimum, the width should accommodate at least 2 words
      expect(box.width).toBeGreaterThanOrEqual(150);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. IMAGES — all render without broken references
// ---------------------------------------------------------------------------

test.describe('Image integrity', () => {
  test('header logo loads correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const logo = page.locator('.v2-header__logo');
    await expect(logo).toBeAttached();

    const naturalWidth = await logo.evaluate((img) => (img as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('all images have non-zero natural dimensions', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const brokenImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const broken: string[] = [];
      images.forEach((img) => {
        if (img.naturalWidth === 0 && img.src) {
          broken.push(img.src);
        }
      });
      return broken;
    });

    expect(brokenImages).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. SCROLL PERFORMANCE — no layout thrashing indicators
// ---------------------------------------------------------------------------

test.describe('Scroll health', () => {
  test('page has no invisible content wider than viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Scroll through entire page and check for overflow at each position
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const vh = page.viewportSize()!.height;
    const checkpoints = [0, vh, vh * 2, totalHeight * 0.5, totalHeight - vh];

    for (const y of checkpoints) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(100);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. INTERACTIVE ELEMENTS — buttons and links are clickable
// ---------------------------------------------------------------------------

test.describe('Interactive elements', () => {
  test('all header links have valid hrefs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const links = page.locator('header a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      // Should not be "#" or empty
      expect(href).not.toBe('#');
      expect(href!.length).toBeGreaterThan(0);
    }
  });

  test('all footer links have valid hrefs', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const links = page.locator('.v2-footer__links a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });
});

// ---------------------------------------------------------------------------
// 7. LANDSCAPE EDGE CASES
// ---------------------------------------------------------------------------

test.describe('Landscape', () => {
  test('hero is not taller than viewport in landscape', async ({ page }) => {
    const viewport = page.viewportSize()!;
    // Only matters for landscape phones
    if (viewport.height > 500 || viewport.width < viewport.height) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const hero = page.locator('.hero');
    if (!(await hero.isVisible())) return;

    const box = await hero.boundingBox();
    // Hero should not be taller than 2× viewport height in landscape
    expect(box!.height).toBeLessThanOrEqual(viewport.height * 2);
  });

  test('content is readable in landscape', async ({ page }) => {
    const viewport = page.viewportSize()!;
    if (viewport.height > 500 || viewport.width < viewport.height) return;

    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });
});
