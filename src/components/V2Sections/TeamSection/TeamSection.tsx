/**
 * TeamSection — grid of team member cards.
 * Data-driven: receives all content via props from content-v2.ts.
 *
 * Each card displays: initials avatar, name (serif), role (overline), bio (body).
 * No images from Stitch — uses initials for premium feel matching design system.
 */

import type { TeamSection as TeamSectionData } from '@/config/types-v2';
import './TeamSection.css';

interface Props {
  data: TeamSectionData;
}

/** Extract initials from a full name, e.g. "Jacob Sterling" → "JS" */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamSection({ data }: Props) {
  return (
    <div className="v2-container">
      <div className="v2-team-header">
        <h2 className="v2-team-header__heading">{data.heading}</h2>
        {data.subtext && (
          <p className="v2-team-header__subtext">{data.subtext}</p>
        )}
      </div>

      <div className="v2-team-grid">
        {data.members.map((member) => (
          <div key={member.name} className="v2-team-card">
            <div
              className="v2-team-card__avatar"
              aria-hidden="true"
            >
              {getInitials(member.name)}
            </div>
            <h3 className="v2-team-card__name">{member.name}</h3>
            <span className="v2-team-card__role">{member.role}</span>
            <p className="v2-team-card__bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
