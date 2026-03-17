'use client';

import Section from '@/components/Section/Section';
import '@/components/LinkButton/LinkButton.css';
import './status-pages.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section centered minHeight="60vh">
      <h1 className="status-page__title">Something went wrong</h1>
      <p className="status-page__body">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button onClick={reset} className="link-button link-button--primary">
        Try again
      </button>
    </Section>
  );
}
