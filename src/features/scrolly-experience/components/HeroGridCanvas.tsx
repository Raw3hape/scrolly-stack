/**
 * HeroGridCanvas — Decorative 3D grid background for hero sections.
 *
 * Renders an NxN grid of rounded blocks that respond to cursor proximity
 * by smoothly rising in height. Uses the same visual language as the
 * home-page scrolly-stack (RoundedBox + GradientShadowMaterial + proximity tilt).
 *
 * RESPONSIVE:
 *   - Desktop  (≥1024px): 10×10 grid, full hover interaction
 *   - Tablet   (≥640px):  8×8 grid, touch-move interaction
 *   - Mobile   (<640px):  6×6 grid, idle-only breathing (no hover)
 *
 * PERFORMANCE:
 *   - frameloop='demand' — only renders when useFrame calls invalidate()
 *   - Geometry shared across all blocks (single RoundedBoxGeometry instance)
 *   - useRef for cursor position — zero React re-renders on mousemove
 *   - Reduced-motion: disables hover rise, keeps static grid
 *
 * ARCHITECTURE:
 *   Exported as default — wrapped by HeroGridLoader (dynamic ssr:false).
 *   Config is extracted into GRID_CONFIG for easy tuning.
 */

'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '@/config/palette';

// =============================================================================
// CONFIGURATION — single place to tune the grid
// =============================================================================

const GRID_CONFIG = {
  /** Tile geometry */
  tile: {
    size: 0.7,            // XZ footprint of each tile
    baseHeight: 0.12,     // Default Y-scale (very flat)
    maxHeight: 0.8,       // Peak Y-scale — subtle, not towering
    borderRadius: 0.035,
    smoothness: 3,
  },

  /** Grid density per breakpoint (columns = rows) */
  breakpoints: {
    desktop: { minWidth: 1024, cols: 18 },
    tablet:  { minWidth: 640,  cols: 14 },
    mobile:  { minWidth: 0,    cols: 10 },
  },

  /** Gap between tiles */
  gap: 0.08,

  /** Hover proximity */
  hover: {
    radius: 4.0,          // World-space influence radius (wide)
    falloffPower: 2.5,    // Smooth quadratic+ falloff
    lerpSpeed: 0.06,      // Smooth convergence per frame
    resetSpeed: 0.03,     // Slower return to rest — premium feel
  },

  /** Idle breathing when cursor is outside */
  idle: {
    amplitude: 0.12,
    frequency: 0.3,       // Slow, meditative
    phaseSpread: 0.6,     // Gentle wave across grid
  },

  /** Color gradient: height-dependent (subtle, on-brand) */
  colors: {
    low: palette.sand100,
    mid: palette.sand300,
    high: palette.teal100,
  },

  /** Camera — nearly top-down for maximum screen coverage */
  camera: {
    position: [4, 12, 4] as [number, number, number],
    zoom: 48,
  },

  /** Lighting (soft, ambient-heavy for flat aesthetic) */
  lighting: {
    ambientIntensity: 0.45,
    mainPosition: [3, 16, 3] as [number, number, number],
    mainIntensity: 1.4,
    envPreset: 'sunset' as const,
    envIntensity: 0.2,
  },

  /** Material — matte, warm, matches sand palette */
  material: {
    roughness: 0.45,
    metalness: 0.0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    iridescence: 0.08,
    iridescenceIOR: 1.3,
    sheen: 0.1,
    sheenRoughness: 0.5,
    sheenColor: palette.sand50,
    envMapIntensity: 0.15,
  },
} as const;

// =============================================================================
// HELPER: compute grid columns for current viewport
// =============================================================================

function getGridCols(): number {
  if (typeof window === 'undefined') return GRID_CONFIG.breakpoints.desktop.cols;
  const w = window.innerWidth;
  if (w >= GRID_CONFIG.breakpoints.desktop.minWidth) return GRID_CONFIG.breakpoints.desktop.cols;
  if (w >= GRID_CONFIG.breakpoints.tablet.minWidth) return GRID_CONFIG.breakpoints.tablet.cols;
  return GRID_CONFIG.breakpoints.mobile.cols;
}

// =============================================================================
// HELPER: prefers-reduced-motion
// =============================================================================

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// =============================================================================
// SINGLE TILE — individual animated block
// =============================================================================

