import HomeV2Client from './HomeV2Client';
import { homeContent } from '@/config/content-v2';
import SectionRenderer from '@/components/V2Sections/SectionRenderer';
import './home-v2.css';

/**
 * Home /v2/ — Foundation Projects (Stitch edition)
 *
 * Data-driven architecture:
 * - All content comes from content-v2.ts (single source of truth)
 * - Sections render via SectionRenderer (discriminated union → component)
 * - 3D Cube (ScrollyExperience) replaces Stitch Hero section
 * - To edit content: change strings in content-v2.ts
 * - To add/remove/reorder sections: edit the sections array
 */
export default function HomeV2Page() {
  return (
    <HomeV2Client variantId="v6-exact-flipped">
      {homeContent.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </HomeV2Client>
  );
}
