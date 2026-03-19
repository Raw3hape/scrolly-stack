/**
 * CardsSection — renders a grid of info cards.
 * Data-driven: receives all content via props from content-v2.ts.
 */

import type { CardsSection as CardsSectionData } from '@/config/types-v2';
import V2Icon from '../V2Icon/V2Icon';
import './CardsSection.css';

interface Props {
  data: CardsSectionData;
}

export default function CardsSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-cards-header">
        <h2 className="v2-cards-header__heading">{data.heading}</h2>
        {data.subtext && (
          <p className="v2-cards-header__subtext">{data.subtext}</p>
        )}
      </div>

      <div className="v2-cards-grid">
        {data.cards.map((card) => (
          <div key={card.title} className="v2-card">
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
