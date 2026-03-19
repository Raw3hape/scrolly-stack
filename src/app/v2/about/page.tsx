import type { Metadata } from 'next';
import { aboutContent } from '@/config/content-v2';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';

/**
 * About /v2/about — Foundation Projects (Stitch edition)
 *
 * Data-driven architecture (same as Home):
 * - All content comes from content-v2.ts (aboutContent)
 * - Sections render via SectionRenderer (discriminated union → component)
 * - No 3D experience wrapper — pure content page
 * - To edit content: change strings in content-v2.ts aboutContent
 */

export const metadata: Metadata = {
  title: aboutContent.metadata.title,
  description: aboutContent.metadata.description,
};

export default function AboutV2Page() {
  return (
    <main>
      {aboutContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
