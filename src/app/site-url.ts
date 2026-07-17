const localUrl = 'http://localhost:3000'

export function getSiteUrl(): URL {
  const configuredUrl = process.env.SITE_URL
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const value = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : localUrl)

  return new URL(value)
}
