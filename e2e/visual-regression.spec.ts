/**
 * Visual Regression Test — 3D Cube Stability
 *
 * Takes screenshots at 12 key scroll positions across the full scroll journey,
 * then compares forward vs backward screenshots for visual consistency.
 *
 * Output: /tmp/scrolly-visual/ directory with:
 *   - fwd_NN_name.png   — forward scroll captures
 *   - bwd_NN_name.png   — backward scroll captures
 *   - round_trip_N.png  — screenshots after N round-trips (drift accumulation check)
 *
 * Run:
 *   npm run dev  # in another terminal
 *   npx playwright test e2e/visual-regression.spec.ts --project desktop-1920
 */

import { test, expect } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';

const DESKTOP_ONLY = ['desktop-1920', 'desktop-1440'];
const OUTPUT_DIR = '/tmp/scrolly-visual';

const SCROLL_POINTS = [
  { name: '01_hero_top', frac: 0.0 },
  { name: '02_hero_bottom', frac: 0.03 },
  { name: '03_iso_entry', frac: 0.06 },
  { name: '04_step_3', frac: 0.12 },
  { name: '05_step_8', frac: 0.28 },
  { name: '06_step_15', frac: 0.5 },
  { name: '07_mosaic_start', frac: 0.55 },
  { name: '08_mosaic_25pct', frac: 0.6 },
  { name: '09_mosaic_50pct', frac: 0.65 },
  { name: '10_mosaic_75pct', frac: 0.72 },
  { name: '11_mosaic_settled', frac: 0.8 },
  { name: '12_hold_zone', frac: 0.9 },
];

test.describe('Visual Regression — 3D Cube Stability', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (!DESKTOP_ONLY.includes(testInfo.project.name)) {
      test.skip();
      return;
    }
    // Create output directory
    if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

    test.setTimeout(120_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for 3D canvas to hydrate
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(2000); // Let initial animations settle
  });

  // =========================================================================
  // TEST 1: Forward scroll — screenshot at every key point
  // =========================================================================
  test('forward scroll visual captures', async ({ page }) => {
    console.log('\n═══ FORWARD SCROLL CAPTURES ═══');

    for (const point of SCROLL_POINTS) {
      await page.evaluate((f) => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * f);
      }, point.frac);
      await page.waitForTimeout(600); // Let damp/spring settle

      const path = `${OUTPUT_DIR}/fwd_${point.name}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log(`  📸 ${point.name} (scroll ${(point.frac * 100).toFixed(0)}%) → ${path}`);
    }

    console.log(`\n  Total: ${SCROLL_POINTS.length} forward captures saved to ${OUTPUT_DIR}/`);
  });

  // =========================================================================
  // TEST 2: Backward scroll — screenshot at every key point (reverse)
  // =========================================================================
  test('backward scroll visual captures', async ({ page }) => {
    // First scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    console.log('\n═══ BACKWARD SCROLL CAPTURES ═══');

    for (const point of [...SCROLL_POINTS].reverse()) {
      await page.evaluate((f) => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * f);
      }, point.frac);
      await page.waitForTimeout(600);

      const path = `${OUTPUT_DIR}/bwd_${point.name}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log(`  📸 ${point.name} (scroll ${(point.frac * 100).toFixed(0)}%) → ${path}`);
    }

    console.log(`\n  Total: ${SCROLL_POINTS.length} backward captures saved to ${OUTPUT_DIR}/`);
  });

  // =========================================================================
  // TEST 3: Round-trip drift accumulation visual (hero position after N trips)
  // =========================================================================
  test('round-trip drift visual — hero position after 1, 3, 5 round-trips', async ({ page }) => {
    console.log('\n═══ ROUND-TRIP DRIFT VISUAL ═══');

    // Capture initial hero state
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUTPUT_DIR}/round_trip_0_initial.png`, fullPage: false });
    console.log('  📸 Initial hero position');

    const trips = [1, 3, 5];
    let totalTrips = 0;

    for (const target of trips) {
      while (totalTrips < target) {
        // Scroll to mosaic zone
        await page.evaluate(() => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          window.scrollTo(0, maxScroll * 0.85);
        });
        await page.waitForTimeout(400);
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
        totalTrips++;
      }

      // Capture after N trips
      await page.waitForTimeout(600); // extra settle time
      await page.screenshot({
        path: `${OUTPUT_DIR}/round_trip_${target}_after.png`,
        fullPage: false,
      });
      console.log(`  📸 After ${target} round-trip(s)`);
    }

    console.log(`\n  Compare: round_trip_0_initial.png vs round_trip_5_after.png`);
    console.log(`  If cube position differs → drift detected`);
  });

  // =========================================================================
  // TEST 4: Mosaic transition at slow scroll intervals
  // =========================================================================
  test('fine-grained mosaic entry — 20 steps from step-15 to mosaic-settled', async ({ page }) => {
    console.log('\n═══ FINE-GRAINED MOSAIC ENTRY ═══');

    const steps = 20;
    const startFrac = 0.48; // just before mosaic starts
    const endFrac = 0.82; // mosaic settled

    for (let i = 0; i <= steps; i++) {
      const frac = startFrac + (endFrac - startFrac) * (i / steps);

      await page.evaluate((f) => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * f);
      }, frac);
      await page.waitForTimeout(350);

      const path = `${OUTPUT_DIR}/mosaic_fine_${String(i).padStart(2, '0')}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log(`  📸 step ${i}/${steps} (scroll ${(frac * 100).toFixed(1)}%) → ${path}`);
    }

    console.log(`\n  Total: ${steps + 1} fine-grained captures`);
    console.log(`  Look for: smooth block scaling, no binary jumps, no color pops`);
  });

  // =========================================================================
  // TEST 5: Hero → Isometric transition (the "double jerk" check)
  // =========================================================================
  test('hero-to-isometric transition — 15 fine steps', async ({ page }) => {
    console.log('\n═══ HERO → ISOMETRIC TRANSITION ═══');

    const steps = 15;
    const startFrac = 0.0;
    const endFrac = 0.1;

    for (let i = 0; i <= steps; i++) {
      const frac = startFrac + (endFrac - startFrac) * (i / steps);

      await page.evaluate((f) => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * f);
      }, frac);
      await page.waitForTimeout(400);

      const path = `${OUTPUT_DIR}/hero_iso_${String(i).padStart(2, '0')}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log(`  📸 step ${i}/${steps} (scroll ${(frac * 100).toFixed(1)}%) → ${path}`);
    }

    console.log(`\n  Total: ${steps + 1} captures`);
    console.log(`  Look for: smooth camera rotation, no double jerk, no zoom jump`);
  });
});
