/**
 * SectionRenderer — maps Section data type → visual component + parallax.
 *
 * Client component: uses useParallax to write `--px-progress` (0→1) on
 * the root `<section>`. Inner elements use `.px-layer--*` CSS classes
 * to derive their own transform/opacity via calc().
 *
 * Usage:
 *   {pageContent.sections.map(s => <SectionRenderer key={s.id} section={s} />)}
 */

'use client';

import type { Section } from '@/config/types';
import useParallax from '@/hooks/useParallax';
import CardsSection from './CardsSection/CardsSection';
import CinematicSection from './CinematicSection/CinematicSection';
import MissionSection from './MissionSection/MissionSection';
import StepsSection from './StepsSection/StepsSection';
import CtaSection from './CtaSection/CtaSection';
import UrgencySection from './UrgencySection/UrgencySection';
import HeroSection from './HeroSection/HeroSection';
import TeamSection from './TeamSection/TeamSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import TimelineSection from './TimelineSection/TimelineSection';
import BentoSection from './BentoSection/BentoSection';
import TrustSection from './TrustSection/TrustSection';
import SplitSection from './SplitSection/SplitSection';
import BenefitsGridSection from './BenefitsGridSection/BenefitsGridSection';
import OptInHeroSection from './OptInHeroSection/OptInHeroSection';
import OptInTestimonialsSection from './OptInTestimonialsSection/OptInTestimonialsSection';
import ScheduleHeroSection from './ScheduleHeroSection/ScheduleHeroSection';
import ScheduleBookingSection from './ScheduleBookingSection/ScheduleBookingSection';
import ScheduleQuoteSection from './ScheduleQuoteSection/ScheduleQuoteSection';

interface SectionRendererProps {
  section: Section;
}

const surfaceMap: Record<string, string> = {
  base: 'v2-section--surface',
  low: 'v2-section--surface-low',
  high: 'v2-section--surface-high',
  dark: 'v2-section--dark',
};

function renderSection(section: Section) {
  switch (section.type) {
    case 'cards':        return <CardsSection data={section} />;
    case 'cinematic':    return <CinematicSection data={section} />;
    case 'mission':      return <MissionSection data={section} />;
    case 'steps':        return <StepsSection data={section} />;
    case 'cta':          return <CtaSection data={section} />;
    case 'urgency':      return <UrgencySection data={section} />;
    case 'hero':         return <HeroSection data={section} />;
    case 'team':         return <TeamSection data={section} />;
    case 'testimonial':  return <TestimonialSection data={section} />;
    case 'timeline':     return <TimelineSection data={section} />;
    case 'bento':        return <BentoSection data={section} />;
    case 'trust':        return <TrustSection data={section} />;
    case 'split':        return <SplitSection data={section} />;
    case 'benefits-grid': return <BenefitsGridSection data={section} />;
    case 'opt-in-hero':         return <OptInHeroSection data={section} />;
    case 'opt-in-testimonials': return <OptInTestimonialsSection data={section} />;
    case 'schedule-hero':       return <ScheduleHeroSection data={section} />;
    case 'schedule-booking':    return <ScheduleBookingSection data={section} />;
    case 'schedule-quote':      return <ScheduleQuoteSection data={section} />;
    default:             return null;
  }
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const isCinematicMission = section.type === 'mission' && 'backgroundUrl' in section && !!section.backgroundUrl;
  const isExpand = section.type === 'cinematic' || isCinematicMission || section.type === 'benefits-grid';
  const ref = useParallax<HTMLElement>(
    isExpand ? { completionFactor: 0.85 } : undefined,
  );
  const surfaceClass = surfaceMap[section.surface ?? 'base'] ?? '';
  const isCtaSection = section.type === 'cta';
  const isBleed = section.type === 'team';
  const isFullscreen = ['cards', 'cinematic', 'mission', 'cta', 'bento', 'trust', 'benefits-grid'].includes(section.type)
    && !section.flush;

  return (
    <section
      ref={ref}
      id={section.id}
      className={`v2-section ${surfaceClass}${isCtaSection ? ' v2-cta' : ''}${isFullscreen ? ' v2-section--fullscreen' : ''}${isExpand ? ' v2-section--expand' : ''}${isBleed ? ' v2-section--bleed' : ''}`}
    >
      {renderSection(section)}
    </section>
  );
}
