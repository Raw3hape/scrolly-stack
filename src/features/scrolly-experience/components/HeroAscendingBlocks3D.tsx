/**
 * HeroAscendingBlocks3D — Interactive 3D ascending column grid for the Roofers hero.
 *
 * 5×5 = 25 rounded columns with a diagonal height gradient.
 * On hover a sine wave propagates across the grid.
 *
 * Architecture:
 *   PresentationControls (outer)
 *     └─ MouseParallaxGroup (inner)
 *          └─ AscendingBlocksModel (frustum-scaled)
 *
 * Zero re-renders — all animation driven by useFrame + refs.
 */

'use client';

import { Suspense, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PresentationControls,
  RoundedBox,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { palette } from '@/config/palette';
import {
  readHeroLayout,
  computeModelXOffset,
  computeAvailableWidth,
  measureTextCenter,
  measureContainerContentWidth,
  computeModelYOffset,
  isoScreenToWorld,
  type HeroLayout,
  type HeroTextMeasurement,
} from '../utils/heroLayout';

// ─── Grid Constants ──────────────────────────────────────────────────────────
const GRID_SIZE = 5;
const COL_COUNT = GRID_SIZE * GRID_SIZE; // 25
const COL_XZ = 0.22;
const COL_GAP = 0.12;
const STRIDE = COL_XZ + COL_GAP; // 0.34
const COL_RADIUS = 0.025;
const COL_SMOOTHNESS = 4;
const HALF_SPAN = ((GRID_SIZE - 1) * STRIDE) / 2; // 0.68

// Bounding box for frustum scaling
const TOTAL_XZ = (GRID_SIZE - 1) * STRIDE + COL_XZ; // 1.58
const MIN_H = 0.22;
const MAX_H = 1.45;
const MAX_H_PADDED = 1.60;

// ─── Wave Animation Constants ────────────────────────────────────────────────
const WAVE_AMP = 0.30;
const WAVE_FREQ = 1.2;
const WAVE_SPEED = 2.5;

// ─── Brand Colors ────────────────────────────────────────────────────────────
const PALETTE_COLORS = [
  palette.anchor500,
  palette.anchor300,
  palette.teal500,
  palette.teal700,
  palette.green500,
  palette.gold500,
  palette.sand200,
] as const;

// ─── Shared Materials (one per color) ────────────────────────────────────────
const sharedMaterials = PALETTE_COLORS.map(
  (color) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.25,
      metalness: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      sheen: 0.3,
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color('#e8ddd0'),
      envMapIntensity: 0.3,
      iridescence: 0.3,
      iridescenceIOR: 1.3,
    }),
);

// ─── Mouse Parallax Config ───────────────────────────────────────────────────
const PARALLAX_X = 0.06;
const PARALLAX_Y = 0.08;
const PARALLAX_LERP = 0.03;

// ─── Shared module-level state (written by listeners, read by useFrame) ──────
const mouseNDC = { x: 0, y: 0 };
let blocksHovered = false;
let hoverBlend = 0;

// ─── Pre-compute base heights ────────────────────────────────────────────────
function computeBaseHeights(): Float32Array {
  const heights = new Float32Array(COL_COUNT);
  for (let i = 0; i < COL_COUNT; i++) {
    const col = i % GRID_SIZE;
    const row = Math.floor(i / GRID_SIZE);
    // Invert gradient so tall columns face the viewer (isometric camera at [100,100,100])
    const gradient = MIN_H + (MAX_H - MIN_H) * (1 - (col + row) / (2 * (GRID_SIZE - 1)));
    const noise = 0.08 * Math.sin(col * 3.7 + row * 5.3);
    heights[i] = gradient + noise;
  }
  return heights;
}

const BASE_HEIGHTS = computeBaseHeights();

