import { APP_VERSION } from '@/config/version';
import './VersionBadge.css';

/**
 * VersionBadge — Displays current app version in the bottom-left corner.
 *
 * Server component (no 'use client' needed).
 * Visible on all pages via layout.tsx.
 * Version sourced from `src/config/version.ts` (single source of truth).
 */
export default function VersionBadge() {
  return (
    <span className="version-badge" aria-label={`Version ${APP_VERSION}`}>
      v{APP_VERSION}
    </span>
  );
}
