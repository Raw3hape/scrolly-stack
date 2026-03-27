/**
 * @deprecated Homepage content now lives in `home-page.ts`.
 *
 * This file intentionally remains as a compatibility re-export for older imports
 * such as the scrolly overlay and legacy tests. New code should import from:
 * `@/config/content/home-page` or `@/config/content`.
 */
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
