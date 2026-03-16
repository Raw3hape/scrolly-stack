/**
 * LinkButton — Foundation Projects
 *
 * Reusable button/link component with gradient, ghost, and secondary variants.
 * Replaces inline-styled buttons/links across pages.
 *
 * Server component safe — uses <a> tag for external, Next Link for internal.
 */

import Link from 'next/link';
import './LinkButton.css';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  arrow?: boolean;
  className?: string;
}

export default function LinkButton({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className = '',
}: LinkButtonProps) {
  const classes = [
    'link-button',
    `link-button--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  const isExternal = href.startsWith('http');
  const content = (
    <>
      {children}
      {arrow && <span className="link-button__arrow" aria-hidden="true">→</span>}
    </>
  );

  if (isExternal) {
    return <a href={href} className={classes}>{content}</a>;
  }

  return <Link href={href} className={classes}>{content}</Link>;
}
