/**
 * ClientSectionRenderer — renders client-only section types.
 *
 * These 13 section components use client hooks, state, or import
 * client-only dependencies and must run in the browser.
 */

'use client';

import dynamic from 'next/dynamic';
import type { Section } from '@/config/types';

// Dynamic imports for code splitting — each section loads its own chunk
const StepsSection = dynamic(() => import('./StepsSection/StepsSection'));
const HeroSection = dynamic(() => import('./HeroSection/HeroSection'));
const TeamSection = dynamic(() => import('./TeamSection/TeamSection'));
const TestimonialSection = dynamic(() => import('./TestimonialSection/TestimonialSection'));
const TimelineSection = dynamic(() => import('./TimelineSection/TimelineSection'));
const BentoSection = dynamic(() => import('./BentoSection/BentoSection'));
const OptInHeroSection = dynamic(() => import('./OptInHeroSection/OptInHeroSection'));
const OptInTestimonialsSection = dynamic(() => import('./OptInTestimonialsSection/OptInTestimonialsSection'));
const ScheduleBookingSection = dynamic(() => import('./ScheduleBookingSection/ScheduleBookingSection'));

function assertNever(value: never): never {
  throw new Error(`Unhandled section type: ${JSON.stringify(value)}`);
}

export default function ClientSectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'steps':               return <StepsSection data={section} />;
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
    case 'cards':
    case 'mission':
    case 'urgency':
    case 'cta':
      return null;
    default:
      return assertNever(section);
  }
}
