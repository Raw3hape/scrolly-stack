/**
 * ClientSectionRenderer — renders client-only section types.
 *
 * These 13 section components use client hooks, state, or import
 * client-only dependencies and must run in the browser.
 */

'use client';

import type { Section } from '@/config/types';
import CardsSection from './CardsSection/CardsSection';
import MissionSection from './MissionSection/MissionSection';
import StepsSection from './StepsSection/StepsSection';
import CtaSection from './CtaSection/CtaSection';
import UrgencySection from './UrgencySection/UrgencySection';
import HeroSection from './HeroSection/HeroSection';
import TeamSection from './TeamSection/TeamSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import TimelineSection from './TimelineSection/TimelineSection';
import BentoSection from './BentoSection/BentoSection';
import OptInHeroSection from './OptInHeroSection/OptInHeroSection';
import OptInTestimonialsSection from './OptInTestimonialsSection/OptInTestimonialsSection';
import ScheduleBookingSection from './ScheduleBookingSection/ScheduleBookingSection';

function assertNever(value: never): never {
  throw new Error(`Unhandled section type: ${JSON.stringify(value)}`);
}

export default function ClientSectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'cards':               return <CardsSection data={section} />;
    case 'mission':             return <MissionSection data={section} />;
    case 'steps':               return <StepsSection data={section} />;
    case 'cta':                 return <CtaSection data={section} />;
    case 'urgency':             return <UrgencySection data={section} />;
    case 'hero':                return <HeroSection data={section} />;
    case 'team':                return <TeamSection data={section} />;
    case 'testimonial':         return <TestimonialSection data={section} />;
    case 'timeline':            return <TimelineSection data={section} />;
    case 'bento':               return <BentoSection data={section} />;
    case 'opt-in-hero':         return <OptInHeroSection data={section} />;
    case 'opt-in-testimonials': return <OptInTestimonialsSection data={section} />;
    case 'schedule-booking':    return <ScheduleBookingSection data={section} />;
    /* Server-handled types never reach here; catch unknown types at compile time */
    case 'cinematic':
    case 'split':
    case 'trust':
    case 'benefits-grid':
    case 'schedule-hero':
    case 'schedule-quote':
      return null;
    default:
      return assertNever(section);
  }
}
