import type { Metadata } from 'next';
import { roofersContent } from '@/config/content';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: roofersContent.metadata.title,
  description: roofersContent.metadata.description,
};

export default function HowItWorksRoofersPage() {
  return (
    <div className="v2-content-wrapper">
      {roofersContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
