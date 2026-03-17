import type { Metadata } from 'next';
import Section from '@/components/Section/Section';
import PageHeader from '@/components/PageHeader/PageHeader';
import ComparisonColumns from '@/components/ComparisonColumns/ComparisonColumns';
import CtaBlock from '@/components/CtaBlock/CtaBlock';
import { pageMetadata } from '@/config/content/metadata';
import {
  aboutHero,
  expandedProblem,
  comparison,
  teamSection,
  proofSection,
  aboutClosingCta,
} from '@/config/content/about';
import '../status-pages.css';
import './about.css';

export const metadata: Metadata = pageMetadata.about;

/**
 * About Page — Foundation Projects
 *
 * Section 1: Hero
 * Section 2: Expanded Problem
 * Section 3: Broken System vs Better Way (ComparisonColumns)
 * Section 4: Team
 * Section 5: Proof Section
 * Section 6: Closing CTA
 */
export default function AboutPage() {
  return (
    <>
      {/* Section 1: Hero */}
      <Section width="narrow">
        <PageHeader
          title={aboutHero.heading}
          description={aboutHero.body}
        />
      </Section>

      {/* Section 2: Expanded Problem */}
      <Section width="narrow">
        <div className="about-problem">
          <h2 className="about-problem__heading">{expandedProblem.heading}</h2>
          <p className="about-problem__body">{expandedProblem.body}</p>
          <p className="about-problem__punchline">{expandedProblem.punchline}</p>
        </div>
      </Section>

      {/* Section 3: The Broken System vs The Better Way */}
      <Section width="default">
        <ComparisonColumns left={comparison.left} right={comparison.right} />
      </Section>

      {/* Section 4: Team */}
      <Section width="default">
        <div className="team-section">
          <h2 className="team-section__heading">{teamSection.heading}</h2>
          <p className="team-section__subheading">{teamSection.subheading}</p>
          <p className="team-accent-stat">{teamSection.accentStat}</p>

          {teamSection.members.length > 0 ? (
            <div className="team-grid">
              {teamSection.members.map((member) => (
                <article key={member.name} className="team-card">
                  <div className="team-card__photo-wrapper">
                    <div
                      className="team-card__photo-placeholder"
                      aria-label={`Photo of ${member.name}`}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__bio">{member.bio}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-page__body--lg-no-mb">
              Team profiles coming soon.
            </p>
          )}
        </div>
      </Section>

      {/* Section 5: Proof */}
      <Section width="narrow">
        <div className="about-proof">
          <h2 className="about-proof__heading">{proofSection.heading}</h2>
          <p className="about-proof__body">{proofSection.body}</p>
          <p className="about-proof__detail">{proofSection.detail}</p>
        </div>
      </Section>

      {/* Section 6: Closing CTA */}
      <Section width="default">
        <CtaBlock
          heading={aboutClosingCta.heading}
          body={aboutClosingCta.body}
          ctaLabel={aboutClosingCta.ctaLabel}
          ctaHref={aboutClosingCta.ctaHref}
        />
      </Section>
    </>
  );
}
