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

import { useMemo, useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Layer from './Layer';
import { getLayerHeight, calculateBlockPositions } from '../utils/layoutUtils';
import { useVariant } from '../VariantContext';
import type { ResolvedGeometry } from '../VariantContext';
import { isHeroStep } from '../utils/stepNavigation';
import {
  precomputeTrajectories,
  type BlockTrajectory,
} from '../utils/mosaicLayout';
import { useAdaptiveMosaic } from '../hooks/useAdaptiveMosaic';
import {
  easeInOutCubic,
  lerp,
  lerpV3,
  quadraticBezierV3,
  smoothProgress,
} from '../utils/easings';
import { animation } from '../config';
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
      layer.blocks.forEach(block => {
        if (block.id !== currentStep && (
          scrollDirection === 'up'
            ? block.id > currentStep
            : block.id < currentStep
        )) {
          aboveIds.push(block.id);
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

  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(currentStep, layers, steps, scrollDirection),
    [currentStep, layers, steps, scrollDirection]
  );

  // Lift direction: forward(down) = UP (+1), reverse(up) = DOWN (-1)
  const aboveLiftSign = scrollDirection === 'up' ? -1 : 1;

  // For reverse: layers ABOVE active haven't been seen yet but occlude it.
  // They must lift UP to make room, mirroring how forward lifts already-seen layers.
  const blocksNotYetSeenAbove = useMemo(() => {
    if (scrollDirection !== 'up' || isHeroStep(currentStep)) return [];
    const activeLayerIndex = layers.findIndex(layer =>
      layer.blocks.some(block => block.id === currentStep)
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

  const isRevealed = !isHeroStep(currentStep);

  const allBlocks = useMemo(
    () => collectAllBlocks(layerPositions, geo),
    [layerPositions, geo],
  );

  // Header measurement — needed by adaptive mosaic (state) and scene offset (ref)
  const headerPxRef = useRef(0);
  const contentRatioRef = useRef(0.45);
  const [headerPx, setHeaderPx] = useState(0);

  useEffect(() => {
    const measure = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const h = parseFloat(rootStyles.getPropertyValue('--header-height')) || 0;
      headerPxRef.current = h;
      setHeaderPx(h);

      const rawContentWidth = rootStyles.getPropertyValue('--content-width').trim();
      const parsedContentWidth = rawContentWidth.endsWith('%')
        ? parseFloat(rawContentWidth) / 100
        : 0.45;

      contentRatioRef.current = window.innerWidth <= 768 ? 0 : parsedContentWidth;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
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
  const mosaicBlockData = useMemo((): MosaicBlockDataMap | undefined => {
    if (mosaicProgress <= 0) return undefined;
    return interpolateMosaicPositions(mosaicProgress, trajectories, allBlocks);
  }, [mosaicProgress, trajectories, allBlocks]);

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
  const offsetInitializedRef = useRef(false);

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
    const isHeroView = isHeroStep(currentStep);
    const isMobile = size.width < animation.zoom.mobileBreakpoint;
    const targetZoom = isHeroView
      ? (isMobile ? animation.zoom.heroMobile : animation.zoom.heroDesktop)
      : (isMobile ? animation.zoom.mobile : animation.zoom.desktop);

    const worldPerPx = 1 / targetZoom;
    const targetOffsetX = size.width * contentRatioRef.current * 0.5 * worldPerPx;

    // 1. Cross-axis compensation: X offset in isometric also shifts screen-Y.
    const crossAxisCompY = targetOffsetX * ISO_PROJECTION.yPerX;

    // 2. Header compensation: fixed header covers top of canvas,
    //    shift cube DOWN to center in visible area below header.
    const headerCompY = -(headerPxRef.current / (2 * targetZoom * ISO_PROJECTION.screenYPerWorldY));

    const targetOffsetY = mosaicConfig.sceneOffset.stackY + crossAxisCompY + headerCompY;

    // First frame: snap to target (skip damping to prevent startup animation)
    if (!offsetInitializedRef.current) {
      dampedOffsetXRef.current = targetOffsetX;
      dampedOffsetYRef.current = targetOffsetY;
      offsetInitializedRef.current = true;
    }

    // Smooth hero↔iso transition via damping (synced with camera & zoom λ)
    dampedOffsetXRef.current = d(dampedOffsetXRef.current, targetOffsetX, OFFSET_LAMBDA, delta);
    dampedOffsetYRef.current = d(dampedOffsetYRef.current, targetOffsetY, OFFSET_LAMBDA, delta);

    // During mosaic transition, lerp towards center (0, mosaicY)
    const finalX = lerp(dampedOffsetXRef.current, 0, transitionProgress);
    const finalY = lerp(dampedOffsetYRef.current, mosaicConfig.sceneOffset.mosaicY, transitionProgress);

    groupRef.current.position.set(finalX, finalY, 0);
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
            currentStep={currentStep}
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
