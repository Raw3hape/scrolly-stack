/**
 * Palette Sync Checker — Foundation Projects
 *
 * Verifies that hex values in palette.ts and colors.css are in sync.
 * Run: `npx tsx scripts/check-palette-sync.ts`
 *
 * Exit 0 = in sync, Exit 1 = drift detected.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PALETTE_PATH = resolve(ROOT, 'src/config/palette.ts');
const COLORS_PATH = resolve(ROOT, 'src/styles/tokens/colors.css');

// --- Parse palette.ts ---
const paletteSource = readFileSync(PALETTE_PATH, 'utf8');
const paletteHexes = new Map<string, string>();

// Match: key: '#hex' or key: "#hex"  
for (const match of paletteSource.matchAll(/(\w+):\s*['"]#([0-9a-fA-F]{3,8})['"]/g)) {
  paletteHexes.set(match[1], `#${match[2].toUpperCase()}`);
}

// --- Parse colors.css ---
const colorsSource = readFileSync(COLORS_PATH, 'utf8');
const cssHexes = new Map<string, string>();

// Match: --token-name: #hex;
for (const match of colorsSource.matchAll(/--([\w-]+):\s*#([0-9a-fA-F]{3,8})\s*;/g)) {
  cssHexes.set(match[1], `#${match[2].toUpperCase()}`);
}

// --- Known mapping: palette key → CSS token ---
const MAPPING: Record<string, string> = {
  // Anchor
  anchor900: 'color-anchor-900',
  anchor700: 'color-anchor-700',
  anchor500: 'color-anchor-500',
  anchor300: 'color-anchor-300',
  // Systems (teal)
  teal700: 'color-teal-700',
  teal500: 'color-teal-500',
  teal300: 'color-teal-300',
  teal100: 'color-teal-100',
  // Growth (green)
  green700: 'color-green-700',
  green500: 'color-green-500',
  green300: 'color-green-300',
  // Foundation (sand)
  sand300: 'color-sand-300',
  sand200: 'color-sand-200',
  sand100: 'color-sand-100',
  sand50: 'color-sand-50',
  sand25: 'color-sand-25',
  // Value (gold)
  gold700: 'color-gold-700',
  gold500: 'color-gold-500',
  gold300: 'color-gold-300',
  // NOTE: Neutrals (neutral-900/600/400) intentionally omitted —
  // they exist only in CSS, not needed in 3D palette.
};

// --- Compare ---
let driftCount = 0;

for (const [paletteKey, cssToken] of Object.entries(MAPPING)) {
  const paletteHex = paletteHexes.get(paletteKey);
  const cssHex = cssHexes.get(cssToken);

  if (!paletteHex) {
    console.error(`❌ palette.ts missing key: ${paletteKey}`);
    driftCount++;
    continue;
  }
  if (!cssHex) {
    console.error(`❌ colors.css missing token: --${cssToken}`);
    driftCount++;
    continue;
  }
  if (paletteHex !== cssHex) {
    console.error(`❌ DRIFT: ${paletteKey} → palette=${paletteHex} vs css=${cssHex} (--${cssToken})`);
    driftCount++;
  }
}

if (driftCount === 0) {
  console.log(`✅ Palette sync OK — ${Object.keys(MAPPING).length} colors verified`);
  process.exit(0);
} else {
  console.error(`\n🚨 ${driftCount} drift(s) detected between palette.ts and colors.css`);
  process.exit(1);
}
