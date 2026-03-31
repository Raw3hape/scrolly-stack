/**
 * BlueprintGrid — Interactive architectural grid with spring-physics + colored tiles.
 *
 * Each grid intersection is a particle that gently deflects from the mouse and
 * springs back. Cells near the cursor reveal small colored tiles using brand colors.
 *
 * Performance:
 * - Typed Float32Arrays for positions/velocities (GC-free)
 * - Only dots within repulsion radius get force applied
 * - Mobile (hover: none) → static render, zero event listeners
 * - Single rAF loop, self-stopping when particles settle
 * - CSS mask-image handles gradient fade (GPU composited)
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { palette } from '@/config/palette';
import './BlueprintGrid.css';

// =============================================================================
// CONFIG — All tunable parameters
// =============================================================================

/** Parse a hex color string (e.g. '#103740') into { r, g, b } */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

const CFG = {
  /** Grid cell size (CSS px) */
  cellSize: 40,

  // --- Visual ---
  color: hexToRgb(palette.anchor900), // brand teal
  lineAlpha: 0.06,
  lineWidth: 0.5,
  dotRadius: 1.6,
  dotAlpha: 0.1,

  // --- Physics (very gentle — ~2% displacement) ---
  repelRadius: 100,
  repelStrength: 0.8,
  springK: 0.04,
  damping: 0.92,
  glowAlpha: 0.22,

  // --- Colored tiles ---
  tileRadius: 180, // how far from cursor tiles appear (CSS px)
  tileInset: 0.25, // tile inset ratio (0.25 = 25% of cell, centered)
  tilePeakAlpha: 0.14, // max tile opacity at cursor center
  tileColors: [
    palette.anchor900, // Anchor deep teal
    '#1b6969', // Teal 500 (no exact palette match)
    palette.teal500, // Systems teal
    palette.green500, // Growth green
    palette.gold500, // Value gold
    '#8cd3d2', // Light teal (no exact palette match)
    palette.gold300, // Gold 300
    '#004f50', // Dark teal (no exact palette match)
  ],

  maxDpr: 2,
} as const;

// =============================================================================
// HELPERS
// =============================================================================

