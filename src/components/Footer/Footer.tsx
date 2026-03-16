import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { routes, navLinks } from '@/config/nav';
import './Footer.css';

/**
 * Footer component — Foundation Projects
 *
 * Navigation, copyright, and brand info.
 * Server component (no client-side JS needed).
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-wordmark">{siteConfig.name}</span>
            <p className="footer-description">{siteConfig.description}</p>
          </div>

          {/* Navigation */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <h3 className="footer-nav-title">Navigation</h3>
            <ul className="footer-nav-list">
              <li><Link href={routes.home}>Home</Link></li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li><Link href={routes.schedule}>Schedule A Call</Link></li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
