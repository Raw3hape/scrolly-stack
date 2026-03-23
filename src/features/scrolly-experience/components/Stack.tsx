/**
 * Stack Component — Single-Phase Mosaic Transition
 *
 * Data-driven container that renders all layers and orchestrates
 * the mosaic transition when mosaicProgress > 0.
 *
 * TRANSITION: Single smooth Bezier arc from stack positions to grid positions.
 * No multi-phase animation — scroll-driven, stops when you stop scrolling.
 *
 * PERFORMANCE FIX #6: Uses flat array instead of Map for block data.
 * All values driven by config.ts — zero hardcode.
 */

import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Layer from './Layer';
import { getLayerHeight, calculateBlockPositions } from '../utils/layoutUtils';
import { useVariant } from '../VariantContext';
import type { ResolvedGeometry } from '../VariantContext';
import { isHeroStep, HERO_STEP } from '../utils/stepNavigation';
import {
  precomputeTrajectories,
  type BlockTrajectory,
} from '../utils/mosaicLayout';
import { useAdaptiveMosaic } from '../hooks/useAdaptiveMosaic';
import useAdaptiveFinalZoom from '../hooks/useAdaptiveFinalZoom';
import {
  easeInOutCubic,
  lerp,
  lerpV3,
  quadraticBezierV3,
  smoothProgress,
} from '../utils/easings';
import { animation } from '../config';
import { computeMaxIsoZoom } from '../utils/computeMaxIsoZoom';
import type { StackProps, LayerData, StepData, ComputedBlock } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface MosaicBlockDatum {
  position: [number, number, number];
  dimensions: [number, number, number];
}

/** Block data lookup keyed by block ID */
export type MosaicBlockDataMap = Record<number, MosaicBlockDatum>;

// =============================================================================
// ISOMETRIC CROSS-AXIS CORRECTION — derived from camera config, zero hardcode
//
// In isometric projection, shifting group.position.x ALSO shifts screen-Y
// because the camera's screen-up vector has an X component.
// For camera [d,d,d] + up [0,1,0]: trueUp = (-1, 2, -1)/√6
// → each unit of X-offset shifts screen-Y by trueUp.x/trueUpLen = -0.408
// → we compensate with Y += -X * (trueUp.x / trueUp.y) = X * 0.5
//
// Without this, the X-offset for the two-column layout pushes the stack
// DOWN ~94px on screen — the real root cause of "cube too low".
// =============================================================================

const ISO_PROJECTION = (() => {
  const pos = animation.camera.positions.isometric as [number, number, number];
  const up = animation.camera.upVectors.isometric as [number, number, number];

  const len = Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2);
  const fwd: [number, number, number] = [-pos[0] / len, -pos[1] / len, -pos[2] / len];

  const dotUpFwd = up[0] * fwd[0] + up[1] * fwd[1] + up[2] * fwd[2];
  const trueUp = [
    up[0] - dotUpFwd * fwd[0],
    up[1] - dotUpFwd * fwd[1],
    up[2] - dotUpFwd * fwd[2],
  ];
  const trueUpLen = Math.sqrt(trueUp[0] ** 2 + trueUp[1] ** 2 + trueUp[2] ** 2);

  return {
    // Cancels screen-Y displacement from X offset: Y += X * yPerX
    yPerX: -trueUp[0] / trueUp[1],
    // World-Y to screen-Y factor: screenPx = worldY * screenYPerWorldY * zoom
    screenYPerWorldY: trueUp[1] / trueUpLen,
  };
})();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * VARIANT-SAFE: Uses layer indices.
 * scrollDirection='down': layers with LOWER index = "already seen" (above)
 * scrollDirection='up':   layers with HIGHER index = "already seen" (below, seen first)
 */