// ─── Mouse Parallax Group ────────────────────────────────────────────────────
function MouseParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const targetX = -mouseNDC.y * PARALLAX_X;
    const targetY = mouseNDC.x * PARALLAX_Y;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, PARALLAX_LERP);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, PARALLAX_LERP);
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── Column data (pre-computed once) ─────────────────────────────────────────
interface ColumnData {
  x: number;
  z: number;
  baseH: number;
  colorIndex: number;
  index: number;
}

function buildColumns(): ColumnData[] {
  const result: ColumnData[] = [];
  for (let i = 0; i < COL_COUNT; i++) {
    const col = i % GRID_SIZE;
    const row = Math.floor(i / GRID_SIZE);
    result.push({
      x: col * STRIDE - HALF_SPAN,
      z: row * STRIDE - HALF_SPAN,
      baseH: BASE_HEIGHTS[i],
      colorIndex: (col + row) % PALETTE_COLORS.length,
      index: i,
    });
  }
  return result;
}

// ─── Ascending Blocks Model ──────────────────────────────────────────────────
function AscendingBlocksModel({
  reducedMotion,
  layoutRef,
  textMeasureRef,
  containerWidthRef,
}: {
  reducedMotion: boolean;
  layoutRef: React.RefObject<HeroLayout | null>;
  textMeasureRef: React.RefObject<HeroTextMeasurement | null>;
  containerWidthRef: React.RefObject<number | null>;
}) {
  const { camera, size } = useThree();
  const cam = camera as THREE.OrthographicCamera;

  // Camera view offset — render wider canvas while preserving container-based frustum
  useEffect(() => {
    const cw = containerWidthRef.current ?? size.width;
    if (size.width > cw + 1) {
      cam.setViewOffset(cw, size.height, 0, 0, size.width, size.height);
    } else {
      cam.clearViewOffset();
    }
    cam.updateProjectionMatrix();
  }, [cam, size.width, size.height, containerWidthRef]);

  // Frustum-based scaling
  const containerW = containerWidthRef.current ?? size.width;
  const visibleH = size.height / cam.zoom;
  const visibleW = containerW / cam.zoom;

  const layout = layoutRef.current ?? readHeroLayout();
  const xOffset = computeModelXOffset(layout, visibleW);
  const yOffset = computeModelYOffset(textMeasureRef.current, visibleH, size.height, layout.isMobile);
  const availableW = computeAvailableWidth(layout, visibleW);
  const fillFactor = layout.isMobile ? layout.fillMobile : layout.fillAnimated;
  const scale = Math.min(
    (visibleH * fillFactor) / MAX_H_PADDED,
    (availableW * fillFactor) / TOTAL_XZ,
  );

  // Column refs for animation
  const colRefs = useRef<(THREE.Group | null)[]>([]);

  // Mutable animation state (zero re-renders)
  const currentHeights = useMemo(() => {
    const arr = new Float32Array(COL_COUNT);
    arr.set(BASE_HEIGHTS);
    return arr;
  }, []);

  const columns = useMemo(() => buildColumns(), []);

  // Initialize refs array
  useMemo(() => {
    colRefs.current = new Array(COL_COUNT).fill(null);
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    const elapsed = state.clock.elapsedTime;

    // Smooth hover blend
    hoverBlend = THREE.MathUtils.damp(hoverBlend, blocksHovered ? 1 : 0, 5, delta);

    for (let i = 0; i < COL_COUNT; i++) {
      const col = i % GRID_SIZE;
      const row = Math.floor(i / GRID_SIZE);

      // Compute target height
      const wave = WAVE_AMP * Math.sin((col + row) * WAVE_FREQ + elapsed * WAVE_SPEED);
      const targetH = Math.max(0.05, BASE_HEIGHTS[i] + hoverBlend * wave);

      // Damp toward target
      currentHeights[i] = THREE.MathUtils.damp(currentHeights[i], targetH, 6, delta);

      // Update group ref
      const g = colRefs.current[i];
      if (!g) continue;
      g.scale.y = currentHeights[i];
      g.position.y = currentHeights[i] / 2;
    }
  });

  // Convert screen-space offsets to world-space for isometric camera
  const [wx, wy, wz] = isoScreenToWorld(xOffset, yOffset);

  return (
    <group position={[wx, wy, wz]}>
      <PresentationControls
        global={false}
        cursor={true}
        snap={true}
        speed={1.5}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 5, Math.PI / 5]}
        azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
      >
        <MouseParallaxGroup>
          <group scale={scale}>
            <group position={[0, -MAX_H_PADDED / 2, 0]}>
              {/* Invisible hitbox covering the full volume */}
              <mesh
                position={[0, MAX_H_PADDED / 2, 0]}
                onPointerOver={() => { blocksHovered = true; }}
                onPointerOut={() => { blocksHovered = false; }}
              >
                <boxGeometry args={[TOTAL_XZ, MAX_H_PADDED, TOTAL_XZ]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
              {columns.map((c) => (
                <group
                  key={c.index}
                  ref={(el: THREE.Group | null) => { colRefs.current[c.index] = el; }}
                  position={[c.x, c.baseH / 2, c.z]}
                  scale={[1, c.baseH, 1]}
                >
                  <RoundedBox
                    args={[COL_XZ, 1, COL_XZ]}
                    radius={COL_RADIUS}
                    smoothness={COL_SMOOTHNESS}
                    material={sharedMaterials[c.colorIndex]}
                  />
                </group>
              ))}
            </group>
          </group>
        </MouseParallaxGroup>
      </PresentationControls>
    </group>
  );
}

