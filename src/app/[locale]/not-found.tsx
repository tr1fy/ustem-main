import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { localize } from '@/lib/site-content'
import NotFoundView, { notFoundTitle } from './_components/not-found-view'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  // Next adds <meta name="robots" content="noindex"> to 404 responses itself.
  return { title: localize(notFoundTitle, locale) }
}

export default async function NotFound() {
  const locale = await getLocale()
  return <NotFoundView locale={locale} />
}
