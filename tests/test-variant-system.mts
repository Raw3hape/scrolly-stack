/**
 * Comprehensive Variant System Tests
 * 
 * Run: npx tsx tests/test-variant-system.mts
 */

import { getVariant, getAllVariants } from '../src/features/scrolly-experience/variants/registry';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function section(title: string) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

// ─── 1. REGISTRY ─────────────────────────────────────────────────────────────

section('1. Variant Registry');

const allVariants = getAllVariants();
assert(allVariants.length === 6, `getAllVariants() returns 6 variants (got ${allVariants.length})`);

const classic = getVariant('classic');
const journey = getVariant('v2-journey');
const reverse = getVariant('v3-reverse');
const exact = getVariant('v4-exact');
const exactDown = getVariant('v5-exact-down');
const exactFlipped = getVariant('v6-exact-flipped');

assert(classic.id === 'classic', 'classic variant exists');
assert(journey.id === 'v2-journey', 'journey variant exists');
assert(reverse.id === 'v3-reverse', 'reverse variant exists');
assert(exact.id === 'v4-exact', 'exact variant exists');
assert(exactDown.id === 'v5-exact-down', 'exactDown variant exists');
assert(exactFlipped.id === 'v6-exact-flipped', 'exactFlipped variant exists');

assert(getVariant('nonexistent').id === 'classic', 'Unknown ID falls back to classic');
assert(getVariant(null).id === 'classic', 'null falls back to classic');
assert(getVariant(undefined).id === 'classic', 'undefined falls back to classic');

// ─── 2. DATA INTEGRITY ──────────────────────────────────────────────────────

section('2. Data Integrity');

function countBlocks(v: typeof classic) {
  return v.layers.reduce((acc, l) => acc + l.blocks.length, 0);
}

assert(countBlocks(classic) === 15, `Classic: 15 blocks (got ${countBlocks(classic)})`);
assert(classic.layers.length === 3, `Classic: 3 layers (got ${classic.layers.length})`);
assert(countBlocks(journey) === 19, `Journey: 19 blocks (got ${countBlocks(journey)})`);
assert(journey.layers.length === 12, `Journey: 12 layers (got ${journey.layers.length})`);
assert(countBlocks(reverse) === 19, `Reverse: 19 blocks (got ${countBlocks(reverse)})`);
assert(reverse.layers.length === 12, `Reverse: 12 layers (got ${reverse.layers.length})`);
assert(countBlocks(exact) === 19, `Exact: 19 blocks (got ${countBlocks(exact)})`);
assert(exact.layers.length === 14, `Exact: 14 layers (got ${exact.layers.length})`);
assert(countBlocks(exactDown) === 19, `ExactDown: 19 blocks (got ${countBlocks(exactDown)})`);
assert(exactDown.layers.length === 14, `ExactDown: 14 layers (got ${exactDown.layers.length})`);
assert(countBlocks(exactFlipped) === 19, `ExactFlipped: 19 blocks (got ${countBlocks(exactFlipped)})`);
assert(exactFlipped.layers.length === 14, `ExactFlipped: 14 layers (got ${exactFlipped.layers.length})`);

// Unique block IDs
for (const v of [classic, journey, reverse, exact, exactDown, exactFlipped]) {
  const allIds = v.layers.flatMap(l => l.blocks.map(b => b.id));
  const uniqueIds = new Set(allIds);
  assert(uniqueIds.size === allIds.length, `${v.name}: all ${allIds.length} block IDs unique`);
}

// Required fields
for (const v of [classic, journey, reverse, exact]) {
  const blocks = v.layers.flatMap(l => l.blocks);
  const ok = blocks.every(b => b.label && b.color && b.tooltipTitle && b.icon && b.description !== undefined);
  assert(ok, `${v.name}: all blocks have required fields`);
}

// ─── 3. SCROLL DIRECTION ────────────────────────────────────────────────────

section('3. Scroll Direction');

assert(classic.scrollDirection === undefined, 'Classic: scrollDirection = undefined (default down)');
assert(journey.scrollDirection === undefined, 'Journey: scrollDirection = undefined (default down)');
assert(reverse.scrollDirection === 'up', 'Reverse: scrollDirection = "up"');
assert(exact.scrollDirection === 'up', 'Exact: scrollDirection = "up"');
assert(exactDown.scrollDirection === 'down', 'ExactDown: scrollDirection = "down"');
assert(exactFlipped.scrollDirection === 'down', 'ExactFlipped: scrollDirection = "down"');

