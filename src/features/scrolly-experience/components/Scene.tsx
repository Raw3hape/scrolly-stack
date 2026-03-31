/**
 * Scene Component — Orchestrator
 *
 * Assembles the 3D canvas: camera, lighting, effects, parallax, and content.
 * Individual concerns are extracted into `./scene/` modules.
 *
 * PERFORMANCE: Mouse parallax uses useRef instead of useState
 * to avoid triggering full React re-renders on every mousemove.
 *
 * MOSAIC: When mosaicProgress > 0, PresentationControls are disabled
 * to prevent user dragging during the transition.
 */

import { Suspense, lazy, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { VSMShadowMap, PCFSoftShadowMap, ACESFilmicToneMapping, AgXToneMapping } from 'three';
import type { ShadowMapType } from 'three';
import { getIOSGpuOverrides } from '../utils/iosGpuProfile';
import Stack from './Stack';
import HoverTooltip from './HoverTooltip';
import SceneLoader from './scene/SceneLoader';
import Lights from './scene/Lights';
const Effects = lazy(() => import('./scene/Effects'));
import MouseParallaxGroup from './scene/MouseParallaxGroup';
import { CameraRig, ZoomController, useResponsiveZoom } from './scene/camera';
import { animation, lighting, render } from '../config';

const SHADOW_MAP_TYPES: Record<string, ShadowMapType> = { VSMShadowMap, PCFSoftShadowMap };
import { useVariant } from '../VariantContext';
import useAdaptiveFinalZoom from '../hooks/useAdaptiveFinalZoom';
import { isHeroStep, getStepElementId } from '../utils/stepNavigation';
import { computeMaxIsoZoom as computeMaxIso } from '../utils/computeMaxIsoZoom';
import type { SceneProps, RawBlockData, MousePosition } from '../types';

// =============================================================================
// MAIN SCENE COMPONENT
// =============================================================================

/** Ensures demand-mode Canvas renders during scroll — critical for mobile touch
 *  scroll where no other invalidation source may exist. Listens for scroll events
 *  and calls invalidate() so the 3D scene updates during scroll momentum. */
function ScrollInvalidator() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const handler = () => invalidate();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [invalidate]);

  return null;
}

/** Fires onReady after the first fully-rendered frames (shaders compiled, env loaded).
 *  Uses rAF + invalidate() instead of useFrame so it works with frameloop="demand". */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const firedRef = useRef(false);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (firedRef.current || !onReady) return;
    let count = 0;
    const tick = () => {
      count++;
      invalidate(); // Force R3F to render a frame in demand mode
      if (count >= 3) {
        firedRef.current = true;
        onReady();
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [onReady, invalidate]);

  return null;
}

export default function Scene({
  currentStep,
  mosaicProgress,
  onBlockClick,
  onReady,
}: SceneProps & { onReady?: () => void }) {
  const { mosaicConfig, layers, geometry: geo } = useVariant();

  // Total block count — needed for adaptive zoom row calculation
  const totalBlocks = layers.reduce((sum, layer) => sum + layer.blocks.length, 0);

  // ── Adaptive isometric zoom cap ────────────────────────────────────────
  // Uses shared utility (also used by Stack.tsx for position compensation)
  // to ensure camera zoom and cube positioning use the same value.
  const [maxIsoZoomLive, setMaxIsoZoomLive] = useState(() => computeMaxIso(layers, geo));
  useEffect(() => {
    const handleResize = () => setMaxIsoZoomLive(computeMaxIso(layers, geo));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [layers, geo]);

  // Dynamic mosaic zoom: fills viewport with header clearance, replaces static finalZoom
  const adaptiveFinalZoom = useAdaptiveFinalZoom(mosaicConfig, totalBlocks);
  const zoom = useResponsiveZoom(currentStep, mosaicProgress, adaptiveFinalZoom, maxIsoZoomLive);
  const isHero = isHeroStep(currentStep);

  // iOS GPU overrides — null on desktop (zero changes to desktop path)
  const iosOverrides = getIOSGpuOverrides();

  // Use capped DPR on mobile to reduce GPU load (3× screens don't need 2× render)
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth <= animation.zoom.mobileBreakpoint;
  const activeDpr = isMobile && render.mobileDpr ? render.mobileDpr : render.dpr;

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

  const handleBlockClick = useCallback(
    (blockId: number) => {
      const stepElement = document.getElementById(getStepElementId(blockId));
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (onBlockClick) {
        onBlockClick(blockId);
      }
    },
    [onBlockClick],
  );

  const handleBlockHover = useCallback(
    (blockData: RawBlockData | null, isHovered: boolean, mousePos: MousePosition | null) => {
      if (isHovered && blockData) {
        setHoveredBlock(blockData);
        setMousePosition(mousePos);
      } else {
        setHoveredBlock(null);
        setMousePosition(null);
      }
    },
    [],
  );

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
        shadows={{ type: SHADOW_MAP_TYPES[iosOverrides?.shadowMapType ?? render.shadowMapType] }}
        dpr={activeDpr as [number, number]}
        orthographic
        camera={{
          zoom: zoom,
          position: animation.camera.positions.hero as [number, number, number],
          fov: 25,
        }}
        frameloop="demand"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: iosOverrides ? ACESFilmicToneMapping : AgXToneMapping,
          ...(iosOverrides ? { powerPreference: iosOverrides.powerPreference } : {}),
        }}
        onCreated={(state) => {
          // Precompile all shaders asynchronously — eliminates first-frame stutter
          // (especially noticeable on mobile GPUs). Falls back to sync invalidate
          // if compileAsync is unavailable (Three.js < v158).
          if (state.gl.compileAsync) {
            state.gl.compileAsync(state.scene, state.camera).then(() => {
              state.invalidate();
            });
          } else {
            state.invalidate();
            requestAnimationFrame(() => state.invalidate());
          }

          // WebGL context-loss safety net — if iOS kills the context
          // (memory pressure, background tab), dismiss the loader so the
          // user isn't stuck on a frozen loading screen.
          const canvas = state.gl.domElement;
          const handleContextLost = (e: Event) => {
            e.preventDefault();
            console.warn('[ScrollyStack] WebGL context lost — dismissing loader');
            onReady?.();
          };
          canvas.addEventListener('webglcontextlost', handleContextLost);
        }}
      >
        <ScrollInvalidator />
        <CameraRig isHero={isHero} mosaicProgress={mosaicProgress} />
        <ZoomController targetZoom={zoom} mosaicProgress={mosaicProgress} />

        <Lights />

        <Suspense fallback={null}>
          <Environment
            files="/envmaps/venice_sunset_256.hdr"
            environmentIntensity={lighting.environment.intensity}
          />
        </Suspense>

        <Suspense fallback={<SceneLoader />}>
          <MouseParallaxGroup
            mouseRef={parallaxMouseRef}
            isHero={isHero}
            mosaicProgress={mosaicProgress}
          >
            <Stack
              currentStep={currentStep}
              mosaicProgress={mosaicProgress}
              onBlockClick={handleBlockClick}
              onBlockHover={handleBlockHover}
            />
          </MouseParallaxGroup>
          <ReadySignal onReady={onReady} />
        </Suspense>

        <Suspense fallback={null}>
          <Effects mosaicProgress={mosaicProgress} />
        </Suspense>
      </Canvas>

      <HoverTooltip hoveredBlock={hoveredBlock} mousePosition={mousePosition} />
    </div>
  );
}
