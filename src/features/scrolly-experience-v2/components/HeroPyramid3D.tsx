'use client';

import { Suspense, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PresentationControls, RoundedBox } from '@react-three/drei';
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

// ─── Layer Config ───
const LAYERS = [
  { size: 4.0, height: 0.2, color: palette.anchor900 },
  { size: 3.7, height: 0.2, color: palette.anchor700 },
  { size: 3.4, height: 0.2, color: palette.anchor500 },
  { size: 3.1, height: 0.2, color: palette.anchor300 },
  { size: 2.8, height: 0.2, color: palette.teal700 },
  { size: 2.5, height: 0.2, color: palette.teal500 },
  { size: 2.2, height: 0.2, color: palette.teal300 },
  { size: 1.9, height: 0.2, color: palette.green700 },
  { size: 1.6, height: 0.2, color: palette.green500 },
  { size: 1.3, height: 0.2, color: palette.green300 },
  { size: 1.0, height: 0.2, color: palette.gold300 },
  { size: 0.7, height: 0.2, color: palette.gold500, emissive: true },
] as const;

const GAP = 0.08;
const RADIUS = 0.03;
const PARALLAX_X = 0.06;
const PARALLAX_Y = 0.08;
const PARALLAX_LERP = 0.03;

// ─── Shared module-level state ───
const mouseNDC = { x: 0, y: 0 };
let pyramidHovered = false;

// ─── Materials (created once, outside React) ───
const layerMaterials = LAYERS.map((l) => {
  const mat = new THREE.MeshPhysicalMaterial({
    color: l.color,
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
  if ('emissive' in l && l.emissive) {
    mat.emissive = new THREE.Color(l.color);
    mat.emissiveIntensity = 0.08;
  }
  return mat;
});

// ─── Mouse Parallax Group ───
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

// ─── Single Pyramid Layer ───
const HOVER_SPREAD = 1.35; // Y positions scale factor on hover (1 = no spread)

function PyramidLayer({
  size,
  height,
  materialIndex,
  yPosition,
}: {
  size: number;
  height: number;
  materialIndex: number;
  yPosition: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    // Spread: expand layers apart on hover (yPosition is centered around 0)
    const yTarget = pyramidHovered ? yPosition * HOVER_SPREAD : yPosition;
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      yTarget,
      4,
      delta,
    );
  });

  return (
    <group ref={meshRef} position={[0, yPosition, 0]}>
      <RoundedBox
        args={[size, height, size]}
        radius={RADIUS}
        smoothness={4}
        material={layerMaterials[materialIndex]}
      />
    </group>
  );
}

// ─── Pyramid Model ───
function PyramidModel({
  layoutRef,
  textMeasureRef,
  containerWidthRef,
}: {
  layoutRef: React.RefObject<HeroLayout | null>;
  textMeasureRef: React.RefObject<HeroTextMeasurement | null>;
  containerWidthRef: React.RefObject<number | null>;
}) {
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);

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
  const totalH = LAYERS.reduce((sum, l) => sum + l.height, 0) + (LAYERS.length - 1) * GAP;
  const maxSize = LAYERS[0].size;

  // Layout tokens from CSS custom properties (read once on mount)
  const layout = layoutRef.current ?? readHeroLayout();
  const xOffset = computeModelXOffset(layout, visibleW);
  const yOffset = computeModelYOffset(
    textMeasureRef.current,
    visibleH,
    size.height,
    layout.isMobile,
  );
  const availableW = computeAvailableWidth(layout, visibleW);
  const fillFactor = layout.isMobile ? layout.fillMobile : layout.fill;
  const scale = Math.min((visibleH * fillFactor) / totalH, (availableW * fillFactor) / maxSize);

  // Compute Y positions (centered vertically)
  const yPositions: number[] = [];
  let y = -totalH / 2 + LAYERS[0].height / 2;
  for (let i = 0; i < LAYERS.length; i++) {
    yPositions.push(y);
    y += LAYERS[i].height + GAP;
  }

  // Convert screen-space offsets to world-space for isometric camera
  const [wx, wy, wz] = isoScreenToWorld(xOffset, yOffset);

  return (
    <group position={[wx, wy, wz]}>
      <PresentationControls
        global={false}
        cursor
        snap
        speed={1.5}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 5, Math.PI / 5]}
        azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
      >
        <MouseParallaxGroup>
          <group
            ref={groupRef}
            scale={scale}
            onPointerOver={() => {
              pyramidHovered = true;
            }}
            onPointerOut={() => {
              pyramidHovered = false;
            }}
          >
            {LAYERS.map((layer, i) => (
              <PyramidLayer
                key={i}
                size={layer.size}
                height={layer.height}
                materialIndex={i}
                yPosition={yPositions[i]}
              />
            ))}
          </group>
        </MouseParallaxGroup>
      </PresentationControls>
    </group>
  );
}

// ─── Canvas Wrapper (default export) ───
interface HeroPyramid3DProps {
  className?: string;
  onReady?: () => void;
}

export default function HeroPyramid3D({ className, onReady }: HeroPyramid3DProps) {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const containerRef = useRef<HTMLDivElement>(null);
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
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onReady?.();
          });
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.AgXToneMapping }}
        style={{ background: 'transparent', cursor: 'grab' }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 14, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, 12, -6]} intensity={0.1} color="#e8ddd0" />
        <directionalLight position={[0, -6, 0]} intensity={0.05} color="#ffffff" />
        <Suspense fallback={null}>
          <Environment files="/envmaps/venice_sunset_256.hdr" environmentIntensity={0.35} />
        </Suspense>
        <PyramidModel
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
