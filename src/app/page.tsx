import ScrollyLoader from '@/features/scrolly-experience/ScrollyLoader';
import { noscriptContent } from '@/config/content';

/**
 * HomePage — Foundation Projects (Server Component)
 *
 * The 3D scrollytelling experience is loaded via ScrollyLoader (client wrapper).
 * Additional marketing sections can be added below as server components.
 */
export default function HomePage() {
  return (
    <>
      {/* Section 1: Interactive 3D scrollytelling experience */}
      <ScrollyLoader />

      {/* Fallback hero for no-JS / search engine crawlers */}
      <noscript>
        <section style={{ padding: '4rem 2rem', maxWidth: '600px' }}>
          <h1>{noscriptContent.headline}</h1>
          <p>{noscriptContent.description}</p>
          <a href={noscriptContent.ctaHref}>{noscriptContent.ctaLabel}</a>
        </section>
      </noscript>

      {/*
        Section 2+: Standard marketing sections (server components)
        Add sections here: social proof, testimonials, FAQ, etc.
      */}
    </>
  );
}
