import type { Metadata } from 'next';
import { aboutContent } from '@/config/content-v2';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description,
};

export default function AboutPage() {
  return (
    <div className="v2-content-wrapper">
      {aboutContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
