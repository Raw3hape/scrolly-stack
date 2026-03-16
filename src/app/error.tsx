'use client';

import Section from '@/components/Section/Section';
import '@/components/LinkButton/LinkButton.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section centered minHeight="60vh">
      <h1 style={{ font: 'var(--font-h2)', marginBottom: 'var(--space-md)' }}>Something went wrong</h1>
      <p style={{ font: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button onClick={reset} className="link-button link-button--primary">
        Try again
      </button>
    </Section>
  );
}
