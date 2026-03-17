/**
 * Content Barrel — Foundation Projects
 *
 * Single import point for all page content.
 * Usage: import { heroContent, pageMetadata } from '@/config/content';
 */

// SEO metadata for all pages
export { pageMetadata } from './metadata';

// Per-page content
export {
  heroContent,
  homeValueProps,
  stepCta,
  noscriptContent,
  problemStakesContent,
  homeHowItWorks,
  stakesContent,
  homeFinalCta,
} from './home';

export {
  aboutHero,
  expandedProblem,
  comparison,
  teamSection,
  proofSection,
  aboutClosingCta,
} from './about';

export {
  roofersHero,
  roofersValueProps,
  roofersProb,
  roofersSteps,
  whatChanges,
  roofersFinalCta,
} from './roofers';

export {
  investorsHero,
  investorsValueProps,
  opportunity,
  investorsSteps,
  investorsStakes,
  whyActNow,
  investorsFinalCta,
} from './investors';

export { scheduleContent } from './schedule';
export { optInContent } from './opt-in';
