import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { localize } from '@/lib/site-content'
import NotFoundView, { notFoundTitle } from '../_components/not-found-view'

/**
 * Any path inside a locale that matches no route (e.g. /ru/unknown) renders
 * the localized 404 from app/[locale]/not-found.tsx inside the site layout,
 * instead of Next's bare default page.
 *
 * The static build has no server to answer unknown paths, so it renders that
 * page once per language as /{locale}/404, and deploy/htaccess serves it as
 * the ErrorDocument (with status 404) for every missing URL in that language.
 */
const isStaticExport = process.env.STATIC_EXPORT === '1'

type Params = { params: { locale: string } }

export function generateStaticParams() {
  return [{ rest: ['404'] }]
}

export function generateMetadata({ params: { locale } }: Params): Metadata {
  if (!isStaticExport) return {}
  return {
    title: localize(notFoundTitle, locale),
    robots: { index: false, follow: true }
  }
}

export default function UnknownPage({ params: { locale } }: Params) {
  if (!isStaticExport) notFound()
  setRequestLocale(locale)
  return <NotFoundView locale={locale} />
}
