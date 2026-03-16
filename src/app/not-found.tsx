import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section flex-center" style={{ minHeight: '60vh' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ font: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>404</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Page not found
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: 'var(--btn-padding)',
          background: 'var(--gradient-primary)',
          color: 'var(--text-inverse)',
          borderRadius: 'var(--btn-radius)',
          fontWeight: 'var(--btn-font-weight)' as string,
        }}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
