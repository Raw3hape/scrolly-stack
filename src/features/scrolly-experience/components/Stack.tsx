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

import { useMemo, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Layer from './Layer';
import { getLayerHeight, calculateBlockPositions } from '../utils/layoutUtils';
import { layers, steps } from '../data';
import { isHeroStep } from '../utils/stepNavigation';
import {
  precomputeTrajectories,
  type BlockTrajectory,
} from '../utils/mosaicLayout';
import {
  easeInOutCubic,
  lerp,
  lerpV3,
  quadraticBezierV3,
  smoothProgress,
} from '../utils/easings';
import { mosaic as mosaicConfig } from '../config';
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
// HELPER FUNCTIONS
// =============================================================================

function calculateBlocksAboveActive(currentStep: number): number[] {
  if (isHeroStep(currentStep)) return [];

  const activeStep = (steps as StepData[]).find((s) => s.id === currentStep);
  if (!activeStep) return [];

  const activeLevel = activeStep.level;
  const aboveIds: number[] = [];

  (steps as StepData[]).forEach((step) => {
    if (step.id === currentStep) return;

    const stepLevel = step.level;

    if (activeLevel === 'C') {
      if (stepLevel === 'A' || stepLevel === 'B') {
        aboveIds.push(step.id);
      }
      if (stepLevel === 'C' && step.id < currentStep) {
        aboveIds.push(step.id);
      }
    } else if (activeLevel === 'B') {
      if (stepLevel === 'A') {
        aboveIds.push(step.id);
      }
    }
  });

  return aboveIds;
}

function calculateLayerPositions(): Array<{ layer: LayerData; baseY: number }> {
  let totalHeight = 0;
  (layers as LayerData[]).forEach((layer) => {
    totalHeight += getLayerHeight(layer);
  });

  const positions: Array<{ layer: LayerData; baseY: number }> = [];
  let currentY = totalHeight / 2;

  for (const layer of layers as LayerData[]) {
    positions.push({ layer, baseY: currentY });
    currentY -= getLayerHeight(layer);
  }

  return positions;
}

function calculateLayerOpacity(layer: LayerData, currentStep: number): number {
  if (isHeroStep(currentStep)) {
    return layer.level === 'A' ? 1 : 0;
  }
  return 1;
}

// =============================================================================
// SINGLE-PHASE BEZIER INTERPOLATION
// =============================================================================

function collectAllBlocks(
  layerPositions: Array<{ layer: LayerData; baseY: number }>,
): ComputedBlock[] {
  const allBlocks: ComputedBlock[] = [];
  for (const { layer, baseY } of layerPositions) {
    const blocks = calculateBlockPositions(layer, baseY);
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

  const lift = 1.5 + distance * mosaicConfig.arc.heightFactor;

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
  const blocksAboveActive = useMemo(
    () => calculateBlocksAboveActive(currentStep),
    [currentStep]
  );

  const layerPositions = useMemo(() => calculateLayerPositions(), []);

  const isRevealed = !isHeroStep(currentStep);

  const allBlocks = useMemo(
    () => collectAllBlocks(layerPositions),
    [layerPositions],
  );

  const trajectories = useMemo(
    () => {
      const trajs = precomputeTrajectories(allBlocks);
      return trajs.map((traj) => ({
        ...traj,
        arcControlPoint: computeArcControl(traj.stackPosition, traj.mosaicPosition),
      }));
    },
    [allBlocks],
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
  const { viewport, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const headerPxRef = useRef(0);
  const contentRatioRef = useRef(0.45);

  useEffect(() => {
    const measure = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      headerPxRef.current = parseFloat(rootStyles.getPropertyValue('--header-height')) || 0;

      const rawContentWidth = rootStyles.getPropertyValue('--content-width').trim();
      const parsedContentWidth = rawContentWidth.endsWith('%')
        ? parseFloat(rawContentWidth) / 100
        : 0.45;

      contentRatioRef.current = window.innerWidth < 768 ? 0 : parsedContentWidth;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Keep the group position as a pure function of scroll/viewport so it never drifts.
  useFrame(() => {
    if (!groupRef.current) return;

    const transitionProgress = smoothProgress(
      mosaicProgress,
      mosaicConfig.motion.viewStart,
      mosaicConfig.motion.viewEnd,
    );
    const worldPerPxX = viewport.width / size.width;
    const worldPerPx = viewport.height / size.height;
    const headerCompensation = headerPxRef.current
      * worldPerPx
      * mosaicConfig.sceneOffset.headerCompensationFactor;
    const stackOffsetX = size.width * contentRatioRef.current * 0.5 * worldPerPxX;
    const stackOffsetY = mosaicConfig.sceneOffset.stackY + headerCompensation;

    const finalX = lerp(stackOffsetX, 0, transitionProgress);
    const finalY = lerp(stackOffsetY, mosaicConfig.sceneOffset.mosaicY, transitionProgress);

    groupRef.current.position.set(finalX, finalY, 0);
  });

  return (
    <group ref={groupRef}>
      {layerPositions.map(({ layer, baseY }, index) => {
        const opacity = calculateLayerOpacity(layer, currentStep);
        const totalLayers = layerPositions.length;
        const staggerDelay = isRevealed
          ? index * 100
          : (totalLayers - 1 - index) * 100;

        return (
          <Layer
            key={layer.id}
            layer={layer}
            baseY={baseY}
            currentStep={currentStep}
            allBlocksAboveActive={blocksAboveActive}
            onBlockClick={onBlockClick}
            onBlockHover={onBlockHover}
            opacity={opacity}
            staggerDelay={staggerDelay}
            isRevealed={isRevealed}
            mosaicProgress={mosaicProgress}
            mosaicBlockData={mosaicBlockData}
          />
        );
      })}
    </group>
  );
}
