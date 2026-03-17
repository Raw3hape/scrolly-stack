/**
 * BulletSection — Foundation Projects
 *
 * Bullet list with optional heading and CTA button.
 * Used for "What Changes" (Roofers) and "Why Act Now" (Investors).
 * Server component — no client-side JS needed.
 */

import LinkButton from '@/components/LinkButton/LinkButton';
import './BulletSection.css';

interface BulletSectionProps {
  heading?: string;
  items: readonly string[];
  ctaLabel?: string;
  ctaHref?: string;
}

/** Styled bullet list with optional heading and CTA */
export default function BulletSection({ heading, items, ctaLabel, ctaHref }: BulletSectionProps) {
  return (
    <div className="bullet-section">
      {heading && (
        <h3 className="bullet-section__heading">{heading}</h3>
      )}
      <ul className="bullet-section__list">
        {items.map((item, i) => (
          <li key={i} className="bullet-section__item">
            <span className="bullet-section__icon" aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>
      {ctaLabel && ctaHref && (
        <div className="bullet-section__cta">
          <LinkButton href={ctaHref} arrow>
            {ctaLabel}
          </LinkButton>
        </div>
      )}
    </div>
  );
}
