'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { HERO_3D_ROUTES } from '@/config/content';

/** Max time to wait for page:ready before forcing dismiss */
const READY_TIMEOUT_MS = 3_000;
/** Fade-out duration (matches CSS transition) */
const FADE_MS = 400;

/**
 * PageTransitionOverlay — Lightweight fade during SPA navigations.
 *
 * Shows a solid background-color overlay (no branding) that fades out
 * when the new page's 3D model fires `page:ready`, or after timeout.
 * Skips initial page load (handled by SSR / HomeV2Client).
 */
export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const isFirst = useRef(true);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
    // Unmount after fade-out transition completes
    fadeRef.current = setTimeout(() => setMounted(false), FADE_MS);
  }, []);

  // Show overlay on SPA navigation (skip first mount)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    // Only show overlay for pages with Hero 3D models
    if (!HERO_3D_ROUTES.has(pathname)) return;
    if (fadeRef.current) clearTimeout(fadeRef.current);
    setMounted(true);
    // Force a layout read so the opacity:1 transition fires from 0
    requestAnimationFrame(() => setVisible(true));
    timeoutRef.current = setTimeout(dismiss, READY_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, dismiss]);

  // Listen for page:ready custom event from Hero3DLoaders
  useEffect(() => {
    const handler = () => dismiss();
    window.addEventListener('page:ready', handler);
    return () => window.removeEventListener('page:ready', handler);
  }, [dismiss]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-sand-100)',
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden
    />
  );
}
