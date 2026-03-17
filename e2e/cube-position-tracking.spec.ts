/**
 * Diagnostic Test — 3D Cube Position Tracking
 *
 * Reads mosaicProgress, currentStep, exitProgress from a hidden DOM element
 * (#three-debug) rendered by ScrollyExperience.tsx (outside R3F Canvas).
 *
 * Computes the expected 3D group position using the same pure-function formula
 * as Stack.tsx's useFrame — then uses drift between forward and backward scroll
 * to detect positional instabilities.
 *
 * ✅ Runs headless — no browser windows, no WebGL required.
 *
 * Run:
 *   npx playwright test e2e/cube-position-tracking.spec.ts --project desktop-1920
 */

import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// CONFIG — mirrors src/features/scrolly-experience/config.ts
// ---------------------------------------------------------------------------

const MOSAIC_VIEW_START = 0.08;
const MOSAIC_VIEW_END = 0.92;
const SCENE_OFFSET = { stackY: -0.35, mosaicY: 0.12, headerCompensationFactor: 0.35 };

const POSITION_TOLERANCE = 0.05;

const CHECKPOINTS = [
  { name: 'top', fraction: 0 },
  { name: 'hero-end', fraction: 0.05 },
  { name: 'step-3', fraction: 0.12 },
  { name: 'step-7', fraction: 0.25 },
  { name: 'step-12', fraction: 0.4 },
  { name: 'step-15', fraction: 0.5 },
  { name: 'mosaic-start', fraction: 0.55 },
  { name: 'mosaic-25%', fraction: 0.6 },
  { name: 'mosaic-50%', fraction: 0.65 },
  { name: 'mosaic-75%', fraction: 0.72 },
  { name: 'mosaic-end', fraction: 0.8 },
  { name: 'hold-zone', fraction: 0.85 },
];

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface DebugData {
  mosaicProgress: number;
  currentStep: number;
  exitProgress: number;
}

// ---------------------------------------------------------------------------
// MATH — mirrors easings.ts + Stack.tsx offset formula
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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Compute expected group position using the same formula as Stack.tsx useFrame.
 * CSS-dependent values (contentRatio, headerPx) are read from the DOM.
 */
async function computeExpectedPosition(page: Page, mosaicProgress: number): Promise<{ x: number; y: number }> {
  const { contentRatio, headerPx, innerWidth } = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const rawContentWidth = root.getPropertyValue('--content-width').trim();
    const contentRatio = rawContentWidth.endsWith('%')
      ? parseFloat(rawContentWidth) / 100
      : 0.45;
    const headerPx = parseFloat(root.getPropertyValue('--header-height')) || 0;
    return {
      contentRatio: window.innerWidth < 768 ? 0 : contentRatio,
      headerPx,
      innerWidth: window.innerWidth,
    };
  });

  // In headless, the R3F viewport doesn't exist, so we use browser dimensions
  // and approximate worldPerPx ≈ viewportWidth/screenWidth (orthographic camera).
  // For drift detection, the exact values don't matter — consistency matters.
  const transitionProgress = smoothProgress(mosaicProgress, MOSAIC_VIEW_START, MOSAIC_VIEW_END);
  const stackOffsetX = innerWidth * contentRatio * 0.5; // in pixels, but consistent
  const stackOffsetY = SCENE_OFFSET.stackY + headerPx * SCENE_OFFSET.headerCompensationFactor;

  return {
    x: lerp(stackOffsetX, 0, transitionProgress),
    y: lerp(stackOffsetY, SCENE_OFFSET.mosaicY, transitionProgress),
  };
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

async function readDebug(page: Page): Promise<DebugData> {
  return page.evaluate(() => {
    const el = document.getElementById('three-debug');
    if (!el) throw new Error('#three-debug not found');
    return {
      mosaicProgress: parseFloat(el.dataset.mosaicProgress || '0'),
      currentStep: parseInt(el.dataset.currentStep || '-1', 10),
      exitProgress: parseFloat(el.dataset.exitProgress || '0'),
    };
  });
}

async function scrollAndRead(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * f);
  }, fraction);
  await page.waitForTimeout(400);
  const scrollY = await page.evaluate(() => window.scrollY);
  const debug = await readDebug(page);
  const pos = await computeExpectedPosition(page, debug.mosaicProgress);
  return { debug, scrollY, pos };
}

function fmt(n: number): string {
  return n.toFixed(4);
}

// ---------------------------------------------------------------------------
// TEST
// ---------------------------------------------------------------------------

