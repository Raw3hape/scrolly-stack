/**
 * HomeV2Client — Client wrapper for /v2/ Home page.
 *
 * Simplified version of HomeClient:
 * - No VariantSelector splash (uses default variant directly)
 * - Mounts ScrollyLoader (3D cube) replacing Stitch Hero section
 * - TransitionLoader covers until scene is ready
 * - Static Stitch sections render below the 3D cube
 */

'use client';

import { useState, useCallback, type ReactNode } from 'react';
import ScrollyLoader from '@/features/scrolly-experience/ScrollyLoader';
import TransitionLoader from '@/components/TransitionLoader/TransitionLoader';

interface HomeV2ClientProps {
  /** Variant ID for the 3D cube (default: v4-exact) */
  variantId?: string;
  /** Server-rendered Stitch sections (below the 3D cube) */
  children: ReactNode;
}

export default function HomeV2Client({ variantId = 'v6-exact-flipped', children }: HomeV2ClientProps) {
  const [sceneReady, setSceneReady] = useState(false);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  return (
    <>
      {/* TransitionLoader covers everything until scene is ready */}
      <TransitionLoader visible={!sceneReady} />

      {/* 3D Cube replaces Stitch Hero section */}
      <ScrollyLoader variantId={variantId} onReady={handleSceneReady} />

      {/* Stitch sections below the cube — positioned above sticky canvas */}
      <div className="v2-sections">
        {children}
      </div>
    </>
  );
}
