/**
 * TrustSection — badge + heading + partner logos row.
 *
 * Matches Stitch "Trust Section" pattern:
 * - Centered badge pill (e.g. "Verified Institutional Partner")
 * - Large serif heading
 * - Row of partner names (grayscale, muted)
 *
 * Parallax: badge is px-layer--bg (slow, atmospheric), heading is
 * px-layer--fg (base rhythm), partners are px-layer--accent with delay
 * for dramatic last reveal.
 *
 * Data-driven: receives all content via props from content.ts.
 */

import type { TrustSection as TrustSectionData } from '@/config/types';
import './TrustSection.css';

interface Props {
  data: TrustSectionData;
}

export default function TrustSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-trust">
        {/* Badge pill — slow background reveal */}
        {data.badge && (
          <div className="v2-trust__badge px-layer--bg">
            <span className="v2-trust__badge-icon" aria-hidden="true">
              ✓
            </span>
            <span className="v2-trust__badge-text">{data.badge}</span>
          </div>
        )}

        {/* Heading — base rhythm */}
        <h2 className="v2-trust__heading px-layer--fg">{data.heading}</h2>

        {/* Partner logos / names — dramatic accent reveal */}
        <div className="v2-trust__partners px-layer--accent" data-px-delay="1">
          {data.partners.map((name) => (
            <div key={name} className="v2-trust__partner">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