function calculateBlocksAboveActive(
  currentStep: number,
  layers: LayerData[],
  _steps: StepData[],
  scrollDirection: 'down' | 'up',
): number[] {
  if (isHeroStep(currentStep)) return [];

  const activeLayerIndex = layers.findIndex(layer =>
    layer.blocks.some(block => block.id === currentStep)
  );
  if (activeLayerIndex < 0) return [];

  const aboveIds: number[] = [];

  layers.forEach((layer, layerIndex) => {
    const isAlreadySeen = scrollDirection === 'up'
      ? layerIndex > activeLayerIndex   // bottom-to-top: higher index = seen first
      : layerIndex < activeLayerIndex;  // top-to-bottom: lower index = seen first

    if (isAlreadySeen) {
      layer.blocks.forEach(block => aboveIds.push(block.id));
    } else if (layerIndex === activeLayerIndex) {
      // Use array index (not block ID) to determine reveal order within a layer.
      // Block IDs may not be sequential after reordering (e.g. reversed crown).
      const activeBlockIndex = layer.blocks.findIndex(b => b.id === currentStep);
      layer.blocks.forEach((block, blockIndex) => {
        if (block.id !== currentStep) {
          const isBlockAlreadySeen = scrollDirection === 'up'
            ? blockIndex > activeBlockIndex
            : blockIndex < activeBlockIndex;
          if (isBlockAlreadySeen) {
            aboveIds.push(block.id);
          }
        }
      });
    }
  });

  return aboveIds;
}

function calculateLayerPositions(
  layers: LayerData[],
  geo: ResolvedGeometry,
): Array<{ layer: LayerData; baseY: number }> {
  let totalHeight = 0;
  layers.forEach((layer) => {
    totalHeight += getLayerHeight(layer, geo);
  });

  const positions: Array<{ layer: LayerData; baseY: number }> = [];
  let currentY = totalHeight / 2;

  for (const layer of layers) {
    positions.push({ layer, baseY: currentY });
    currentY -= getLayerHeight(layer, geo);
  }

  return positions;
}

/**
 * VARIANT-SAFE + SCROLL-DIRECTION-SAFE.
 * Hero always shows the TOP layer (index 0) because the camera is top-down,
 * so only the topmost layer is visible regardless of scroll direction.
 */
function calculateLayerOpacity(
  layerIndex: number,
  _totalLayers: number,
  currentStep: number,
  _scrollDirection: 'down' | 'up',
): number {
  if (isHeroStep(currentStep)) {
    return layerIndex === 0 ? 1 : 0;
  }
  return 1;
}

// =============================================================================
// SINGLE-PHASE BEZIER INTERPOLATION
// =============================================================================

function collectAllBlocks(
  layerPositions: Array<{ layer: LayerData; baseY: number }>,
  geo: ResolvedGeometry,
): ComputedBlock[] {
  const allBlocks: ComputedBlock[] = [];
  for (const { layer, baseY } of layerPositions) {
    const blocks = calculateBlockPositions(layer, baseY, geo);
    allBlocks.push(...blocks);
  }
  return allBlocks;
}

