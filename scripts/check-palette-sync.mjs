/**
 * Palette Sync Checker — Foundation Projects
 *
 * Verifies that hex values in palette.ts, colors.css, and stitch-overrides.css
 * are in sync (or intentionally divergent where documented).
 *
 * Run: `node scripts/check-palette-sync.mjs`
 *
 * Exit 0 = in sync, Exit 1 = drift detected.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PALETTE_PATH = resolve(ROOT, 'src/config/palette.ts');
const COLORS_PATH = resolve(ROOT, 'src/styles/tokens/colors.css');
const STITCH_PATH = resolve(ROOT, 'src/styles/tokens/stitch-overrides.css');

const paletteSource = readFileSync(PALETTE_PATH, 'utf8');
const paletteHexes = new Map();

for (const match of paletteSource.matchAll(/(\w+):\s*['"]#([0-9a-fA-F]{3,8})['"]/g)) {
  paletteHexes.set(match[1], `#${match[2].toUpperCase()}`);
}

const colorsSource = readFileSync(COLORS_PATH, 'utf8');
const cssHexes = new Map();

for (const match of colorsSource.matchAll(/--([\w-]+):\s*#([0-9a-fA-F]{3,8})\s*;/g)) {
  cssHexes.set(match[1], `#${match[2].toUpperCase()}`);
}

const MAPPING = {
  anchor900: 'color-anchor-900',
  anchor700: 'color-anchor-700',
  anchor500: 'color-anchor-500',
  anchor300: 'color-anchor-300',
  teal700: 'color-teal-700',
  teal500: 'color-teal-500',
  teal300: 'color-teal-300',
  teal100: 'color-teal-100',
  green700: 'color-green-700',
  green500: 'color-green-500',
  green300: 'color-green-300',
  sand300: 'color-sand-300',
  sand200: 'color-sand-200',
  sand100: 'color-sand-100',
  sand50: 'color-sand-50',
  sand25: 'color-sand-25',
  gold700: 'color-gold-700',
  gold500: 'color-gold-500',
  gold300: 'color-gold-300',
};

let driftCount = 0;

for (const [paletteKey, cssToken] of Object.entries(MAPPING)) {
  const paletteHex = paletteHexes.get(paletteKey);
  const cssHex = cssHexes.get(cssToken);

  if (!paletteHex) {
    console.error(`palette.ts missing key: ${paletteKey}`);
    driftCount++;
    continue;
  }

  if (!cssHex) {
    console.error(`colors.css missing token: --${cssToken}`);
    driftCount++;
    continue;
  }

  if (paletteHex !== cssHex) {
    console.error(
      `DRIFT: ${paletteKey} -> palette=${paletteHex} vs css=${cssHex} (--${cssToken})`
    );
    driftCount++;
  }
}

if (driftCount === 0) {
  console.log(`✓ colors.css sync OK: ${Object.keys(MAPPING).length} colors verified`);
} else {
  console.error(`\n${driftCount} drift(s) detected between palette.ts and colors.css`);
}

/* =========================================================================
 * Pass 2 — stitch-overrides.css vs palette.ts
 *
 * stitch-overrides.css intentionally diverges from palette.ts for some tokens
 * (the Stitch theme applies different values). This pass checks:
 *   - "match" entries: tokens that MUST equal their palette.ts counterpart.
 *   - "override" entries: tokens that intentionally differ — we verify the
 *     override value hasn't drifted from its documented target.
 *   - "derived" entries: stitch-only tokens sourced from a palette key
 *     (e.g. --stitch-dark-bg should equal palette.anchor900).
 * ======================================================================= */

const stitchSource = readFileSync(STITCH_PATH, 'utf8');
const stitchHexes = new Map();

for (const match of stitchSource.matchAll(/--([\w-]+):\s*#([0-9a-fA-F]{3,8})\s*;/g)) {
  stitchHexes.set(match[1], `#${match[2].toUpperCase()}`);
}

/**
 * Stitch-to-palette mapping.
 *
 * Each entry: { paletteKey, expectedStitchHex? }
 *   - If expectedStitchHex is omitted the stitch value must equal palette.
 *   - If expectedStitchHex is provided the stitch value must equal THAT hex
 *     (intentional override — we still flag if the override itself drifts).
 */
const STITCH_MAPPING = {
  // Tokens that intentionally override palette values
  'color-teal-500':   { paletteKey: 'teal500',  expectedStitchHex: '#1B6969' },
  'color-teal-700':   { paletteKey: 'teal700',  expectedStitchHex: '#004F50' },
  'color-teal-300':   { paletteKey: 'teal300',  expectedStitchHex: '#8CD3D2' },
  'color-gold-300':   { paletteKey: 'gold300',  expectedStitchHex: '#FFB86A' },

  // Tokens that should match palette exactly
  'color-gold-500':   { paletteKey: 'gold500' },

  // Derived / semantic tokens sourced from a palette key
  'stitch-dark-bg':   { paletteKey: 'anchor900' },
};

let stitchDriftCount = 0;

for (const [cssToken, spec] of Object.entries(STITCH_MAPPING)) {
  const stitchHex = stitchHexes.get(cssToken);
  const paletteHex = paletteHexes.get(spec.paletteKey);

  if (!stitchHex) {
    console.error(`stitch-overrides.css missing token: --${cssToken}`);
    stitchDriftCount++;
    continue;
  }

  if (!paletteHex) {
    console.error(`palette.ts missing key: ${spec.paletteKey} (needed by stitch --${cssToken})`);
    stitchDriftCount++;
    continue;
  }

  if (spec.expectedStitchHex) {
    // Intentional override — verify it hasn't drifted from its documented value
    if (stitchHex !== spec.expectedStitchHex) {
      console.error(
        `STITCH DRIFT: --${cssToken} expected override ${spec.expectedStitchHex} but found ${stitchHex}`
      );
      stitchDriftCount++;
    }
  } else {
    // Must match palette
    if (stitchHex !== paletteHex) {
      console.error(
        `STITCH DRIFT: --${cssToken} -> palette.${spec.paletteKey}=${paletteHex} vs stitch=${stitchHex}`
      );
      stitchDriftCount++;
    }
  }
}

if (stitchDriftCount === 0) {
  console.log(`✓ stitch-overrides.css sync OK: ${Object.keys(STITCH_MAPPING).length} tokens verified`);
}

/* =========================================================================
 * Summary
 * ======================================================================= */

const totalDrift = driftCount + stitchDriftCount;

if (totalDrift === 0) {
  console.log('\nAll palette checks passed.');
  process.exit(0);
}

console.error(`\n${totalDrift} total drift(s) detected.`);
process.exit(1);
