import Section from '@/components/Section/Section';
import LinkButton from '@/components/LinkButton/LinkButton';

export default function NotFound() {
  return (
    <Section centered minHeight="60vh">
      <h1 style={{ font: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>404</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
        Page not found
      </p>
      <LinkButton href="/">Back to Home</LinkButton>
    </Section>
  );
}
