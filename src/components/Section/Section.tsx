/**
 * Section — Foundation Projects
 *
 * Reusable page section with container.
 * Replaces repeated <section className="section"><div className="container..."> pattern.
 */

interface SectionProps {
  children: React.ReactNode;
  width?: 'narrow' | 'default' | 'wide' | 'full';
  compact?: boolean;
  centered?: boolean;
  className?: string;
  /** Minimum height — useful for error/404 pages */
  minHeight?: string;
}

export default function Section({
  children,
  width = 'default',
  compact = false,
  centered = false,
  className = '',
  minHeight,
}: SectionProps) {
  const sectionClasses = [
    'section',
    compact ? 'section--compact' : '',
    centered ? 'flex-center' : '',
    className,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'container',
    width !== 'default' ? `container--${width}` : '',
  ].filter(Boolean).join(' ');

  return (
    <section
      className={sectionClasses}
      style={minHeight ? { minHeight } : undefined}
    >
      <div
        className={containerClasses}
        style={centered ? { textAlign: 'center' } : undefined}
      >
        {children}
      </div>
    </section>
  );
}
