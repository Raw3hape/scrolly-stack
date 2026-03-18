/**
 * HomeClient — Client wrapper managing splash → loader → site transition.
 *
 * FLOW:
 * 1. No variant selected → show VariantSelector (splash screen)
 * 2. Variant selected → show TransitionLoader (fullscreen) + mount ScrollyLoader behind it
 * 3. Scene signals onReady → fade out TransitionLoader → reveal site
 *
 * TransitionLoader covers Header/Footer (z-index: 9999) for clean transition.
 */

'use client';

import { useState, useCallback, type ReactNode } from 'react';
import ScrollyLoader from '@/features/scrolly-experience/ScrollyLoader';
import VariantSelector from '@/components/VariantSelector/VariantSelector';
import TransitionLoader from '@/components/TransitionLoader/TransitionLoader';

interface HomeClientProps {
  /** Pre-selected variant from URL ?variant= */
  initialVariantId?: string;
  /** Server-rendered page content (everything below the scrolly) */
  children: ReactNode;
}

export default function HomeClient({ initialVariantId, children }: HomeClientProps) {
  const [variantId, setVariantId] = useState<string | null>(initialVariantId ?? null);
  const [sceneReady, setSceneReady] = useState(false);

  // Show loader when coming from splash (not from direct URL)
  const showLoader = !initialVariantId;

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const handleVariantSelect = useCallback((id: string) => {
    setVariantId(id);
    // Loader is already visible (we keep showing it)
  }, []);

  // Phase 1: No variant selected — show splash
  if (!variantId) {
    return (
      <VariantSelector onSelect={handleVariantSelect} />
    );
  }

  // Phase 2 & 3: Variant selected — mount scene, show loader until ready
  return (
    <>
      {/* TransitionLoader covers everything until scene is ready */}
      {showLoader && (
        <TransitionLoader visible={!sceneReady} />
      )}

      {/* Scene loads behind the loader */}
      <ScrollyLoader variantId={variantId} onReady={handleSceneReady} />
      {children}
    </>
  );
}
