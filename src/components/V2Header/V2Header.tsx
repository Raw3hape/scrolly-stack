/**
 * V2Header — Stitch «Architectural Editorial» header.
 *
 * Features:
 * - Glassmorphism on scroll
 * - Hide on scroll-down, reveal on scroll-up
 * - Mobile drawer with full-screen overlay
 * - Data-driven from nav-v2.ts
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navLinksV2, ctaConfigV2, brandConfigV2, routesV2 } from '@/config/nav-v2';
import './V2Header.css';

export default function V2Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setIsScrolled(y > 40);

    if (y > lastScrollY.current && y > 200) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const headerClasses = [
    'v2-header',
    isScrolled ? 'v2-header--scrolled' : '',
    isHidden ? 'v2-header--hidden' : '',
  ].filter(Boolean).join(' ');

  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header className={headerClasses}>
        <div className="v2-header__inner">
          {/* Brand */}
          <Link href={routesV2.home} className="v2-header__brand" onClick={close}>
            <Image
              src={brandConfigV2.logo}
              alt={brandConfigV2.wordmark}
              width={120}
              height={30}
              className="v2-header__logo"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="v2-header__nav" aria-label="V2 navigation">
            {navLinksV2.map((link) => (
              <Link key={link.href} href={link.href} className="v2-header__link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Burger */}
          <div className="v2-header__actions">
            <Link href={ctaConfigV2.href} className="v2-header__cta">
              {ctaConfigV2.label} <span aria-hidden="true">→</span>
            </Link>

            <button
              className={`v2-header__burger ${isMenuOpen ? 'v2-header__burger--open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <span className="v2-header__burger-line" />
              <span className="v2-header__burger-line" />
              <span className="v2-header__burger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`v2-header__overlay ${isMenuOpen ? 'v2-header__overlay--open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <nav
        className={`v2-drawer ${isMenuOpen ? 'v2-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="v2-drawer__content">
          <div className="v2-drawer__links">
            {navLinksV2.map((link) => (
              <Link key={link.href} href={link.href} className="v2-drawer__link" onClick={close}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href={ctaConfigV2.href} className="v2-drawer__cta" onClick={close}>
            {ctaConfigV2.label} <span aria-hidden="true">→</span>
          </Link>
          {ctaConfigV2.microcopy && (
            <span className="v2-drawer__microcopy">{ctaConfigV2.microcopy}</span>
          )}
        </div>
      </nav>
    </>
  );
}
