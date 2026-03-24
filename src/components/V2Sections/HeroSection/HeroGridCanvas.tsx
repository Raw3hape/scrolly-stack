/**
 * HeroGridCanvas — Ambient 3D grid background for the Investors Hero.
 *
 * Renders a responsive grid of RoundedBox blocks that:
 *   • Idle: gentle sine-wave Y displacement ("breathing")
 *   • Hover: ripple effect from cursor position (elevation + teal glow)
 *   • Reduced-motion: hides entirely via CSS check
 *   • Mobile: fewer blocks, lower DPR, no hover (touch-safe)
 *   • iOS: stripped-down material (no iridescence/clearcoat/sheen)
 *
 * Architecture: fully self-contained client component.
 * Canvas is transparent (alpha=true), positioned behind hero content.
 *
 * Uses same tech as Home page scrolly-stack:
 *   - RoundedBox from @react-three/drei
 *   - MeshPhysicalMaterial with brand palette
 *   - Orthographic camera, top-down view
 */

'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '@/config/palette';

// =============================================================================
// CONFIGURATION — all tunables in one place for easy iteration
// =============================================================================

const GRID_CONFIG = {
  /** Desktop grid dimensions — large enough to wallpaper full viewport */
  desktop: { cols: 16, rows: 12 },
  /** Mobile grid dimensions */
  mobile: { cols: 10, rows: 10 },
  /** Breakpoint for desktop vs mobile grid */
  mobileBreakpoint: 768,

  /** Block geometry */
  block: {
    size: 0.8,             // width/depth of each block
    height: 0.12,          // block thickness (thin tiles)
    gap: 0.22,             // gap between blocks — breathing room
    borderRadius: 0.04,    // corner rounding
    smoothness: 3,         // subdivision for rounding
  },

  /** Idle wave animation */
  wave: {
    amplitude: 0.04,       // subtle Y displacement
    speedX: 0.3,           // slow horizontal wave
    speedZ: 0.25,          // slow depth wave
    freqCol: 0.45,         // lower frequency = longer wavelength
    freqRow: 0.35,         // longer wavelength for elegance
  },

  /** Mouse hover ripple */
  ripple: {
    radius: 6.0,           // wide influence radius for large grid
    maxElevation: 0.14,    // subtle lift at cursor center
    falloff: 0.3,          // gentler decay for wider ripple
    lerpSpeed: 0.06,       // smooth convergence
    resetSpeed: 0.03,      // very slow return for premium feel
  },

  /** Camera — low zoom to spread grid across full viewport */
  camera: {
    position: [0, 50, 0] as [number, number, number],
    up: [0, 0, -1] as [number, number, number],
    zoomDesktop: 28,
    zoomMobile: 22,
  },

  /** Material colors — warm brand tones that blend with surface-base */
  colors: {
    base: palette.sand100,
    baseB: palette.sand50,
    hover: palette.teal100,
    hoverIntense: palette.tealExLight,
  },

  /** Material properties (mirrors scrolly-stack materials) */
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

  /** Rendering */
  render: {
    dprDesktop: [1, 2] as [number, number],
    dprMobile: [1, 1.5] as [number, number],
  },
} as const;

// =============================================================================
// TYPES
// =============================================================================

interface BlockData {
  col: number;
  row: number;
  baseX: number;
  baseZ: number;
}

// =============================================================================
// GRID SCENE — renders all blocks + handles hover logic
// =============================================================================

/** Shared plane for raycaster (top of blocks' base Y) */
const HOVER_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _planeHit = new THREE.Vector3();