function rgba(c: typeof CFG.color, a: number): string {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

/** Deterministic color for a grid cell based on position */
function tileColorForCell(col: number, row: number): string {
  const hash = ((col * 7 + row * 13) ^ (col * 3 + row * 11)) & 0x7fffffff;
  return CFG.tileColors[hash % CFG.tileColors.length];
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function BlueprintGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const stateRef = useRef<{
    cols: number;
    rows: number;
    ox: Float32Array;
    oy: Float32Array;
    cx: Float32Array;
    cy: Float32Array;
    vx: Float32Array;
    vy: Float32Array;
    w: number;
    h: number;
    dpr: number;
    mouseX: number;
    mouseY: number;
    mouseActive: boolean;
    running: boolean;
    animating: boolean;
  } | null>(null);
  const rafRef = useRef(0);

  // --- Build grid data ---
  const buildGrid = useCallback((w: number, h: number, dpr: number) => {
    const step = CFG.cellSize * dpr;
    const cols = Math.ceil(w / step) + 2;
    const rows = Math.ceil(h / step) + 2;
    const n = cols * rows;

    const ox = new Float32Array(n);
    const oy = new Float32Array(n);
    const cx = new Float32Array(n);
    const cy = new Float32Array(n);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const x = col * step;
        const y = row * step;
        ox[i] = x;
        oy[i] = y;
        cx[i] = x;
        cy[i] = y;
      }
    }

    return {
      cols,
      rows,
      ox,
      oy,
      cx,
      cy,
      vx,
      vy,
      w,
      h,
      dpr,
      mouseX: -9999,
      mouseY: -9999,
      mouseActive: false,
      running: true,
      animating: false,
    };
  }, []);

  // --- Physics step ---
  const simulate = useCallback(() => {
    const s = stateRef.current;
    if (!s) return false;

    const { cols, rows, ox, oy, cx, cy, vx: svx, vy: svy, dpr } = s;
    const repelR = CFG.repelRadius * dpr;
    const repelR2 = repelR * repelR;
    const mx = s.mouseX * dpr;
    const my = s.mouseY * dpr;
    const hasInput = s.mouseActive && s.mouseX > -999;

    let totalMotion = 0;
    const n = cols * rows;

    for (let i = 0; i < n; i++) {
      // Spring toward rest position
      let fx = (ox[i] - cx[i]) * CFG.springK;
      let fy = (oy[i] - cy[i]) * CFG.springK;

      // Mouse repulsion
      if (hasInput) {
        const dmx = cx[i] - mx;
        const dmy = cy[i] - my;
        const dist2 = dmx * dmx + dmy * dmy;

        if (dist2 < repelR2 && dist2 > 1) {
          const dist = Math.sqrt(dist2);
          const t = 1 - dist / repelR;
          const force = t * t * CFG.repelStrength * dpr;
          fx += (dmx / dist) * force;
          fy += (dmy / dist) * force;
        }
      }

      svx[i] = (svx[i] + fx) * CFG.damping;
      svy[i] = (svy[i] + fy) * CFG.damping;
      cx[i] += svx[i];
      cy[i] += svy[i];

      totalMotion += Math.abs(svx[i]) + Math.abs(svy[i]);
    }

    return totalMotion > 0.01;
  }, []);

  // --- Draw ---
  const draw = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const { cols, rows, cx, cy, ox, oy, dpr } = s;
    const step = CFG.cellSize * dpr;
    const dotR = CFG.dotRadius * dpr;
    const repelR = CFG.repelRadius * dpr;
    const tileR = CFG.tileRadius * dpr;
    const mx = s.mouseX * dpr;
    const my = s.mouseY * dpr;
    const hasInput = s.mouseActive && s.mouseX > -999;

    ctx.clearRect(0, 0, s.w, s.h);

    // ── 1. Colored tiles (behind everything) ──
    if (hasInput) {
      const inset = CFG.tileInset * step;
      const tileSize = step - inset * 2;
      const tileR2 = tileR * tileR;

      // Determine cell range near mouse
      const startCol = Math.max(0, Math.floor((mx - tileR) / step));
      const endCol = Math.min(cols - 2, Math.ceil((mx + tileR) / step));
      const startRow = Math.max(0, Math.floor((my - tileR) / step));
      const endRow = Math.min(rows - 2, Math.ceil((my + tileR) / step));

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          // Cell center
          const cellCx = (col + 0.5) * step;
          const cellCy = (row + 0.5) * step;
          const ddx = cellCx - mx;
          const ddy = cellCy - my;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 > tileR2) continue;

          const dist = Math.sqrt(dist2);
          const t = 1 - dist / tileR;
          const alpha = t * t * CFG.tilePeakAlpha;

          // Use displaced corner positions for the tile rectangle
          const i = row * cols + col;
          const tileX = cx[i] + inset;
          const tileY = cy[i] + inset;

          ctx.fillStyle = tileColorForCell(col, row);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          // Rounded rect for a softer look
          const r = 3 * dpr;
          ctx.roundRect(tileX, tileY, tileSize, tileSize, r);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // ── 2. Grid lines ──
    ctx.lineWidth = CFG.lineWidth * dpr;
    ctx.strokeStyle = rgba(CFG.color, CFG.lineAlpha);
    ctx.beginPath();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const x = cx[i];
        const y = cy[i];

        if (col < cols - 1) {
          const j = i + 1;
          ctx.moveTo(x, y);
          ctx.lineTo(cx[j], cy[j]);
        }
        if (row < rows - 1) {
          const j = i + cols;
          ctx.moveTo(x, y);
          ctx.lineTo(cx[j], cy[j]);
        }
      }
    }
    ctx.stroke();

    // ── 3. Dots ──
    for (let i = 0, n = cols * rows; i < n; i++) {
      const x = cx[i];
      const y = cy[i];

      let alpha = CFG.dotAlpha;
      let radius = dotR;

      // Glow near cursor
      if (hasInput) {
        const dmx = x - mx;
        const dmy = y - my;
        const dist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dist < repelR) {
          const t = 1 - dist / repelR;
          alpha += t * t * CFG.glowAlpha;
          radius += t * dotR * 1.0;
        }
      }

      // Glow from displacement
      const disp = Math.sqrt((cx[i] - ox[i]) ** 2 + (cy[i] - oy[i]) ** 2);
      if (disp > 0.5) {
        const dt = Math.min(disp / (15 * dpr), 1);
        alpha += dt * CFG.glowAlpha * 0.5;
        radius += dt * dotR * 0.4;
      }

      ctx.fillStyle = rgba(CFG.color, Math.min(alpha, 0.45));
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // --- Setup ---
  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Cache 2D context (avoids getContext on every draw frame)
    ctxRef.current = canvas.getContext('2d');

    const prev = stateRef.current;
    const state = buildGrid(w, h, dpr);
    if (prev) {
      state.mouseX = prev.mouseX;
      state.mouseY = prev.mouseY;
      state.mouseActive = prev.mouseActive;
    }
    stateRef.current = state;
    draw();
  }, [buildGrid, draw]);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    setup();

    const parent = canvasRef.current?.parentElement;
    let ro: ResizeObserver | undefined;
    if (parent) {
      ro = new ResizeObserver(() => setup());
      ro.observe(parent);
    }

    if (!isTouch) {
      const tick = () => {
        const s = stateRef.current;
        if (!s || !s.running) return;
        const moving = simulate();
        draw();
        if (moving || s.mouseActive) {
          s.animating = true;
          rafRef.current = requestAnimationFrame(tick);
        } else {
          s.animating = false;
          draw();
        }
      };
      const s = stateRef.current;
      if (s) {
        s.running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    return () => {
      if (stateRef.current) stateRef.current.running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro?.disconnect();
    };
  }, [setup, simulate, draw]);

  const ensureAnimating = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.animating) return;
    s.animating = true;
    const tick = () => {
      if (!s.running) return;
      const moving = simulate();
      draw();
      if (moving || s.mouseActive) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        s.animating = false;
        draw();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [simulate, draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      s.mouseX = e.clientX - rect.left;
      s.mouseY = e.clientY - rect.top;
      s.mouseActive = true;
      ensureAnimating();
    },
    [ensureAnimating],
  );

  const handleMouseLeave = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.mouseActive = false;
    s.mouseX = -9999;
    s.mouseY = -9999;
    ensureAnimating();
  }, [ensureAnimating]);

  return (
    <div
      className={`blueprint-grid${className ? ` ${className}` : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: 'auto' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
    </div>
  );
}
