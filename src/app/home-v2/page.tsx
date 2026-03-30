import HomeV2PageClient from './HomeV2PageClient';
import { homeContent } from '@/config/content';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';
import '../home-v2.css';

/**
 * HomeV2Page — Isolated homepage variant for 3D model experimentation.
 *
 * Uses scrolly-experience-v2 feature folder (fully isolated from V1).
 * Content sections are shared — V2 focus is on the 3D model, not text.
 */
export default function HomeV2Page() {
  return (
    <HomeV2PageClient variantId="v7-progressive">
      {homeContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </HomeV2PageClient>
  );
}
