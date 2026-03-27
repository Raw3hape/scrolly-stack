/**
 * ServerSectionRenderer — renders server-safe section types.
 *
 * These 6 section components have NO 'use client' directive and
 * use no client hooks, so they can render on the server.
 */

import type { Section } from '@/config/types';
import CinematicSection from './CinematicSection/CinematicSection';
import SplitSection from './SplitSection/SplitSection';
import TrustSection from './TrustSection/TrustSection';
import BenefitsGridSection from './BenefitsGridSection/BenefitsGridSection';
import ScheduleHeroSection from './ScheduleHeroSection/ScheduleHeroSection';
import ScheduleQuoteSection from './ScheduleQuoteSection/ScheduleQuoteSection';

/** Server-safe section type identifiers */
const SERVER_TYPES = new Set([
  'cinematic',
  'split',
  'trust',
  'benefits-grid',
  'schedule-hero',
  'schedule-quote',
]);

/** Type guard: returns true if the section type can be rendered on the server */
export function isServerSection(type: string): boolean {
  return SERVER_TYPES.has(type);
}

export default function ServerSectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'cinematic':       return <CinematicSection data={section} />;
    case 'split':           return <SplitSection data={section} />;
    case 'trust':           return <TrustSection data={section} />;
    case 'benefits-grid':   return <BenefitsGridSection data={section} />;
    case 'schedule-hero':   return <ScheduleHeroSection data={section} />;
    case 'schedule-quote':  return <ScheduleQuoteSection data={section} />;
    default:                return null;
  }
}
