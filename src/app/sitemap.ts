import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/nav';

/**
 * Auto-generated sitemap — Foundation Projects
 * Next.js generates this at /sitemap.xml
 *
 * Routes are pulled from nav.ts automatically.
 * Adding a new route there will include it in the sitemap.
 */

/** Routes excluded from sitemap (internal/utility pages) */
const excludedRoutes: Set<string> = new Set([routes.optIn, routes.shadowLocal]);

/** Priority overrides for specific routes */
const priorityMap: Record<string, number> = {
  [routes.home]: 1,
  [routes.schedule]: 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes)
    .filter((route) => !excludedRoutes.has(route))
    .map((route) => ({
      url: `${siteConfig.url}${route === '/' ? '' : route}`,
      lastModified: new Date(),
      changeFrequency: route === routes.home ? 'weekly' : 'monthly',
      priority: priorityMap[route] ?? 0.8,
    }));
}
