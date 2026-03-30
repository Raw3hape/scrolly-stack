/**
 * HeroGridConfig — Configurable parameters for the shared HeroGridCanvas.
 *
 * Two presets are provided:
 *   - HERO_GRID_FULLSCREEN: for the scrolly-experience homepage hero
 *   - HERO_GRID_SECTION: for the investors hero / page section backgrounds
 */

export interface HeroGridConfig {
  /** Grid density per breakpoint. Each entry: { minWidth, cols, rows }. Ordered desktop-first. */
  breakpoints: Array<{
    minWidth: number;
    cols: number;
    rows: number;
  }>;

  /** Tile / block geometry */
  tile: {
    size: number;
    baseHeight: number;
    gap: number;
    borderRadius: number;
    smoothness: number;
  };

  /** Idle wave / breathing animation */
  wave: {
    amplitude: number;
    frequency: number;
    phaseSpread: number;
  };

  /** Hover / cursor proximity effect */
  hover: {
    radius: number;
    maxElevation: number;
    falloffPower: number;
    lerpSpeed: number;
    resetSpeed: number;
    /** If true, use Gaussian falloff; otherwise use polynomial falloff */
    gaussian: boolean;
    /** Gaussian falloff parameter (only used when gaussian=true) */
    gaussianFalloff?: number;
    /** If true, disable hover on mobile */
    disableOnMobile: boolean;
  };

  /** Camera configuration */
  camera: {
    position: [number, number, number];
    up?: [number, number, number];
    zoom: number;
    /** Zoom multiplier per breakpoint index (same order as breakpoints). If omitted, zoom is constant. */
    zoomByBreakpoint?: number[];
  };

  /** Color palette */
  colors: {
    base: string;
    mid?: string;
    hover: string;
    hoverIntense?: string;
  };

  /** Material properties */
  material: {
    roughness: number;
    metalness: number;
    envMapIntensity: number;
    clearcoat: number;
    clearcoatRoughness: number;
    sheen: number;
    sheenRoughness: number;
    sheenColor: string;
    iridescence: number;
    iridescenceIOR: number;
  };

  /** Lighting */
  lighting: {
    ambientIntensity: number;
    mainPosition: [number, number, number];
    mainIntensity: number;
    /** Optional fill light */
    fillPosition?: [number, number, number];
    fillIntensity?: number;
    fillColor?: string;
    /** Environment preset from drei (e.g. 'sunset'). If omitted, no Environment is rendered. */
    envPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
    envIntensity?: number;
  };

  /** Rendering */
  render: {
    dpr: [number, number];
    frameloop: 'demand' | 'always';
    /** Canvas wrapper CSS class */
    className: string;
    /** If true, apply adaptive zoom based on viewport width (normalized to 1440px) */
    adaptiveZoom: boolean;
    /** If true, detect iOS and strip advanced material features */
    iosOptimize: boolean;
    /** If true, return null when prefers-reduced-motion is set */
    hideOnReducedMotion: boolean;
  };
}
