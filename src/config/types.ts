/**
 * Section Types — Foundation Projects (Stitch edition)
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
  /** Optional background photo URL — enables cinematic mode with expand effect */
  backgroundUrl?: string;
}

/** Numbered steps (e.g. "Here's How It Works") */
export interface StepsSection extends SectionBase {
  type: 'steps';
  heading: string;
  subtext?: string;
  /** 'minimal' (default): large number + text. 'cards': card bg + icon box + hover shadow. */
  variant?: 'minimal' | 'cards';
  steps: Array<{
    number: string;
    title: string;
    text: string;
    /** Material-style icon for cards variant */
    icon?: V2Icon;
    /** Optional CTA label shown when this step is active */
    ctaLabel?: string;
    /** Optional footnote displayed below the description (muted, smaller text) */
    footnote?: string;
  }>;
  /** Shared CTA href for all steps. Falls back to ctaConfig.href */
  ctaHref?: string;
}


/** Call-to-action block */
export interface CtaSection extends SectionBase {
  type: 'cta';
  /** Small uppercase overline above heading (e.g. "READY TO BUILD THE EXIT?") */
  overline?: string;
  heading: string;
  /** Accent-colored portion appended after heading (rendered in gold/orange) */
  headingAccent?: string;
  /** When true, hide decorative background (BlueprintGrid, arch lines, frame) */
  minimal?: boolean;
  /** Microcopy below the button (e.g. "No commitments...") */
  microcopy?: string;
  /** CTA button label. href comes from nav.ts ctaConfig */
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
  /** Layout variant: 'center' (default), 'left' (left-aligned), or 'editorial' (left text + right image) */
  layout?: 'center' | 'left' | 'editorial';
  /** Decorative image URL for editorial layout (right column) */
  imageUrl?: string;
  /** Small uppercase overline label above heading (e.g. "Investment Framework") */
  overline?: string;
  /** Key stat display (right column in editorial layout) */
  stat?: {
    value: string;
    label: string;
  };
  /** Gold pill badge above heading (e.g. "FOR ROOFING FOUNDERS") */
  badge?: string;
  /** Trust indicator below CTA (e.g. "No upfront costs. 30-minute fit assessment.") */
  trustBadge?: string;
  /** Multiple trust-badge pills rendered as a row below the CTA */
  trustBadges?: string[];
  /** Decorative radial gradient glow (top-right corner) */
  backgroundGlow?: boolean;
  /** Decorative 3D grid canvas behind content (responsive, hover proximity effect) */
  backgroundCanvas?: boolean;
  /** 3D model to render in the hero's right column */
  hero3dModel?: 'pyramid' | 'rubiks-cube' | 'exploded-grid' | 'ascending-blocks';
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

/** Testimonial carousel (About page) */
export interface TestimonialItem {
  quote: string;
  author: string;
  company: string;
  /** Author avatar URL */
  avatarUrl?: string;
  /** Trust badge text (e.g. "Verified Exit") */
  badge?: string;
}

export interface TestimonialSection extends SectionBase {
  type: 'testimonial';
  /** Section heading (e.g. "Proof Of The Model") — shown in left column */
  heading?: string;
  /** Auto-rotate interval in ms. Default 8000. Set 0 to disable. */
  autoPlayInterval?: number;
  /** Array of testimonials to rotate through */
  testimonials: TestimonialItem[];
}

/** Vertical alternating timeline (e.g. Investment Lifecycle) */
export interface TimelineSection extends SectionBase {
  type: 'timeline';
  heading: string;
  steps: Array<{
    number: string;
    title: string;
    text?: string;
    /** Material icon name or V2Icon for the KPI card */
    icon: V2Icon;
    /** KPI focus label */
    kpiLabel: string;
    /** KPI focus value */
    kpiValue: string;
  }>;
}

/** Bento grid — mixed-size cards (feature + link + stats + highlight) */
export interface BentoSection extends SectionBase {
  type: 'bento';
  /** Large feature card (spans 2 cols + 2 rows) */
  feature: {
    overline: string;
    heading: string;
    text: string;
    /** Optional bullet points for the feature card */
    bullets?: string[];
  };
  /** Link card (spans 2 cols) */
  linkCard?: {
    title: string;
    text: string;
    href?: string;
    /** Small icon identifier for the link card */
    icon?: V2Icon;
  };
  /** Small stat cards */
  stats: Array<{
    value: string;
    label: string;
    /** Optional suffix text (e.g. "%" or "+") */
    suffix?: string;
    /** Optional prefix text (e.g. "$") */
    prefix?: string;
  }>;
  /** Optional highlight metric card (gold accent, placed prominently) */
  highlight?: {
    value: string;
    label: string;
    /** Descriptive context text */
    context?: string;
  };
}

/** Trust/partner logos section */
export interface TrustSection extends SectionBase {
  type: 'trust';
  heading: string;
  /** Badge text (e.g. "Verified Institutional Partner") */
  badge?: string;
  /** List of partner/brand names */
  partners: string[];
}

/** Two-column split: image (with overlay + quote) + text + bullet list */
export interface SplitSection extends SectionBase {
  type: 'split';
  heading: string;
  text: string;
  bullets: Array<{ icon: 'cancel' | 'check'; text: string }>;
  image: {
    url: string;
    /** Italic quote overlay at bottom of image */
    quote?: string;
  };
  /** Reverse column order (image right, text left) */
  reverse?: boolean;
}

/** Dark benefits grid: heading + body + CTA (left) + glassmorphism card grid (right) */
export interface BenefitsGridSection extends SectionBase {
  type: 'benefits-grid';
  heading: string;
  text: string;
  /** Optional CTA button label */
  ctaLabel?: string;
  cards: Array<{
    icon: V2Icon;
    title: string;
    text: string;
  }>;
}

/** Opt-in hero: 3D interactive book + lead magnet form */
export interface OptInHeroSection extends SectionBase {
  type: 'opt-in-hero';
  /** Small uppercase label above heading (e.g. "Foundation Insights Series") */
  overline: string;
  heading: string;
  subtext: string;
  /** Book cover metadata for 3D rendering */
  book: {
    title: string;
    subtitle: string;
    /** Cover image URL for the book */
    coverUrl: string;
  };
  /** Trust badge below the book */
  trustBadge: { text: string; metric: string };
  /** Form configuration */
  form: {
    fields: Array<{
      name: string;
      label: string;
      placeholder: string;
      type: string;
      required: boolean;
    }>;
    submitLabel: string;
    disclaimer: string;
  };
  /** Value props grid below the form */
  valueProps: Array<{ icon: V2Icon; title: string; text: string }>;
}

/** Horizontal bleed testimonial cards (opt-in page style) */
export interface OptInTestimonialsSection extends SectionBase {
  type: 'opt-in-testimonials';
  heading: string;
  subtext: string;
  /** Large pull quote displayed at right of header */
  pullQuote: { text: string; source: string };
  testimonials: Array<{
    quote: string;
    role: string;
    company: string;
    verified: boolean;
  }>;
}

/** Schedule page: hero with heading, subtext, and SMS badge */
export interface ScheduleHeroSection extends SectionBase {
  type: 'schedule-hero';
  heading: string;
  subtext: string;
  /** SMS pill badge config */
  smsBadge: {
    text: string;
    keyword: string;
    phone: string;
  };
}

/**
 * Calendar provider type — enables swapping built-in calendar for
 * Calendly, Cal.com, or any external scheduling service.
 *
 * 'built-in': renders the project's own interactive calendar widget
 * 'calendly': renders a Calendly embed (pass embedUrl)
 * 'cal-com': renders a Cal.com embed (pass embedUrl)
 * 'custom':  renders children via a slot (for arbitrary embeds)
 */
export type CalendarProvider = 'built-in' | 'calendly' | 'cal-com' | 'custom';

/** Schedule page: booking section with sidebar value-props + calendar widget */
export interface ScheduleBookingSection extends SectionBase {
  type: 'schedule-booking';
  /** Calendar provider mode — defaults to 'built-in' */
  provider: CalendarProvider;
  /** External calendar embed URL (for 'calendly' | 'cal-com') */
  embedUrl?: string;
  /** Left sidebar: what to expect */
  sidebar: {
    heading: string;
    items: Array<{
      icon: V2Icon;
      title: string;
      text: string;
    }>;
    /** Gold trust badge */
    trustBadge: {
      label: string;
      text: string;
    };
  };
  /** Calendar widget config */
  widget: {
    /** Small label above title (e.g. "Select Date & Time") */
    label: string;
    /** Widget title (e.g. "Strategy Session") */
    title: string;
    /** Timezone display text */
    timezone: string;
    /** Available time slots for the built-in calendar */
    timeSlots: string[];
    /** Label for the submit button */
    submitLabel: string;
  };
}

/** Schedule page: full-width dark testimonial quote block */
export interface ScheduleQuoteSection extends SectionBase {
  type: 'schedule-quote';
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
  backgroundUrl?: string;
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
  | TestimonialSection
  | TimelineSection
  | BentoSection
  | TrustSection
  | SplitSection
  | BenefitsGridSection
  | OptInHeroSection
  | OptInTestimonialsSection
  | ScheduleHeroSection
  | ScheduleBookingSection
  | ScheduleQuoteSection;

// =============================================================================
// PAGE CONTENT — typed page-level structure
// =============================================================================

export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    /** Route key from nav.ts or absolute path */
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
}
