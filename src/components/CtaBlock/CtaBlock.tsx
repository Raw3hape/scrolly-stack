/**
 * CtaBlock — Foundation Projects
 *
 * Full-width closing CTA section with heading, body text, and button.
 * Used at the bottom of all marketing pages.
 * Server component — no client-side JS needed.
 */

import LinkButton from '@/components/LinkButton/LinkButton';
import './CtaBlock.css';

interface CtaBlockProps {
  heading: string;
  subheading?: string;
  body?: string;
  footnote?: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Closing CTA section for page bottoms */
export default function CtaBlock({
  heading,
  subheading,
  body,
  footnote,
  ctaLabel,
  ctaHref,
}: CtaBlockProps) {
  return (
    <div className="cta-block">
      <h2 className="cta-block__heading">{heading}</h2>
      {subheading && (
        <p className="cta-block__subheading">{subheading}</p>
      )}
      {body && (
        <p className="cta-block__body">{body}</p>
      )}
      <div className="cta-block__action">
        <LinkButton href={ctaHref} arrow>
          {ctaLabel}
        </LinkButton>
      </div>
      {footnote && (
        <p className="cta-block__footnote">{footnote}</p>
      )}
    </div>
  );
}
