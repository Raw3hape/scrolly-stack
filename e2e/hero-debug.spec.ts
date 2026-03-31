/**
 * Debug script — take screenshots of the hero on multiple mobile viewports
 * and dump exact element positions.
 *
 * Run: npx playwright test e2e/hero-debug.spec.ts --project=desktop-1440
 */

import { test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'iPhone-SE', width: 375, height: 667 },
  { name: 'iPhone-14', width: 390, height: 844 },
  { name: 'iPhone-14-Pro-Max', width: 430, height: 932 },
] as const;

for (const device of VIEWPORTS) {
  test(`screenshot ${device.name}`, async ({ page }) => {
    await page.setViewportSize({ width: device.width, height: device.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000); // Wait for 3D to render

    // Take full-page screenshot
    await page.screenshot({
      path: `/tmp/hero-${device.name}.png`,
      fullPage: false, // viewport only — what the user sees
    });

    // Dump all element positions
    const data = await page.evaluate(() => {
      const getRect = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
          zIndex: style.zIndex,
          position: style.position,
          background: style.background?.slice(0, 60),
          overflow: style.overflow,
        };
      };

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        header: getRect('.v2-header'),
        colContent: getRect('.col-content'),
        colVisual: getRect('.col-visual'),
        overlay: getRect('.overlay'),
        hero: getRect('.hero'),
        eyebrow: getRect('.hero__eyebrow'),
        headline: getRect('.hero__headline'),
        subheadline: getRect('.hero__subheadline'),
        ctaWrapper: getRect('.hero__cta-wrapper'),
        ctaButton: getRect('.hero__cta-button'),
        canvas: getRect('canvas'),
        firstStep: getRect('.step'),
      };
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 ${device.name} (${device.width}×${device.height})`);
    console.log(`${'='.repeat(60)}`);
    for (const [name, rect] of Object.entries(data)) {
      if (name === 'viewport') {
        console.log(`  viewport: ${JSON.stringify(rect)}`);
        continue;
      }
      if (!rect) {
        console.log(`  ${name}: NOT FOUND`);
        continue;
      }
      const r = rect as Record<string, unknown>;
      console.log(
        `  ${name.padEnd(14)} top=${String(r.top).padEnd(5)} bottom=${String(r.bottom).padEnd(5)} h=${String(r.height).padEnd(5)} z=${r.zIndex} pos=${r.position} bg=${String(r.background).slice(0, 30)}`,
      );
    }
    console.log(`\n  Screenshot: /tmp/hero-${device.name}.png`);
  });
}
