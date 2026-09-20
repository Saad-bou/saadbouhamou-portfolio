import type { MetadataRoute } from 'next';

const SITE_URL = 'https://saadbouhamou.dev';

/**
 * Static date prevents spurious re-crawl triggers on every build.
 * Bump it by hand when a route's content actually changes.
 */
const BUILD_DATE = '2026-05-01';

/**
 * Every indexable route on the site — `robots.ts` allows everything, so the
 * sitemap has to list everything too. The three in-house case studies are the
 * portfolio's main acquisition surface, which is why they are listed with the
 * same weight as the home page.
 *
 * Not listed: the external project links (the Mediazone partner sites) — those
 * live on other domains and are not ours to submit.
 */
const ROUTES: { path: string; lastModified: string; priority: number }[] = [
  { path: '/', lastModified: BUILD_DATE, priority: 1 },
  { path: '/mono', lastModified: BUILD_DATE, priority: 0.9 },
  { path: '/le-petit-college', lastModified: BUILD_DATE, priority: 0.9 },
  { path: '/le-petit-college/gallery', lastModified: BUILD_DATE, priority: 0.6 },
  { path: '/wima-car', lastModified: '2026-09-16', priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, lastModified, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency: 'monthly' as const,
    priority,
  }));
}
