/**
 * Breakpoints — Foundation Projects
 *
 * Single source of truth for responsive breakpoints used in JavaScript.
 * CSS cannot use custom properties in media queries, so CSS files
 * use raw px values with a @bp-{name} comment convention.
 *
 * RESKIN: Update values here AND in each CSS media query
 *         (search for @bp-sm, @bp-md, @bp-lg, @bp-content).
 */

export const BREAKPOINTS = {
  /** 480px — Small mobile (stacked layouts) */
  sm: 480,
  /** 640px — Content threshold (2-col grid kicks in) */
  content: 640,
  /** 768px — Tablet / mobile-desktop threshold */
  md: 768,
  /** 1024px — Desktop (side-by-side scrolly layout) */
  lg: 1024,
} as const;

/** Media query helpers for JS (e.g. window.matchMedia) */
export const MQ = {
  smDown: `(max-width: ${BREAKPOINTS.sm}px)`,
  mdDown: `(max-width: ${BREAKPOINTS.md}px)`,
  lgDown: `(max-width: ${BREAKPOINTS.lg}px)`,
  mdUp: `(min-width: ${BREAKPOINTS.md + 1}px)`,
  lgUp: `(min-width: ${BREAKPOINTS.lg + 1}px)`,
  contentUp: `(min-width: ${BREAKPOINTS.content}px)`,
} as const;
