/**
 * InteractiveGrid — Mouse-reactive grid of subtle, elegant squares.
 *
 * Renders a grid of cells over its parent container.
 * On mouse hover, cells near the cursor softly glow, creating a
 * living, responsive background texture.
 *
 * Architecture:
 *   - Grid cells are pure divs with no content
 *   - On mousemove, we compute proximity from cursor to each cell center
 *   - Cells within a radius get a soft opacity glow
 *   - All computation is rAF-throttled for 60fps
 *   - On mobile: grid is hidden via CSS (no mouse events)
 *
 * Props:
 *   - cols: number of columns (default: 12)
 *   - rows: number of rows (default: 6)
 *   - glowRadius: radius of influence in grid cells (default: 3)
 *   - glowIntensity: max opacity of glow (default: 0.08)
 */

'use client';

import { useRef, useCallback, useMemo, useEffect } from 'react';
import './InteractiveGrid.css';

interface InteractiveGridProps {
  /** Number of grid columns. Default: 12 */
  cols?: number;
  /** Number of grid rows. Default: 6 */
  rows?: number;
  /** Radius of glow influence in grid-cell units. Default: 3 */
  glowRadius?: number;
  /** Max opacity of the cell glow (0-1). Default: 0.08 */
  glowIntensity?: number;
}

export default function InteractiveGrid({
  cols = 12,
  rows = 6,
  glowRadius = 3,
  glowIntensity = 0.08,
}: InteractiveGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const totalCells = cols * rows;

  // Pre-compute cell positions (col, row) for proximity calculation
  const cellPositions = useMemo(() => {
    const positions: Array<{ col: number; row: number }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({ col: c, row: r });
      }
    }
    return positions;
  }, [cols, rows]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const grid = gridRef.current;
      if (!grid) return;

      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const rect = grid.getBoundingClientRect();
        // Normalized mouse position in grid-cell coordinates
        const mx = ((e.clientX - rect.left) / rect.width) * cols;
        const my = ((e.clientY - rect.top) / rect.height) * rows;

        const radiusSq = glowRadius * glowRadius;

        for (let i = 0; i < totalCells; i++) {
          const cell = cellRefs.current[i];
          if (!cell) continue;

          const { col, row } = cellPositions[i];
          // Distance from cell center to mouse (in grid units)
          const dx = col + 0.5 - mx;
          const dy = row + 0.5 - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq) {
            const proximity = 1 - Math.sqrt(distSq) / glowRadius;
            const opacity = proximity * proximity * glowIntensity;
            cell.style.backgroundColor = `rgba(255, 255, 255, ${opacity.toFixed(4)})`;
            cell.style.borderColor = `rgba(255, 255, 255, ${(opacity * 1.5).toFixed(4)})`;
          } else {
            cell.style.backgroundColor = '';
            cell.style.borderColor = '';
          }
        }
      });
    },
    [cols, rows, glowRadius, glowIntensity, totalCells, cellPositions],
  );

  const handleMouseLeave = useCallback(() => {
    // Clear all cell glow on leave
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    for (let i = 0; i < totalCells; i++) {
      const cell = cellRefs.current[i];
      if (!cell) continue;
      cell.style.backgroundColor = '';
      cell.style.borderColor = '';
    }
  }, [totalCells]);

  // Attach mouse listeners to grid
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    grid.addEventListener('mousemove', handleMouseMove, { passive: true });
    grid.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={gridRef}
      className="interactive-grid interactive-grid--active"
      style={
        {
          '--grid-cols': cols,
          '--grid-rows': rows,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {Array.from({ length: totalCells }, (_, i) => (
        <div
          key={i}
          ref={(el) => { cellRefs.current[i] = el; }}
          className="interactive-grid__cell"
        />
      ))}
    </div>
  );
}
