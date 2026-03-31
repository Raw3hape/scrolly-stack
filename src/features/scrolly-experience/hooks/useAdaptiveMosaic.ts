/**
 * useAdaptiveMosaic — Viewport-Adaptive Mosaic Configuration
 *
 * Computes responsive `cols` and adaptive `cellSize` from the current viewport,
 * ensuring the mosaic grid fits any screen without hardcoded magic numbers.
 *
 * All bounds are derived from existing config:
 *   - maxCell = config.mosaic.cellSize (default cap)
 *   - top padding = headerPx / zoom + gap (space below fixed header)
 *   - side/bottom padding = gap
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

/**
 * Breakpoint — single source, matches CSS `@media (max-width: 768px)`.
 *
 * NOTE: We compare against R3F `size.width` (Canvas pixel size), NOT
 * `window.innerWidth` (browser viewport). These can differ when browser
 * chrome or WebView insets shrink the canvas. `size.width` is the correct
 * source here because it reflects the actual rendering area the camera sees.
 */
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
  const zoom = isMobile ? animation.zoom.mobile : baseMosaic.camera.finalZoom;
  const visW = size.width / zoom;
  const visH = size.height / zoom;

  // ── 1. Responsive cols ──────────────────────────────────────────────
  // Auto: how many default-sized cells fit in viewport width?
  // Clamp to [2, baseMosaic.cols] — never more than desktop, never less than 2
  const autoCols = Math.max(2, Math.min(baseMosaic.cols, Math.floor(visW / baseMosaic.cellSize)));
  const cols = isMobile ? autoCols : baseMosaic.cols;

  // ── 1b. Scale multi-span blocks to fill full row on mobile ──────────
  // Prevents trailing gaps (e.g. IPO span=2 on 3-col → gap in last row).
  // On mobile with fewer cols, scale any multi-span to fill the full row.
  const spanBlocks =
    isMobile && cols < (baseMosaic.cols ?? cols)
      ? Object.fromEntries(
          Object.entries(baseMosaic.spanBlocks ?? {}).map(([id, span]) => [
            Number(id),
            (span as number) > 1 ? cols : 1,
          ]),
        )
      : baseMosaic.spanBlocks;

  // ── 2. Row count (pure function, supports spanBlocks with clamping) ─
  const rows = getMosaicRows(blocks, cols, spanBlocks);

  // ── 3. Safe paddings in world units ─────────────────────────────────
  // Header only occludes TOP of the viewport, not all sides.
  // Using symmetric "header pad * 2" can force cellSize below fit bounds on
  // short viewports, and a hard minCell then causes bottom clipping.
  const headerWorld = headerPx / zoom;
  const padX = baseMosaic.gap; // side breathing room
  const padTop = headerWorld + baseMosaic.gap; // reserve area under fixed header
  const padBottom = baseMosaic.gap; // bottom breathing room

  // ── 4. Adaptive cellSize — fit grid into visible area ───────────────
  const maxByH = (visH - (rows - 1) * baseMosaic.gap - padTop - padBottom) / rows;
  const maxByW = (visW - (cols - 1) * baseMosaic.gap - padX * 2) / cols;

  // Never upscale above default. Keep fit as the hard guarantee so the final
  // row cannot be clipped on shorter viewports.
  const maxCell = baseMosaic.cellSize; // from config, not a magic number
  const fittedCell = Math.min(maxByH, maxByW, maxCell);
  // Floor at 0.6 — small enough to guarantee fit on any viewport,
  // large enough to keep block labels legible at the mosaic zoom level.
  const cellSize = Math.max(0.6, fittedCell);

  // ── 5. Label scaling — proportional to cell size ────────────────────
  const scale = cellSize / defaultMosaic.cellSize;
  const labelFontSize = labels.fontSize * scale;
  const labelMaxWidth = labels.maxWidth * scale;

  return {
    ...baseMosaic,
    cols,
    cellSize,
    spanBlocks,
    rows,
    labelFontSize,
    labelMaxWidth,
  };
}
