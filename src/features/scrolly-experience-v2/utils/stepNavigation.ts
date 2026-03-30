/**
 * Step Navigation Utilities
 *
 * Single source of truth for the hero-step sentinel value and step-element
 * DOM ID convention. Eliminates magic `-1` scattered across Scene, Overlay,
 * and Stack, and centralises the `step-${id}` contract between Overlay
 * (which sets the DOM id) and Scene (which reads it via getElementById).
 */

/** Sentinel value for the hero (top-down) camera state. */
export const HERO_STEP = -1;

/** Type guard: is this the hero state? */
export const isHeroStep = (step: number): boolean => step === HERO_STEP;

/**
 * DOM id shared between Overlay (sets `id`) and Scene (reads via getElementById).
 * Changing this format requires updating both consumers.
 */
export const getStepElementId = (id: number): string => `step-${id}`;
