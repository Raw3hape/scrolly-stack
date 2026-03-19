/**
 * HomeClient — Client wrapper managing splash → loader → site transition.
 *
 * FLOW:
 * 1. No ?variant= in URL → show VariantSelector (splash screen)
 * 2. User picks variant → router.push('/?variant=id') → browser history entry
 * 3. Scene signals onReady → fade out TransitionLoader → reveal site
 * 4. Browser back button → removes ?variant= → shows selector again
 *
 * TransitionLoader covers Header/Footer (z-index: 9999) for clean transition.
 */

'use client';

import { useState, useCallback, useRef, type ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ScrollyLoader from '@/features/scrolly-experience/ScrollyLoader';
import VariantSelector from '@/components/VariantSelector/VariantSelector';
import TransitionLoader from '@/components/TransitionLoader/TransitionLoader';

interface HomeClientProps {
  /** Pre-selected variant from URL ?variant= (SSR initial value) */
  initialVariantId?: string;
  /** Server-rendered page content (everything below the scrolly) */
  children: ReactNode;
}

export default function HomeClient({ initialVariantId, children }: HomeClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read variant from URL query param (reactive — updates on back/forward)
  const variantId = searchParams.get('variant') ?? initialVariantId ?? null;

  const [sceneReady, setSceneReady] = useState(false);

  // Track whether user navigated from splash (persists through re-renders)
  const cameFromSplash = useRef(false);

  // Show loader: either navigated from splash, or loaded without initial variant
  const showLoader = cameFromSplash.current || !initialVariantId;

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const handleVariantSelect = useCallback((id: string) => {
    cameFromSplash.current = true;
    setSceneReady(false); // Reset for fresh load
    // Push to URL — creates browser history entry so back button works
    router.push(`/?variant=${id}`);
  }, [router]);

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
