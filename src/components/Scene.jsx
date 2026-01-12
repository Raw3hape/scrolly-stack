/**
 * Scene Component
 * 
 * Main 3D canvas with lighting, post-processing, and camera controls.
 * All settings driven by config.js.
 */

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, ContactShadows, useProgress, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Stack from './Stack';
import { animation, lighting, shadows, postProcessing, render } from '../config';

// =============================================================================
// LOADING INDICATOR
// =============================================================================

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #f1f5f9',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: '#64748b',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
        }}>
          Loading 3D... {progress.toFixed(0)}%
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Html>
  );
}

// =============================================================================
// CAMERA RIG
// =============================================================================

function CameraRig({ currentStep }) {
  useFrame((state, delta) => {
    const isHero = currentStep === -1;
    
    const targetPos = isHero
      ? new THREE.Vector3(...animation.camera.positions.hero)
      : new THREE.Vector3(...animation.camera.positions.isometric);

    const targetUp = isHero
      ? new THREE.Vector3(...animation.camera.upVectors.hero)
      : new THREE.Vector3(...animation.camera.upVectors.isometric);

    state.camera.position.lerp(targetPos, delta * animation.camera.lerpSpeed);
    state.camera.up.lerp(targetUp, delta * animation.camera.lerpSpeed);
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// =============================================================================
// ZOOM CONTROLLER
// =============================================================================

function useResponsiveZoom() {
  const [zoom, setZoom] = useState(() => {
    if (typeof window === 'undefined') return animation.zoom.desktop;
    return window.innerWidth < animation.zoom.mobileBreakpoint
      ? animation.zoom.mobile
      : animation.zoom.desktop;
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setZoom(
      width < animation.zoom.mobileBreakpoint
        ? animation.zoom.mobile
        : animation.zoom.desktop
    );
  }, []);

  useEffect(() => {
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return zoom;
}

function ZoomController({ targetZoom }) {
  useFrame((state, delta) => {
    if (Math.abs(state.camera.zoom - targetZoom) > 0.1) {
      state.camera.zoom = THREE.MathUtils.lerp(
        state.camera.zoom,
        targetZoom,
        delta * animation.zoom.lerpSpeed
      );
      state.camera.updateProjectionMatrix();
    }
  });
  
  return null;
}

// =============================================================================
// LIGHTING SETUP
// =============================================================================

function Lights() {
  return (
    <>
      <ambientLight intensity={lighting.ambient.intensity} />
      
      {/* Main directional light with soft VSM shadows */}
      <directionalLight
        position={lighting.main.position}
        intensity={lighting.main.intensity}
        castShadow={lighting.main.castShadow}
        shadow-mapSize={[lighting.main.shadowMapSize, lighting.main.shadowMapSize]}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={lighting.main.shadowBias}
        shadow-radius={lighting.main.shadowRadius}
        shadow-blurSamples={25}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={lighting.fill.position}
        intensity={lighting.fill.intensity}
        color={lighting.fill.color}
      />
      
      {/* Bottom fill light to soften undersides */}
      {lighting.bottom && (
        <directionalLight
          position={lighting.bottom.position}
          intensity={lighting.bottom.intensity}
          color={lighting.bottom.color}
        />
      )}
    </>
  );
}

// =============================================================================
// POST-PROCESSING EFFECTS
// =============================================================================

function Effects() {
  if (!postProcessing.enabled) return null;

  return (
    <EffectComposer>
      {postProcessing.bloom.enabled && (
        <Bloom
          intensity={postProcessing.bloom.intensity}
          luminanceThreshold={postProcessing.bloom.luminanceThreshold}
          luminanceSmoothing={postProcessing.bloom.luminanceSmoothing}
          mipmapBlur={postProcessing.bloom.mipmapBlur}
        />
      )}
      
      {postProcessing.vignette.enabled && (
        <Vignette
          offset={postProcessing.vignette.offset}
          darkness={postProcessing.vignette.darkness}
        />
      )}
    </EffectComposer>
  );
}

// =============================================================================
// MAIN SCENE COMPONENT
// =============================================================================

export default function Scene({ currentStep, onBlockClick }) {
  const zoom = useResponsiveZoom();
  
  // Handle block click - scroll to corresponding step
  const handleBlockClick = useCallback((blockId) => {
    // Scroll to the step element
    const stepElement = document.getElementById(`step-${blockId}`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Also call the parent handler if provided
    if (onBlockClick) {
      onBlockClick(blockId);
    }
  }, [onBlockClick]);

  return (
    <Canvas
      shadows={{ type: THREE.VSMShadowMap }}
      dpr={render.dpr}
      orthographic
      camera={{
        zoom: zoom,
        position: animation.camera.positions.hero,
        fov: 25,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <CameraRig currentStep={currentStep} />
      <ZoomController targetZoom={zoom} />
      
      <Lights />
      
      <Environment 
        preset={lighting.environment.preset} 
        environmentIntensity={lighting.environment.intensity}
      />

      <Suspense fallback={<Loader />}>
        <PresentationControls
          global={false}
          cursor={true}
          snap={true}
          speed={1}
          zoom={1}
          rotation={[0, 0, 0]}
          polar={[-Infinity, Infinity]}
          azimuth={[-Infinity, Infinity]}
          config={{ mass: 1, tension: 170, friction: 26 }}
        >
          <Stack currentStep={currentStep} onBlockClick={handleBlockClick} />
        </PresentationControls>
      </Suspense>

      {/* ContactShadows only if enabled in config */}
      {shadows.enabled && (
        <ContactShadows
          position={shadows.contact.position}
          opacity={shadows.contact.opacity}
          scale={shadows.contact.scale}
          blur={shadows.contact.blur}
          far={shadows.contact.far}
          resolution={shadows.contact.resolution}
          color={shadows.contact.color}
        />
      )}
      
      <Effects />
    </Canvas>
  );
}
