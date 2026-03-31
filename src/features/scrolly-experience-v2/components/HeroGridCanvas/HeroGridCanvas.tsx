/**
 * HeroGridCanvas — Shared 3D grid background for hero sections.
 *
 * Renders a responsive grid of RoundedBox blocks that respond to:
 *   - Idle: sine-wave breathing animation
 *   - Hover: cursor-proximity elevation + color shift
 *   - Reduced-motion: configurable (static grid or hidden)
 *
 * Accepts a HeroGridConfig prop for full customization.
 * Two presets are provided:
 *   - HERO_GRID_FULLSCREEN (homepage scrolly hero)
 *   - HERO_GRID_SECTION (page-section hero backgrounds)
 *
 * ARCHITECTURE:
 *   Client component. Wrapped by HeroGridLoader (dynamic ssr:false)
 *   or imported via dynamic() in consumer components.
 */

'use client';

import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { HeroGridConfig } from './types';

// =============================================================================
// HELPERS
// =============================================================================

/** Resolve current breakpoint index and grid dimensions from config. */
function resolveBreakpoint(config: HeroGridConfig): {
  cols: number;
  rows: number;
  bpIndex: number;
} {
  if (typeof window === 'undefined') {
    return { cols: config.breakpoints[0].cols, rows: config.breakpoints[0].rows, bpIndex: 0 };
  }
  const w = window.innerWidth;
  for (let i = 0; i < config.breakpoints.length; i++) {
    if (w >= config.breakpoints[i].minWidth) {
      return { cols: config.breakpoints[i].cols, rows: config.breakpoints[i].rows, bpIndex: i };
    }
  }
  const last = config.breakpoints[config.breakpoints.length - 1];
  return { cols: last.cols, rows: last.rows, bpIndex: config.breakpoints.length - 1 };
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPod|iPad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

// =============================================================================
// SHARED STATE
// =============================================================================

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _planeHit = new THREE.Vector3();

// =============================================================================
// GRID SCENE — renders blocks + handles hover logic
// =============================================================================

interface BlockData {
  col: number;
  row: number;
  baseX: number;
  baseZ: number;
}

function GridScene({
  config,
  cols,
  rows,
  isMobile,
}: {
  config: HeroGridConfig;
  cols: number;
  rows: number;
  isMobile: boolean;
}) {
  const { tile, wave, hover, colors, material: matCfg } = config;
  const invalidate = useThree((s) => s.invalidate);

  // Pre-compute grid positions centered at origin
  const blocks = useMemo<BlockData[]>(() => {
    const cellStep = tile.size + tile.gap;
    const totalWidth = cols * tile.size + (cols - 1) * tile.gap;
    const totalDepth = rows * tile.size + (rows - 1) * tile.gap;
    const offsetX = -totalWidth / 2 + tile.size / 2;
    const offsetZ = -totalDepth / 2 + tile.size / 2;

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
  }, [cols, rows, tile.size, tile.gap]);

  // Refs for each block mesh
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const elevationRef = useRef<Float32Array>(new Float32Array(cols * rows));
  const colorMixRef = useRef<Float32Array>(new Float32Array(cols * rows));

  // Mouse world position
  const mouseWorldRef = useRef(new THREE.Vector3(0, -100, 0));
  const mouseActiveRef = useRef(false);

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const isIOS = useMemo(
    () => (config.render.iosOptimize ? detectIOS() : false),
    [config.render.iosOptimize],
  );

  // Re-initialize arrays when grid size changes
  useEffect(() => {
    elevationRef.current = new Float32Array(cols * rows);
    colorMixRef.current = new Float32Array(cols * rows);
    meshRefs.current = new Array(cols * rows).fill(null);
  }, [cols, rows]);

  // Pre-compute THREE.Color instances
  const colorBase = useMemo(() => new THREE.Color(colors.base), [colors.base]);
  const colorMid = useMemo(() => (colors.mid ? new THREE.Color(colors.mid) : null), [colors.mid]);
  const colorHover = useMemo(() => new THREE.Color(colors.hover), [colors.hover]);
  const colorIntense = useMemo(
    () => (colors.hoverIntense ? new THREE.Color(colors.hoverIntense) : null),
    [colors.hoverIntense],
  );
  const workColor = useMemo(() => new THREE.Color(), []);

  // Pointer tracking + animation loop
  useFrame((state) => {
    // Raycast cursor to ground plane
    const p = state.pointer;
    state.raycaster.setFromCamera(p, state.camera);
    const hit = state.raycaster.ray.intersectPlane(GROUND_PLANE, _planeHit);

    if (hit) {
      mouseWorldRef.current.copy(hit);
      mouseActiveRef.current = Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1;
    }

    const time = state.clock.elapsedTime;
    const elevations = elevationRef.current;
    const colorMixes = colorMixRef.current;
    const hoverDisabled = reducedMotion || (hover.disableOnMobile && isMobile);

    for (let i = 0; i < blocks.length; i++) {
      const { col, row, baseX, baseZ } = blocks[i];
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      // 1. Idle wave / breathing
      let targetElevation = 0;
      if (!reducedMotion) {
        const phase = (col + row * 1.3) * wave.phaseSpread;
        const breath = Math.sin(time * wave.frequency * Math.PI * 2 + phase) * wave.amplitude;
        targetElevation = Math.max(0, breath * tile.baseHeight);
      }

      // 2. Hover proximity
      let hoverIntensity = 0;
      if (!hoverDisabled && mouseActiveRef.current) {
        const dx = mouseWorldRef.current.x - baseX;
        const dz = mouseWorldRef.current.z - baseZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (hover.gaussian && hover.gaussianFalloff != null) {
          // Gaussian falloff
          const influence = Math.exp(
            (-(dist * dist) * hover.gaussianFalloff) / (hover.radius * hover.radius),
          );
          hoverIntensity = influence;
          targetElevation += influence * hover.maxElevation;
        } else if (dist < hover.radius) {
          // Polynomial falloff
          const t = 1 - dist / hover.radius;
          hoverIntensity = Math.pow(t, hover.falloffPower);
          targetElevation += hoverIntensity * (hover.maxElevation - tile.baseHeight);
        }
      }

      // Smooth elevation lerp
      const currentElev = elevations[i];
      const speed = targetElevation > currentElev ? hover.lerpSpeed : hover.resetSpeed;
      elevations[i] += (targetElevation - currentElev) * speed;

      // Apply position
      mesh.position.y = elevations[i];

      // 3. Color interpolation
      const maxElev = hover.maxElevation;
      const elevNorm = Math.min(1, Math.max(0, elevations[i] / maxElev));

      // Smooth color mix
      const colorSpeed = 0.1;
      colorMixes[i] += (elevNorm - colorMixes[i]) * colorSpeed;
      const cm = colorMixes[i];

      if (colorMid) {
        // Three-stop gradient: base -> mid -> hover
        if (cm < 0.5) {
          workColor.lerpColors(colorBase, colorMid, cm * 2);
        } else {
          workColor.lerpColors(colorMid, colorHover, (cm - 0.5) * 2);
        }
      } else if (colorIntense) {
        // Two-stop with intense: base -> hover -> hoverIntense
        workColor.copy(colorBase).lerp(colorHover, cm * 0.6);
        if (cm > 0.5) {
          workColor.lerp(colorIntense, (cm - 0.5) * 0.4);
        }
      } else {
        // Simple two-stop: base -> hover
        workColor.lerpColors(colorBase, colorHover, cm);
      }

      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (!mat.color.equals(workColor)) {
        mat.color.copy(workColor);
      }
    }

    // For demand mode, always invalidate to keep breathing alive
    if (config.render.frameloop === 'demand') {
      invalidate();
    }
  });

  // Handle pointer leaving the canvas
  const handlePointerLeave = () => {
    mouseActiveRef.current = false;
    mouseWorldRef.current.set(0, -100, 0);
  };

  return (
    <group onPointerLeave={handlePointerLeave}>
      {blocks.map((blockData, i) => (
        <RoundedBox
          key={`${blockData.col}-${blockData.row}`}
          ref={(el: THREE.Mesh | null) => {
            meshRefs.current[i] = el;
          }}
          args={[tile.size, tile.baseHeight, tile.size]}
          radius={tile.borderRadius}
          smoothness={tile.smoothness}
          position={[blockData.baseX, 0, blockData.baseZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <meshPhysicalMaterial
            color={colors.base}
            roughness={matCfg.roughness}
            metalness={matCfg.metalness}
            envMapIntensity={matCfg.envMapIntensity}
            clearcoat={isIOS ? 0 : matCfg.clearcoat}
            clearcoatRoughness={matCfg.clearcoatRoughness}
            sheen={isIOS ? 0 : matCfg.sheen}
            sheenRoughness={matCfg.sheenRoughness}
            sheenColor={matCfg.sheenColor}
            iridescence={isIOS ? 0 : matCfg.iridescence}
            iridescenceIOR={matCfg.iridescenceIOR}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

// =============================================================================
// RESPONSIVE ZOOM — adapts camera zoom to viewport width
// =============================================================================

function ResponsiveZoom({ config, bpIndex }: { config: HeroGridConfig; bpIndex: number }) {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { camera: cam, size } = useThree();

  const zoomMultiplier = config.camera.zoomByBreakpoint?.[bpIndex] ?? 1;
  const targetZoom = config.camera.zoom * zoomMultiplier;

  useEffect(() => {
    cameraRef.current = cam as THREE.OrthographicCamera;
  }, [cam]);

  useFrame(() => {
    const ortho = cameraRef.current;
    if (!ortho) return;

    let adjustedZoom = targetZoom;
    if (config.render.adaptiveZoom) {
      const scale = size.width / 1440;
      adjustedZoom = targetZoom * Math.max(0.6, Math.min(1.2, scale));
    }

    ortho.zoom += (adjustedZoom - ortho.zoom) * 0.05;
    ortho.updateProjectionMatrix();
  });

  return null;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface HeroGridCanvasProps {
  config: HeroGridConfig;
}

export default function HeroGridCanvas({ config }: HeroGridCanvasProps) {
  const [gridState, setGridState] = useState(() => resolveBreakpoint(config));
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());

  // Responsive grid density + reduced motion
  useEffect(() => {
    const handleResize = () => {
      const next = resolveBreakpoint(config);
      setGridState((prev) => (prev.cols !== next.cols || prev.rows !== next.rows ? next : prev));
    };
    window.addEventListener('resize', handleResize);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handleMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mq.removeEventListener('change', handleMotion);
    };
  }, [config]);

  // Optionally hide on reduced motion
  if (config.render.hideOnReducedMotion && reducedMotion) return null;

  const { cols, rows, bpIndex } = gridState;
  const isMobile = bpIndex === config.breakpoints.length - 1;

  const zoomMultiplier = config.camera.zoomByBreakpoint?.[bpIndex] ?? 1;
  const initialZoom = config.camera.zoom * zoomMultiplier;

  return (
    <div className={config.render.className} aria-hidden="true">
      <Canvas
        orthographic
        camera={{
          zoom: initialZoom,
          position: config.camera.position,
          ...(config.camera.up ? { up: config.camera.up } : {}),
          near: 0.1,
          far: 200,
        }}
        dpr={config.render.dpr}
        frameloop={config.render.frameloop}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: config.render.iosOptimize ? 'high-performance' : 'default',
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={config.lighting.ambientIntensity} />
        <directionalLight
          position={config.lighting.mainPosition}
          intensity={config.lighting.mainIntensity}
          castShadow={false}
        />
        {config.lighting.fillPosition && (
          <directionalLight
            position={config.lighting.fillPosition}
            intensity={config.lighting.fillIntensity ?? 0.1}
            color={config.lighting.fillColor}
          />
        )}
        {config.lighting.envPreset && (
          <Suspense fallback={null}>
            <Environment
              files="/envmaps/venice_sunset_256.hdr"
              environmentIntensity={config.lighting.envIntensity ?? 0.2}
            />
          </Suspense>
        )}

        <ResponsiveZoom config={config} bpIndex={bpIndex} />
        <GridScene config={config} cols={cols} rows={rows} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
