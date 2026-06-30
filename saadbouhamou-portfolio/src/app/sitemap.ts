import type { MetadataRoute } from 'next';

// Static date prevents spurious re-crawl triggers on every build
const BUILD_DATE = '2026-05-01';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://saadbouhamou.dev', lastModified: new Date(BUILD_DATE) }];
}
