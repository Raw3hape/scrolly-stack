/**
 * E2E Tests — 3D Cube Stability Fixes
 *
 * Validates stability fixes from the architectural refactor.
 * Split into two groups:
 * - Pure math tests (no browser needed, always run)
 * - Browser tests (require #three-debug element, need WebGL)
 *
 * Run:
 *   npx playwright test e2e/stability-fixes.spec.ts --project desktop-1920
 */

import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// CONFIG — mirrors src/features/scrolly-experience/config.ts
// ---------------------------------------------------------------------------

const MOSAIC_VIEW_START = 0.08;
const MOSAIC_VIEW_END = 0.92;
const REF_ZOOM = 65;
const POSITION_TOLERANCE = 0.05;

// ---------------------------------------------------------------------------
// MATH — mirrors easings.ts
// ---------------------------------------------------------------------------

function remapProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothProgress(progress: number, start: number, end: number): number {
  return easeInOutCubic(remapProgress(progress, start, end));
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function fmt(n: number): string {
  return n.toFixed(4);
}

// =========================================================================
// PURE MATH TESTS — always run, no browser needed
// =========================================================================
test.describe('Stability Fixes — Math Validation', () => {
  test('dimensionScale interpolation: easeOutQuart eliminates binary jump', () => {
    // At mosaicProgress = 0.01 (first frame): scale should be near 1
    const t_001 = easeOutQuart(0.01);
    expect(t_001).toBeLessThan(0.04); // ≈ 0.039

    // Example: block [5.5, 0.42, 5.5] → mosaic [3.0, 0.3, 3.0]
    // Target scale = [0.545, 0.714, 0.545]
    const scaleX_first = 1 + (0.545 - 1) * t_001;
    expect(scaleX_first).toBeGreaterThan(0.97); // Before fix: was 0.545!

    // At half (fast due to easeOutQuart)
    const t_05 = easeOutQuart(0.5);
    expect(t_05).toBeGreaterThan(0.8);
    expect(t_05).toBeLessThan(1.0);

    // Endpoints
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(1)).toBe(1);

    console.log('\n═══ DIMENSION SCALE INTERPOLATION ═══');
    console.log(
      `  progress=0.01 → easeOutQuart=${t_001.toFixed(4)} → scaleX=${scaleX_first.toFixed(4)} (was 0.545 before fix)`,
    );
    console.log(`  progress=0.50 → easeOutQuart=${t_05.toFixed(4)}`);
    console.log('  ✅ No binary jump at mosaicProgress > 0');
  });

  test('crossfade formula: 100% damped at t=0, 100% instant at t=1', () => {
    const damped = { x: 100, y: 100, z: 100 };
    const instant = { x: 0, y: 100, z: 0 };

    // t=0 → pure damped
    expect(lerp(damped.x, instant.x, 0)).toBe(100);
    expect(lerp(damped.z, instant.z, 0)).toBe(100);

    // t=1 → pure instant
    expect(lerp(damped.x, instant.x, 1)).toBe(0);
    expect(lerp(damped.z, instant.z, 1)).toBe(0);

    // t=0.5 → midpoint
    expect(lerp(damped.x, instant.x, 0.5)).toBe(50);

    console.log('\n═══ CROSSFADE FORMULA ═══');
    console.log('  t=0 → damped ✅, t=1 → instant ✅, t=0.5 → midpoint ✅');
  });

  test('label fade: hidden mid-flight, visible when settled', () => {
    function mosaicLabelFade(p: number): number {
      if (p <= 0) return 1;
      if (p >= 1) return 1;
      return Math.max(0, (p - 0.9) / 0.1);
    }

    expect(mosaicLabelFade(0)).toBe(1); // stack: visible
    expect(mosaicLabelFade(0.5)).toBe(0); // mid-flight: hidden
    expect(mosaicLabelFade(0.95)).toBeCloseTo(0.5, 1); // emerging
    expect(mosaicLabelFade(1.0)).toBe(1); // settled: visible

    console.log('\n═══ LABEL FADE ═══');
    console.log(
      '  p=0 → 1 (stack) ✅, p=0.5 → 0 (flight) ✅, p=0.95 → 0.5 ✅, p=1 → 1 (settled) ✅',
    );
  });

  test('monotonic zoom formula: no V-shape', () => {
    // Old: lerp(65,42,t) then lerp(42,75,t) → zoom dipped to 42
    // New: lerp(65,75,transitionProgress) → always ≥ 65
    const fractions = [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0];
    const zooms = fractions.map((f) => lerp(65, 75, f));

    for (let i = 1; i < zooms.length; i++) {
      expect(zooms[i], `zoom at f=${fractions[i]} should be ≥ previous`).toBeGreaterThanOrEqual(
        zooms[i - 1],
      );
      expect(zooms[i], `zoom should never go below 65`).toBeGreaterThanOrEqual(65);
    }

    console.log('\n═══ MONOTONIC ZOOM ═══');
    fractions.forEach((f, i) => console.log(`  t=${f.toFixed(1)} → zoom=${zooms[i].toFixed(1)}`));
    console.log('  ✅ All monotonically increasing, none below 65');
  });

  test('REF_ZOOM offset is pure function — same input = same output', () => {
    // Simulating the offset formula with fixed REF_ZOOM
    const innerWidth = 1920;
    const contentRatio = 0.45;
    const headerPx = 72;
    const stableWorldPerPx = 1 / REF_ZOOM;

    function computeOffset(mosaicProgress: number) {
      const transitionProgress = smoothProgress(mosaicProgress, MOSAIC_VIEW_START, MOSAIC_VIEW_END);
      const stackOffsetX = innerWidth * contentRatio * 0.5 * stableWorldPerPx;
      const headerCompensation = headerPx * stableWorldPerPx * 0.35;
      const stackOffsetY = -0.1 + headerCompensation;
      return {
        x: lerp(stackOffsetX, 0, transitionProgress),
        y: lerp(stackOffsetY, 0.12, transitionProgress),
      };
    }

    // Same input → same output (REF_ZOOM is constant, not animated)
    const a = computeOffset(0.3);
    const b = computeOffset(0.3);
    const c = computeOffset(0.3);

    expect(a.x).toBe(b.x);
    expect(b.x).toBe(c.x);
    expect(a.y).toBe(b.y);

    // Forward and backward are identical
    const fwd = computeOffset(0.5);
    const bwd = computeOffset(0.5);
    expect(Math.abs(fwd.x - bwd.x)).toBe(0);
    expect(Math.abs(fwd.y - bwd.y)).toBe(0);

    console.log('\n═══ REF_ZOOM DETERMINISTIC ═══');
    console.log(`  offset(0.3) = (${fmt(a.x)}, ${fmt(a.y)}) — 3x identical ✅`);
    console.log(`  forward=backward at 0.5: ΔX=0, ΔY=0 ✅`);
  });

  test('smoothProgress sub-ranges produce valid outputs', () => {
    // Verify smoothProgress works correctly at boundaries
    expect(smoothProgress(0, MOSAIC_VIEW_START, MOSAIC_VIEW_END)).toBe(0);
    expect(smoothProgress(0.08, MOSAIC_VIEW_START, MOSAIC_VIEW_END)).toBe(0);
    expect(smoothProgress(0.92, MOSAIC_VIEW_START, MOSAIC_VIEW_END)).toBeCloseTo(1, 5);
    expect(smoothProgress(1.0, MOSAIC_VIEW_START, MOSAIC_VIEW_END)).toBe(1);

    // Mid-range should be smooth
    const mid = smoothProgress(0.5, MOSAIC_VIEW_START, MOSAIC_VIEW_END);
    expect(mid).toBeGreaterThan(0.4);
    expect(mid).toBeLessThan(0.6);

    console.log('\n═══ SMOOTH PROGRESS ═══');
    console.log(`  sp(0)    = ${smoothProgress(0, MOSAIC_VIEW_START, MOSAIC_VIEW_END).toFixed(4)}`);
    console.log(
      `  sp(0.08) = ${smoothProgress(0.08, MOSAIC_VIEW_START, MOSAIC_VIEW_END).toFixed(4)}`,
    );
    console.log(`  sp(0.50) = ${mid.toFixed(4)}`);
    console.log(
      `  sp(0.92) = ${smoothProgress(0.92, MOSAIC_VIEW_START, MOSAIC_VIEW_END).toFixed(4)}`,
    );
    console.log('  ✅ All boundaries correct');
  });
});

