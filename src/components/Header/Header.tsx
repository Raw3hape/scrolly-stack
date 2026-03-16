'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { navLinks, ctaConfig, brandConfig, headerBehavior } from '@/config/nav';
import './Header.css';

/**
 * Header component — Foundation Projects
 *
 * Features: glassmorphism, hide-on-scroll-down, show-on-scroll-up.
 * Uses 'use client' because of scroll event listeners.
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
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

  const headerClasses = [
    'header',
    isScrolled ? 'header--scrolled' : '',
    isHidden ? 'header--hidden' : '',
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <div className="header-container">
        {/* Brand */}
        <Link href="/" className="header-brand">
          <span className="header-wordmark">{brandConfig.wordmark}</span>
          <span className="header-tagline">{brandConfig.tagline}</span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="header-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="header-cta-wrapper">
          <a href={ctaConfig.href} className="header-cta">
            {ctaConfig.label}
            {ctaConfig.arrowIcon && <span className="header-cta-arrow" aria-hidden="true">→</span>}
          </a>
          {ctaConfig.microcopy && (
            <span className="header-cta-microcopy">{ctaConfig.microcopy}</span>
          )}
        </div>
      </div>
    </header>
  );
}
