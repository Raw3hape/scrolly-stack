/**
 * FreebieBook3D — Interactive 3D hardcover book.
 *
 * Interaction model (hybrid — two layers):
 *
 *   PresentationControls (outer)          ← drag-to-rotate, springs back on release
 *     └─ MouseParallaxGroup (inner)       ← continuous mouse-follow parallax
 *          └─ BookGeometry                ← static book meshes + text
 *
 * This layered approach ensures:
 *   - Mouse parallax works continuously (idle, after drag release, always)
 *   - Drag rotation stacks on top of parallax
 *   - Spring-back only affects the drag layer; parallax persists
 *   - Touch/mobile: drag works via gesture, parallax disabled (no mouse)
 *
 * Frustum-based scaling ensures the book fits within the canvas at any
 * aspect ratio without clipping, with 22% padding for rotation overshoot.
 */

'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PresentationControls,
  Text,
  RoundedBox,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * LogoPlane — Renders the Foundation Projects logo as a crisp texture
 * on a transparent plane. Uses LinearFilter (no mipmaps) + max anisotropy
 * for sharp rendering at any viewing angle.
 */
function LogoPlane({ position, scale }: {
  position: [number, number, number];
  scale: [number, number];
}) {
  const texture = useTexture('/FoundationProjects_Logo_Main.png');

  // Optimize texture for sharpness
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 16;

  return (
    <mesh position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Dimensions ──────────────────────────────────────────────────────────────
const COVER_W = 2.4;
const COVER_H = 3.2;
const COVER_THICK = 0.035;
const SPINE_D = 0.14;      // slim journal/magazine thickness
const COVER_RADIUS = 0.02;

const PAGE_OVERHANG = 0.06;
const PAGE_W = COVER_W - PAGE_OVERHANG;
const PAGE_H = COVER_H - PAGE_OVERHANG * 2;
const PAGE_D = SPINE_D - COVER_THICK * 2;
const PAGE_LAYER_COUNT = 3; // fewer visible page layers for slim book

// ─── Brand Colors (mapped from design tokens in colors.css) ───────────────
const C = {
  coverFront: '#297373',    // --color-teal-500
  coverBack: '#1E5757',     // --color-teal-700
  spine: '#1A4E58',         // --color-anchor-700
  spineEdge: '#103740',     // --color-anchor-900
  pages: '#F2EDE4',         // --color-sand-100
  pageLines: '#E8E1D6',     // --color-sand-200
  accent: '#D79344',        // --color-gold-500
  textLight: '#FDFCFA',     // --color-sand-25
  textMuted: '#3A8C8C',     // --color-teal-300
  textGold: '#E5AD6B',      // --color-gold-300
} as const;

// ─── Mouse Parallax Config ───────────────────────────────────────────────────
const PARALLAX_X = 0.3;   // vertical tilt range (~17°)
const PARALLAX_Y = 0.45;  // horizontal tilt range (~26°)
const PARALLAX_LERP = 0.05;

// ─── Materials ───────────────────────────────────────────────────────────────
const matCoverFront = new THREE.MeshPhysicalMaterial({
  color: C.coverFront,
  roughness: 0.25, metalness: 0.0,
  clearcoat: 0.4, clearcoatRoughness: 0.1,
  sheen: 0.3, sheenRoughness: 0.4,
  sheenColor: new THREE.Color('#e8ddd0'),
  envMapIntensity: 0.3,
});
const matCoverBack = new THREE.MeshPhysicalMaterial({
  color: C.coverBack,
  roughness: 0.3, metalness: 0.0,
  clearcoat: 0.3, clearcoatRoughness: 0.15,
  sheen: 0.2, sheenRoughness: 0.5,
  sheenColor: new THREE.Color('#e8ddd0'),
  envMapIntensity: 0.25,
});
const matSpine = new THREE.MeshPhysicalMaterial({
  color: C.spine,
  roughness: 0.2, metalness: 0.0,
  clearcoat: 0.5, clearcoatRoughness: 0.08,
  envMapIntensity: 0.35,
});
const matSpineEdge = new THREE.MeshStandardMaterial({
  color: C.spineEdge, roughness: 0.5, metalness: 0.06,
});
const matPageBlock = new THREE.MeshStandardMaterial({
  color: C.pages, roughness: 0.9, metalness: 0,
});
const matPageLine = new THREE.MeshStandardMaterial({
  color: C.pageLines, roughness: 0.85, metalness: 0,
});
const matAccent = new THREE.MeshStandardMaterial({
  color: C.accent, roughness: 0.25, metalness: 0.08,
  emissive: C.accent, emissiveIntensity: 0.12,
});

const PAGE_INDICES = Array.from({ length: PAGE_LAYER_COUNT }, (_, i) => i);

// ─── Shared mouse NDC (written by window listener, read by useFrame) ─────────
const mouseNDC = { x: 0, y: 0 };

// ─── Mouse Parallax Group (inner rotation layer) ─────────────────────────────
/**
 * Continuously rotates its children based on mouse position.
 * This runs independently of PresentationControls — the rotations ADD together.
 */
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

// ─── Book Model ──────────────────────────────────────────────────────────────

interface BookModelProps {
  title: string;
  subtitle: string;
}

function BookModel({ title, subtitle }: BookModelProps) {
  const { camera, size } = useThree();

  // Frustum-based scaling
  const cam = camera as THREE.PerspectiveCamera;
  const fovRad = THREE.MathUtils.degToRad(cam.fov);
  const visibleH = 2 * cam.position.z * Math.tan(fovRad / 2);
  const visibleW = visibleH * (size.width / size.height);
  const scale = Math.min(
    (visibleH * 0.78) / COVER_H,
    (visibleW * 0.78) / COVER_W,
  );

  const px = PAGE_OVERHANG / 2;

  return (
    <PresentationControls
      global={false}
      cursor={true}
      snap={true}
      speed={1.5}
      zoom={1}
      rotation={[0, 0.2, 0]}
      polar={[-Math.PI / 5, Math.PI / 5]}
      azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
    >
      <MouseParallaxGroup>
        <group scale={scale}>
          {/* ── Front Cover ── */}
          <RoundedBox
            args={[COVER_W, COVER_H, COVER_THICK]}
            radius={COVER_RADIUS}
            smoothness={4}
            position={[0, 0, SPINE_D / 2 - COVER_THICK / 2]}
            material={matCoverFront}
          />

          {/* ── Back Cover ── */}
          <RoundedBox
            args={[COVER_W, COVER_H, COVER_THICK]}
            radius={COVER_RADIUS}
            smoothness={4}
            position={[0, 0, -SPINE_D / 2 + COVER_THICK / 2]}
            material={matCoverBack}
          />

          {/* ── Spine ── */}
          <mesh position={[-COVER_W / 2 + 0.012, 0, 0]} material={matSpine}>
            <boxGeometry args={[0.028, COVER_H, SPINE_D]} />
          </mesh>
          <mesh position={[-COVER_W / 2 + 0.012, COVER_H / 2 - 0.005, 0]} material={matSpineEdge}>
            <boxGeometry args={[0.028, 0.01, SPINE_D]} />
          </mesh>
          <mesh position={[-COVER_W / 2 + 0.012, -COVER_H / 2 + 0.005, 0]} material={matSpineEdge}>
            <boxGeometry args={[0.028, 0.01, SPINE_D]} />
          </mesh>

          {/* ── Page Block ── */}
          <mesh position={[px, 0, 0]} material={matPageBlock}>
            <boxGeometry args={[PAGE_W, PAGE_H, PAGE_D]} />
          </mesh>

          {/* Page line layers */}
          {PAGE_INDICES.map((i) => {
            const t = (i + 1) / (PAGE_LAYER_COUNT + 1);
            const z = -PAGE_D / 2 + PAGE_D * t;
            return (
              <mesh key={i} position={[px, 0, z]} material={matPageLine}>
                <boxGeometry args={[PAGE_W - 0.01, PAGE_H - 0.01, 0.001]} />
              </mesh>
            );
          })}

          {/* ── Page Edges ── */}
          <mesh position={[px + PAGE_W / 2, 0, 0]} material={matPageBlock}>
            <boxGeometry args={[0.008, PAGE_H - 0.02, PAGE_D - 0.01]} />
          </mesh>
          <mesh position={[px, PAGE_H / 2, 0]} material={matPageBlock}>
            <boxGeometry args={[PAGE_W - 0.02, 0.008, PAGE_D - 0.01]} />
          </mesh>
          <mesh position={[px, -PAGE_H / 2, 0]} material={matPageBlock}>
            <boxGeometry args={[PAGE_W - 0.02, 0.008, PAGE_D - 0.01]} />
          </mesh>

          {/* ── Cover Decorations ── */}
          <mesh position={[0.05, 0.72, SPINE_D / 2 + 0.001]} material={matAccent}>
            <boxGeometry args={[COVER_W * 0.35, 0.018, 0.003]} />
          </mesh>
          <mesh position={[0.05, COVER_H / 2 - 0.1, SPINE_D / 2 + 0.001]} material={matAccent}>
            <boxGeometry args={[COVER_W * 0.72, 0.002, 0.002]} />
          </mesh>
          <mesh position={[0.05, -COVER_H / 2 + 0.14, SPINE_D / 2 + 0.001]} material={matAccent}>
            <boxGeometry args={[COVER_W * 0.72, 0.002, 0.002]} />
          </mesh>

          {/* ── Cover Typography ── */}
          {/* Logo — top of cover (1201×276px = 4.35:1 aspect) */}
          <LogoPlane
            position={[0.05, 1.0, SPINE_D / 2 + 0.004]}
            scale={[0.75, 0.172]}
          />

          <Text
            position={[0.05, 0.18, SPINE_D / 2 + 0.005]}
            fontSize={0.19}
            color={C.textLight}
            anchorX="center"
            anchorY="middle"
            maxWidth={COVER_W * 0.72}
            textAlign="center"
            lineHeight={1.3}
          >
            {title}
          </Text>

          <mesh position={[0.05, -0.4, SPINE_D / 2 + 0.001]} material={matAccent}>
            <boxGeometry args={[0.3, 0.008, 0.002]} />
          </mesh>

          <Text
            position={[0.05, -0.55, SPINE_D / 2 + 0.005]}
            fontSize={0.065}
            color={C.textMuted}
            font="/fonts/Inter-Regular.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
            maxWidth={COVER_W * 0.7}
            textAlign="center"
          >
            {subtitle.toUpperCase()}
          </Text>

          {/* Overline — bottom of cover */}
          <Text
            position={[0.05, -COVER_H / 2 + 0.24, SPINE_D / 2 + 0.005]}
            fontSize={0.065}
            color={C.textGold}
            font="/fonts/Inter-Regular.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.22}
          >
            EXCLUSIVE INSIGHT
          </Text>

          <Text
            position={[-COVER_W / 2 - 0.005, 0, 0]}
            fontSize={0.07}
            color={C.textGold}
            font="/fonts/Inter-Regular.woff"
            anchorX="center"
            anchorY="middle"
            rotation={[0, -Math.PI / 2, Math.PI / 2]}
            letterSpacing={0.12}
          >
            FOUNDATION PROJECTS
          </Text>
        </group>
      </MouseParallaxGroup>
    </PresentationControls>
  );
}

// ─── Canvas Wrapper ──────────────────────────────────────────────────────────

interface FreebieBook3DProps {
  title: string;
  subtitle: string;
  className?: string;
}

export default function FreebieBook3D({ title, subtitle, className }: FreebieBook3DProps) {
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

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 36 }}
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
        <BookModel title={title} subtitle={subtitle} />
      </Canvas>
    </div>
  );
}
