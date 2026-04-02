/**
 * FounderNoteSection — personal note from founders with inset lifestyle image.
 *
 * Layout: warm surface bg, 2-col grid (image left, text right).
 * Mobile: stacks vertically (image above text).
 *
 * Data-driven: receives all content via props from content.ts.
 */

import Image from 'next/image';
import type { FounderNoteSection as FounderNoteSectionData } from '@/config/types';
import './FounderNoteSection.css';

interface Props {
  data: FounderNoteSectionData;
}

export default function FounderNoteSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-founder-note">
        <div className="v2-founder-note__image-col px-layer--bg" data-px-from="left">
          <div className="v2-founder-note__image-wrapper">
            <Image
              className="v2-founder-note__image"
              src={data.image.url}
              alt={data.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              quality={75}
            />
          </div>
        </div>

        <div className="v2-founder-note__content px-layer--fg">
          <h2 className="v2-founder-note__heading">{data.heading}</h2>
          <p className="v2-founder-note__text">{data.text}</p>
          {data.signature && <p className="v2-founder-note__signature">{data.signature}</p>}
        </div>
      </div>
    </div>
  );
}
