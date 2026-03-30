/**
 * HeroExplodedGrid3D — Interactive 3D exploded cube grid for the Investors page hero.
 *
 * 4×4×4 = 64 small cubes with large gaps, rendered via InstancedMesh (1 draw call).
 * Cubes breathe with idle oscillation and grow toward mouse proximity.
 *
 * Architecture mirrors FreebieBook3D.tsx:
 *   PresentationControls (outer)          ← drag-to-rotate, springs back on release
 *     └─ MouseParallaxGroup (inner)       ← continuous mouse-follow parallax
 *          └─ ExplodedGridModel           ← instanced cube grid
 */

'use client';

import { Suspense, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { palette } from '@/config/palette';
import { readHeroLayout, computeModelXOffset, computeAvailableWidth, measureTextCenter, measureContainerContentWidth, computeModelYOffset, isoScreenToWorld, type HeroLayout, type HeroTextMeasurement } from '../utils/heroLayout';

// ─── Grid Constants ──────────────────────────────────────────────────────────
const CUBE_COUNT = 64;
const GRID_SIZE = 4;
const CUBE_DIM = 0.28;
const GAP = 0.28;
const STRIDE = CUBE_DIM + GAP; // 0.56
const CUBE_RADIUS = 0.03;
const OFFSET = -((GRID_SIZE - 1) * STRIDE) / 2; // -1.05

// ─── Mouse Parallax Config ──────────────────────────────────────────────────
const PARALLAX_X = 0.18;
const PARALLAX_Y = 0.24;
const PARALLAX_LERP = 0.03;

// ─── Shared mouse NDC (written by window listener, read by useFrame) ────────
const mouseNDC = { x: 0, y: 0 };
let gridHovered = false;

// ─── Material ───────────────────────────────────────────────────────────────
const cubeMaterial = new THREE.MeshPhysicalMaterial({
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
});

// ─── Brand Colors (discrete palette, matching Rubik's Cube) ─────────────────
const PALETTE_COLORS = [
  palette.anchor500,
  palette.anchor300,
  palette.teal500,
  palette.teal700,
  palette.green500,
  palette.gold500,
  palette.sand200,
] as const;

// ─── Reduced Motion Detection ───────────────────────────────────────────────
function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    ref.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { ref.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return ref;
}

// ─── Mouse Parallax Group (inner rotation layer) ────────────────────────────
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

// ─── Viewport Offset Group — shifts children to right half of canvas ────────
function ViewportOffsetGroup({ children, layoutRef, textMeasureRef, containerWidthRef }: { children: React.ReactNode; layoutRef: React.RefObject<HeroLayout | null>; textMeasureRef: React.RefObject<HeroTextMeasurement | null>; containerWidthRef: React.RefObject<number | null> }) {
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

  // Orthographic frustum: visible area = pixels / zoom
  const containerW = containerWidthRef.current ?? size.width;
  const visibleH = size.height / cam.zoom;
  const visibleW = containerW / cam.zoom;

  const layout = layoutRef.current ?? readHeroLayout();
  const xOffset = computeModelXOffset(layout, visibleW);
  const yOffset = computeModelYOffset(textMeasureRef.current, visibleH, size.height, layout.isMobile);

  // Convert screen-space offsets to world-space for isometric camera
  const [wx, wy, wz] = isoScreenToWorld(xOffset, yOffset);

  return <group position={[wx, wy, wz]}>{children}</group>;
}

// ─── Exploded Grid Model ────────────────────────────────────────────────────

function ExplodedGridModel({ layoutRef, containerWidthRef }: { layoutRef: React.RefObject<HeroLayout | null>; containerWidthRef: React.RefObject<number | null> }) {
  const { camera, size } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Rounded geometry matching the visual style of Pyramid & Rubik's Cube
  const roundedGeom = useMemo(() => new RoundedBoxGeometry(CUBE_DIM, CUBE_DIM, CUBE_DIM, 4, CUBE_RADIUS), []);
  useEffect(() => () => roundedGeom.dispose(), [roundedGeom]);

  // Pre-compute per-cube data
  const { basePositions, phaseOffsets, instanceColors } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const phases = new Float32Array(CUBE_COUNT);
    const colors = new Float32Array(CUBE_COUNT * 3);
    const tmpColor = new THREE.Color();

    let idx = 0;
    for (let xi = 0; xi < GRID_SIZE; xi++) {
      for (let yi = 0; yi < GRID_SIZE; yi++) {
        for (let zi = 0; zi < GRID_SIZE; zi++) {
          const x = OFFSET + xi * STRIDE;
          const y = OFFSET + yi * STRIDE;
          const z = OFFSET + zi * STRIDE;
          positions.push(new THREE.Vector3(x, y, z));

          phases[idx] = xi * 3.7 + yi * 5.3 + zi * 7.1;

          tmpColor.set(PALETTE_COLORS[idx % PALETTE_COLORS.length]);
          colors[idx * 3] = tmpColor.r;
          colors[idx * 3 + 1] = tmpColor.g;
          colors[idx * 3 + 2] = tmpColor.b;

          idx++;
        }
      }
    }

    return { basePositions: positions, phaseOffsets: phases, instanceColors: colors };
  }, []);

  // Mutable state arrays (not React state — updated every frame)
  const currentScales = useMemo(() => {
    const arr = new Float32Array(CUBE_COUNT);
    arr.fill(1);
    return arr;
  }, []);
  const targetScales = useMemo(() => {
    const arr = new Float32Array(CUBE_COUNT);
    arr.fill(1);
    return arr;
  }, []);

  // Reusable temp objects for useFrame (no allocations per frame)
  const tempMat4 = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const tempScl = useMemo(() => new THREE.Vector3(), []);

  // Set instance colors once on mount
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Set initial matrices + colors
    for (let i = 0; i < CUBE_COUNT; i++) {
      tempPos.copy(basePositions[i]);
      tempScl.setScalar(1);
      tempMat4.compose(tempPos, tempQuat, tempScl);
      mesh.setMatrixAt(i, tempMat4);
      mesh.setColorAt(i, new THREE.Color(instanceColors[i * 3], instanceColors[i * 3 + 1], instanceColors[i * 3 + 2]));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [basePositions, instanceColors, tempMat4, tempPos, tempQuat, tempScl]);

  // Frustum-based scaling — orthographic: visible area = pixels / zoom
  const cam = camera as THREE.OrthographicCamera;
  const gridExtent = (GRID_SIZE - 1) * STRIDE + CUBE_DIM; // total grid span
  const containerW = containerWidthRef.current ?? size.width;
  const visibleH = size.height / cam.zoom;
  const visibleW = containerW / cam.zoom;

  const layout = layoutRef.current ?? readHeroLayout();
  const availableW = computeAvailableWidth(layout, visibleW);
  // Use animated fill factor — hover animation scales cubes up to 1.5×
  const fillFactor = layout.isMobile ? layout.fillMobile : layout.fillAnimated;
  const fitScale = Math.min(
    (visibleH * fillFactor) / gridExtent,
    (availableW * fillFactor) / gridExtent,
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsed = state.clock.elapsedTime;
    const isReduced = reducedMotion.current;

    for (let i = 0; i < CUBE_COUNT; i++) {
      if (isReduced) {
        targetScales[i] = 1.0;
      } else if (!gridHovered) {
        // No hover — static scale
        targetScales[i] = 1.0;
      } else {
        // Hover: shrink to half size with breathing oscillation
        const breathScale = 0.5 + 0.05 * Math.sin(elapsed * 0.8 + phaseOffsets[i]);
        targetScales[i] = breathScale;
      }

      // Damped approach to target
      currentScales[i] = THREE.MathUtils.damp(currentScales[i], targetScales[i], 8, delta);

      // Compose instance matrix
      tempPos.copy(basePositions[i]);
      tempScl.setScalar(currentScales[i]);
      tempMat4.compose(tempPos, tempQuat, tempScl);
      mesh.setMatrixAt(i, tempMat4);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group scale={fitScale}>
      {/* Invisible hitbox covering the entire grid — eliminates hover flickering
          from gaps between cubes. Pointer events fire on this solid surface. */}
      <mesh
        onPointerOver={() => { gridHovered = true; }}
        onPointerOut={() => { gridHovered = false; }}
      >
        <boxGeometry args={[gridExtent, gridExtent, gridExtent]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <instancedMesh
        ref={meshRef}
        args={[roundedGeom, undefined, CUBE_COUNT]}
        material={cubeMaterial}
        frustumCulled={false}
      />
    </group>
  );
}

// ─── Canvas Wrapper ──────────────────────────────────────────────────────────

interface HeroExplodedGrid3DProps {
  className?: string;
  onReady?: () => void;
}

export default function HeroExplodedGrid3D({ className, onReady }: HeroExplodedGrid3DProps) {
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
    <div
      ref={containerRef}
      className={className}
    >
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
        <ViewportOffsetGroup layoutRef={layoutRef} textMeasureRef={textMeasureRef} containerWidthRef={containerWidthRef}>
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
              <ExplodedGridModel layoutRef={layoutRef} containerWidthRef={containerWidthRef} />
            </MouseParallaxGroup>
          </PresentationControls>
        </ViewportOffsetGroup>
        <EffectComposer multisampling={2}>
          <Bloom intensity={0.08} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
