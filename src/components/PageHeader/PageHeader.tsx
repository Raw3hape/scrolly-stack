/**
 * PageHeader — Foundation Projects
 *
 * Reusable page header with h1 + description.
 * Replaces inline-styled h1/p pattern across all marketing pages.
 */

import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function PageHeader({ title, description, align = 'left' }: PageHeaderProps) {
  return (
    <div className={`page-header ${align === 'center' ? 'page-header--center' : ''}`}>
      <h1 className="page-header__title">{title}</h1>
      {description && (
        <p className="page-header__description">{description}</p>
      )}
    </div>
  );
}