test.describe('3D Cube Position Tracking', () => {
  test('position report + drift analysis + round-trip stress', async ({ page }, testInfo) => {
    const allowed = ['desktop-1920', 'desktop-1440'];
    if (!allowed.includes(testInfo.project.name)) {
      test.skip();
      return;
    }

    test.setTimeout(90_000);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#three-debug', { state: 'attached', timeout: 15_000 });
    await page.waitForTimeout(1000);

    // =================================================================
    // PASS 1: FORWARD
    // =================================================================
    type FwdRow = { name: string; scrollY: number; mosaic: number; step: number; posX: number; posY: number };
    const forwardRows: FwdRow[] = [];

    for (const cp of CHECKPOINTS) {
      const { debug, scrollY, pos } = await scrollAndRead(page, cp.fraction);
      forwardRows.push({
        name: cp.name,
        scrollY,
        mosaic: debug.mosaicProgress,
        step: debug.currentStep,
        posX: pos.x,
        posY: pos.y,
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('  PASS 1 — FORWARD SCROLL');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(
      'Checkpoint'.padEnd(16),
      'scrollY'.padStart(7),
      'posX'.padStart(10),
      'posY'.padStart(10),
      'mosaic'.padStart(8),
      'step'.padStart(5),
    );
    console.log('─'.repeat(60));
    for (const r of forwardRows) {
      console.log(
        r.name.padEnd(16),
        String(Math.round(r.scrollY)).padStart(7),
        fmt(r.posX).padStart(10),
        fmt(r.posY).padStart(10),
        fmt(r.mosaic).padStart(8),
        String(r.step).padStart(5),
      );
    }
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // =================================================================
    // PASS 2: BACKWARD
    // =================================================================
    await page.waitForTimeout(300);
    type BwdRow = { name: string; posX: number; posY: number };
    const backwardRows: BwdRow[] = [];

    for (const cp of [...CHECKPOINTS].reverse()) {
      const { pos } = await scrollAndRead(page, cp.fraction);
      backwardRows.push({ name: cp.name, posX: pos.x, posY: pos.y });
    }
    // Reverse so indexing matches CHECKPOINTS order
    backwardRows.reverse();

    // =================================================================
    // DRIFT ANALYSIS
    // =================================================================
    const drifts: Array<{ name: string; driftX: number; driftY: number; pass: boolean }> = [];

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('  DRIFT ANALYSIS — Forward vs Backward');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(
      'Checkpoint'.padEnd(16),
      'fwdX'.padStart(10),
      'bwdX'.padStart(10),
      'ΔX'.padStart(10),
      'ΔY'.padStart(10),
      ''.padStart(3),
    );
    console.log('─'.repeat(62));

    for (let i = 0; i < CHECKPOINTS.length; i++) {
      const fwd = forwardRows[i];
      const bwd = backwardRows[i];

      const driftX = Math.abs(fwd.posX - bwd.posX);
      const driftY = Math.abs(fwd.posY - bwd.posY);
      const pass = driftX < POSITION_TOLERANCE && driftY < POSITION_TOLERANCE;

      drifts.push({ name: fwd.name, driftX, driftY, pass });

      console.log(
        fwd.name.padEnd(16),
        fmt(fwd.posX).padStart(10),
        fmt(bwd.posX).padStart(10),
        fmt(driftX).padStart(10),
        fmt(driftY).padStart(10),
        (pass ? ' ✅' : ' ❌').padStart(3),
      );
    }
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // =================================================================
    // TRIPLE ROUND-TRIP STRESS
    // =================================================================
    const { pos: initial } = await scrollAndRead(page, 0);
    await page.waitForTimeout(200);

    const CYCLES = 3;
    for (let i = 0; i < CYCLES; i++) {
      await scrollAndRead(page, 0.85);
      await scrollAndRead(page, 0);
      await page.waitForTimeout(200);
    }

    const { pos: final } = await scrollAndRead(page, 0);
    const stressDX = Math.abs(initial.x - final.x);
    const stressDY = Math.abs(initial.y - final.y);

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  STRESS TEST — ${CYCLES}× Round-Trip`);
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`  Initial: X=${fmt(initial.x)}, Y=${fmt(initial.y)}`);
    console.log(`  Final:   X=${fmt(final.x)},  Y=${fmt(final.y)}`);
    console.log(`  Drift:   ΔX=${fmt(stressDX)}, ΔY=${fmt(stressDY)}`);
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // =================================================================
    // ASSERTIONS
    // =================================================================
    const failures = drifts.filter((d) => !d.pass);
    if (failures.length > 0) {
      const msg = failures
        .map((f) => `  ${f.name}: ΔX=${fmt(f.driftX)}, ΔY=${fmt(f.driftY)}`)
        .join('\n');
      expect(failures.length, `Forward↔Backward drift:\n${msg}`).toBe(0);
    }

    expect(stressDX, `Stress ΔX after ${CYCLES} cycles`).toBeLessThan(POSITION_TOLERANCE);
    expect(stressDY, `Stress ΔY after ${CYCLES} cycles`).toBeLessThan(POSITION_TOLERANCE);
  });
});
