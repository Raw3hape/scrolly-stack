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
 * 3. Exit (exit 0→1): sections at z=100 wipe over canvas z=50
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

  // Touch detection — stable after mount (capability doesn't change mid-session)
  const isTouchDevice = useMemo(
    () => typeof window !== 'undefined'
      && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    [],
  );

  // Pointer events: only when mosaic is fully assembled AND not exiting.
  // Touch devices: no tile hover/click, so never make canvas interactive
  // or promote z-index — prevents gesture interception on mobile.
  const isInteractive = !isTouchDevice && mosaicProgress >= 1 && exitProgress <= 0;
  const isPriorityFrame = !isTouchDevice && mosaicProgress >= 1 && exitProgress < 0.15;

  // On touch devices: keep col-content scrollable even during mosaic hold.
  // Mobile has no tile hover/click — disabling pointer-events only blocks scroll.
  // On desktop: disable content for mosaic tile hover/click interactions.
  const contentStyle = (isInteractive && !isTouchDevice)
    ? { pointerEvents: 'none' as const }
    : undefined;

  // Exit: slide canvas UP + fade out. This physically moves the opaque
  // fixed-position canvas upward, revealing v2-sections beneath (z=49).
  const exitStyle = useMemo(() => {
    if (exitProgress <= 0) return undefined;
    return {
      transform: `translateY(${-exitProgress * 100}%)`,
      opacity: Math.max(0, 1 - exitProgress * 1.5), // fully transparent at ~67% exit
    };
  }, [exitProgress]);

  return (
    <VariantProvider variantId={variantId}>
    <div className="layout-container">
      <div
        className="col-content"
        style={contentStyle}
      >
        <Overlay
          currentStep={currentStep}
          setStep={setStep}
          mosaicTriggerRef={mosaicTriggerRef}
        />
      </div>
      <div
        className={`col-visual ${isInteractive ? 'col-visual--interactive' : ''} ${isPriorityFrame ? 'col-visual--priority' : ''}`}
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