// ─── Bridge Component (threads hover ref + reduced motion into Canvas) ───────
function AscendingBlocksInner({
  layoutRef,
  textMeasureRef,
  containerWidthRef,
}: {
  layoutRef: React.RefObject<HeroLayout | null>;
  textMeasureRef: React.RefObject<HeroTextMeasurement | null>;
  containerWidthRef: React.RefObject<number | null>;
}) {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <AscendingBlocksModel
      reducedMotion={reducedMotion}
      layoutRef={layoutRef}
      textMeasureRef={textMeasureRef}
      containerWidthRef={containerWidthRef}
    />
  );
}

// ─── Canvas Wrapper ──────────────────────────────────────────────────────────

interface HeroAscendingBlocks3DProps {
  className?: string;
  onReady?: () => void;
}

export default function HeroAscendingBlocks3D({ className, onReady }: HeroAscendingBlocks3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Window-level mouse tracking — writes to shared mouseNDC
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const layoutRef = useRef<HeroLayout | null>(null);
  const textMeasureRef = useRef<HeroTextMeasurement | null>(null);
  const containerWidthRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      layoutRef.current = readHeroLayout();
      if (containerRef.current) {
        textMeasureRef.current = measureTextCenter(containerRef.current);
        containerWidthRef.current = measureContainerContentWidth(containerRef.current);
      }
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        orthographic
        camera={{ zoom: 65, position: [100, 100, 100], near: 0.1, far: 500 }}
        onCreated={(state) => {
          state.camera.lookAt(0, 0, 0);
          if (state.gl.compileAsync) {
            state.gl.compileAsync(state.scene, state.camera).then(() => {
              state.invalidate();
              onReady?.();
            });
          } else {
            state.invalidate();
            requestAnimationFrame(() => onReady?.());
          }
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onReady?.(); });
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.AgXToneMapping,
        }}
        style={{ background: 'transparent', cursor: 'grab' }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 14, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, 12, -6]} intensity={0.1} color="#e8ddd0" />
        <directionalLight position={[0, -6, 0]} intensity={0.05} color="#ffffff" />
        <Suspense fallback={null}>
          <Environment files="/envmaps/venice_sunset_256.hdr" environmentIntensity={0.35} />
        </Suspense>
        <AscendingBlocksInner
          layoutRef={layoutRef}
          textMeasureRef={textMeasureRef}
          containerWidthRef={containerWidthRef}
        />
        <EffectComposer multisampling={2}>
          <Bloom intensity={0.08} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
