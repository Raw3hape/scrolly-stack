import type { Metadata } from 'next';
import { optInContent } from '@/config/content';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: optInContent.metadata.title,
  description: optInContent.metadata.description,
};

/**
 * OptInPage — Freebie Lead Magnet
 *
 * Data-driven: all content from content.ts → SectionRenderer.
 * Sections: opt-in-hero (3D book + form) + opt-in-testimonials (bleed scroll).
 */
export default function OptInPage() {
  return (
    <div className="v2-content-wrapper">
      {optInContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
