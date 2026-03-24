/**
 * CardsSection — renders a grid of info cards.
 * Data-driven: receives all content via props from content.ts.
 *
 * Heading uses ScrollTypewriter for scroll-driven letter-by-letter reveal.
 */

import type { CardsSection as CardsSectionData } from '@/config/types';
import ScrollTypewriter from '@/components/ScrollTypewriter/ScrollTypewriter';
import V2Icon from '../V2Icon/V2Icon';
import './CardsSection.css';

interface Props {
  data: CardsSectionData;
}

export default function CardsSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-cards-header">
        {/* Scroll-driven letter-by-letter heading reveal */}
        <ScrollTypewriter
          text={data.heading}
          as="h2"
          className="v2-cards-header__heading"
          completionFactor={0.45}
        />
        {data.subtext && (
          <p className="v2-cards-header__subtext">{data.subtext}</p>
        )}
      </div>

      <div className="v2-cards-grid">
        {data.cards.map((card, i) => (
          <div key={card.title} className="v2-card px-layer--accent" data-px-delay={String(i)}>
            <div className="v2-card__icon">
              <V2Icon name={card.icon} />
            </div>
            <h3 className="v2-card__title">{card.title}</h3>
            <p className="v2-card__text">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

