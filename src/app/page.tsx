import Section from '@/components/Section/Section';
import LinkButton from '@/components/LinkButton/LinkButton';
import ValuePropsStrip from '@/components/ValuePropsStrip/ValuePropsStrip';
import StepCards from '@/components/StepCards/StepCards';
import CtaBlock from '@/components/CtaBlock/CtaBlock';
import HomeClient from './HomeClient';
import {
  noscriptContent,
  homeValueProps,
  problemStakesContent,
  homeHowItWorks,
  stakesContent,
  homeFinalCta,
} from '@/config/content/home';
import './home.css';

/**
 * HomePage — Foundation Projects (Server Component)
 *
 * Section 1: Interactive 3D scrollytelling (client-only via ScrollyLoader)
 * Section 2: Value Props Strip
 * Section 3: Problem & Stakes
 * Section 4: How It Works (3 steps)
 * Section 5: Stakes / Urgency
 * Section 6: Final CTA
 *
 * VARIANT SYSTEM:
 * - With ?variant=<id> → skips splash, loads that variant directly
 * - Without ?variant= → shows splash screen to choose cube variant
 */

interface HomePageProps {
  searchParams: Promise<{ variant?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { variant: variantId } = await searchParams;

  return (
    <HomeClient initialVariantId={variantId}>
      {/* Fallback hero for no-JS / search engine crawlers */}
      <noscript>
        <section className="noscript-hero">
          <h1>{noscriptContent.headline}</h1>
          <p>{noscriptContent.description}</p>
          <a href={noscriptContent.ctaHref}>{noscriptContent.ctaLabel}</a>
        </section>
      </noscript>

      {/* Section 2: Value Props Strip */}
      <Section width="default">
        <ValuePropsStrip items={homeValueProps} />
      </Section>

      {/* Section 3: Problem & Stakes */}
      <Section width="narrow">
        <div className="problem-stakes">
          <h2 className="problem-stakes__heading">
            {problemStakesContent.heading}
          </h2>
          <div className="problem-stakes__columns">
            <div className="problem-stakes__problem">
              <h3 className="problem-stakes__label">The Problem</h3>
              <p className="problem-stakes__text">{problemStakesContent.problem}</p>
            </div>
            <div className="problem-stakes__solution">
              <h3 className="problem-stakes__label">The Solution</h3>
              <p className="problem-stakes__text">{problemStakesContent.solution}</p>
            </div>
          </div>
          <div className="problem-stakes__cta">
            <LinkButton href={problemStakesContent.ctaHref} arrow>
              {problemStakesContent.ctaLabel}
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* Section 4: How It Works */}
      <Section width="default">
        <h2 className="section-heading">{homeHowItWorks.heading}</h2>
        <StepCards steps={homeHowItWorks.steps} />
      </Section>

      {/* Section 5: Stakes / Urgency */}
      <Section width="narrow">
        <div className="stakes-section">
          <p className="stakes-section__lead">{stakesContent.body}</p>
          <p className="stakes-section__detail">{stakesContent.detail}</p>
        </div>
      </Section>

      {/* Section 6: Final CTA */}
      <Section width="default">
        <CtaBlock
          heading={homeFinalCta.heading}
          subheading={homeFinalCta.subheading}
          body={homeFinalCta.body}
          ctaLabel={homeFinalCta.ctaLabel}
          ctaHref={homeFinalCta.ctaHref}
        />
      </Section>
    </HomeClient>
  );
}
