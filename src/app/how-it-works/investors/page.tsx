import type { Metadata } from 'next';
import { investorsContent } from '@/config/content-v2';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

export const metadata: Metadata = {
  title: investorsContent.metadata.title,
  description: investorsContent.metadata.description,
};

export default function HowItWorksInvestorsPage() {
  return (
    <div className="v2-content-wrapper">
      {investorsContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
