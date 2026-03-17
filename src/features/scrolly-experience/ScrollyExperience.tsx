'use client';

/**
 * ScrollyExperience — Foundation Projects
 *
 * Entry point for the 3D scrollytelling experience.
 * This is the ONLY 'use client' boundary for the entire feature.
 * All child components (Scene, Stack, Layer, Block, Overlay) inherit client mode.
 *
 * Loaded via dynamic(ssr:false) in app/page.tsx.
 */

import { useState } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import FpsCounter from '@/components/FpsCounter/FpsCounter';
import { HERO_STEP } from './utils/stepNavigation';
import './ScrollyExperience.css';

export default function ScrollyExperience() {
  const [currentStep, setStep] = useState(HERO_STEP);

  return (
    <div className="layout-container">
      <div className="col-content">
        <Overlay currentStep={currentStep} setStep={setStep} />
      </div>
      <div className="col-visual">
        <Scene currentStep={currentStep} onBlockClick={() => {}} />
      </div>
      {process.env.NODE_ENV === 'development' && <FpsCounter />}
    </div>
  );
}

