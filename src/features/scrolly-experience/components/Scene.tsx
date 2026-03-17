/**
 * Scene Component — Orchestrator
 *
 * Assembles the 3D canvas: camera, lighting, effects, parallax, and content.
 * Individual concerns are extracted into `./scene/` modules.
 *
 * PERFORMANCE: Mouse parallax uses useRef instead of useState
 * to avoid triggering full React re-renders on every mousemove.
 */

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import Stack from './Stack';
import HoverTooltip from './HoverTooltip';
import SceneLoader from './scene/SceneLoader';
import Lights from './scene/Lights';
import Effects from './scene/Effects';
import MouseParallaxGroup from './scene/MouseParallaxGroup';
import { CameraRig, ZoomController, useResponsiveZoom } from './scene/camera';
import { animation, shadows, lighting, render } from '../config';
import { isHeroStep, getStepElementId } from '../utils/stepNavigation';
import type { SceneProps, RawBlockData, MousePosition } from '../types';

// =============================================================================
// MAIN SCENE COMPONENT
// =============================================================================

export default function Scene({ currentStep, onBlockClick }: SceneProps) {
  const zoom = useResponsiveZoom(currentStep);
  const isHero = isHeroStep(currentStep);

  // Hover state for tooltip (DOM overlay — needs state for re-render)
  const [hoveredBlock, setHoveredBlock] = useState<RawBlockData | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * PERFORMANCE FIX: Mouse parallax uses useRef instead of useState.
   * mousemove fires 60+ times/sec — useState would trigger full React tree
   * re-renders each time. useRef mutates silently, and useFrame reads it.
   */
  const parallaxMouseRef = useRef({ x: 0, y: 0 });

  const handleBlockClick = useCallback((blockId: number) => {
    const stepElement = document.getElementById(getStepElementId(blockId));
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (onBlockClick) {
      onBlockClick(blockId);
    }
  }, [onBlockClick]);

  const handleBlockHover = useCallback((blockData: RawBlockData | null, isHovered: boolean, mousePos: MousePosition | null) => {
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
        shadows={{ type: THREE[render.shadowMapType as keyof typeof THREE] as THREE.ShadowMapType }}
        dpr={render.dpr as [number, number]}
        orthographic
        camera={{
          zoom: zoom,
          position: animation.camera.positions.hero as [number, number, number],
          fov: 25,
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.AgXToneMapping }}
      >
        <CameraRig isHero={isHero} />
        <ZoomController targetZoom={zoom} />

        <Lights />

        <Environment
          preset={lighting.environment.preset as 'studio' | 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'lobby' | 'park'}
          environmentIntensity={lighting.environment.intensity}
        />

        <Suspense fallback={<SceneLoader />}>
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
