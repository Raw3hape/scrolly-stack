/**
 * Scene Component
 *
 * Main 3D canvas with lighting, post-processing, and camera controls.
 * All settings driven by config.
 *
 * PERFORMANCE: Mouse parallax uses useRef instead of useState
 * to avoid triggering full React re-renders on every mousemove.
 */

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, ContactShadows, useProgress, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Stack from './Stack';
import HoverTooltip from './HoverTooltip';
import { animation, lighting, shadows, postProcessing, render } from '../config';
import type { SceneProps, BlockData, MousePosition } from '../types';

// Mouse parallax intensity (radians)
const PARALLAX_INTENSITY = 0.04;
const PARALLAX_LERP_SPEED = 0.05;

// =============================================================================
// LOADING INDICATOR
// =============================================================================

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #f1f5f9',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: '#64748b',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
        }}>
          Loading 3D... {progress.toFixed(0)}%
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
}

// =============================================================================
// CAMERA RIG
// =============================================================================

function CameraRig({ currentStep }: { currentStep: number }) {
  useFrame((state, delta) => {
    const isHero = currentStep === -1;

    const targetPos = isHero
      ? new THREE.Vector3(...(animation.camera.positions.hero as [number, number, number]))
      : new THREE.Vector3(...(animation.camera.positions.isometric as [number, number, number]));

    const targetUp = isHero
      ? new THREE.Vector3(...(animation.camera.upVectors.hero as [number, number, number]))
      : new THREE.Vector3(...(animation.camera.upVectors.isometric as [number, number, number]));

    state.camera.position.lerp(targetPos, delta * animation.camera.lerpSpeed);
    state.camera.up.lerp(targetUp, delta * animation.camera.lerpSpeed);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// =============================================================================
// ZOOM CONTROLLER
// =============================================================================

function useResponsiveZoom(currentStep: number): number {
  const [baseZoom, setBaseZoom] = useState(() => {
    if (typeof window === 'undefined') return animation.zoom.desktop;
    return window.innerWidth < animation.zoom.mobileBreakpoint
      ? animation.zoom.mobile
      : animation.zoom.desktop;
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setBaseZoom(
      width < animation.zoom.mobileBreakpoint
        ? animation.zoom.mobile
        : animation.zoom.desktop
    );
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  const isHero = currentStep === -1;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < animation.zoom.mobileBreakpoint;

  if (isHero) {
    return isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop;
  }

  return baseZoom;
}

function ZoomController({ targetZoom }: { targetZoom: number }) {
  useFrame((state, delta) => {
    if (Math.abs(state.camera.zoom - targetZoom) > 0.1) {
      state.camera.zoom = THREE.MathUtils.lerp(
        state.camera.zoom,
        targetZoom,
        delta * animation.zoom.lerpSpeed
      );
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

// =============================================================================
// MOUSE PARALLAX CONTROLLER (uses ref, no re-renders)
// =============================================================================

interface MouseParallaxGroupProps {
  children: React.ReactNode;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

function MouseParallaxGroup({ children, mouseRef }: MouseParallaxGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current || !mouseRef.current) return;

    const targetX = -mouseRef.current.y * PARALLAX_INTENSITY;
    const targetY = mouseRef.current.x * PARALLAX_INTENSITY;

    currentRotation.current.x += (targetX - currentRotation.current.x) * PARALLAX_LERP_SPEED;
    currentRotation.current.y += (targetY - currentRotation.current.y) * PARALLAX_LERP_SPEED;

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

// =============================================================================
// LIGHTING SETUP
// =============================================================================

function Lights() {
  return (
    <>
      <ambientLight intensity={lighting.ambient.intensity} />

      <directionalLight
        position={lighting.main.position as [number, number, number]}
        intensity={lighting.main.intensity}
        castShadow={lighting.main.castShadow}
        shadow-mapSize={[lighting.main.shadowMapSize, lighting.main.shadowMapSize]}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={lighting.main.shadowBias}
        shadow-radius={lighting.main.shadowRadius}
        shadow-blurSamples={25}
      />

      <directionalLight
        position={lighting.fill.position as [number, number, number]}
        intensity={lighting.fill.intensity}
        color={lighting.fill.color}
      />

      {lighting.bottom && (
        <directionalLight
          position={lighting.bottom.position as [number, number, number]}
          intensity={lighting.bottom.intensity}
          color={lighting.bottom.color}
        />
      )}
    </>
  );
}

// =============================================================================
// POST-PROCESSING EFFECTS
// =============================================================================

function Effects() {
  if (!postProcessing.enabled) return null;

  // Collect enabled effects to avoid null children in EffectComposer
  const effects: React.ReactElement[] = [];

  if (postProcessing.bloom.enabled) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={postProcessing.bloom.intensity}
        luminanceThreshold={postProcessing.bloom.luminanceThreshold}
        luminanceSmoothing={postProcessing.bloom.luminanceSmoothing}
        mipmapBlur={postProcessing.bloom.mipmapBlur}
      />
    );
  }

  if (postProcessing.vignette.enabled) {
    effects.push(
      <Vignette
        key="vignette"
        offset={postProcessing.vignette.offset}
        darkness={postProcessing.vignette.darkness}
      />
    );
  }

  if (effects.length === 0) return null;

  return (
    <EffectComposer>
      {effects}
    </EffectComposer>
  );
}

// =============================================================================
// MAIN SCENE COMPONENT
// =============================================================================

export default function Scene({ currentStep, onBlockClick }: SceneProps) {
  const zoom = useResponsiveZoom(currentStep);

  // Hover state for tooltip (DOM overlay — needs state for re-render)
  const [hoveredBlock, setHoveredBlock] = useState<BlockData | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * PERFORMANCE FIX: Mouse parallax uses useRef instead of useState.
   * mousemove fires 60+ times/sec — useState would trigger full React tree
   * re-renders each time. useRef mutates silently, and useFrame reads it.
   */
  const parallaxMouseRef = useRef({ x: 0, y: 0 });

  const handleBlockClick = useCallback((blockId: number) => {
    const stepElement = document.getElementById(`step-${blockId}`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (onBlockClick) {
      onBlockClick(blockId);
    }
  }, [onBlockClick]);

  const handleBlockHover = useCallback((blockData: BlockData | null, isHovered: boolean, mousePos: MousePosition | null) => {
    if (isHovered && blockData) {
      setHoveredBlock(blockData);
      setMousePosition(mousePos);
    } else {
      setHoveredBlock(null);
      setMousePosition(null);
    }
  }, []);

  // Track mouse for parallax (writes to ref, 0 re-renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      parallaxMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      parallaxMouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      // Update tooltip position if hovering (only this causes re-render)
      if (hoveredBlock) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredBlock]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows={{ type: THREE.VSMShadowMap }}
        dpr={render.dpr as [number, number]}
        orthographic
        camera={{
          zoom: zoom,
          position: animation.camera.positions.hero as [number, number, number],
          fov: 25,
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig currentStep={currentStep} />
        <ZoomController targetZoom={zoom} />

        <Lights />

        <Environment
          preset={lighting.environment.preset as 'studio' | 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'lobby' | 'park'}
          environmentIntensity={lighting.environment.intensity}
        />

        <Suspense fallback={<Loader />}>
          <MouseParallaxGroup mouseRef={parallaxMouseRef}>
            <PresentationControls
              global={false}
              cursor={true}
              snap={true}
              speed={1}
              zoom={1}
              rotation={[0, 0, 0]}
              polar={[-Infinity, Infinity]}
              azimuth={[-Infinity, Infinity]}
            >
              <Stack
                currentStep={currentStep}
                onBlockClick={handleBlockClick}
                onBlockHover={handleBlockHover}
              />
            </PresentationControls>
          </MouseParallaxGroup>
        </Suspense>

        {shadows.enabled && (
          <ContactShadows
            position={shadows.contact.position as [number, number, number]}
            opacity={shadows.contact.opacity}
            scale={shadows.contact.scale}
            blur={shadows.contact.blur}
            far={shadows.contact.far}
            resolution={shadows.contact.resolution}
            color={shadows.contact.color}
          />
        )}

        <Effects />
      </Canvas>

      <HoverTooltip
        hoveredBlock={hoveredBlock}
        mousePosition={mousePosition}
      />
    </div>
  );
}
