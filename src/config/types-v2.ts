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
  /** When true, skip fullscreen centering — attach tightly to preceding content */
  flush?: boolean;
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

/** Fullscreen cinematic section with background photo + glassmorphism card */
export interface CinematicSection extends SectionBase {
  type: 'cinematic';
  /** Chapter label (e.g. "Chapter I") */
  chapterLabel?: string;
  /** Chapter subtitle (e.g. "The Trap") */
  chapterSubtitle?: string;
  heading: string;
  /** Glassmorphism card content */
  card: {
    title: string;
    text: string;
    /** Small footnote with icon (e.g. "The standard broker model is broken") */
    footnote?: string;
  };
  /** Background photo URL (fullscreen, grayscale + dark overlay) */
  backgroundUrl: string;
}

/** Dark mission block with steps + quote card */
export interface MissionSection extends SectionBase {
  type: 'mission';
  /** Layout variant: 'horizontal' (default, 2-col) or 'vertical' (centered, Stitch About) */
  layout?: 'horizontal' | 'vertical';
  /** Chapter label for vertical layout (e.g. "Chapter II") */
  chapterLabel?: string;
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
  /** Optional secondary ghost button (e.g. "View Our Process") */
  secondaryButtonLabel?: string;
  /** Route for secondary button */
  secondaryHref?: string;
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
  /** Layout variant: 'center' (default) or 'editorial' (left text + right image) */
  layout?: 'center' | 'editorial';
  /** Decorative image URL for editorial layout (right column) */
  imageUrl?: string;
}

/** Team member grid (About page) */
export interface TeamSection extends SectionBase {
  type: 'team';
  heading: string;
  subtext?: string;
  /** Chapter marker label (e.g. "Chapter III") */
  chapterLabel?: string;
  members: Array<{
    name: string;
    role: string;
    bio: string;
    /** Optional photo URL. Falls back to initials circle if missing */
    imageUrl?: string;
  }>;
}

/** Single testimonial quote (About page) */
export interface TestimonialSection extends SectionBase {
  type: 'testimonial';
  /** Section heading (e.g. "Proof Of The Model") — shown in left column */
  heading?: string;
  quote: string;
  author: string;
  company: string;
  /** Author avatar URL */
  avatarUrl?: string;
  /** Trust badge text (e.g. "Verified Exit") */
  badge?: string;
}

/** Full section union — extend this when adding new section types */
export type Section =
  | CardsSection
  | CinematicSection
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
