/**
 * HeroRubiksCube3D — Interactive 3D Rubik's Cube for the Roofers hero.
 *
 * 3×3×3 = 27 small rounded cubes with a continuous face-rotation loop.
 * Architecture mirrors FreebieBook3D.tsx exactly:
 *   PresentationControls (outer)
 *     └─ MouseParallaxGroup (inner)
 *          └─ RubiksCubeModel (frustum-scaled)
 *
 * Zero re-renders — all animation driven by useFrame + refs.
 */

'use client';

import { useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PresentationControls,
  RoundedBox,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { palette } from '@/config/palette';
import { readHeroLayout, computeModelXOffset, computeAvailableWidth, measureTextCenter, measureContainerContentWidth, computeModelYOffset, isoScreenToWorld, type HeroLayout, type HeroTextMeasurement } from '../utils/heroLayout';

// ─── Cube Dimensions ────────────────────────────────────────────────────────
const CUBE_SIZE = 0.5;
const CUBE_GAP = 0.06;
const STRIDE = CUBE_SIZE + CUBE_GAP; // 0.56
const CUBE_RADIUS = 0.03;
const CUBE_SMOOTHNESS = 4;

// Bounding box of the assembled cube (for frustum scaling)
const TOTAL_SIZE = CUBE_SIZE * 3 + CUBE_GAP * 2; // 1.62

// ─── Brand Colors ───────────────────────────────────────────────────────────
const PALETTE_COLORS = [
  palette.anchor500,
  palette.anchor300,
  palette.teal500,
  palette.teal700,
  palette.green500,
  palette.gold500,
  palette.sand200,
] as const;

// ─── Shared Materials (one per color) ───────────────────────────────────────
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

// ─── Mouse Parallax Config ──────────────────────────────────────────────────
const PARALLAX_X = 0.06;
const PARALLAX_Y = 0.08;
const PARALLAX_LERP = 0.03;

// ─── Shared mouse NDC (written by window listener, read by useFrame) ────────
const mouseNDC = { x: 0, y: 0 };

// ─── Animation Types & Constants ────────────────────────────────────────────
type AnimState = 'IDLE' | 'ROTATING' | 'PAUSE';

interface RotationStep {
  axis: 'x' | 'y' | 'z';
  layer: number;
  direction: 1 | -1;
}

const ROTATION_SEQUENCE: RotationStep[] = [
  { axis: 'y', layer: 2, direction: 1 },   // top CW
  { axis: 'x', layer: 2, direction: -1 },  // right CCW
  { axis: 'z', layer: 0, direction: 1 },   // front CW
  { axis: 'y', layer: 0, direction: -1 },  // bottom CCW
  { axis: 'x', layer: 0, direction: 1 },   // left CW
  { axis: 'z', layer: 2, direction: -1 },  // back CCW
];

const AXIS_INDEX: Record<string, number> = { x: 0, y: 1, z: 2 };

const DURATION_NORMAL = 1.5;
const DURATION_HOVER = 1.0;
const PAUSE_NORMAL = 0.8;
const PAUSE_HOVER = 0.4;

// ─── Easing ─────────────────────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Logical Position Update ────────────────────────────────────────────────
/**
 * Returns new logical position after a 90° rotation around `axis` with `direction`.
 * direction=1 is CW looking down the positive axis toward origin.
 */
function rotateLogicalPos(
  pos: [number, number, number],
  axis: 'x' | 'y' | 'z',
  direction: 1 | -1,
): [number, number, number] {
  const [x, y, z] = pos;

  if (direction === 1) {
    switch (axis) {
      case 'y': return [z, y, 2 - x];
      case 'x': return [x, 2 - z, y];
      case 'z': return [2 - y, x, z];
    }
  } else {
    // direction === -1: apply inverse (= 3x forward)
    switch (axis) {
      case 'y': return [2 - z, y, x];
      case 'x': return [x, z, 2 - y];
      case 'z': return [y, 2 - x, z];
    }
  }
  return pos; // unreachable, satisfies TS
}

// ─── Cube State ─────────────────────────────────────────────────────────────
interface CubeState {
  logicalPos: [number, number, number];
  colorIndex: number;
}

function gridPosition(logicalPos: [number, number, number]): [number, number, number] {
  return [
    (logicalPos[0] - 1) * STRIDE,
    (logicalPos[1] - 1) * STRIDE,
    (logicalPos[2] - 1) * STRIDE,
  ];
}

// ─── Mouse Parallax Group ───────────────────────────────────────────────────
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

// ─── Rubik's Cube Model ─────────────────────────────────────────────────────
function RubiksCubeModel({ reducedMotion, hoveredRef, layoutRef, textMeasureRef, containerWidthRef }: { reducedMotion: boolean; hoveredRef: React.RefObject<boolean>; layoutRef: React.RefObject<HeroLayout | null>; textMeasureRef: React.RefObject<HeroTextMeasurement | null>; containerWidthRef: React.RefObject<number | null> }) {
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

  // Frustum-based scaling — orthographic: visible area = pixels / zoom
  const containerW = containerWidthRef.current ?? size.width;
  const visibleH = size.height / cam.zoom;
  const visibleW = containerW / cam.zoom;

  const layout = layoutRef.current ?? readHeroLayout();
  const xOffset = computeModelXOffset(layout, visibleW);
  const yOffset = computeModelYOffset(textMeasureRef.current, visibleH, size.height, layout.isMobile);
  const availableW = computeAvailableWidth(layout, visibleW);
  const fillFactor = layout.isMobile ? layout.fillMobile : layout.fill;
  const scale = Math.min(
    (visibleH * fillFactor) / TOTAL_SIZE,
    (availableW * fillFactor) / TOTAL_SIZE,
  );

  // Build initial cube states
  const cubeStates = useRef<CubeState[]>([]);
  const cubeRefs = useRef<(THREE.Group | null)[]>([]);

  // Animation state (all refs — zero re-renders)
  const animState = useRef<AnimState>('IDLE');
  const sequenceIndex = useRef(0);
  const animTimer = useRef(0);
  const rotatingIndices = useRef<number[]>([]);
  const currentStep = useRef<RotationStep>(ROTATION_SEQUENCE[0]);

  // Initialize cube states once
  useMemo(() => {
    const states: CubeState[] = [];
    let idx = 0;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          states.push({
            logicalPos: [x, y, z],
            colorIndex: idx % 7,
          });
          idx++;
        }
      }
    }
    cubeStates.current = states;
    cubeRefs.current = new Array(27).fill(null);
  }, []);

  // Start in IDLE — animation only runs on hover
  useEffect(() => {
    if (!reducedMotion) {
      animState.current = 'IDLE';
      animTimer.current = 0;
    }
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const isHov = hoveredRef.current;
    const duration = isHov ? DURATION_HOVER : DURATION_NORMAL;
    const pauseDur = isHov ? PAUSE_HOVER : PAUSE_NORMAL;

    // When not hovered and idle, do nothing (static cube)
    if (!isHov && animState.current === 'IDLE') return;

    // When not hovered and in pause, return to idle (don't start next rotation)
    if (!isHov && animState.current === 'PAUSE') {
      animState.current = 'IDLE';
      animTimer.current = 0;
      return;
    }

    // When hovered and idle, transition to pause to begin animation
    if (isHov && animState.current === 'IDLE') {
      animState.current = 'PAUSE';
      animTimer.current = 0;
    }

    animTimer.current += delta;

    if (animState.current === 'PAUSE') {
      if (animTimer.current >= pauseDur) {
        // Start next rotation
        const step = ROTATION_SEQUENCE[sequenceIndex.current % ROTATION_SEQUENCE.length];
        currentStep.current = step;
        const ai = AXIS_INDEX[step.axis];

        // Find the 9 cubes in this layer
        const indices: number[] = [];
        for (let i = 0; i < 27; i++) {
          if (cubeStates.current[i].logicalPos[ai] === step.layer) {
            indices.push(i);
          }
        }
        rotatingIndices.current = indices;

        animState.current = 'ROTATING';
        animTimer.current = 0;
      }
    } else if (animState.current === 'ROTATING') {
      const t = Math.min(animTimer.current / duration, 1);
      const eased = easeInOutCubic(t);
      const step = currentStep.current;
      const angle = eased * (Math.PI / 2) * step.direction;

      // Apply rotation offset to each rotating cube
      for (const idx of rotatingIndices.current) {
        const ref = cubeRefs.current[idx];
        if (!ref) continue;

        // Set rotation on the cube's group
        const pos = gridPosition(cubeStates.current[idx].logicalPos);
        ref.position.set(pos[0], pos[1], pos[2]);

        // Rotate around the axis through the center (0,0,0)
        // We need to: translate to origin, rotate, translate back
        // Since grid is centered, we rotate position around origin
        const p = new THREE.Vector3(pos[0], pos[1], pos[2]);
        const axisVec = new THREE.Vector3(
          step.axis === 'x' ? 1 : 0,
          step.axis === 'y' ? 1 : 0,
          step.axis === 'z' ? 1 : 0,
        );
        p.applyAxisAngle(axisVec, angle);
        ref.position.copy(p);

        // Also rotate the cube itself
        ref.rotation.set(0, 0, 0);
        const q = new THREE.Quaternion().setFromAxisAngle(axisVec, angle);
        ref.quaternion.copy(q);
      }

      if (t >= 1) {
        // Animation complete — update logical positions and snap
        for (const idx of rotatingIndices.current) {
          const state = cubeStates.current[idx];
          state.logicalPos = rotateLogicalPos(state.logicalPos, step.axis, step.direction);

          // Snap to grid
          const ref = cubeRefs.current[idx];
          if (ref) {
            const pos = gridPosition(state.logicalPos);
            ref.position.set(pos[0], pos[1], pos[2]);
            ref.rotation.set(0, 0, 0);
            ref.quaternion.identity();
          }
        }

        rotatingIndices.current = [];
        sequenceIndex.current++;
        animState.current = 'PAUSE';
        animTimer.current = 0;
      }
    }
  });

  // Build initial positions
  const cubes = useMemo(() => {
    const result: { pos: [number, number, number]; colorIndex: number; index: number }[] = [];
    let idx = 0;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          result.push({
            pos: gridPosition([x, y, z]),
            colorIndex: idx % 7,
            index: idx,
          });
          idx++;
        }
      }
    }
    return result;
  }, []);

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
            {/* Invisible hitbox covering the assembled cube — eliminates hover
                flickering from gaps between individual cubes */}
            <mesh
              onPointerOver={() => { hoveredRef.current = true; }}
              onPointerOut={() => { hoveredRef.current = false; }}
            >
              <boxGeometry args={[TOTAL_SIZE, TOTAL_SIZE, TOTAL_SIZE]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {cubes.map((cube) => (
              <group
                key={cube.index}
                ref={(el: THREE.Group | null) => { cubeRefs.current[cube.index] = el; }}
                position={cube.pos}
              >
                <RoundedBox
                  args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]}
                  radius={CUBE_RADIUS}
                  smoothness={CUBE_SMOOTHNESS}
                  material={sharedMaterials[cube.colorIndex]}
                />
              </group>
            ))}
          </group>
        </MouseParallaxGroup>
      </PresentationControls>
    </group>
  );
}

