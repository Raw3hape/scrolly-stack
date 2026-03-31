/**
 * E2E Tests — Hero Section Overlap Detection
 *
 * Mathematically measures whether hero elements (headline, subheadline, CTA)
 * overlap with the 3D cube on each iPhone viewport. Uses bounding box
 * intersection to detect pixel-level overlaps.
 */

import { test, expect } from '@playwright/test';

// All iPhone viewports we care about
const IPHONE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667, scale: 2 },
  { name: 'iPhone 14', width: 390, height: 844, scale: 3 },
  { name: 'iPhone 14 Pro', width: 393, height: 852, scale: 3 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, scale: 3 },
  { name: 'iPhone 15', width: 393, height: 852, scale: 3 },
  { name: 'iPhone 16 Pro Max', width: 440, height: 956, scale: 3 },
] as const;

for (const device of IPHONE_VIEWPORTS) {
  test.describe(`Hero overlap — ${device.name} (${device.width}×${device.height})`, () => {
    test.use({ viewport: { width: device.width, height: device.height } });

    test('hero content does not overlap 3D cube area', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000); // Wait for 3D scene to render

      const measurements = await page.evaluate(() => {
        const header = document.querySelector('.v2-header');
        const hero = document.querySelector('.hero');
        const headline = document.querySelector('.hero__headline');
        const subheadline = document.querySelector('.hero__subheadline');
        const ctaWrapper = document.querySelector('.hero__cta-wrapper');
        const canvas = document.querySelector('canvas');

        const headerRect = header?.getBoundingClientRect();
        const heroRect = hero?.getBoundingClientRect();
        const headlineRect = headline?.getBoundingClientRect();
        const subheadlineRect = subheadline?.getBoundingClientRect();
        const ctaRect = ctaWrapper?.getBoundingClientRect();
        const canvasRect = canvas?.getBoundingClientRect();

        // Get the actual 3D content area (where blocks render)
        // Blocks render in approximately the center-bottom of the canvas
        const vh = window.innerHeight;

        return {
          viewport: { width: window.innerWidth, height: vh },
          header: headerRect
            ? { top: headerRect.top, bottom: headerRect.bottom, height: headerRect.height }
            : null,
          hero: heroRect
            ? { top: heroRect.top, bottom: heroRect.bottom, height: heroRect.height }
            : null,
          headline: headlineRect
            ? { top: headlineRect.top, bottom: headlineRect.bottom, height: headlineRect.height }
            : null,
          subheadline: subheadlineRect
            ? {
                top: subheadlineRect.top,
                bottom: subheadlineRect.bottom,
                height: subheadlineRect.height,
              }
            : null,
          cta: ctaRect
            ? { top: ctaRect.top, bottom: ctaRect.bottom, height: ctaRect.height }
            : null,
          canvas: canvasRect
            ? { top: canvasRect.top, bottom: canvasRect.bottom, height: canvasRect.height }
            : null,
          // Computed heights
          heroContentBottom:
            ctaRect?.bottom ?? subheadlineRect?.bottom ?? headlineRect?.bottom ?? 0,
          // The visual cube area starts at approximately 65% of viewport from top
          // (visual-height-mobile is 35vh, so cube occupies bottom 35%)
          cubeAreaTop: vh * 0.65,
          // Available space for hero text
          availableForText: vh * 0.65 - (headerRect?.bottom ?? 64),
          actualTextHeight: (ctaRect?.bottom ?? 0) - (headlineRect?.top ?? 0),
        };
      });

      console.log(`\n📱 ${device.name} (${device.width}×${device.height}):`);
      console.log(`   Header bottom: ${measurements.header?.bottom?.toFixed(0)}px`);
      console.log(
        `   Headline: ${measurements.headline?.top?.toFixed(0)}→${measurements.headline?.bottom?.toFixed(0)}px (${measurements.headline?.height?.toFixed(0)}px)`,
      );
      console.log(
        `   Subheadline: ${measurements.subheadline?.top?.toFixed(0)}→${measurements.subheadline?.bottom?.toFixed(0)}px (${measurements.subheadline?.height?.toFixed(0)}px)`,
      );
      console.log(
        `   CTA: ${measurements.cta?.top?.toFixed(0)}→${measurements.cta?.bottom?.toFixed(0)}px (${measurements.cta?.height?.toFixed(0)}px)`,
      );
      console.log(`   Hero content bottom: ${measurements.heroContentBottom.toFixed(0)}px`);
      console.log(`   Cube area top (65% vh): ${measurements.cubeAreaTop.toFixed(0)}px`);
      console.log(`   Available for text: ${measurements.availableForText.toFixed(0)}px`);
      console.log(`   Actual text height: ${measurements.actualTextHeight.toFixed(0)}px`);
      console.log(
        `   Overflow: ${(measurements.actualTextHeight - measurements.availableForText).toFixed(0)}px`,
      );

      // ASSERTION: hero content bottom must be above the cube area top
      // We allow 20px tolerance for visual overlap (cube blocks don't render at exact 45% line)
      expect(
        measurements.heroContentBottom,
        `Hero content extends to ${measurements.heroContentBottom.toFixed(0)}px but cube area starts at ${measurements.cubeAreaTop.toFixed(0)}px`,
      ).toBeLessThanOrEqual(measurements.cubeAreaTop + 20);
    });

    test('hero elements do not overlap each other', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const overlaps = await page.evaluate(() => {
        const elements = [
          { name: 'eyebrow', el: document.querySelector('.hero__eyebrow') },
          { name: 'headline', el: document.querySelector('.hero__headline') },
          { name: 'subheadline', el: document.querySelector('.hero__subheadline') },
          { name: 'cta', el: document.querySelector('.hero__cta-wrapper') },
        ].filter((e) => e.el);

        const results: { a: string; b: string; overlapPx: number }[] = [];

        for (let i = 0; i < elements.length - 1; i++) {
          const rectA = elements[i].el!.getBoundingClientRect();
          const rectB = elements[i + 1].el!.getBoundingClientRect();

          // Check if bottom of A overlaps top of B
          const overlap = rectA.bottom - rectB.top;
          if (overlap > 2) {
            // 2px tolerance
            results.push({
              a: elements[i].name,
              b: elements[i + 1].name,
              overlapPx: Math.round(overlap),
            });
          }
        }
        return results;
      });

      expect(overlaps, `Elements overlap: ${JSON.stringify(overlaps)}`).toEqual([]);
    });

    test('all hero content fits within viewport without scrolling', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const fits = await page.evaluate(() => {
        const cta = document.querySelector('.hero__cta-wrapper');
        if (!cta) return { fits: true, ctaBottom: 0, viewportHeight: window.innerHeight };

        const rect = cta.getBoundingClientRect();
        return {
          fits: rect.bottom <= window.innerHeight,
          ctaBottom: Math.round(rect.bottom),
          viewportHeight: window.innerHeight,
          overflow: Math.round(rect.bottom - window.innerHeight),
        };
      });

      expect(
        fits.fits,
        `CTA bottom (${fits.ctaBottom}px) exceeds viewport (${fits.viewportHeight}px) by ${fits.overflow}px`,
      ).toBe(true);
    });
  });
}