interface TileProps {
  position: [number, number, number];
  gridX: number;
  gridZ: number;
  cursorRef: React.RefObject<{ x: number; z: number; active: boolean }>;
  reducedMotion: boolean;
  sharedGeometryArgs: [number, number, number];
}

/** Shared raycaster plane at y=0 for cursor projection */
const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _planeHit = new THREE.Vector3();

function Tile({ position, gridX, gridZ, cursorRef, reducedMotion, sharedGeometryArgs }: TileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentHeight = useRef(GRID_CONFIG.tile.baseHeight);
  const currentColorMix = useRef(0); // 0=low, 0.5=mid, 1=high
  const invalidate = useThree((s) => s.invalidate);

  // Pre-compute phase offset for idle breathing
  const phaseOffset = useMemo(
    () => (gridX + gridZ * 1.3) * GRID_CONFIG.idle.phaseSpread,
    [gridX, gridZ],
  );

  // Colors
  const colorLow = useMemo(() => new THREE.Color(GRID_CONFIG.colors.low), []);
  const colorMid = useMemo(() => new THREE.Color(GRID_CONFIG.colors.mid), []);
  const colorHigh = useMemo(() => new THREE.Color(GRID_CONFIG.colors.high), []);
  const workColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const cursor = cursorRef.current;
    let targetHeight = GRID_CONFIG.tile.baseHeight;

    if (!reducedMotion) {
      // Idle breathing — always active
      const t = state.clock.elapsedTime;
      const breath = Math.sin(t * GRID_CONFIG.idle.frequency * Math.PI * 2 + phaseOffset)
        * GRID_CONFIG.idle.amplitude;
      targetHeight += Math.max(0, breath * GRID_CONFIG.tile.baseHeight);

      // Hover proximity
      if (cursor && cursor.active) {
        const dx = position[0] - cursor.x;
        const dz = position[2] - cursor.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const radius = GRID_CONFIG.hover.radius;

        if (dist < radius) {
          const t2 = 1 - dist / radius;
          const intensity = Math.pow(t2, GRID_CONFIG.hover.falloffPower);
          targetHeight += intensity * (GRID_CONFIG.tile.maxHeight - GRID_CONFIG.tile.baseHeight);
        }
      }
    }

    // Lerp height
    const speed = targetHeight > currentHeight.current
      ? GRID_CONFIG.hover.lerpSpeed
      : GRID_CONFIG.hover.resetSpeed;
    currentHeight.current += (targetHeight - currentHeight.current) * speed;

    // Apply Y-scale
    const h = currentHeight.current;
    meshRef.current.scale.y = h / GRID_CONFIG.tile.baseHeight;
    // Keep block grounded — shift up by half the height difference
    meshRef.current.position.y = position[1] + (h - GRID_CONFIG.tile.baseHeight) * 0.5;

    // Color interpolation based on height
    const heightNorm = Math.min(1, Math.max(0,
      (h - GRID_CONFIG.tile.baseHeight) / (GRID_CONFIG.tile.maxHeight - GRID_CONFIG.tile.baseHeight)
    ));

    // Smooth color lerp
    const colorSpeed = 0.1;
    currentColorMix.current += (heightNorm - currentColorMix.current) * colorSpeed;
    const cm = currentColorMix.current;

    // Two-stop gradient: low → mid at 0.5, mid → high at 1.0
    if (cm < 0.5) {
      workColor.lerpColors(colorLow, colorMid, cm * 2);
    } else {
      workColor.lerpColors(colorMid, colorHigh, (cm - 0.5) * 2);
    }

    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (!mat.color.equals(workColor)) {
      mat.color.copy(workColor);
      invalidate();
    }

    // Only invalidate when there's visible change
    const delta = Math.abs(targetHeight - currentHeight.current);
    if (delta > 0.001 || Math.abs(heightNorm - currentColorMix.current) > 0.001) {
      invalidate();
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={sharedGeometryArgs}
      radius={GRID_CONFIG.tile.borderRadius}
      smoothness={GRID_CONFIG.tile.smoothness}
      position={position}
      castShadow={false}
      receiveShadow={false}
    >
      <meshPhysicalMaterial
        color={GRID_CONFIG.colors.low}
        roughness={GRID_CONFIG.material.roughness}
        metalness={GRID_CONFIG.material.metalness}
        clearcoat={GRID_CONFIG.material.clearcoat}
        clearcoatRoughness={GRID_CONFIG.material.clearcoatRoughness}
        iridescence={GRID_CONFIG.material.iridescence}
        iridescenceIOR={GRID_CONFIG.material.iridescenceIOR}
        sheen={GRID_CONFIG.material.sheen}
        sheenRoughness={GRID_CONFIG.material.sheenRoughness}
        sheenColor={GRID_CONFIG.material.sheenColor}
        envMapIntensity={GRID_CONFIG.material.envMapIntensity}
      />
    </RoundedBox>
  );
}