function computeArcControl(
  stack: [number, number, number],
  grid: [number, number, number],
): [number, number, number] {
  const midX = (stack[0] + grid[0]) / 2;
  const midY = (stack[1] + grid[1]) / 2;
  const midZ = (stack[2] + grid[2]) / 2;

  const dx = grid[0] - stack[0];
  const dy = grid[1] - stack[1];
  const dz = grid[2] - stack[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const lift = 1.5 + distance * 0.5;

  return [midX, midY + lift, midZ];
}

/**
 * PERFORMANCE FIX #6: Returns a flat Record<blockId, data> instead of 2 Maps.
 * Eliminates 2 Map allocations per frame → simple object keyed by ID.
 */
function interpolateMosaicPositions(
  progress: number,
  trajectories: BlockTrajectory[],
  allBlocks: ComputedBlock[],
): MosaicBlockDataMap {
  const t = easeInOutCubic(progress);
  const result: MosaicBlockDataMap = {};

  for (let i = 0; i < trajectories.length; i++) {
    const traj = trajectories[i];

    const pos = quadraticBezierV3(
      traj.stackPosition,
      traj.arcControlPoint,
      traj.mosaicPosition,
      t,
    );

    const dims = lerpV3(
      traj.stackDimensions,
      traj.mosaicDimensions,
      t,
    ) as [number, number, number];

    result[allBlocks[i].id] = { position: pos, dimensions: dims };
  }

  return result;
}

// =============================================================================
// STACK COMPONENT
// =============================================================================

export default function Stack({ currentStep, mosaicProgress, onBlockClick, onBlockHover }: StackProps) {
  const { layers, steps, geometry: geo, mosaicConfig, scrollDirection } = useVariant();

  // Adaptive mosaic zoom — viewport-derived, matches Scene.tsx's camera zoom
  const totalBlocks = layers.reduce((sum, layer) => sum + layer.blocks.length, 0);
  const adaptiveFinalZoom = useAdaptiveFinalZoom(mosaicConfig, totalBlocks);

  // =========================================================================
  // CLOSE PHASE: Override currentStep when mosaic starts.
  //
  // When mosaicProgress > 0, ALL blocks must return to their base positions
  // (no slide, no lift) BEFORE the Bezier arc begins. We achieve this by
  // setting effectiveStep = HERO_STEP, which makes isActive = false and
  // isAboveActive = [] for every block. Springs animate the return smoothly.
  //
  // isRevealed stays true (from real currentStep) so blocks remain visible —
  // only the position offset (slide + lift) is deactivated.
  // =========================================================================
  const effectiveStep = mosaicProgress > 0 ? HERO_STEP : currentStep;

  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(effectiveStep, layers, steps, scrollDirection),
    [effectiveStep, layers, steps, scrollDirection]
  );

  // Lift direction: forward(down) = UP (+1), reverse(up) = DOWN (-1)
  const aboveLiftSign = scrollDirection === 'up' ? -1 : 1;

  // For reverse: layers ABOVE active haven't been seen yet but occlude it.
  // They must lift UP to make room, mirroring how forward lifts already-seen layers.
  const blocksNotYetSeenAbove = useMemo(() => {
    if (scrollDirection !== 'up' || isHeroStep(effectiveStep)) return [];
    const activeLayerIndex = layers.findIndex(layer =>
      layer.blocks.some(block => block.id === effectiveStep)
    );
    if (activeLayerIndex < 0) return [];
    const ids: number[] = [];
    layers.forEach((layer, idx) => {
      if (idx < activeLayerIndex) {
        layer.blocks.forEach(b => ids.push(b.id));
      }
    });
    return ids;
  }, [scrollDirection, currentStep, layers]);

  const layerPositions = useMemo(
    () => calculateLayerPositions(layers, geo),
    [layers, geo],
  );

  const isRevealed = !isHeroStep(currentStep);  // Keep real step — blocks stay visible

  const allBlocks = useMemo(
    () => collectAllBlocks(layerPositions, geo),
    [layerPositions, geo],
  );

  // Header measurement — needed by adaptive mosaic (state) and scene offset (ref)
  const headerPxRef = useRef(0);
  // Initialize from actual viewport — avoids first-frame snap to desktop value
  // on mobile (0.45 → 0 drift visible as cube sliding left-to-right).
  const contentRatioRef = useRef(
    typeof window !== 'undefined' && window.innerWidth <= animation.zoom.mobileBreakpoint ? 0 : 0.45
  );
  // Mobile: hero content bottom (px from viewport top) — cached to avoid
  // getComputedStyle/DOM reads in useFrame (layout thrashing at 60fps).
  // Cube centers in remaining space below this line.
  const heroBottomRef = useRef(0);
  // Cached maxIsoZoom — computed on mount+resize, NEVER in useFrame
  // (getComputedStyle inside useFrame = layout thrashing at 60fps)
  const maxIsoZoomRef = useRef(0);
  const [headerPx, setHeaderPx] = useState(0);

  // useLayoutEffect: runs before first paint and before first R3F useFrame,
  // so all refs (contentRatio, headerPx, heroBottom, maxIsoZoom) are correct
  // on the very first render frame — prevents startup position drift.
  useLayoutEffect(() => {
    const measure = () => {
      // Measure REAL header height from DOM — CSS token is inaccurate on mobile
      // (--header-height-mobile = 64px, actual V2Header ≈ 90px due to padding)
      const headerEl = document.querySelector('.v2-header');
      const h = headerEl
        ? headerEl.getBoundingClientRect().height
        : 72; // fallback
      headerPxRef.current = h;
      setHeaderPx(h);

      const rootStyles = getComputedStyle(document.documentElement);
      const isMobileViewport = window.innerWidth <= animation.zoom.mobileBreakpoint;

      const rawContentWidth = rootStyles.getPropertyValue('--content-width').trim();
      const parsedContentWidth = rawContentWidth.endsWith('%')
        ? parseFloat(rawContentWidth) / 100
        : 0.45;

      contentRatioRef.current = isMobileViewport ? 0 : parsedContentWidth;

      // Measure hero TEXT CONTENT bottom (not the container, which is 100dvh).
      // Use last content element (.hero__cta-wrapper) as the boundary.
      // Cube will center in the space between contentBottom and viewport bottom.
      if (isMobileViewport) {
        const ctaEl = document.querySelector('.hero__cta-wrapper');
        if (ctaEl) {
          const ctaRect = ctaEl.getBoundingClientRect();
          // Only cache when hero is near viewport — stale negative values
          // during deep scroll cause cube to fly off-screen on resize events
          if (ctaRect.bottom > 0 && ctaRect.top < window.innerHeight) {
            heroBottomRef.current = ctaRect.bottom;
          }
        }
      }

      // Cache maxIsoZoom — avoids getComputedStyle in useFrame (layout thrashing)
      maxIsoZoomRef.current = computeMaxIsoZoom(layers, geo);
    };

    measure();
    // Debounce resize — iOS address bar show/hide fires rapid resize events
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measure, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [layers, geo]);

  // Re-measure heroBottomRef when user scrolls BACK to hero zone.
  // measure() only runs on mount/resize — this handles the "returned to hero"
  // case where CTA rect was stale from a deep-scroll resize event.
  // rAF-throttled: at most one getBoundingClientRect per frame, NOT in useFrame.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth <= animation.zoom.mobileBreakpoint;
    if (!isMobile) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        // Only measure when hero is near viewport top
        if (window.scrollY > window.innerHeight * 0.5) return;
        const ctaEl = document.querySelector('.hero__cta-wrapper');
        if (!ctaEl) return;
        const ctaRect = ctaEl.getBoundingClientRect();
        if (ctaRect.bottom > 0 && ctaRect.top < window.innerHeight) {
          heroBottomRef.current = ctaRect.bottom;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Adaptive mosaic: fits grid to viewport, auto cols on mobile
  const adaptedMosaic = useAdaptiveMosaic(mosaicConfig, allBlocks, headerPx);

  const trajectories = useMemo(
    () => {
      const trajs = precomputeTrajectories(allBlocks, adaptedMosaic);
      return trajs.map((traj) => ({
        ...traj,
        arcControlPoint: computeArcControl(traj.stackPosition, traj.mosaicPosition),
      }));
    },
    [allBlocks, adaptedMosaic],
  );

  // Compute interpolated mosaic data — uses Record instead of Map
  // Settle phase: delay mosaic override until viewStart threshold.
  // During 0 → viewStart, springs return blocks to base positions (drop lift/slide).
  // This prevents the visible jerk when blocks teleport from lifted to mosaic start.
  const settleThreshold = mosaicConfig.motion.viewStart;

  const mosaicBlockData = useMemo((): MosaicBlockDataMap | undefined => {
    if (mosaicProgress <= settleThreshold) return undefined;
    return interpolateMosaicPositions(mosaicProgress, trajectories, allBlocks);
  }, [mosaicProgress, settleThreshold, trajectories, allBlocks]);

  // ========================================================================
  // SCENE OFFSET — emulates "right column" in 3D space
  //
  // Canvas is always fullscreen. To make the stack appear in the right half,
  // we shift the scene group rightward. During mosaic, the offset smoothly
  // returns to 0 (centered on full viewport).
  //
  // ARCHITECTURE: Offset stays a pure function of viewport + scroll progress,
  // so reversing scroll always returns to the exact same coordinates.
  // ========================================================================
  const { size } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // ========================================================================
  // DAMPED SCENE OFFSET
  //
  // Uses state-specific target zoom (hero or iso) instead of a fixed REF_ZOOM
  // so the cube is always centered in the visual column regardless of zoom.
  //
  // Vertical centering (header compensation) is handled by CameraRig.lookAt.
  // This component only handles horizontal positioning + stackY/mosaicY.
  //
  // Damping (λ=4) syncs with CameraRig & ZoomController — no desync.
  // First frame is initialized without damping to avoid startup drift.
  // ========================================================================
  const dampedOffsetXRef = useRef(0);
  const dampedOffsetYRef = useRef(0);
  const dampedOffsetZRef = useRef(0);
  const offsetInitializedRef = useRef(false);

  // Hero blend: damped 0→1 float synced with CameraRig's UNIFIED_LAMBDA.
  // Prevents offset discontinuity when camera transitions between iso↔hero.
  // Without this, Z-offset and headerCompY switch instantly while camera is
  // still damping → Z means different things in iso vs hero → cube flies away.
  const heroBlendRef = useRef(0);

  /** Must match CameraRig & ZoomController UNIFIED_LAMBDA for synchronized motion */
  const OFFSET_LAMBDA = 4;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const d = THREE.MathUtils.damp;

    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );

    // Deterministic target zoom per state (not the live animated zoom)
    // — keeps offset stable (same state = same position, no damp-jitter)
    // Cap iso zoom with computeMaxIsoZoom so position compensation matches
    // the actual camera zoom (which is also capped by the same function).
    const isHeroView = isHeroStep(currentStep);
    const isMobile = size.width < animation.zoom.mobileBreakpoint;
    const maxIso = maxIsoZoomRef.current || animation.zoom.desktop;
    const targetZoom = isHeroView
      ? (isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop)
      : (isMobile ? animation.zoom.mobile : Math.min(animation.zoom.desktop, maxIso));

    const worldPerPx = 1 / targetZoom;
    const targetOffsetX = size.width * contentRatioRef.current * 0.5 * worldPerPx;

    // 1. Cross-axis compensation: X offset in isometric also shifts screen-Y.
    const crossAxisCompY = targetOffsetX * ISO_PROJECTION.yPerX;

    // 2. Hero blend: damped transition synced with camera damping.
    //    Iso camera: +Z = up-left on screen. Hero camera: +Z = down on screen.
    //    Blending prevents Z-offset from having wrong semantics during transition.
    const heroTarget = (isMobile && isHeroView) ? 1 : 0;

    // 3. Header + visual-zone compensation.
    //    Blended via heroBlend instead of instant if/else — stays synced with
    //    CameraRig's damped camera transition.
    const isoHeaderCompY = -(headerPxRef.current / (2 * targetZoom * ISO_PROJECTION.screenYPerWorldY));
    const hb = heroBlendRef.current;
    const headerCompY = isoHeaderCompY * (1 - hb);

    // 4. Z-offset for top-down hero camera, blended via heroBlend.
    //    Compute hero Z value always (even in iso), then scale by heroBlend.
    //    This ensures smooth transition without semantic discontinuity.
    let heroZ = 0;
    if (isMobile) {
      const heroBottom = heroBottomRef.current || size.height * 0.5;
      const cubeZoneCenter = (heroBottom + size.height) / 2;
      const shiftPx = cubeZoneCenter - size.height / 2;
      heroZ = shiftPx / targetZoom;
    }
    const targetOffsetZ = heroZ * hb;

    const targetOffsetY = mosaicConfig.sceneOffset.stackY + crossAxisCompY + headerCompY;

    // First frame: snap to target (skip damping to prevent startup animation)
    if (!offsetInitializedRef.current) {
      dampedOffsetXRef.current = targetOffsetX;
      dampedOffsetYRef.current = targetOffsetY;
      dampedOffsetZRef.current = targetOffsetZ;
      heroBlendRef.current = heroTarget; // snap, no damping on first frame
      offsetInitializedRef.current = true;
    }

    // Smooth hero↔iso transition via damping (synced with camera & zoom λ)
    dampedOffsetXRef.current = d(dampedOffsetXRef.current, targetOffsetX, OFFSET_LAMBDA, delta);
    dampedOffsetYRef.current = d(dampedOffsetYRef.current, targetOffsetY, OFFSET_LAMBDA, delta);
    // Z: heroBlendRef already provides damping — writing directly avoids
    // double-damping that would make Z lag behind the camera transition.
    heroBlendRef.current = d(heroBlendRef.current, heroTarget, OFFSET_LAMBDA, delta);
    dampedOffsetZRef.current = targetOffsetZ;

    // During mosaic transition, lerp towards center (0, mosaicY, 0).
    // Apply header compensation to mosaicY so the grid is centered in the
    // visible area below the fixed header — same principle as headerCompY above.
    const finalX = lerp(dampedOffsetXRef.current, 0, transitionProgress);
    // Use adaptive zoom (viewport-derived) for accurate header compensation
    const mosaicZoom = adaptiveFinalZoom;
    const mosaicHeaderCompY = -(headerPxRef.current / (2 * mosaicZoom * ISO_PROJECTION.screenYPerWorldY));
    const mosaicTargetY = mosaicConfig.sceneOffset.mosaicY + mosaicHeaderCompY;
    const finalY = lerp(dampedOffsetYRef.current, mosaicTargetY, transitionProgress);
    const finalZ = lerp(dampedOffsetZRef.current, 0, transitionProgress);

    groupRef.current.position.set(finalX, finalY, finalZ);
  });

  return (
    <group ref={groupRef}>
      {layerPositions.map(({ layer, baseY }, index) => {
        const totalLayers = layerPositions.length;
        const opacity = calculateLayerOpacity(index, totalLayers, currentStep, scrollDirection);

        // Stagger: 'down' reveals top→bottom, 'up' reveals bottom→top
        const staggerDelay = isRevealed
          ? (scrollDirection === 'up'
              ? (totalLayers - 1 - index) * 100  // bottom layers first
              : index * 100)                      // top layers first
          : (scrollDirection === 'up'
              ? index * 100                        // top layers fade last
              : (totalLayers - 1 - index) * 100);  // bottom layers fade last

        return (
          <Layer
            key={layer.id}
            layer={layer}
            baseY={baseY}
            currentStep={effectiveStep}
            allBlocksAboveActive={blocksAboveActive}
            aboveLiftSign={aboveLiftSign}
            allBlocksNotYetSeenAbove={blocksNotYetSeenAbove}
            onBlockClick={onBlockClick}
            onBlockHover={onBlockHover}
            opacity={opacity}
            staggerDelay={staggerDelay}
            isRevealed={isRevealed}
            mosaicProgress={mosaicProgress}
            mosaicBlockData={mosaicBlockData}
            labelFontSize={adaptedMosaic.labelFontSize}
            labelMaxWidth={adaptedMosaic.labelMaxWidth}
          />
        );
      })}
    </group>
  );
}
