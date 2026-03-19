/**
 * useAdaptiveMosaic — Viewport-Adaptive Mosaic Configuration
 *
 * Computes responsive `cols` and adaptive `cellSize` from the current viewport,
 * ensuring the mosaic grid fits any screen without hardcoded magic numbers.
 *
 * All bounds are derived from existing config:
 *   - minCell = labels.fontSize × 4 (label readability)
 *   - maxCell = config.mosaic.cellSize (default cap)
 *   - padding = headerPx / zoom + gap (visible area below header)
 *   - autoCols = floor(visibleWidth / cellSize), clamped [2, baseCols]
 *
 * ARCHITECTURE: Called in Stack.tsx, returns an adapted ResolvedMosaic that
 * flows into precomputeTrajectories and block rendering.
 */

import { useThree } from '@react-three/fiber';
import { labels, mosaic as defaultMosaic, animation } from '../config';
import type { ResolvedMosaic } from '../VariantContext';
import type { ComputedBlock } from '../types';
import { getMosaicRows } from '../utils/mosaicLayout';

/** Breakpoint — single source, matches CSS `@media (max-width: 768px)` */
const MOBILE_BP = 768;

export interface AdaptiveMosaicResult extends ResolvedMosaic {
  /** Actual number of rows in the adapted grid */
  rows: number;
  /** Label font size, scaled proportionally to cellSize */
  labelFontSize: number;
  /** Label max width, scaled proportionally to cellSize */
  labelMaxWidth: number;
}

/**
 * Compute viewport-adaptive mosaic config.
 *
 * @param baseMosaic - Resolved mosaic config from VariantContext
 * @param blocks - All computed blocks (needed for span-aware row counting)
 * @param headerPx - Header height in CSS pixels
 */
export function useAdaptiveMosaic(
  baseMosaic: ResolvedMosaic,
  blocks: ComputedBlock[],
  headerPx: number,
): AdaptiveMosaicResult {
  const { size } = useThree(); // viewport in CSS pixels
  const isMobile = size.width <= MOBILE_BP;

  // The effective zoom the camera will reach during mosaic.
  // On desktop: camera zooms to variant's finalZoom (e.g. 65).
  // On mobile: the grid has MORE rows (2-3 cols → 7-10 rows), so keeping
  // finalZoom would make the visible area too small. Use mobile zoom (40)
  // which gives a larger visible area to fit the taller grid.
  const zoom = isMobile
    ? animation.zoom.mobile
    : baseMosaic.camera.finalZoom;
  const visW = size.width / zoom;
  const visH = size.height / zoom;

  // ── 1. Responsive cols ──────────────────────────────────────────────
  // Auto: how many default-sized cells fit in viewport width?
  // Clamp to [2, baseMosaic.cols] — never more than desktop, never less than 2
  const autoCols = Math.max(2, Math.min(
    baseMosaic.cols,
    Math.floor(visW / baseMosaic.cellSize),
  ));
  const cols = isMobile ? autoCols : baseMosaic.cols;

  // ── 2. Row count (pure function, supports spanBlocks with clamping) ─
  const rows = getMosaicRows(blocks, cols, baseMosaic.spanBlocks);

  // ── 3. Padding — derived from header height ─────────────────────────
  const headerWorld = headerPx / zoom;
  const pad = headerWorld + baseMosaic.gap; // header + one gap breathing room

  // ── 4. Adaptive cellSize — fit grid into visible area ───────────────
  const maxByH = (visH - (rows - 1) * baseMosaic.gap - pad * 2) / rows;
  const maxByW = (visW - (cols - 1) * baseMosaic.gap - pad * 2) / cols;

  // Bounds: min = 4× font (label readability), max = default cellSize (don't upscale)
  const minCell = labels.fontSize * 4;
  const maxCell = baseMosaic.cellSize; // from config, not a magic number
  const cellSize = Math.max(minCell, Math.min(maxByH, maxByW, maxCell));

  // ── 5. Label scaling — proportional to cell size ────────────────────
  const scale = cellSize / defaultMosaic.cellSize;
  const labelFontSize = labels.fontSize * scale;
  const labelMaxWidth = labels.maxWidth * scale;

  return {
    ...baseMosaic,
    cols,
    cellSize,
    rows,
    labelFontSize,
    labelMaxWidth,
  };
}
