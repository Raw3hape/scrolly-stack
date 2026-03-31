import Section from '@/components/Section/Section';
import LinkButton from '@/components/LinkButton/LinkButton';
import { routes } from '@/config/nav';
import './status-pages.css';

export default function NotFound() {
  return (
    <Section centered minHeight="60vh">
      <h1 className="status-page__title--display">404</h1>
      <p className="status-page__body--lg">Page not found</p>
      <LinkButton href={routes.home}>Back to Home</LinkButton>
    </Section>
  );
}
