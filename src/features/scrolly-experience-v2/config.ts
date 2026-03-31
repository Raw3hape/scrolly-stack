/**
 * Centralized Configuration for Scrolly-Stack
 *
 * All sizing, animation, and material parameters in one place.
 * Change values here to adjust the entire visualization without touching components.
 */

import { palette } from '@/config/palette';

// =============================================================================
// GEOMETRY CONFIGURATION
// =============================================================================

export const geometry = {
  // Overall stack dimensions - reduced for better balance
  stack: {
    totalWidth: 5.5, // Reduced from 6.5
    totalDepth: 5.5, // Reduced from 6.5
    layerHeight: 0.42, // Reduced from 0.5
    borderRadius: 0.05, // Subtle rounding
    smoothness: 4,
  },

  // Gaps between elements - proportionally reduced
  gaps: {
    horizontal: 0.12, // Reduced from 0.15
    vertical: 0.42, // Reduced from 0.5
  },
};

// =============================================================================
// ANIMATION CONFIGURATION
// =============================================================================

export const animation = {
  // Spring physics for block animations
  spring: {
    tension: 170,
    friction: 26,
    mass: 1,
  },

  // Active block behavior
  active: {
    slideDistance: 0.8, // Reduced from 1.5 - less intrusive
    liftHeight: 0.4, // Increased lift for better visibility
    slideDirection: [-1, 1], // Default [x, z] direction vector
  },

  // Blocks above active
  aboveActive: {
    liftHeight: 0.5, // Slightly reduced
  },

  // Camera animation
  camera: {
    lerpSpeed: 4, // Synced with UNIFIED_LAMBDA in CameraRig/ZoomController
    positions: {
      hero: [0, 100, 0], // Top-down view
      isometric: [100, 100, 100],
    },
    upVectors: {
      hero: [0, 0, -1],
      isometric: [0, 1, 0],
    },
  },

  // Zoom settings
  zoom: {
    desktop: 65,
    mobile: 40,
    // Larger zoom for hero state (3D fills more of the viewport)
    heroDesktop: 90,
    heroMobile: 55,
    mobileBreakpoint: 768,
    lerpSpeed: 3,
    snapThreshold: 0.1, // minimum delta before zoom lerp triggers
  },

  // Hover effect settings
  hover: {
    lerpSpeed: 0.12, // Smooth transition speed per frame
    glowIntensity: 0.15, // Subtle glow strength
    scale: 1.025, // Scale on hover (2.5% increase)
    tooltip: {
      offsetX: 16, // Cursor offset X
      offsetY: 16, // Cursor offset Y
      fadeInDuration: 200, // ms
      fadeOutDuration: 150, // ms
    },
    tilt: {
      maxAngle: 0.35, // ~20° max rotation (hovered block)
      proximityFalloff: 0.25, // Distance falloff factor — lower = wider influence radius
      proximityMax: 0.7, // Proximity blocks max intensity (0→1, relative to hovered block)
      lerpSpeed: 0.12, // Smooth convergence per frame
      resetLerpSpeed: 0.08, // Slower return to neutral for premium feel
      mobileBreakpoint: 768, // Disable tilt on narrow viewports (touch conflict)
    },
  },

  parallax: {
    intensity: 0.012, // Reduced: less floating feel
    lerpSpeed: 0.05, // smoothing per frame
    damping: 14, // Increased: faster return to neutral
    stackIntensityMultiplier: 0.05, // Minimal parallax in stack mode for stability
  },

  // Viewport / resize
  viewport: {
    resizeDebounceMs: 150,
  },

  // Progressive build mode — layer entrance animation (spring physics)
  // Creates "crane lowering" feel: accelerates as it drops, slight bounce on landing
  build: {
    dropHeight: 2.5, // World units above target Y where layer starts
    stiffness: 120, // Spring stiffness (higher = faster drop, snappier)
    damping: 14, // Damping (lower = more bounce on landing)
  },
};

// =============================================================================
// MATERIAL CONFIGURATION
// =============================================================================

export const materials = {
  // Block material — clean pastel look
  block: {
    roughness: 0.25,
    metalness: 0.0,
    envMapIntensity: 0.2,
  },

  // Active state — slightly shinier
  active: {
    roughness: 0.2,
    metalness: 0.0,
    envMapIntensity: 0.3,
  },

  // MeshPhysicalMaterial properties (glass effects)
  physical: {
    transmission: 0, // Disabled: requires double-render per block
    ior: 1.5, // Index of refraction (glass = 1.5)
    thickness: 0.5, // Refraction depth
    iridescence: 0.3, // Rainbow color shift
    iridescenceIOR: 1.3, // Iridescence strength
    clearcoat: 0.4, // Glossy top layer
    clearcoatRoughness: 0.1, // Smooth clearcoat
    sheen: 0.3, // Soft velvet-like highlight
    sheenRoughness: 0.4, // Sheen spread
    sheenColor: '#e8ddd0', // Warm tint (matches palette)
  },

  // Color transition
  colorTransition: {
    speed: 4,
  },
};

