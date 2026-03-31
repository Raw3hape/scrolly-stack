/**
 * Easing Functions for Mosaic Transition
 *
 * Pure math — no dependencies. Used by mosaicLayout.ts and Stack.tsx
 * to create premium, Apple-quality motion curves.
 *
 * Reference: https://easings.net/
 */

/** Linear (identity) */
export function linear(t: number): number {
  return t;
}

/** Ease Out Quad — decelerating */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/** Ease Out Cubic — smooth deceleration (primary morph easing) */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease Out Quart — strong deceleration */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/** Ease In Out Cubic — smooth S-curve */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Ease Out Back — slight overshoot */
export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** Ease In Out Quint — very smooth */
export function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

/**
 * Remap a value from global progress to a sub-range [start, end].
 * Returns 0 before start, 1 after end, and 0→1 within the range.
 */
export function remapProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/**
 * Remap a progress range and smooth it with the shared cubic easing.
 */
export function smoothProgress(progress: number, start: number, end: number): number {
  return easeInOutCubic(remapProgress(progress, start, end));
}

/**
 * Clamp a number to [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two numbers.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linear interpolation between two 3D vectors.
 */
export function lerpV3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/**
 * Quadratic Bezier curve interpolation for arc trajectories.
 * P0 = start, P1 = control point, P2 = end
 */
export function quadraticBezierV3(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  t: number,
): [number, number, number] {
  const oneMinusT = 1 - t;
  const a = oneMinusT * oneMinusT;
  const b = 2 * oneMinusT * t;
  const c = t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0],
    a * p0[1] + b * p1[1] + c * p2[1],
    a * p0[2] + b * p1[2] + c * p2[2],
  ];
}