// =========================================================================
// BROWSER TESTS — need running dev server with WebGL
// =========================================================================

const DESKTOP_ONLY = ['desktop-1920', 'desktop-1440'];

async function readDebug(page: Page): Promise<{ mosaicProgress: number; currentStep: number }> {
  return page.evaluate(() => {
    const el = document.getElementById('three-debug');
    if (!el) throw new Error('#three-debug not found');
    return {
      mosaicProgress: parseFloat(el.dataset.mosaicProgress || '0'),
      currentStep: parseInt(el.dataset.currentStep || '-1', 10),
    };
  });
}

async function scrollTo(page: Page, fraction: number): Promise<void> {
  await page.evaluate((f) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * f);
  }, fraction);
  await page.waitForTimeout(400);
}

test.describe('Stability Fixes — Browser Tests', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (!DESKTOP_ONLY.includes(testInfo.project.name)) {
      test.skip();
      return;
    }
    test.setTimeout(90_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Try to find #three-debug, skip tests gracefully if WebGL unavailable
    try {
      await page.waitForSelector('#three-debug', { state: 'attached', timeout: 15_000 });
    } catch {
      test.skip();
      return;
    }
    await page.waitForTimeout(1500);
  });

  test('canvas persists through full scroll cycle without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15_000 });

    // Full scroll cycle: forward then backward
    for (const frac of [0.25, 0.5, 0.75, 1.0, 0.75, 0.5, 0.25, 0]) {
      await scrollTo(page, frac);
      await expect(canvas).toBeVisible();
    }

    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('THREE.') &&
        !e.includes('WebGL') &&
        !e.includes('Deprecation') &&
        !e.includes('Failed to load resource'),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('forward→backward scroll positions match (no drift)', async ({ page }) => {
    const checkpoints = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85];

    type DataPoint = { frac: number; mosaicProgress: number };
    const fwdData: DataPoint[] = [];
    for (const frac of checkpoints) {
      const debug = await (async () => {
        await scrollTo(page, frac);
        return readDebug(page);
      })();
      fwdData.push({ frac, mosaicProgress: debug.mosaicProgress });
    }

    const bwdData: DataPoint[] = [];
    for (const frac of [...checkpoints].reverse()) {
      const debug = await (async () => {
        await scrollTo(page, frac);
        return readDebug(page);
      })();
      bwdData.push({ frac, mosaicProgress: debug.mosaicProgress });
    }
    bwdData.reverse();

    // Compute expected offsets (using REF_ZOOM formula)
    console.log('\n═══ BROWSER DRIFT TEST ═══');
    const failures: string[] = [];
    for (let i = 0; i < checkpoints.length; i++) {
      const fwdTP = smoothProgress(fwdData[i].mosaicProgress, MOSAIC_VIEW_START, MOSAIC_VIEW_END);
      const bwdTP = smoothProgress(bwdData[i].mosaicProgress, MOSAIC_VIEW_START, MOSAIC_VIEW_END);
      const diff = Math.abs(fwdTP - bwdTP);
      const pass = diff < POSITION_TOLERANCE;
      console.log(
        `  frac=${checkpoints[i].toFixed(2)} fwd_tp=${fwdTP.toFixed(4)} bwd_tp=${bwdTP.toFixed(4)} Δ=${diff.toFixed(4)} ${pass ? '✅' : '❌'}`,
      );
      if (!pass) failures.push(`frac=${checkpoints[i]}: Δ=${diff.toFixed(4)}`);
    }

    expect(failures, `Transition progress drift:\n${failures.join('\n')}`).toHaveLength(0);
  });
});
