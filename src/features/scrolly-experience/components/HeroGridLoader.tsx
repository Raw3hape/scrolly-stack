/**
 * HeroGridLoader — Client wrapper for dynamic SSR-safe import of HeroGridCanvas.
 *
 * Three.js crashes on server import, so we dynamic-import with ssr:false.
 * This component is safe to render inside any client component.
 */

'use client';

import dynamic from 'next/dynamic';

const HeroGridCanvas = dynamic(() => import('./HeroGridCanvas'), {
  ssr: false,
  loading: () => null,   // No visible fallback — canvas fades in via CSS
});

export default function HeroGridLoader() {
  return <HeroGridCanvas />;
}
