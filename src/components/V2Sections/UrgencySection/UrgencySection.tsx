/**
 * UrgencySection — dark card with two-column layout (text + image).
 *
 * Matches Stitch design:
 * - Dark rounded card on light page background
 * - Left: heading (with accent color), body text, CTA link
 * - Right: architectural image with rounded corner
 */

import Image from 'next/image';
import Link from 'next/link';
import type { UrgencySection as UrgencySectionData } from '@/config/types';
import { ctaConfig } from '@/config/nav';
import ScrollTypewriter from '@/components/ScrollTypewriter/ScrollTypewriter';
import InteractiveGrid from '@/components/InteractiveGrid/InteractiveGrid';
import './UrgencySection.css';

interface Props {
  data: UrgencySectionData;
}

export default function UrgencySection({ data }: Props) {
  const centered = !data.image;

  return (
    <div className="v2-container">
      <div className={`v2-urgency-card${centered ? ' v2-urgency-card--centered' : ''}`}>
        {/* Interactive grid background when no image */}
        {centered && (
          <InteractiveGrid cols={8} rows={5} glowRadius={2.5} glowIntensity={0.07} />
        )}

        {/* Text content */}
        <div className="v2-urgency-card__content px-layer--fg">
          <h2 className="v2-urgency-card__heading">
            <ScrollTypewriter
              text={data.heading}
              as="span"
              completionFactor={0.4}
            />
            {data.headingAccent && (
              <>
                <br />
                <ScrollTypewriter
                  text={data.headingAccent}
                  className="v2-urgency-card__accent"
                  as="span"
                  completionFactor={0.3}
                />
              </>
            )}
          </h2>

          <p className="v2-urgency-card__text">{data.text}</p>

          {data.ctaLabel && (
            <Link href={ctaConfig.href} className="v2-urgency-card__cta">
              {data.ctaLabel}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>

        {/* Right column: image */}
        {data.image && (
          <div className="v2-urgency-card__image-wrap px-layer--bg" data-px-from="right">
            <Image
              src={data.image}
              alt="Foundation Projects — building the future"
              fill
              className="v2-urgency-card__image"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
