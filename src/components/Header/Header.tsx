'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { navLinks, ctaConfig, brandConfig, headerBehavior, routes } from '@/config/nav';
import './Header.css';

/**
 * Header component — Foundation Projects
 *
 * Features: glassmorphism, hide-on-scroll-down, show-on-scroll-up, mobile drawer.
 * Uses 'use client' because of scroll event listeners.
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsScrolled(currentScrollY > headerBehavior.scrollThreshold);

    if (headerBehavior.hideOnScrollDown && headerBehavior.showOnScrollUp) {
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close menu on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const headerClasses = [
    'header',
    isScrolled ? 'header--scrolled' : '',
    isHidden ? 'header--hidden' : '',
  ].filter(Boolean).join(' ');

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={headerClasses}>
        <div className="header-container">
          {/* Brand */}
          <Link href={routes.home} className="header-brand">
            <Image
              src={brandConfig.logo}
              alt={brandConfig.wordmark}
              width={135}
              height={31}
              className="header-logo"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="header-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Burger */}
          <div className="header-cta-wrapper">
            <a href={ctaConfig.href} className="header-cta">
              {ctaConfig.label}
              {ctaConfig.arrowIcon && <span className="header-cta-arrow" aria-hidden="true">→</span>}
            </a>
            {ctaConfig.microcopy && (
              <span className="header-cta-microcopy">{ctaConfig.microcopy}</span>
            )}

            {/* Mobile burger button */}
            <button
              className={`header-burger ${isMenuOpen ? 'header-burger--open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <span className="header-burger__line" />
              <span className="header-burger__line" />
              <span className="header-burger__line" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`header-overlay ${isMenuOpen ? 'header-overlay--open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        className={`header-drawer ${isMenuOpen ? 'header-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="header-drawer__links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-drawer__link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <a href={ctaConfig.href} className="header-cta header-drawer__cta" onClick={closeMenu}>
          {ctaConfig.label}
          {ctaConfig.arrowIcon && <span className="header-cta-arrow" aria-hidden="true">→</span>}
        </a>
      </nav>
    </>
  );
}
