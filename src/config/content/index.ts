/**
 * Content barrel — re-exports all page content.
 *
 * Usage: import { homeContent, aboutContent } from '@/config/content';
 */

export { footerContent } from './shared';
export { aboutContent } from './about';
export {
  heroContent,
  homeContent,
  homeFinalCta,
  homeHowItWorks,
  homePageSourceOfTruth,
  homeScrollyOverlayContent,
  homeValueProps,
  noscriptContent,
  problemStakesContent,
  stakesContent,
  stepCta,
} from './home-page';
export { roofersContent } from './roofers';
export { investorsContent } from './investors';
export { optInContent } from './opt-in';
export { scheduleContent } from './schedule';

/* ── Derived: routes with Hero 3D models ──
   Used by PageTransitionOverlay to gate the fade overlay. */
import { aboutContent } from './about';
import { roofersContent } from './roofers';
import { investorsContent } from './investors';
import { optInContent } from './opt-in';
import { scheduleContent } from './schedule';
import type { HeroSection } from '@/config/types';

const ALL_PAGE_CONTENTS = [aboutContent, roofersContent, investorsContent, optInContent, scheduleContent];

export const HERO_3D_ROUTES: ReadonlySet<string> = new Set(
  ALL_PAGE_CONTENTS
    .filter(page => page.sections.some(
      s => s.type === 'hero' && 'hero3dModel' in s && (s as HeroSection).hero3dModel
    ))
    .map(page => `/${page.slug}`)
);
