/**
 * Header Component
 * 
 * Modular, configurable navigation header.
 * All content comes from navConfig.js
 */

import { useState, useEffect, useCallback } from 'react';
import { header } from '../navConfig';
import './Header.css';

/**
 * Logo / Brand Component
 */
function Brand({ onLogoClick }) {
  const { brand } = header;
  
  const handleClick = (e) => {
    if (header.behavior.scrollToTopOnLogoClick) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onLogoClick?.();
    }
  };
  
  return (
    <a href="#" className="header-brand" onClick={handleClick}>
      {brand.logoUrl ? (
        <img src={brand.logoUrl} alt={brand.name} className="header-logo" />
      ) : (
        <span className="header-wordmark">{brand.name}</span>
      )}
      {brand.showTagline && brand.tagline && (
        <span className="header-tagline">{brand.tagline}</span>
      )}
    </a>
  );
}

/**
 * Navigation Links Component (for future use)
 */
function NavLinks() {
  const { links } = header;
  
  if (!links || links.length === 0) return null;
  
  return (
    <nav className="header-nav">
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.href} 
          className="header-nav-link"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * CTA Button Component
 */
function CTAButton() {
  const { cta } = header;
  
  return (
    <div className="header-cta-wrapper">
      {cta.showMicrocopy && cta.microcopy && (
        <span className="header-cta-microcopy">{cta.microcopy}</span>
      )}
      <a href={cta.href} className="header-cta">
        {cta.text}
        <svg 
          className="header-cta-arrow" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
        >
          <path 
            d="M3 8h10M9 4l4 4-4 4" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

/**
 * Main Header Component
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Check if scrolled past threshold
    setIsScrolled(currentScrollY > 20);
    
    // Hide on scroll down (if enabled)
    if (header.behavior.hideOnScroll) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  const headerClasses = [
    'header',
    header.behavior.stickyHeader ? 'header--sticky' : '',
    isScrolled ? 'header--scrolled' : '',
    !isVisible ? 'header--hidden' : '',
    header.behavior.transparentUntilScroll && !isScrolled ? 'header--transparent' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <header className={headerClasses}>
      <div className="header-container">
        <Brand />
        <NavLinks />
        <CTAButton />
      </div>
    </header>
  );
}
