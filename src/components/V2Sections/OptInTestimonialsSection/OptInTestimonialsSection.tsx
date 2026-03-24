/**
 * OptInTestimonialsSection — thin wrapper around TestimonialCarousel (opt-in variant).
 *
 * Preserves the section-level interface expected by SectionRenderer while
 * delegating all scroll-driven card strip rendering to the shared component.
 */

'use client';

import type { OptInTestimonialsSection as OptInTestimonialsSectionData } from '@/config/types';
import TestimonialCarousel from '@/components/TestimonialCarousel';

interface Props {
  data: OptInTestimonialsSectionData;
}

export default function OptInTestimonialsSection({ data }: Props) {
  return (
    <TestimonialCarousel
      variant="opt-in"
      testimonials={data.testimonials}
      heading={data.heading}
      subtext={data.subtext}
      pullQuote={data.pullQuote}
    />
  );
}