function GridScene({ isMobile }: { isMobile: boolean }) {
  const { cols, rows } = isMobile ? GRID_CONFIG.mobile : GRID_CONFIG.desktop;
  const blockCfg = GRID_CONFIG.block;
  const { wave, ripple, colors } = GRID_CONFIG;

  // Pre-compute grid block positions (centered around origin)
  const blocks = useMemo<BlockData[]>(() => {
    const cellStep = blockCfg.size + blockCfg.gap;
    const totalWidth = cols * blockCfg.size + (cols - 1) * blockCfg.gap;
    const totalDepth = rows * blockCfg.size + (rows - 1) * blockCfg.gap;
    const offsetX = -totalWidth / 2 + blockCfg.size / 2;
    const offsetZ = -totalDepth / 2 + blockCfg.size / 2;

    const result: BlockData[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        result.push({
          col: c,
          row: r,
          baseX: offsetX + c * cellStep,
          baseZ: offsetZ + r * cellStep,
        });
      }
    }
    return result;
  }, [cols, rows, blockCfg]);

  // Refs for each block mesh — direct mutation in useFrame
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  // Smoothed elevation per block
  const elevationRef = useRef<Float32Array>(new Float32Array(cols * rows));
  // Mouse world position (from raycaster)
  const mouseWorldRef = useRef(new THREE.Vector3(0, -100, 0)); // off-screen initially
  const mouseActiveRef = useRef(false);

  // Re-initialize elevation array when grid size changes
  useEffect(() => {
    elevationRef.current = new Float32Array(cols * rows);
    meshRefs.current = new Array(cols * rows).fill(null);
  }, [cols, rows]);

  // Pre-compute THREE.Color instances (avoid per-frame allocation)
  const colorBase = useMemo(() => new THREE.Color(colors.base), [colors.base]);
  const colorHover = useMemo(() => new THREE.Color(colors.hover), [colors.hover]);
  const colorIntense = useMemo(() => new THREE.Color(colors.hoverIntense), [colors.hoverIntense]);

  // Pointer tracking via raycaster
  useFrame((state) => {
    // Project pointer to world plane
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hit = state.raycaster.ray.intersectPlane(HOVER_PLANE, _planeHit);
    if (hit) {
      mouseWorldRef.current.copy(hit);
      mouseActiveRef.current = true;
    }

    const time = state.clock.elapsedTime;
    const elevations = elevationRef.current;

    for (let i = 0; i < blocks.length; i++) {
      const { col, row, baseX, baseZ } = blocks[i];
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      // 1. Idle wave displacement
      const waveY = wave.amplitude * Math.sin(
        time * wave.speedX + col * wave.freqCol + row * wave.freqRow
      );

      // 2. Hover ripple
      let targetElevation = 0;
      if (mouseActiveRef.current && !isMobile) {
        const dx = mouseWorldRef.current.x - baseX;
        const dz = mouseWorldRef.current.z - baseZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        // Gaussian falloff
        const influence = Math.exp(-(dist * dist) * ripple.falloff / (ripple.radius * ripple.radius));
        targetElevation = influence * ripple.maxElevation;
      }

      // Smooth elevation lerp
      const currentElev = elevations[i];
      const speed = targetElevation > currentElev ? ripple.lerpSpeed : ripple.resetSpeed;
      elevations[i] += (targetElevation - currentElev) * speed;

      // Apply position
      mesh.position.y = waveY + elevations[i];

      // 3. Color interpolation based on elevation
      const elevNormalized = Math.min(elevations[i] / ripple.maxElevation, 1);
      if (elevNormalized > 0.01) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        const c = new THREE.Color().copy(colorBase).lerp(colorHover, elevNormalized * 0.6);
        if (elevNormalized > 0.5) {
          c.lerp(colorIntense, (elevNormalized - 0.5) * 0.4);
        }
        mat.color.copy(c);
      } else {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.color.copy(colorBase);
      }
    }
  });

  // Handle pointer leaving the canvas
  const handlePointerLeave = () => {
    mouseActiveRef.current = false;
    mouseWorldRef.current.set(0, -100, 0);
  };

  // Detect iOS for material overrides
  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /iPhone|iPod|iPad/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  return (
    <group onPointerLeave={handlePointerLeave}>
      {/* Ambient light — soft fill */}
      <ambientLight intensity={0.2} />
      {/* Main directional — same angle as scrolly-stack */}
      <directionalLight position={[5, 14, 5]} intensity={1.8} />
      {/* Fill from opposite side */}
      <directionalLight position={[-6, 12, -6]} intensity={0.08} color={palette.ambientLight} />

      {blocks.map((blockData, i) => (
        <RoundedBox
          key={`${blockData.col}-${blockData.row}`}
          ref={(el: THREE.Mesh | null) => { meshRefs.current[i] = el; }}
          args={[GRID_CONFIG.block.size, GRID_CONFIG.block.height, GRID_CONFIG.block.size]}
          radius={GRID_CONFIG.block.borderRadius}
          smoothness={GRID_CONFIG.block.smoothness}
          position={[blockData.baseX, 0, blockData.baseZ]}
        >
          <meshPhysicalMaterial
            color={colors.base}
            roughness={GRID_CONFIG.material.roughness}
            metalness={GRID_CONFIG.material.metalness}
            envMapIntensity={GRID_CONFIG.material.envMapIntensity}
            clearcoat={isIOS ? 0 : GRID_CONFIG.material.clearcoat}
            clearcoatRoughness={GRID_CONFIG.material.clearcoatRoughness}
            sheen={isIOS ? 0 : GRID_CONFIG.material.sheen}
            sheenRoughness={GRID_CONFIG.material.sheenRoughness}
            sheenColor={new THREE.Color(GRID_CONFIG.material.sheenColor)}
            iridescence={isIOS ? 0 : GRID_CONFIG.material.iridescence}
            iridescenceIOR={GRID_CONFIG.material.iridescenceIOR}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

// =============================================================================
// RESPONSIVE ZOOM — adapts camera zoom to viewport
// =============================================================================

function ResponsiveZoom({ isMobile }: { isMobile: boolean }) {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { camera: cam, size } = useThree();
  const targetZoom = isMobile ? GRID_CONFIG.camera.zoomMobile : GRID_CONFIG.camera.zoomDesktop;

  // Cache camera ref on mount
  useEffect(() => {
    cameraRef.current = cam as THREE.OrthographicCamera;
  }, [cam]);

  useFrame(() => {
    const ortho = cameraRef.current;
    if (!ortho) return;
    // Scale zoom proportionally to viewport width for consistent visual coverage
    const scale = size.width / 1440; // normalize to reference width
    const adjustedZoom = targetZoom * Math.max(0.6, Math.min(1.2, scale));

    // Smooth damping
    ortho.zoom += (adjustedZoom - ortho.zoom) * 0.05;
    ortho.updateProjectionMatrix();
  });

  return null;
}

// =============================================================================
// MAIN COMPONENT — exported, handles reduced-motion
// SSR safety provided by dynamic(ssr: false) in HeroSection.tsx
// =============================================================================

export default function HeroGridCanvas() {
  // Lazy initializers — read once during first render (SSR-safe: dynamic ssr:false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= GRID_CONFIG.mobileBreakpoint
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Subscribe to reduced-motion changes
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handleChange);

    // Subscribe to resize for mobile detection
    const checkMobile = () => setIsMobile(window.innerWidth <= GRID_CONFIG.mobileBreakpoint);
    window.addEventListener('resize', checkMobile);

    return () => {
      mq.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render when reduced motion is preferred
  if (prefersReducedMotion) return null;

  const dpr = isMobile ? GRID_CONFIG.render.dprMobile : GRID_CONFIG.render.dprDesktop;

  return (
    <div className="v2-hero__grid-canvas" aria-hidden="true">
      <Canvas
        orthographic
        camera={{
          zoom: isMobile ? GRID_CONFIG.camera.zoomMobile : GRID_CONFIG.camera.zoomDesktop,
          position: GRID_CONFIG.camera.position,
          up: GRID_CONFIG.camera.up,
        }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ResponsiveZoom isMobile={isMobile} />
        <GridScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

