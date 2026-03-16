/**
 * Lights — Scene Lighting Setup
 *
 * Renders ambient, directional (main + fill + bottom) lights.
 * All values driven by `config.lighting` — no props required.
 *
 * Must render inside `<Canvas>` (uses R3F JSX elements).
 */

import { lighting } from '../../config';

export default function Lights() {
  return (
    <>
      <ambientLight intensity={lighting.ambient.intensity} />

      <directionalLight
        position={lighting.main.position as [number, number, number]}
        intensity={lighting.main.intensity}
        castShadow={lighting.main.castShadow}
        shadow-mapSize={[lighting.main.shadowMapSize, lighting.main.shadowMapSize]}
        shadow-camera-far={lighting.main.shadowCamera.far}
        shadow-camera-left={lighting.main.shadowCamera.left}
        shadow-camera-right={lighting.main.shadowCamera.right}
        shadow-camera-top={lighting.main.shadowCamera.top}
        shadow-camera-bottom={lighting.main.shadowCamera.bottom}
        shadow-bias={lighting.main.shadowBias}
        shadow-radius={lighting.main.shadowRadius}
        shadow-blurSamples={lighting.main.blurSamples}
      />

      <directionalLight
        position={lighting.fill.position as [number, number, number]}
        intensity={lighting.fill.intensity}
        color={lighting.fill.color}
      />

      {lighting.bottom && (
        <directionalLight
          position={lighting.bottom.position as [number, number, number]}
          intensity={lighting.bottom.intensity}
          color={lighting.bottom.color}
        />
      )}
    </>
  );
}
