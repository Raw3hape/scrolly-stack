/**
 * SectionRenderer — server component dispatcher.
 *
 * Maps Section data type → ParallaxSection wrapper + the appropriate
 * server or client renderer. Public API is unchanged:
 *
 *   {pageContent.sections.map(s => <SectionRenderer key={s.id} section={s} />)}
 */

import type { Section } from '@/config/types';
import ParallaxSection from './ParallaxSection';
import ServerSectionRenderer, { isServerSection } from './ServerSectionRenderer';
import ClientSectionRenderer from './ClientSectionRenderer';

interface SectionRendererProps {
  section: Section;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  return (
    <ParallaxSection section={section}>
      {isServerSection(section.type)
        ? <ServerSectionRenderer section={section} />
        : <ClientSectionRenderer section={section} />
      }
    </ParallaxSection>
  );
}