// =============================================================================
// LIGHTING CONFIGURATION
// =============================================================================

export const lighting = {
  ambient: {
    intensity: 0.15, // Lower = deeper shadow contrast
  },

  main: {
    position: [5, 14, 5], // Higher angle for better shadow projection
    intensity: 2.4, // Compensate for lower ambient
    castShadow: true,
    shadowMapSize: 1024, // Optimized: indistinguishable at orthographic zoom levels
    shadowBias: -0.0002, // Fine-tuned bias
    shadowRadius: 20, // Higher = softer blurred edges
    blurSamples: 16, // Optimized: visually identical softness with fewer texture reads
    shadowCamera: {
      far: 60,
      left: -15,
      right: 15,
      top: 15,
      bottom: -15,
    },
  },

  fill: {
    position: [-6, 12, -6],
    intensity: 0.1, // Lower fill = deeper shadows remain visible
    color: palette.ambientLight,
  },

  bottom: {
    position: [0, -6, 0],
    intensity: 0.05, // Very low bottom light
    color: palette.white,
  },

  environment: {
    preset: 'sunset', // Warm cinematic lighting
    intensity: 0.35, // Warm reflections on blocks
  },
};

// =============================================================================
// SHADOWS CONFIGURATION
// =============================================================================

// Contact shadows disabled — model floats in infinite space
export const shadows = {
  enabled: false, // Disabled: model floats without visible floor/shadow
  contact: {
    position: [0, -4.8, 0],
    opacity: 0.35,
    scale: 25,
    blur: 3.5,
    far: 12,
    resolution: 512,
    color: '#1a1520',
  },
};

// =============================================================================
// POST-PROCESSING CONFIGURATION
// =============================================================================

export const postProcessing = {
  enabled: true,

  bloom: {
    enabled: true,
    intensity: 0.08, // Very subtle glow
    luminanceThreshold: 0.85, // Only bright surfaces glow
    luminanceSmoothing: 0.4,
    mipmapBlur: true,
  },

  ssao: {
    enabled: false,
    radius: 0.5,
    intensity: 15,
    luminanceInfluence: 0.6,
  },

  vignette: {
    enabled: false, // Disabled: creates visible dark frame
    offset: 0.3,
    darkness: 0.15,
  },
};

// =============================================================================
// LABEL CONFIGURATION
// =============================================================================

export const labels = {
  fontSize: 0.36,
  font: '/fonts/Inter-Regular.woff',
  color: 'white',
  maxWidth: 1.5,
  lineHeight: 1.1,
  // Position offset from corner
  padding: {
    x: 0.15,
    y: 0.011,
    z: 0.15,
  },
};

// =============================================================================
// RENDER SETTINGS
// =============================================================================

export const render = {
  dpr: [1, 2], // Restored full Retina resolution
  mobileDpr: [1, 1.5], // Mobile: balanced sharpness vs GPU load (1.5× = sweet spot)
  shadows: true,
  shadowMapType: 'VSMShadowMap', // Restored premium butter-soft shadows
};

// =============================================================================
// MOSAIC TRANSITION CONFIGURATION
// =============================================================================

export const mosaic = {
  // Grid layout
  cols: 5, // Default columns — row count is variant-dependent
  cellSize: 3.0, // Uniform tile size — fills full-screen canvas
  gap: 0.2, // Gap between tiles
  blockHeight: 0.3, // Thin tile height (viewed from above)

  // Single-phase Bezier arc
  arc: {
    heightFactor: 0.5, // Arc height = distance × factor (Y lift during flight)
  },

  motion: {
    viewStart: 0.18, // settle window: springs close blocks before Bezier arc starts
    viewEnd: 0.92, // settle before the very end of the trigger zone
    parallaxFadeEnd: 0.18, // remove mouse drift early in the morph
  },

  sceneOffset: {
    stackY: 0, // additional vertical tweak (0 = auto-centered via header compensation)
    mosaicY: 0.12, // keep the final grid slightly above center
  },

  // Camera during mosaic — TOP-DOWN view
  camera: {
    position: [0, 100, 0] as [number, number, number],
    upVector: [0, 0, -1] as [number, number, number],
    pullbackZoom: 42, // DEPRECATED — monotonic zoom, kept for type compat
    finalZoom: 75, // Zoom when settled (fills full-screen viewport)
  },

  // Scroll trigger zone heights (CSS values)
  // Total zone = assemblyHeight + holdHeight + exitHeight
  assemblyHeight: '80vh', // Scroll distance for 0→1 assembly
  holdHeight: '20vh', // Stable final-frame window
  exitHeight: '50vh', // Scroll distance for exit (canvas slides up + fades)
  // Pulls next section up by (exit + overlap) via negative margin on trigger zone.
  // 30vh keeps sections from appearing too early during hold (z=101 protects).
  contentOverlap: '30vh',
};

// =============================================================================
// HELPER: Get full config as single object
// =============================================================================

export const config = {
  geometry,
  animation,
  materials,
  lighting,
  shadows,
  postProcessing,
  labels,
  render,
  mosaic,
};

export default config;
