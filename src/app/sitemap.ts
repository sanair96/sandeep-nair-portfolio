import type { MetadataRoute } from 'next'

import { getSiteUrl } from './site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: 'monthly',
      lastModified: new Date('2026-07-17'),
      priority: 1,
      url: getSiteUrl().toString(),
    },
  ]
}