// ─── 4. BLOCKS ABOVE ACTIVE ─────────────────────────────────────────────────

section('4. blocksAboveActive Logic');

function testBlocksAbove(step: number, layers: typeof classic.layers, dir: 'down' | 'up') {
  if (step === -1) return [];
  const idx = layers.findIndex(l => l.blocks.some(b => b.id === step));
  if (idx < 0) return [];
  const ids: number[] = [];
  layers.forEach((l, i) => {
    const seen = dir === 'up' ? i > idx : i < idx;
    if (seen) l.blocks.forEach(b => ids.push(b.id));
    else if (i === idx) l.blocks.forEach(b => { if (b.id !== step && b.id < step) ids.push(b.id); });
  });
  return ids;
}

// Classic down step=8 → 8 blocks above (Layer A: 4 grid + Layer B: 3 row + same layer: id=7)
const cd8 = testBlocksAbove(8, classic.layers, 'down');
assert(cd8.length === 8, `Classic down step=8: 8 above (got ${cd8.length})`);
assert(!cd8.includes(8), 'Classic down step=8: active NOT in list');

// Hero = empty
assert(testBlocksAbove(-1, classic.layers, 'down').length === 0, 'Hero: empty');

// Journey down step=7 → 7 above (rows 1-2)
const jd7 = testBlocksAbove(7, journey.layers, 'down');
assert(jd7.length === 7, `Journey down step=7: 7 above (got ${jd7.length})`);

// Reverse up step=7 → layers 3-11 "seen" (12 blocks)
const ru7 = testBlocksAbove(7, reverse.layers, 'up');
const expected = reverse.layers.slice(3).reduce((a, l) => a + l.blocks.length, 0);
assert(ru7.length === expected, `Reverse up step=7: ${expected} above (got ${ru7.length})`);

// Down and Up don't overlap (same step, different directions)
const downSet = new Set(testBlocksAbove(7, journey.layers, 'down'));
const upSet = new Set(testBlocksAbove(7, journey.layers, 'up'));
assert([...downSet].filter(id => upSet.has(id)).length === 0, 'Down vs Up sets don\'t overlap');

// ─── 5. LAYER OPACITY ───────────────────────────────────────────────────────

section('5. Layer Opacity (Hero State)');

function testOpacity(idx: number, total: number, step: number, dir: 'down' | 'up') {
  if (step === -1) return idx === (dir === 'up' ? total - 1 : 0) ? 1 : 0;
  return 1;
}

assert(testOpacity(0, 3, -1, 'down') === 1, 'Down hero: layer 0 visible');
assert(testOpacity(1, 3, -1, 'down') === 0, 'Down hero: layer 1 hidden');
assert(testOpacity(2, 3, -1, 'down') === 0, 'Down hero: layer 2 hidden');
assert(testOpacity(0, 12, -1, 'up') === 0, 'Up hero: layer 0 hidden');
assert(testOpacity(11, 12, -1, 'up') === 1, 'Up hero: layer 11 visible');
assert(testOpacity(5, 12, 3, 'up') === 1, 'Non-hero: all visible');

// ─── 6. STAGGER DELAY ───────────────────────────────────────────────────────

section('6. Stagger Delay');

function testStagger(idx: number, total: number, revealed: boolean, dir: 'down' | 'up') {
  if (revealed) return dir === 'up' ? (total - 1 - idx) * 100 : idx * 100;
  return dir === 'up' ? idx * 100 : (total - 1 - idx) * 100;
}

assert(testStagger(0, 12, true, 'down') === 0, 'Down reveal: layer 0 delay=0');
assert(testStagger(11, 12, true, 'down') === 1100, 'Down reveal: layer 11 delay=1100');
assert(testStagger(11, 12, true, 'up') === 0, 'Up reveal: layer 11 (bottom) delay=0');
assert(testStagger(0, 12, true, 'up') === 1100, 'Up reveal: layer 0 (top) delay=1100');

// ─── 7. OVERLAY STEP ORDER ──────────────────────────────────────────────────

section('7. Overlay Step Ordering');

function getOrderedSteps(v: typeof classic) {
  const steps = v.layers.flatMap(l => l.blocks.map(b => ({ ...b, level: l.level })));
  const dir = v.scrollDirection ?? 'down';
  return dir === 'up' ? steps.slice().reverse() : steps;
}

const co = getOrderedSteps(classic);
assert(co[0].id === 0, 'Classic: first step id=0');
assert(co[co.length - 1].id === 14, 'Classic: last step id=14');

