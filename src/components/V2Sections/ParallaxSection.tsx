/**
 * ParallaxSection — thin 'use client' wrapper.
 *
 * Provides the useParallax hook and <section> wrapper markup.
 * All layout logic (fullscreen, expand, bleed, cta, surface) lives here.
 * Children are rendered inside — either server or client section content.
 */

'use client';

import type { Section } from '@/config/types';
import useParallax from '@/hooks/useParallax';

interface SectionLayoutMeta {
  fullscreen?: boolean;
  expand?: boolean;
  bleed?: boolean;
  cta?: boolean;
}

const layoutMeta: Record<Section['type'], SectionLayoutMeta> = {
  cards:                  { fullscreen: true },
  cinematic:              { fullscreen: true, expand: true },
  mission:                { fullscreen: true },
  steps:                  {},
  cta:                    { fullscreen: true, cta: true },
  urgency:                {},
  hero:                   {},
  team:                   { bleed: true },
  testimonial:            {},
  timeline:               {},
  bento:                  { fullscreen: true },
  trust:                  { fullscreen: true },
  split:                  {},
  'benefits-grid':        { fullscreen: true, expand: true },
  'opt-in-hero':          {},
  'opt-in-testimonials':  {},
  'schedule-hero':        {},
  'schedule-booking':     {},
  'schedule-quote':       {},
};

const surfaceMap: Record<string, string> = {
  base: 'v2-section--surface',
  low: 'v2-section--surface-low',
  high: 'v2-section--surface-high',
  dark: 'v2-section--dark',
};

interface ParallaxSectionProps {
  section: Section;
  children: React.ReactNode;
}

export default function ParallaxSection({ section, children }: ParallaxSectionProps) {
  const meta = layoutMeta[section.type];
  const isCinematicMission = section.type === 'mission' && 'backgroundUrl' in section && !!section.backgroundUrl;
  const isExpand = meta.expand || isCinematicMission;
  const ref = useParallax<HTMLElement>(
    isExpand ? { completionFactor: 0.85 } : undefined,
  );
  const surfaceClass = surfaceMap[section.surface ?? 'base'] ?? '';
  const isCtaSection = meta.cta;
  const isBleed = meta.bleed;
  const isFullscreen = meta.fullscreen && !section.flush;

  return (
    <section
      ref={ref}
      id={section.id}
      className={`v2-section ${surfaceClass}${isCtaSection ? ' v2-cta' : ''}${isFullscreen ? ' v2-section--fullscreen' : ''}${isExpand ? ' v2-section--expand' : ''}${isBleed ? ' v2-section--bleed' : ''}`}
    >
      {children}
    </section>
  );
}
