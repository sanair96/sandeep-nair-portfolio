import type { MetadataRoute } from 'next'

import { getSiteUrl } from './site-url'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    host: siteUrl.origin,
    rules: { allow: '/', userAgent: '*' },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
