/**
 * HomeV2Client — Client wrapper for /v2/ Home page.
 *
 * Simplified version of HomeClient:
 * - No VariantSelector splash (uses default variant directly)
 * - Mounts ScrollyLoader (3D cube) replacing Stitch Hero section
 * - TransitionLoader covers until scene is ready
 * - Static Stitch sections render below the 3D cube
 *
 * SAFETY NET: 8s timeout dismisses the loader even if WebGL fails silently
 * (iOS context crash, shader compilation failure, etc.)
 */

'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import ScrollyLoader from '@/features/scrolly-experience/ScrollyLoader';
import TransitionLoader from '@/components/TransitionLoader/TransitionLoader';

interface HomeV2ClientProps {
  /** Variant ID for the 3D cube (default: v4-exact) */
  variantId?: string;
  /** Server-rendered Stitch sections (below the 3D cube) */
  children: ReactNode;
}

/** Max time to wait for WebGL ready signal before forcing loader dismiss */
const READY_TIMEOUT_MS = 8_000;

export default function HomeV2Client({ variantId = 'v6-exact-flipped', children }: HomeV2ClientProps) {
  const [sceneReady, setSceneReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSceneReady = useCallback(() => {
    // Cancel timeout if scene became ready normally
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSceneReady(true);
  }, []);

  // Safety net: dismiss loader after timeout if onReady never fires.
  // This handles silent WebGL crashes on iOS where the canvas renders
  // nothing but no error is thrown.
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setSceneReady((prev) => {
        if (!prev) {
          console.warn('[HomeV2Client] WebGL ready timeout — forcing loader dismiss');
        }
        return true;
      });
    }, READY_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* TransitionLoader covers everything until scene is ready */}
      <TransitionLoader visible={!sceneReady} />

      {/* Content wrapper — sits above the sticky parallax footer (z=0).
          Solid background prevents the dark footer from peeking through
          any gaps between the scrolly experience and the sections below. */}
      <div className="v2-content-wrapper">
        {/* 3D Cube replaces Stitch Hero section */}
        <ScrollyLoader variantId={variantId} onReady={handleSceneReady} />

        {/* Stitch sections below the cube — positioned above sticky canvas */}
        <div className="v2-sections">
          {children}
        </div>
      </div>
    </>
  );
}