const jo = getOrderedSteps(journey);
assert(jo[0].id === 0, 'Journey: first step id=0 (Partnership)');
assert(jo[jo.length - 1].id === 18, 'Journey: last step id=18 (IPO)');

const ro = getOrderedSteps(reverse);
assert(ro[0].id === 18, 'Reverse: first step id=18 (IPO — scroll starts with bottom blocks)');
assert(ro[ro.length - 1].id === 0, 'Reverse: last step id=0 (Partnership — reached last)');

const eo = getOrderedSteps(exact);
assert(eo[0].id === 18, 'Exact: first step id=18 (IPO — scroll starts with bottom blocks)');
assert(eo[eo.length - 1].id === 0, 'Exact: last step id=0 (Partnership — reached last)');

const edo = getOrderedSteps(exactDown);
assert(edo[0].id === 0, 'ExactDown: first step id=0 (Partnership — top-down)');
assert(edo[edo.length - 1].id === 18, 'ExactDown: last step id=18 (IPO — reached last)');

// Exact mirror
const mirrorIds = jo.map(s => s.id).reverse();
assert(JSON.stringify(ro.map(s => s.id)) === JSON.stringify(mirrorIds), 'Reverse is exact mirror of Journey');

// ─── 8. MOSAIC SPAN BLOCKS ──────────────────────────────────────────────────

section('8. Mosaic spanBlocks');

assert(!classic.mosaicOverrides?.spanBlocks, 'Classic: no spanBlocks');
assert(journey.mosaicOverrides?.spanBlocks?.[18] === 2, 'Journey: IPO spans 2');
assert(reverse.mosaicOverrides?.spanBlocks?.[18] === 2, 'Reverse: IPO spans 2 (inherited)');
assert(exact.mosaicOverrides?.spanBlocks?.[18] === 2, 'Exact: IPO spans 2');
assert(exactDown.mosaicOverrides?.spanBlocks?.[18] === 2, 'ExactDown: IPO spans 2');
assert(exactFlipped.mosaicOverrides?.spanBlocks?.[18] === 2, 'ExactFlipped: IPO spans 2');

// Grid fill check
function checkFill(v: typeof classic) {
  const cols = v.mosaicOverrides?.cols ?? 5;
  const spans = v.mosaicOverrides?.spanBlocks ?? {};
  const blocks = v.layers.flatMap(l => l.blocks);
  let slots = 0;
  let col = 0;
  for (const b of blocks) {
    const span = spans[b.id] ?? 1;
    if (col + span > cols) { slots = Math.ceil(slots / cols) * cols; col = 0; }
    slots += span;
    col += span;
    if (col >= cols) col = 0;
  }
  return slots % cols === 0;
}

assert(checkFill(classic), 'Classic: mosaic fills perfectly');
assert(checkFill(journey), 'Journey: mosaic fills perfectly (IPO span=2)');
assert(checkFill(reverse), 'Reverse: mosaic fills perfectly');
assert(checkFill(exact), 'Exact: mosaic fills perfectly');
assert(checkFill(exactDown), 'ExactDown: mosaic fills perfectly');
assert(checkFill(exactFlipped), 'ExactFlipped: mosaic fills perfectly');

// ─── 9. INHERITANCE ──────────────────────────────────────────────────────────

section('9. v3-reverse Inheritance');

assert(reverse.layers === journey.layers, 'Same layers reference');
assert(reverse.geometryOverrides === journey.geometryOverrides, 'Same geometry overrides');
assert(reverse.mosaicOverrides === journey.mosaicOverrides, 'Same mosaic overrides');
assert(reverse.id !== journey.id, 'Different id');
assert(reverse.name !== journey.name, 'Different name');
assert(reverse.scrollDirection === 'up', 'Adds scrollDirection');
assert(journey.scrollDirection === undefined, 'Journey untouched');

// ─── 10. GEOMETRY ────────────────────────────────────────────────────────────

section('10. Geometry & Mosaic Overrides');

assert(journey.geometryOverrides?.layerHeight === 0.38, 'Journey layerHeight = 0.38');
assert(journey.geometryOverrides?.gapVertical === 0.30, 'Journey gapVertical = 0.30');
assert(journey.mosaicOverrides?.cols === 5, 'Journey mosaic cols = 5');
assert(journey.mosaicOverrides?.finalZoom === 65, 'Journey finalZoom = 65');
assert(classic.geometryOverrides === undefined, 'Classic: no overrides');

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(60)}`);
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(60));

if (failed > 0) process.exit(1);
console.log('\n🎉 All tests passed!\n');
