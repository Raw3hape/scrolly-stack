/**
 * ValuePropsStrip — Foundation Projects
 *
 * Horizontal strip of 3 value proposition labels.
 * Used on Home, Roofers, and Investors pages.
 * Server component — no client-side JS needed.
 */

import './ValuePropsStrip.css';

interface ValuePropsStripProps {
  items: readonly string[];
}

/** Renders a horizontal strip of value proposition labels */
export default function ValuePropsStrip({ items }: ValuePropsStripProps) {
  return (
    <div className="value-props">
      {items.map((item, i) => (
        <div key={i} className="value-props__item">
          <span className="value-props__label">{item}</span>
          {i < items.length - 1 && (
            <span className="value-props__divider" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
