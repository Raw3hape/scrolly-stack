import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routesV2 } from '@/config/nav-v2';

/**
 * Auto-generated sitemap — Foundation Projects
 * Next.js generates this at /sitemap.xml
 *
 * Routes are pulled from nav-v2.ts automatically.
 */

/** Routes excluded from sitemap */
const excludedRoutes: Set<string> = new Set([
  routesV2.optIn,  // internal process page
]);

/** Priority overrides for specific routes */
const priorityMap: Record<string, number> = {
  [routesV2.home]: 1,
  [routesV2.schedule]: 0.9,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routesV2)
    .filter((route) => !excludedRoutes.has(route))
    .map((route) => ({
      url: `${siteConfig.url}${route === '/' ? '' : route}`,
      lastModified: new Date(),
      changeFrequency: route === routesV2.home ? 'weekly' : 'monthly',
      priority: priorityMap[route] ?? 0.8,
    }));
}