// ─── Canvas Wrapper ─────────────────────────────────────────────────────────

interface HeroRubiksCube3DProps {
  className?: string;
  onReady?: () => void;
}

export default function HeroRubiksCube3D({ className, onReady }: HeroRubiksCube3DProps) {
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

  // Hover ref read inside useFrame (avoids re-renders)
  const isHovered = useRef(false);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      <Canvas
        orthographic
        camera={{ zoom: 65, position: [100, 100, 100], near: 0.1, far: 500 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          requestAnimationFrame(() => onReady?.());
          const canvas = gl.domElement;
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
        <Environment preset="sunset" environmentIntensity={0.35} />
        <RubiksCubeInner isHovered={isHovered} layoutRef={layoutRef} textMeasureRef={textMeasureRef} containerWidthRef={containerWidthRef} />
        <EffectComposer multisampling={2}>
          <Bloom intensity={0.08} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

/**
 * Bridge component that passes the hover ref into the Canvas tree.
 * This exists because refs from outside Canvas must be threaded through.
 */
function RubiksCubeInner({ isHovered, layoutRef, textMeasureRef, containerWidthRef }: { isHovered: React.RefObject<boolean>; layoutRef: React.RefObject<HeroLayout | null>; textMeasureRef: React.RefObject<HeroTextMeasurement | null>; containerWidthRef: React.RefObject<number | null> }) {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return <RubiksCubeModel reducedMotion={reducedMotion} hoveredRef={isHovered} layoutRef={layoutRef} textMeasureRef={textMeasureRef} containerWidthRef={containerWidthRef} />;
}