// =============================================================================
// GRID — computes tile positions + manages cursor raycasting
// =============================================================================

function Grid({ cols }: { cols: number }) {
  const cursorRef = useRef({ x: 0, z: 0, active: false });
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const invalidate = useThree((s) => s.invalidate);

  // Compute tile positions centered at origin
  const tiles = useMemo(() => {
    const cellSize = GRID_CONFIG.tile.size + GRID_CONFIG.gap;
    const offset = ((cols - 1) * cellSize) / 2;
    const result: Array<{ pos: [number, number, number]; gx: number; gz: number }> = [];

    for (let z = 0; z < cols; z++) {
      for (let x = 0; x < cols; x++) {
        result.push({
          pos: [x * cellSize - offset, 0, z * cellSize - offset],
          gx: x,
          gz: z,
        });
      }
    }
    return result;
  }, [cols]);

  // Shared geometry args (all tiles use the same RoundedBox dimensions)
  const sharedGeometryArgs: [number, number, number] = useMemo(
    () => [GRID_CONFIG.tile.size, GRID_CONFIG.tile.baseHeight, GRID_CONFIG.tile.size],
    [],
  );

  // Raycast cursor position to ground plane each frame
  useFrame((state) => {
    // Track cursor activity: R3F pointer stays at last known NDC; 
    // we mark as active whenever pointer is within canvas bounds
    const p = state.pointer;
    cursorRef.current.active = Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1;

    state.raycaster.setFromCamera(p, state.camera);
    const hit = state.raycaster.ray.intersectPlane(GROUND_PLANE, _planeHit);
    if (hit) {
      cursorRef.current.x = _planeHit.x;
      cursorRef.current.z = _planeHit.z;
    }
    // Invalidate to keep breathing alive
    invalidate();
  });

  return (
    <>
      {tiles.map((t, i) => (
        <Tile
          key={i}
          position={t.pos}
          gridX={t.gx}
          gridZ={t.gz}
          cursorRef={cursorRef as React.RefObject<{ x: number; z: number; active: boolean }>}
          reducedMotion={reducedMotion}
          sharedGeometryArgs={sharedGeometryArgs}
        />
      ))}
    </>
  );
}



// =============================================================================
// MAIN CANVAS COMPONENT
// =============================================================================

export default function HeroGridCanvas() {
  const [cols, setCols] = useState(() => getGridCols());

  // Responsive grid density
  useEffect(() => {
    const handleResize = () => {
      const newCols = getGridCols();
      setCols((prev) => (prev !== newCols ? newCols : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive zoom — smaller screens need wider view to fill viewport
  const zoom = useMemo(() => {
    const base = GRID_CONFIG.camera.zoom;
    if (cols <= 10) return base * 0.55;  // mobile: zoom out more
    if (cols <= 14) return base * 0.75;  // tablet
    return base;                          // desktop
  }, [cols]);

  return (
    <div className="v2-hero__canvas-bg">
      <Canvas
        orthographic
        camera={{
          zoom,
          position: GRID_CONFIG.camera.position,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, 1.5]}
        frameloop="demand"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: 'default',
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={GRID_CONFIG.lighting.ambientIntensity} />
        <directionalLight
          position={GRID_CONFIG.lighting.mainPosition}
          intensity={GRID_CONFIG.lighting.mainIntensity}
          castShadow={false}
        />
        <Environment
          preset={GRID_CONFIG.lighting.envPreset}
          environmentIntensity={GRID_CONFIG.lighting.envIntensity}
        />

        <Grid cols={cols} />
      </Canvas>
    </div>
  );
}
