'use client';

/**
 * ScrollyExperience — Foundation Projects
 *
 * ARCHITECTURE:
 * - Canvas always fullscreen (position:fixed) — no resize, no jump
 * - z-index: --z-canvas (50) — below header (1000) and content (100)
 * - pointer-events: none by default — clicks pass through to page content
 * - pointer-events: auto only when mosaic is settled AND not exiting
 *
 * 3-PHASE SCROLL:
 * 1. Assembly (mosaic 0→1): blocks fly from stack to grid
 * 2. Hold: grid stays visible
 * 3. Exit (exit 0→1): translateY slides grid upward out of viewport
 */

import { useState, useRef, useMemo } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import FpsCounter from '@/components/FpsCounter/FpsCounter';
import { VariantProvider } from './VariantContext';
import { HERO_STEP } from './utils/stepNavigation';
import useScrollProgress from './utils/useScrollProgress';
import './ScrollyExperience.css';

interface ScrollyExperienceProps {
  variantId?: string;
  onReady?: () => void;
}

export default function ScrollyExperience({ variantId, onReady }: ScrollyExperienceProps) {
  const [currentStep, setStep] = useState(HERO_STEP);
  const mosaicTriggerRef = useRef<HTMLDivElement>(null);
  const { mosaic: mosaicProgress, exit: exitProgress } = useScrollProgress(mosaicTriggerRef);

  // Pointer events: only when mosaic is fully assembled AND not exiting
  const isInteractive = mosaicProgress >= 1 && exitProgress <= 0;

  // Exit animation: translateY slides the canvas upward
  // At exit=0: normal position. At exit=1: fully off-screen (-100vh)
  const exitStyle = useMemo(() => {
    if (exitProgress <= 0) return undefined;
    return {
      transform: `translateY(${-exitProgress * 100}vh)`,
    };
  }, [exitProgress]);

  return (
    <VariantProvider variantId={variantId}>
    <div className="layout-container">
      <div
        className="col-content"
        style={isInteractive ? { pointerEvents: 'none' } : undefined}
      >
        <Overlay
          currentStep={currentStep}
          setStep={setStep}
          mosaicTriggerRef={mosaicTriggerRef}
        />
      </div>
      <div
        className={`col-visual ${isInteractive ? 'col-visual--interactive' : ''}`}
        style={exitStyle}
      >
        <Scene
          currentStep={currentStep}
          mosaicProgress={mosaicProgress}
          onBlockClick={() => {}}
          onReady={onReady}
        />
      </div>
      {process.env.NODE_ENV === 'development' && <FpsCounter />}

      {/* Debug probe for Playwright position-tracking tests (hidden, DOM-only) */}
      <div
        id="three-debug"
        style={{ display: 'none' }}
        data-mosaic-progress={mosaicProgress}
        data-current-step={currentStep}
        data-exit-progress={exitProgress}
      />
    </div>
    </VariantProvider>
  );
}
