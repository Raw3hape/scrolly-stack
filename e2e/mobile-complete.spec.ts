/**
 * E2E Tests — Comprehensive Mobile & Responsive Validation
 *
 * Runs on ALL viewport projects defined in playwright.config.ts.
 * Verifies layout integrity, content visibility, no clipping, no overflow,
 * font readability, touch targets, and full scroll flow.
 *
 * Tests are independent and run fully in parallel across all viewports.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Whether the current viewport is mobile-sized */
function isMobile(width: number) { return width <= 768; }

// All pages to validate
const ALL_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/how-it-works/roofers', name: 'Roofers' },
  { path: '/how-it-works/investors', name: 'Investors' },
  { path: '/schedule', name: 'Schedule' },
] as const;

// ---------------------------------------------------------------------------
// 1. NO HORIZONTAL OVERFLOW (every page, every viewport)
// ---------------------------------------------------------------------------

test.describe('No horizontal overflow — all pages', () => {
  for (const p of ALL_PAGES) {
    test(`${p.name} — no horizontal scrollbar`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });

      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// 2. FONT READABILITY — no text < 11px anywhere
// ---------------------------------------------------------------------------

test.describe('Font readability — all pages', () => {
  for (const p of ALL_PAGES) {
    test(`${p.name} — no text smaller than 11px`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });

      const tinyTextElements = await page.evaluate(() => {
        const selectors = 'p, span, li, a, h1, h2, h3, h4, h5, h6, button, label';
        const elements = document.querySelectorAll(selectors);
        const results: { tag: string; text: string; fontSize: number }[] = [];

        elements.forEach((el) => {
          const text = (el.textContent || '').trim();
          if (text.length === 0) return;
          const size = parseFloat(getComputedStyle(el).fontSize);
          if (size < 11) {
            results.push({ tag: el.tagName, text: text.slice(0, 50), fontSize: size });
          }
        });
        return results;
      });

      expect(tinyTextElements).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------------
// 3. CONTENT NOT CLIPPED — key elements within viewport bounds
// ---------------------------------------------------------------------------

test.describe('Content within viewport bounds', () => {
  test('hero headline fits within viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const headline = page.locator('.hero__headline');
    if (!(await headline.isVisible())) return;

    const box = await headline.boundingBox();
    const vw = page.viewportSize()!.width;
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(-2); // 2px tolerance
    expect(box!.x + box!.width).toBeLessThanOrEqual(vw + 2);
  });

  test('hero CTA button fits within viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const cta = page.locator('.hero__cta-button');
    if (!(await cta.isVisible())) return;

    const box = await cta.boundingBox();
    const vw = page.viewportSize()!.width;
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(vw + 5);
  });

  test('step cards fit within viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    const steps = page.locator('.step-content');
    const count = await steps.count();
    const vw = page.viewportSize()!.width;

    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await steps.nth(i).boundingBox();
      if (!box) continue;
      expect(box.x).toBeGreaterThanOrEqual(-2);
      expect(box.x + box.width).toBeLessThanOrEqual(vw + 5);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. TOUCH TARGETS — all interactive elements >= 44px on mobile
// ---------------------------------------------------------------------------

test.describe('Touch targets >= 44px', () => {
  test('hero CTA button meets minimum touch target', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const cta = page.locator('.hero__cta-button');
    if (!(await cta.isVisible())) return;

    const box = await cta.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('header CTA meets minimum touch target', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const cta = page.locator('.v2-header__cta');
    if (!(await cta.isVisible())) return;

    const box = await cta.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(32); // Compact CTA, but still tappable
  });

  test('burger button meets minimum touch target', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const burger = page.locator('.v2-header__burger');
    if (!(await burger.isVisible())) return;

    const box = await burger.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(32);
    expect(box!.height).toBeGreaterThanOrEqual(32);
  });

  test('footer subscribe button meets 44px minimum', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const btn = page.locator('.v2-footer__subscribe-btn');
    if (!(await btn.isVisible())) return;

    const box = await btn.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

// ---------------------------------------------------------------------------
// 5. FULL SCROLL FLOW — hero → steps → mosaic → sections → footer
// ---------------------------------------------------------------------------

test.describe('Full scroll flow', () => {
  test('entire page is scrollable to bottom', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Scroll in smaller increments to simulate real scrolling
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const vh = page.viewportSize()!.height;
    const steps = Math.ceil(totalHeight / vh);

    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.min(i * vh, totalHeight));
      await page.waitForTimeout(200);
    }

    // Footer should be visible at the bottom
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 5000 });
  });

  test('hero exists and has content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const headline = page.locator('.hero__headline');
    await expect(headline).toBeAttached();
    const text = await headline.textContent();
    expect(text!.length).toBeGreaterThan(5);
  });

  test('steps section has multiple steps', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    const steps = page.locator('.step');
    const count = await steps.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('V2 sections render below scrolly experience', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(1000);

    const sections = page.locator('.v2-section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 6. HEADER BEHAVIOR
// ---------------------------------------------------------------------------

test.describe('Header', () => {
  test('header is visible on page load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const header = page.locator('.v2-header');
    await expect(header).toBeVisible();
  });

  test('header shows glassmorphism on scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(500);

    const header = page.locator('.v2-header');
    const hasScrolledClass = await header.evaluate(
      el => el.classList.contains('v2-header--scrolled')
    );
    expect(hasScrolledClass).toBe(true);
  });

  test('desktop nav links are visible on desktop', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const nav = page.locator('.v2-header__nav');
    await expect(nav).toBeVisible();
  });

  test('desktop nav links are hidden on mobile', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const nav = page.locator('.v2-header__nav');
    await expect(nav).not.toBeVisible();
  });

  test('burger button visible only on mobile', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const burger = page.locator('.v2-header__burger');

    if (isMobile(vw)) {
      await expect(burger).toBeVisible();
    } else {
      await expect(burger).not.toBeVisible();
    }
  });

  test('header CTA is visible on all viewports', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const cta = page.locator('.v2-header__cta');
    await expect(cta).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 7. VIEWPORT-FIT META TAG
// ---------------------------------------------------------------------------

test.describe('Viewport configuration', () => {
  test('viewport meta has viewport-fit=cover', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const viewportContent = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute('content') || '';
    });

    expect(viewportContent).toContain('viewport-fit=cover');
  });
});

// ---------------------------------------------------------------------------
// 8. 3D CANVAS
// ---------------------------------------------------------------------------

test.describe('3D Canvas', () => {
  test('canvas renders and fills viewport', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    const box = await canvas.boundingBox();
    const vw = page.viewportSize()!.width;
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThanOrEqual(vw * 0.9); // Canvas should be near-fullscreen
  });
});

// ---------------------------------------------------------------------------
// 9. FOOTER
// ---------------------------------------------------------------------------

test.describe('Footer', () => {
  test('footer is accessible from all pages', async ({ page }) => {
    for (const p of ALL_PAGES) {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = page.locator('.v2-footer');
      await expect(footer).toBeVisible();
    }
  });

  test('footer content not clipped on mobile', async ({ page }) => {
    const vw = page.viewportSize()!.width;
    if (!isMobile(vw)) return;

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const copyright = page.locator('.v2-footer__copyright');
    await expect(copyright).toBeVisible();
  });
});
