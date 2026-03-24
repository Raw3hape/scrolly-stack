/**
 * HeroSection — full-width hero with two layout variants.
 *
 * Variants:
 * - 'center' (default): centered text + CTA, dark background
 * - 'editorial': left-aligned text (8 cols) + decorative image (4 cols), light background
 *
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { HeroSection as HeroSectionData } from '@/config/types-v2';
import { ctaConfigV2 } from '@/config/nav-v2';
import LinkButton from '@/components/LinkButton/LinkButton';
import './HeroSection.css';

interface Props {
  data: HeroSectionData;
}

export default function HeroSection({ data }: Props) {
  const isEditorial = data.layout === 'editorial';

  return (
    <div className={`v2-container${data.backgroundCanvas ? ' v2-container--has-canvas' : ''}`}>
      {/* Decorative 3D grid background — temporarily hidden */}
      {/* {data.backgroundCanvas && <HeroGridLoader />} — uses shared HeroGridCanvas */}

      <div className={`v2-hero${isEditorial ? ' v2-hero--editorial' : ''}`}>
        {/* Editorial: grid wrapper for vertical centering */}
        {isEditorial ? (
          <>
            <div className="v2-hero__grid">
              {/* 3D grid background (investors hero) — temporarily hidden */}
              {/* {data.stat && <HeroGridCanvas config={HERO_GRID_SECTION} />} — uses shared HeroGridCanvas */}

              <div className="v2-hero__content">
                {data.overline && (
                  <span className="v2-hero__overline">{data.overline}</span>
                )}
                <h1 className="v2-hero__heading px-layer--fg">
                  {data.heading.split('\n').map((line, i, arr) => (
                    <span key={i} className={i > 0 ? 'v2-hero__heading-accent' : undefined}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h1>
                {data.subtext && (
                  <p className="v2-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>
                )}
              </div>

              {data.imageUrl && (
                <div className="v2-hero__image-col px-layer--bg" data-px-from="right">
                  <div className="v2-hero__image-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="v2-hero__image"
                      src={data.imageUrl}
                      alt="Modern architectural detail of a premium roof line"
                      loading="eager"
                    />
                  </div>
                </div>
              )}

              {/* Stat display (investors hero) */}
              {data.stat && !data.imageUrl && (
                <div className="v2-hero__stat-col px-layer--bg" data-px-from="right">
                  <div className="v2-hero__stat-block">
                    <span className="v2-hero__stat-value">{data.stat.value}</span>
                    <span className="v2-hero__stat-label">{data.stat.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Elegant scroll indicator */}
            <div className="v2-hero__scroll-hint" aria-hidden="true">
              <span className="v2-hero__scroll-hint__label">Scroll</span>
              <span className="v2-hero__scroll-hint__line" />
            </div>
          </>
        ) : (
          /* Default centered layout */
          <div>
            {data.badge && (
              <span className="v2-hero__badge">{data.badge}</span>
            )}
            <h1 className="v2-hero__heading px-layer--fg">{data.heading}</h1>
            {data.subtext && (
              <p className="v2-hero__subtext px-layer--fg" data-px-delay="1">{data.subtext}</p>
            )}
            <div className="v2-hero__actions">
              <LinkButton href={ctaConfigV2.href} variant="primary" arrow>
                {data.buttonLabel ?? ctaConfigV2.label}
              </LinkButton>
              {data.trustBadge && (
                <span className="v2-hero__trust">
                  <svg className="v2-hero__trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  {data.trustBadge}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional background glow */}
      {data.backgroundGlow && (
        <div className="v2-hero__glow" aria-hidden="true" />
      )}
    </div>
  );
}
