/**
 * TestimonialSection — thin wrapper around TestimonialCarousel (standard variant).
 *
 * Preserves the section-level interface expected by SectionRenderer while
 * delegating all carousel rendering and behaviour to the shared component.
 */

'use client';

import type { TestimonialSection as TestimonialSectionData } from '@/config/types-v2';
import TestimonialCarousel from '@/components/TestimonialCarousel';

interface Props {
  data: TestimonialSectionData;
}

export default function TestimonialSection({ data }: Props) {
  return (
    <TestimonialCarousel
      variant="standard"
      testimonials={data.testimonials}
      heading={data.heading}
      autoPlayInterval={data.autoPlayInterval}
    />
  );
}
