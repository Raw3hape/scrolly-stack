/**
 * Effects — Post-Processing Pipeline
 *
 * Renders EffectComposer with Bloom and Vignette when enabled.
 * All values driven by `config.postProcessing` — no props required.
 *
 * Keeps the post stack mounted through the morph to avoid visible palette pops.
 */

import type { ReactElement } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { mosaic as mosaicConfig, postProcessing } from '../../config';
import { lerp, smoothProgress } from '../../utils/easings';

interface EffectsProps {
  mosaicProgress?: number;
}

export default function Effects({ mosaicProgress = 0 }: EffectsProps) {
  if (!postProcessing.enabled) return null;

  const transitionProgress = smoothProgress(
    mosaicProgress,
    mosaicConfig.motion.viewStart,
    mosaicConfig.motion.viewEnd,
  );

  const effects: ReactElement[] = [];

  if (postProcessing.bloom.enabled) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={lerp(
          postProcessing.bloom.intensity,
          postProcessing.bloom.intensity * 0.92,
          transitionProgress,
        )}
        luminanceThreshold={postProcessing.bloom.luminanceThreshold}
        luminanceSmoothing={postProcessing.bloom.luminanceSmoothing}
        mipmapBlur={postProcessing.bloom.mipmapBlur}
      />,
    );
  }

  if (postProcessing.vignette.enabled) {
    effects.push(
      <Vignette
        key="vignette"
        offset={postProcessing.vignette.offset}
        darkness={postProcessing.vignette.darkness}
      />,
    );
  }

  if (effects.length === 0) return null;

  return <EffectComposer multisampling={0}>{effects}</EffectComposer>;
}
