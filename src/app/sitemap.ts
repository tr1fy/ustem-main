import type { MetadataRoute } from 'next'
import { events, news } from '@/lib/site-content'
import { locales, siteUrl } from '@/lib/seo'

const staticPaths = [
  '',
  '/about',
  '/competitions',
  '/academy',
  '/projects',
  '/projects/jasampaz-urpaq',
  '/news',
  '/partners',
  '/contacts',
  '/privacy'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...events.map(item => `/competitions/${item.slug}`),
    ...news.map(item => `/news/${item.slug}`)
  ]
  // The public-discussion archives exist only in Kazakh and Russian; their
  // /en pages are noindex, so they are listed for kz and ru only.
  const archives = [
    '/news/robotics-lab-public-discussion',
    '/news/space-lab-public-discussion'
  ]
  const entry = (locale: string, path: string) => ({
    url: `${siteUrl}/${locale}${path}`,
    changeFrequency: path.startsWith('/news') ? ('weekly' as const) : ('monthly' as const),
    priority: path === '' ? 1 : 0.6
  })
  return [
    ...paths.flatMap(path => locales.map(locale => entry(locale, path))),
    ...archives.flatMap(path => ['kz', 'ru'].map(locale => entry(locale, path)))
  ]
}
