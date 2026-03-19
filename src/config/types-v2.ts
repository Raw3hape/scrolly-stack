/**
 * V2 Section Types — Foundation Projects (Stitch edition)
 *
 * Discriminated union for data-driven page sections.
 * Each section type maps to a dedicated component via SectionRenderer.
 *
 * To add a new section type:
 * 1. Add the interface here
 * 2. Add it to the Section union
 * 3. Create the component in src/components/V2Sections/
 * 4. Add the case to SectionRenderer.tsx
 */

// =============================================================================
// ICON TYPE — SVG icon identifiers (no emoji)
// =============================================================================

/** Icon identifiers for section cards/steps. Map to SVG or CSS icons in components. */
export type V2Icon =
  | 'chart-bar'
  | 'lock'
  | 'cog'
  | 'search'
  | 'dollar'
  | 'building'
  | 'shield'
  | 'arrow-up'
  | 'clock'
  | 'users'
  | 'target';

// =============================================================================
// SECTION DATA TYPES — discriminated union by `type`
// =============================================================================

interface SectionBase {
  /** Unique section ID — used as React key and CSS anchor */
  id: string;
  /** Surface variant for section background */
  surface?: 'base' | 'low' | 'high' | 'dark';
}

/** Three-column card grid (e.g. Problem Statement) */
export interface CardsSection extends SectionBase {
  type: 'cards';
  heading: string;
  subtext?: string;
  cards: Array<{
    icon: V2Icon;
    title: string;
    text: string;
  }>;
}

/** Dark mission block with steps + quote card */
export interface MissionSection extends SectionBase {
  type: 'mission';
  heading: string;
  /** Italic accent portion of heading (rendered separately) */
  headingAccent?: string;
  steps: Array<{
    icon: V2Icon;
    title: string;
    text: string;
  }>;
  quote: {
    text: string;
    body: string;
    label: string;
  };
}

/** Numbered steps (e.g. "The Path To Permanent Capital") */
export interface StepsSection extends SectionBase {
  type: 'steps';
  heading: string;
  subtext?: string;
  steps: Array<{
    number: string;
    title: string;
    text: string;
  }>;
}

/** Call-to-action block */
export interface CtaSection extends SectionBase {
  type: 'cta';
  /** Small uppercase overline above heading (e.g. "READY TO BUILD THE EXIT?") */
  overline?: string;
  heading: string;
  /** Microcopy below the button (e.g. "No commitments...") */
  microcopy?: string;
  /** CTA button label. href comes from nav-v2.ts ctaConfigV2 */
  buttonLabel?: string;
  /** Show arrow icon in button. Default: false */
  showArrow?: boolean;
}

/** Urgency / FOMO dark card (two-column: text + image) */
export interface UrgencySection extends SectionBase {
  type: 'urgency';
  heading: string;
  /** Accent-colored portion of heading (rendered in second color) */
  headingAccent?: string;
  text: string;
  /** Uppercase CTA link text (e.g. "RESERVE YOUR VALUATION AUDIT") */
  ctaLabel?: string;
  /** Right-side image path */
  image?: string;
}

/** Full-width hero with large heading, optional subtext + CTA */
export interface HeroSection extends SectionBase {
  type: 'hero';
  heading: string;
  subtext?: string;
  buttonLabel?: string;
}

/** Team member grid (About page) */
export interface TeamSection extends SectionBase {
  type: 'team';
  heading: string;
  subtext?: string;
  members: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
}

/** Single testimonial quote (About page) */
export interface TestimonialSection extends SectionBase {
  type: 'testimonial';
  quote: string;
  author: string;
  company: string;
}

/** Full section union — extend this when adding new section types */
export type Section =
  | CardsSection
  | MissionSection
  | StepsSection
  | CtaSection
  | UrgencySection
  | HeroSection
  | TeamSection
  | TestimonialSection;

// =============================================================================
// PAGE CONTENT — typed page-level structure
// =============================================================================

export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    /** Route key from nav-v2.ts or absolute path */
    href: string;
  }>;
}

export interface FooterContent {
  brandDescription: string;
  columns: FooterColumn[];
  /** Optional newsletter/subscribe text */
  subscribeText?: string;
  /** Title for the subscribe column (e.g. "Stay Informed") */
  subscribeTitle?: string;
  /** Placeholder for the email input (e.g. "Email Address") */
  subscribePlaceholder?: string;
  /** Tagline shown next to copyright (e.g. "Architectural Integrity in Roofing.") */
  copyrightTagline?: string;
}

export interface PageContent {
  /** URL slug for this page */
  slug: string;
  /** SEO metadata */
  metadata: {
    title: string;
    description: string;
  };
  /** Ordered array of sections — rendered top to bottom */
  sections: Section[];
  /** Footer content (shared across pages but customizable per-page) */
  footer?: FooterContent;
}
