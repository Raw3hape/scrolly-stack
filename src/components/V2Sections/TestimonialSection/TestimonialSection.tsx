/**
 * TestimonialSection — large italic quote with author attribution.
 * Data-driven: receives all content via props from content-v2.ts.
 *
 * Features a decorative gold bar above the quote for editorial feel.
 */

import type { TestimonialSection as TestimonialSectionData } from '@/config/types-v2';
import './TestimonialSection.css';

interface Props {
  data: TestimonialSectionData;
}

export default function TestimonialSection({ data }: Props) {
  return (
    <div className="v2-container">
      <blockquote className="v2-testimonial">
        <div className="v2-testimonial__bar" aria-hidden="true" />
        <p className="v2-testimonial__quote">&ldquo;{data.quote}&rdquo;</p>
        <footer className="v2-testimonial__attribution">
          <cite className="v2-testimonial__author">{data.author}</cite>
          <span className="v2-testimonial__company">{data.company}</span>
        </footer>
      </blockquote>
    </div>
  );
}
