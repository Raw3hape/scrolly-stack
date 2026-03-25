'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * NavigationTracker — sets [data-hero-revisit] on <html> after the first
 * SPA navigation. CSS uses this to suppress hero intro animations on
 * subsequent page visits (prevents flicker/re-entrance effects).
 */
export default function NavigationTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    document.documentElement.setAttribute('data-hero-revisit', '');
  }, [pathname]);

  return null;
}
