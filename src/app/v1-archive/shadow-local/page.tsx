import type { Metadata } from 'next';
import '../../status-pages.css';

export const metadata: Metadata = {
  title: 'Shadow Local',
  description: 'Shadow Local program by Foundation Projects.',
};

export default function ShadowLocalPage() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <h1 className="status-page__title--h1">Shadow Local</h1>
        <p className="status-page__body--lg-no-mb">
          Content coming soon.
        </p>
      </div>
    </section>
  );
}
