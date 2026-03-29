/**
 * Header — Stitch "Architectural Editorial" header.
 *
 * Features:
 * - Glassmorphism on scroll
 * - Hide on scroll-down, reveal on scroll-up
 * - Mobile drawer with full-screen overlay
 * - Data-driven from nav.ts
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navLinks, ctaConfig, brandConfig, routes } from '@/config/nav';
import './Header.css';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = headerRef.current;
        if (!el) return;
        const y = window.scrollY;
        el.classList.toggle('header--scrolled', y > 40);
        el.classList.toggle('header--hidden', y > lastScrollY.current && y > 200);
        lastScrollY.current = y;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header ref={headerRef} data-layout="header" className="header">
        <div className="header__inner">
          {/* Brand */}
          <Link href={routes.home} className="header__brand" onClick={close}>
            <Image
              src={brandConfig.logo}
              alt={brandConfig.wordmark}
              width={120}
              height={30}
              className="header__logo"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="header__nav" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`header__link ${isActive ? 'header__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Burger */}
          <div className="header__actions">
            <Link href={ctaConfig.href} className="header__cta">
              {ctaConfig.label} <span aria-hidden="true">→</span>
            </Link>

            <button
              className={`header__burger ${isMenuOpen ? 'header__burger--open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <span className="header__burger-line" />
              <span className="header__burger-line" />
              <span className="header__burger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`header__overlay ${isMenuOpen ? 'header__overlay--open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <nav
        className={`drawer ${isMenuOpen ? 'drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="drawer__content">
          <div className="drawer__links">
            {navLinks.map((link) => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`drawer__link ${isActive ? 'drawer__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={close}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Link href={ctaConfig.href} className="drawer__cta" onClick={close}>
            {ctaConfig.label} <span aria-hidden="true">→</span>
          </Link>
          {ctaConfig.microcopy && (
            <span className="drawer__microcopy">{ctaConfig.microcopy}</span>
          )}
        </div>
      </nav>
    </>
  );
}
