/**
 * useAdaptiveFinalZoom — Compute optimal mosaic camera zoom from viewport.
 *
 * Instead of a hardcoded `finalZoom`, this hook dynamically computes the zoom
 * level that makes the mosaic grid fill the viewport with:
 *   - Clearance for the fixed header (read from CSS `--header-height`)
 *   - Breathing-room gaps on all sides
 *
 * Math (no circular dependency):
 *   gridW = cols × cellSize + (cols−1) × gap
 *   gridH = rows × cellSize + (rows−1) × gap
 *   zoomByWidth  = viewportW / (gridW + padX)
 *   zoomByHeight = (viewportH − headerPx) / (gridH + padY)
 *   adaptiveZoom = min(zoomByWidth, zoomByHeight)
 *
 * Cell sizes use the DEFAULT from config (not the adaptive shrunk value).
 * useAdaptiveMosaic then refines cellSize within this zoom — they converge.
 *
 * USAGE: Called in Scene.tsx (outside <Canvas>), so uses window dimensions
 * instead of useThree(). Debounced via the same resize pattern as useResponsiveZoom.
 */

import { useState, useEffect, useCallback } from 'react';
import { animation } from '../config';
import type { ResolvedMosaic } from '../VariantContext';

/** Minimum zoom — prevents the grid from becoming invisibly tiny */
const MIN_ZOOM = 30;

export default function useAdaptiveFinalZoom(
  mosaicConfig: ResolvedMosaic,
  totalBlocks: number,
): number {
  const compute = useCallback(() => {
    if (typeof window === 'undefined') return mosaicConfig.camera.finalZoom;

    const isMobile = window.innerWidth <= animation.zoom.mobileBreakpoint;
    if (isMobile) {
      // On mobile, grid uses mobile zoom pathway — no adaptive override
      return mosaicConfig.camera.finalZoom;
    }

    // ── Read header height from CSS tokens ──────────────────────────────
    const root = getComputedStyle(document.documentElement);
    const headerPx = parseFloat(root.getPropertyValue('--header-height')) || 0;

    // ── Grid dimensions in world units ──────────────────────────────────
    const { cols, cellSize, gap, spanBlocks } = mosaicConfig;

    // Row count — derived from total blocks + span adjustments
    const spanExtra = Object.values(spanBlocks ?? {})
      .reduce((sum, span) => sum + (span - 1), 0);
    const effectiveCells = totalBlocks + spanExtra;
    const rows = Math.ceil(effectiveCells / cols);

    const gridW = cols * cellSize + (cols - 1) * gap;
    const gridH = rows * cellSize + (rows - 1) * gap;

    // Padding: breathing room so tiles don't touch edges
    const padX = gap * 2;         // left + right
    const padY = gap * 2;         // above grid (below header) + bottom

    // ── Optimal zoom: largest zoom where grid fits in both axes ─────────
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    const zoomByWidth = vpW / (gridW + padX);
    const zoomByHeight = (vpH - headerPx) / (gridH + padY);

    return Math.max(MIN_ZOOM, Math.min(zoomByWidth, zoomByHeight));
  }, [mosaicConfig, totalBlocks]);

  const [zoom, setZoom] = useState(compute);

  useEffect(() => {
    // Debounce — iOS address bar show/hide fires rapid resize events
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setZoom(compute()), 150);
    };
    setZoom(compute()); // initial (no debounce)
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [compute]);

  return zoom;
}
