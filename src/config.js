/**
 * Centralized Configuration for Scrolly-Stack
 * 
 * All sizing, animation, and material parameters in one place.
 * Change values here to adjust the entire visualization without touching components.
 */

// =============================================================================
// GEOMETRY CONFIGURATION
// =============================================================================

export const geometry = {
  // Overall stack dimensions - reduced for better balance
  stack: {
    totalWidth: 5.5,       // Reduced from 6.5
    totalDepth: 5.5,       // Reduced from 6.5
    layerHeight: 0.42,     // Reduced from 0.5
    borderRadius: 0.05,      // Subtle rounding
    smoothness: 8,
  },
  
  // Gaps between elements - proportionally reduced
  gaps: {
    horizontal: 0.12,      // Reduced from 0.15
    vertical: 0.42,        // Reduced from 0.5
  },
  
  // Per-level defaults (can be overridden in data.js)
  levels: {
    A: { layout: 'grid', cols: 2, rows: 2 },
    B: { layout: 'row', cols: 3, depth: 1.7, align: 'front' },  // Reduced depth
    C: { layout: 'full' },
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
  
  // Alternative timing-based config (use either spring OR timing)
  timing: {
    duration: 600,   // ms
    easing: 'easeOutQuart',
  },
  
  // Active block behavior
  active: {
    slideDistance: 0.8,      // Reduced from 1.5 - less intrusive
    liftHeight: 0.4,         // Increased lift for better visibility
    slideDirection: [-1, 1], // Default [x, z] direction vector
  },
  
  // Blocks above active
  aboveActive: {
    liftHeight: 0.5,         // Slightly reduced
  },
  
  // Camera animation
  camera: {
    lerpSpeed: 2,            // Speed of camera transition
    positions: {
      hero: [0, 100, 0],     // Top-down view
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
  },
  
  // Hover effect settings
  hover: {
    lerpSpeed: 0.12,           // Smooth transition speed per frame
    glowIntensity: 0.15,       // Subtle glow strength
    scale: 1.025,              // Scale on hover (2.5% increase)
    tooltip: {
      offsetX: 16,             // Cursor offset X
      offsetY: 16,             // Cursor offset Y
      fadeInDuration: 200,     // ms
      fadeOutDuration: 150,    // ms
    },
  },
};


// =============================================================================
// MATERIAL CONFIGURATION
// =============================================================================

export const materials = {
  // Block material - matte finish for better text readability
  block: {
    roughness: 0.85,          // Very matte like competitor
    metalness: 0.0,
    envMapIntensity: 0.2,
  },
  
  // Active state - same matte look
  active: {
    roughness: 0.8,
    metalness: 0.0,
    envMapIntensity: 0.25,
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
    intensity: 0.15,          // Lower = deeper shadow contrast
  },
  
  main: {
    position: [5, 14, 5],     // Higher angle for better shadow projection
    intensity: 2.4,           // Compensate for lower ambient
    castShadow: true,
    shadowMapSize: 2048,      // Balanced resolution for performance
    shadowBias: -0.0002,      // Fine-tuned bias
    shadowRadius: 20,         // Higher = softer, more blurred edges
  },
  
  fill: {
    position: [-6, 12, -6],
    intensity: 0.1,           // Lower fill = deeper shadows remain visible
    color: '#e8e8ff',
  },
  
  bottom: {
    position: [0, -6, 0],
    intensity: 0.05,          // Very low bottom light
    color: '#ffffff',
  },
  
  environment: {
    preset: 'studio',
    intensity: 0.25,          // Reduced env intensity
  },
};


// =============================================================================
// SHADOWS CONFIGURATION
// =============================================================================

// Contact shadows disabled - only using directional light shadows between layers
export const shadows = {
  enabled: false,  // Disabled - the bottom shadow looks unnatural
  contact: {
    position: [0, -4.8, 0],
    opacity: 0.5,
    scale: 30,
    blur: 2,
    far: 15,
    resolution: 1024,
    color: '#0f172a',
  },
};


// =============================================================================
// POST-PROCESSING CONFIGURATION
// =============================================================================

export const postProcessing = {
  enabled: false,  // Disabled for better performance
  
  bloom: {
    enabled: false,
    intensity: 0.2,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.5,
    mipmapBlur: true,
  },
  
  ssao: {
    enabled: false,
    radius: 0.5,
    intensity: 15,
    luminanceInfluence: 0.6,
  },
  
  vignette: {
    enabled: false,
    offset: 0.3,
    darkness: 0.2,
  },
};


// =============================================================================
// LABEL CONFIGURATION
// =============================================================================

export const labels = {
  fontSize: 0.36,
  font: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff',
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
  dpr: [1, 2],           // Device pixel ratio range
  shadows: true,
  shadowMapType: 'PCFSoftShadowMap',  // 'BasicShadowMap' | 'PCFShadowMap' | 'PCFSoftShadowMap' | 'VSMShadowMap'
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
};

export default config;
