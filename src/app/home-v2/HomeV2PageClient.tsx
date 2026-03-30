/**
 * HomeV2PageClient — Client wrapper for /home-v2 page.
 *
 * Isolated copy of HomeV2Client that imports ScrollyLoader from
 * scrolly-experience-v2 feature folder. Changes to the V2 3D experience
 * do NOT affect the original homepage.
 *
 * SAFETY NET: 8s timeout dismisses the loader even if WebGL fails silently.
 */

'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { ScrollyLoader } from '@/features/scrolly-experience-v2';

interface HomeV2PageClientProps {
  /** Variant ID for the 3D cube (default: v6-exact-flipped) */
  variantId?: string;
  /** Server-rendered sections (below the 3D cube) */
  children: ReactNode;
}

/** Max time to wait for WebGL ready signal before forcing loader dismiss */
const READY_TIMEOUT_MS = 4_000;

/** Module-level flag — skip branded loader on SPA return visits */
let hasLoadedOnce = false;

export default function HomeV2PageClient({ variantId = 'v7-progressive', children }: HomeV2PageClientProps) {
  const [sceneReady, setSceneReady] = useState(hasLoadedOnce);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSceneReady = useCallback(() => {
    hasLoadedOnce = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSceneReady(true);
  }, []);

  // Safety net: dismiss loader after timeout if onReady never fires.
  // Skip if already loaded once (SPA return visit).
  useEffect(() => {
    if (hasLoadedOnce) return;
    timeoutRef.current = setTimeout(() => {
      setSceneReady((prev) => {
        if (!prev) {
          console.warn('[HomeV2PageClient] WebGL ready timeout — forcing loader dismiss');
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
      <div className="v2-content-wrapper" data-content-wrapper>
        <ScrollyLoader variantId={variantId} onReady={handleSceneReady} sceneReady={sceneReady} />

        <div className="v2-sections">
          {children}
        </div>
      </div>
    </>
  );
}
