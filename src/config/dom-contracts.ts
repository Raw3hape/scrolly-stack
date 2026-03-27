/**
 * DOM-contract selectors — single source of truth for querySelector() lookups
 * used by layout-measurement code (Stack, Footer, heroLayout).
 *
 * Changing a value here requires updating the matching className / attribute
 * in the component that renders the element.
 */

/** Fixed header element — used by Stack.tsx to measure header height */
export const SELECTOR_HEADER = '[data-layout="header"]';

/** Hero CTA wrapper — used by Stack.tsx to measure hero content bottom on mobile */
export const SELECTOR_CTA_WRAPPER = '[data-hero-cta]';

/** Main content wrapper — used by Footer.tsx for reveal progress calculation */
export const SELECTOR_CONTENT_WRAPPER = '[data-content-wrapper]';

/** Hero container selectors — used by heroLayout.ts for 3D positioning */
export const SELECTOR_HERO_VARIANTS = '.v2-hero--left, .v2-hero--editorial, .v2-hero';
export const SELECTOR_HERO_SPLIT = '.v2-hero__split';
export const SELECTOR_HERO_BASE = '.v2-hero';

/** Custom event dispatched by 3D loaders when scene is ready */
export const PAGE_READY_EVENT = 'page:ready';
