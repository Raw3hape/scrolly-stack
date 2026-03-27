/**
 * heroLayout — Reads hero 3D layout tokens from CSS custom properties.
 *
 * Mirrors the pattern used by Stack.tsx (lines 164–172) for reading
 * --content-width from the design system. All values come from
 * spacing.css tokens — no hardcoded magic numbers.
 *
 * Tokens read:
 *   --hero-text-col        → text column fraction (e.g. "55%" → 0.55)
 *   --hero-3d-gap-ratio    → safe gap as fraction of container width
 *   --hero-3d-fill         → model fill factor for static models
 *   --hero-3d-fill-animated → fill factor for models with hover animation
 *   --hero-3d-fill-mobile  → fill factor in stacked mobile layout
 */

import { BREAKPOINTS } from '@/config/breakpoints';
import { SELECTOR_HERO_VARIANTS, SELECTOR_HERO_SPLIT, SELECTOR_HERO_BASE } from '@/config/dom-contracts';

export interface HeroLayout {
  /** Text column width as fraction of container (0–1) */
  textColRatio: number;
  /** Safe gap between text and model as fraction of container */
  gapRatio: number;
  /** Model fill factor within available space (0–1) */
  fill: number;
  /** Fill factor for animated models (0–1) */
  fillAnimated: number;
  /** Fill factor on mobile (0–1) */
  fillMobile: number;
  /** Whether the viewport is below the mobile breakpoint */
  isMobile: boolean;
}

/** Parse a CSS custom property value like "55%" → 0.55, or "0.04" → 0.04 */
function parseCssRatio(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  if (trimmed.endsWith('%')) return parseFloat(trimmed) / 100;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Read hero layout tokens from CSS custom properties on :root.
 * Call this in a useEffect or useLayoutEffect (client-only).
 */
export function readHeroLayout(): HeroLayout {
  const styles = getComputedStyle(document.documentElement);
  const isMobile = window.innerWidth <= BREAKPOINTS.md;

  return {
    textColRatio: parseCssRatio(styles.getPropertyValue('--hero-text-col'), 0.55),
    gapRatio: parseCssRatio(styles.getPropertyValue('--hero-3d-gap-ratio'), 0.04),
    fill: parseCssRatio(styles.getPropertyValue('--hero-3d-fill'), 0.80),
    fillAnimated: parseCssRatio(styles.getPropertyValue('--hero-3d-fill-animated'), 0.70),
    fillMobile: parseCssRatio(styles.getPropertyValue('--hero-3d-fill-mobile'), 0.85),
    isMobile,
  };
}

/**
 * Compute the 3D world-space X offset to center the model
 * in the space right of the text column.
 *
 * @param layout - hero layout tokens from readHeroLayout()
 * @param visibleW - visible world width at z=0 (from frustum calculation)
 */
export function computeModelXOffset(layout: HeroLayout, visibleW: number): number {
  if (layout.isMobile) return 0;

  // Model left boundary = text right edge + safe gap
  const modelLeftEdge = layout.textColRatio + layout.gapRatio;

  // Center of the remaining space
  const modelCenterRatio = modelLeftEdge + (1 - modelLeftEdge) / 2;

  // Convert from [0,1] screen ratio to 3D world offset
  // NDC = ratio * 2 - 1, then world = NDC * visibleW / 2
  return (modelCenterRatio * 2 - 1) * visibleW / 2;
}

/**
 * Compute the available world-space width for the model.
 *
 * @param layout - hero layout tokens
 * @param visibleW - visible world width at z=0
 */
export function computeAvailableWidth(layout: HeroLayout, visibleW: number): number {
  if (layout.isMobile) return visibleW;
  const modelLeftEdge = layout.textColRatio + layout.gapRatio;
  return (1 - modelLeftEdge) * visibleW;
}

// ─── Vertical Alignment (DOM Measurement) ────────────────────────────────────

export interface HeroTextMeasurement {
  /** Text center Y offset from canvas center, in pixels.
   *  Positive = text center is above canvas center → model moves UP. */
  textCenterOffsetPx: number;
}

/**
 * Measure the text content block's vertical center relative to the canvas container.
 * Finds [data-hero-text] (set in HeroSection.tsx) within the same hero section.
 *
 * Same DOM-measurement approach as Stack.tsx (lines 154–190).
 */
export function measureTextCenter(canvasContainer: HTMLElement): HeroTextMeasurement | null {
  const hero = canvasContainer.closest(SELECTOR_HERO_VARIANTS);
  if (!hero) return null;

  const textEl = hero.querySelector('[data-hero-text]') as HTMLElement | null;
  if (!textEl) return null;

  const canvasRect = canvasContainer.getBoundingClientRect();
  const textRect = textEl.getBoundingClientRect();

  const canvasCenterY = canvasRect.top + canvasRect.height / 2;
  const textCenterY = textRect.top + textRect.height / 2;

  return { textCenterOffsetPx: canvasCenterY - textCenterY };
}

/**
 * Convert pixel offset to 3D world-space Y offset.
 *
 * @param measurement - from measureTextCenter()
 * @param visibleH - visible world height at z=0
 * @param canvasHeightPx - canvas pixel height (size.height from useThree)
 * @param isMobile - skip offset in stacked mobile layout
 */
export function computeModelYOffset(
  measurement: HeroTextMeasurement | null,
  visibleH: number,
  canvasHeightPx: number,
  isMobile: boolean,
): number {
  if (!measurement || isMobile) return 0;
  return (measurement.textCenterOffsetPx / canvasHeightPx) * visibleH;
}

// ─── Container Width Measurement (for canvas extension) ─────────────────────

/**
 * Measure the container content width — the "design intent" width of the hero,
 * before the canvas extends to the viewport right edge for rotation headroom.
 *
 * Used with camera.setViewOffset() to keep model positioning calibrated
 * to the container while the canvas renders a wider area.
 */
export function measureContainerContentWidth(canvasContainer: HTMLElement): number | null {
  const split = canvasContainer.closest(SELECTOR_HERO_SPLIT);
  if (split) return (split as HTMLElement).clientWidth;
  const hero = canvasContainer.closest(SELECTOR_HERO_BASE);
  if (hero) return (hero as HTMLElement).clientWidth;
  return null;
}

// ─── Isometric Screen-to-World Conversion ───────────────────────────────────

/**
 * Convert screen-space X/Y offsets to world-space position for the
 * isometric orthographic camera at [d, d, d] with up [0, 1, 0].
 *
 * Derived from camera geometry (same math as Stack.tsx ISO_PROJECTION):
 *   forward = normalize(-1, -1, -1)
 *   screenRight = normalize(forward × up) = (1/√2, 0, -1/√2)
 *   screenUp = normalize(screenRight × forward) = (-1/√6, 2/√6, -1/√6)
 *
 * worldPos = screenX × screenRight + screenY × screenUp
 */
export function isoScreenToWorld(screenX: number, screenY: number): [number, number, number] {
  const INV_SQRT2 = 1 / Math.SQRT2;        // ≈ 0.7071
  const INV_SQRT6 = 1 / Math.sqrt(6);      // ≈ 0.4082
  const TWO_INV_SQRT6 = 2 * INV_SQRT6;     // ≈ 0.8165
  return [
    screenX * INV_SQRT2 - screenY * INV_SQRT6,
    screenY * TWO_INV_SQRT6,
    -screenX * INV_SQRT2 - screenY * INV_SQRT6,
  ];
}
