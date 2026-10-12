import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/kz/login', '/ru/login', '/en/login', '/kz/register', '/ru/register', '/en/register'] },
    sitemap: `${siteUrl}/sitemap.xml`
  }
}
