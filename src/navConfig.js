/**
 * Navigation / Header Configuration
 * 
 * All header content and settings in one place.
 * Change values here to customize without touching components.
 */

export const header = {
  // Logo / Brand
  brand: {
    name: 'RBP Consulting',
    tagline: 'Foundation Projects',  // Optional label near logo
    showTagline: true,
    logoUrl: null,  // Optional: path to logo image (if null, uses text)
  },
  
  // Primary CTA button
  cta: {
    text: 'See if I qualify',
    href: '#qualify',           // Or external URL
    microcopy: 'Confidential. No obligation.',
    showMicrocopy: true,
  },
  
  // Navigation links (empty for now, easy to add later)
  links: [
    // { label: 'About', href: '#about' },
    // { label: 'Services', href: '#services' },
  ],
  
  // Behavior
  behavior: {
    scrollToTopOnLogoClick: true,
    stickyHeader: true,
    hideOnScroll: false,        // Future: hide header on scroll down
    transparentUntilScroll: true,
  },
  
  // Styles (can be customized)
  styles: {
    height: '72px',
    mobileHeight: '64px',
    background: 'rgba(255, 255, 255, 0.95)',
    backgroundScrolled: 'rgba(255, 255, 255, 0.98)',
    blur: '12px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    shadowScrolled: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
};

export default header;
