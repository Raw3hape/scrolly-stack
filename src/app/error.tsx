'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section flex-center" style={{ minHeight: '60vh' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ font: 'var(--font-h2)', marginBottom: 'var(--space-md)' }}>Something went wrong</h1>
        <p style={{ font: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: 'var(--btn-padding)',
            background: 'var(--gradient-primary)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--btn-radius)',
            fontWeight: 'var(--btn-font-weight)' as string,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </section>
  );
}
