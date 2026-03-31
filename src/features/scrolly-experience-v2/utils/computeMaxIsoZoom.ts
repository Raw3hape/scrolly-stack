/**
 * computeMaxIsoZoom — Pure function for viewport-adaptive isometric zoom cap.
 *
 * Computes the maximum camera zoom at which the full 3D stack fits
 * in the viewport below the header, accounting for isometric projection
 * of all three world axes onto screen-Y.
 *
 * Shared between Scene.tsx (camera zoom) and Stack.tsx (position compensation)
 * to prevent desync between where the cube IS and where the camera SEES it.
 *
 * @returns Maximum zoom that keeps the cube fully visible below the header.
 */

import { animation } from '../config';
import type { ResolvedGeometry } from '../VariantContext';
import type { LayerData } from '../types';

/** Breathing room — 0.82 = fill 82% of available height */
const FIT_MARGIN = 0.82;

export function computeMaxIsoZoom(layers: LayerData[], geo: ResolvedGeometry): number {
  if (typeof window === 'undefined') return animation.zoom.desktop;

  // ── Stack height from layers + geometry ─────────────────────────────
  const { layerHeight, totalWidth, totalDepth } = geo.stack;
  const gapV = geo.gaps.vertical;
  let stackHeight = 0;
  for (const layer of layers) {
    if (layer.layout === 'full') {
      stackHeight += layer.blocks.length * (layerHeight + gapV);
    } else {
      stackHeight += layerHeight + gapV;
    }
  }

  // ── Isometric projection factors (from camera config, zero hardcode) ─
  const pos = animation.camera.positions.isometric as [number, number, number];
  const up = animation.camera.upVectors.isometric as [number, number, number];
  const len = Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2);
  const fwd = [-pos[0] / len, -pos[1] / len, -pos[2] / len];
  const dotUpFwd = up[0] * fwd[0] + up[1] * fwd[1] + up[2] * fwd[2];
  const trueUp = [up[0] - dotUpFwd * fwd[0], up[1] - dotUpFwd * fwd[1], up[2] - dotUpFwd * fwd[2]];
  const trueUpLen = Math.sqrt(trueUp[0] ** 2 + trueUp[1] ** 2 + trueUp[2] ** 2);

  // Visual height = projection of ALL THREE axes onto screen-Y
  const visualHeight =
    stackHeight * Math.abs(trueUp[1] / trueUpLen) + // Y axis (stack height)
    totalWidth * Math.abs(trueUp[0] / trueUpLen) + // X axis (isometric tilt)
    totalDepth * Math.abs(trueUp[2] / trueUpLen); // Z axis (isometric tilt)

  // ── Header + viewport ───────────────────────────────────────────────
  const root = getComputedStyle(document.documentElement);
  const isMobile = window.innerWidth <= animation.zoom.mobileBreakpoint;
  const prop = isMobile ? '--header-height-mobile' : '--header-height';
  const headerPx =
    parseFloat(root.getPropertyValue(prop)) ||
    parseFloat(root.getPropertyValue('--header-height')) ||
    0;
  const vpH = window.innerHeight;

  // On mobile, the cube is visible through the entire viewport (hero is
  // transparent, steps use glass backgrounds). Cube position centering is
  // handled by Stack.tsx heroBottomRef, not by a CSS token.
  const availableH = vpH - headerPx;

  return (FIT_MARGIN * availableH) / visualHeight;
}
