/**
 * Preset configurations for HeroGridCanvas.
 *
 * HERO_GRID_FULLSCREEN — Homepage scrolly-experience hero (large square grid, demand rendering)
 * HERO_GRID_SECTION   — Page-section hero backgrounds (rectangular grid, continuous rendering)
 */

import { palette } from '@/config/palette';
import type { HeroGridConfig } from './types';

/**
 * Full-screen homepage hero grid.
 * Large NxN grid, per-tile Tile components, Environment lighting,
 * demand-based frameloop for performance.
 */
export const HERO_GRID_FULLSCREEN: HeroGridConfig = {
  breakpoints: [
    { minWidth: 1024, cols: 18, rows: 18 },
    { minWidth: 640, cols: 14, rows: 14 },
    { minWidth: 0, cols: 10, rows: 10 },
  ],

  tile: {
    size: 0.7,
    baseHeight: 0.12,
    gap: 0.08,
    borderRadius: 0.035,
    smoothness: 3,
  },

  wave: {
    amplitude: 0.12,
    frequency: 0.3,
    phaseSpread: 0.6,
  },

  hover: {
    radius: 4.0,
    maxElevation: 0.8,
    falloffPower: 2.5,
    lerpSpeed: 0.06,
    resetSpeed: 0.03,
    gaussian: false,
    disableOnMobile: false,
  },

  camera: {
    position: [4, 12, 4],
    zoom: 48,
    zoomByBreakpoint: [1.0, 0.75, 0.55],
  },

  colors: {
    base: palette.sand100,
    mid: palette.sand300,
    hover: palette.teal100,
  },

  material: {
    roughness: 0.45,
    metalness: 0.0,
    envMapIntensity: 0.15,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    sheen: 0.1,
    sheenRoughness: 0.5,
    sheenColor: palette.sand50,
    iridescence: 0.08,
    iridescenceIOR: 1.3,
  },

  lighting: {
    ambientIntensity: 0.45,
    mainPosition: [3, 16, 3],
    mainIntensity: 1.4,
    envPreset: 'sunset',
    envIntensity: 0.2,
  },

  render: {
    dpr: [1, 1.5],
    frameloop: 'demand',
    className: 'v2-hero__canvas-bg',
    adaptiveZoom: false,
    iosOptimize: false,
    hideOnReducedMotion: false,
  },
};

/**
 * Section-level hero grid (e.g. investors page).
 * Rectangular grid, continuous rendering, adaptive zoom,
 * iOS material optimizations, Gaussian hover falloff.
 */
export const HERO_GRID_SECTION: HeroGridConfig = {
  breakpoints: [
    { minWidth: 768, cols: 16, rows: 12 },
    { minWidth: 0, cols: 10, rows: 10 },
  ],

  tile: {
    size: 0.8,
    baseHeight: 0.12,
    gap: 0.22,
    borderRadius: 0.04,
    smoothness: 3,
  },

  wave: {
    amplitude: 0.04,
    frequency: 0.3,
    phaseSpread: 0.45,
  },

  hover: {
    radius: 6.0,
    maxElevation: 0.14,
    falloffPower: 2.0,
    lerpSpeed: 0.06,
    resetSpeed: 0.03,
    gaussian: true,
    gaussianFalloff: 0.3,
    disableOnMobile: true,
  },

  camera: {
    position: [0, 50, 0],
    up: [0, 0, -1],
    zoom: 28,
    zoomByBreakpoint: [1.0, 0.786],
  },

  colors: {
    base: palette.sand100,
    hover: palette.teal100,
    hoverIntense: palette.tealExLight,
  },

  material: {
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.12,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    sheen: 0.15,
    sheenRoughness: 0.5,
    sheenColor: palette.sand50,
    iridescence: 0.15,
    iridescenceIOR: 1.3,
  },

  lighting: {
    ambientIntensity: 0.2,
    mainPosition: [5, 14, 5],
    mainIntensity: 1.8,
    fillPosition: [-6, 12, -6],
    fillIntensity: 0.08,
    fillColor: palette.ambientLight,
  },

  render: {
    dpr: [1, 2],
    frameloop: 'always',
    className: 'v2-hero__grid-canvas',
    adaptiveZoom: true,
    iosOptimize: true,
    hideOnReducedMotion: true,
  },
};
