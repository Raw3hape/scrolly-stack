/**
 * Effects — Post-Processing Pipeline
 *
 * Renders EffectComposer with Bloom and Vignette when enabled.
 * All values driven by `config.postProcessing` — no props required.
 *
 * Must render inside `<Canvas>` (uses EffectComposer context).
 */

import type { ReactElement } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { postProcessing } from '../../config';

export default function Effects() {
  if (!postProcessing.enabled) return null;

  // Collect enabled effects to avoid null children in EffectComposer
  const effects: ReactElement[] = [];

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
