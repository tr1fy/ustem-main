import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

type AppLocale = (typeof routing.locales)[number]

const isLocale = (value: string | undefined): value is AppLocale =>
  routing.locales.includes(value as AppLocale)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if (isLocale(first)) {
    const headers = new Headers(request.headers)
    headers.set('X-NEXT-INTL-LOCALE', first)
    return NextResponse.next({ request: { headers } })
  }
  // '/' and every path without a locale prefix (/about, /news/x, old or
  // mistyped links) go to the same path under the visitor's locale. Without
  // this, /xyz would reach [locale]/layout.tsx with locale 'xyz', whose
  // notFound() no boundary can catch, and Next would answer with a blank
  // error shell. Unknown paths then get the localized 404 ([...rest]).
  // The site opens in Kazakh for everyone: the browser language is ignored
  // (owner's decision, 2026-10-29). Only a saved NEXT_LOCALE — a manual
  // choice made with the language switcher — takes precedence.
  const saved = request.cookies.get('NEXT_LOCALE')?.value
  const locale = isLocale(saved) ? saved : routing.defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  // Temporary (307) and uncached: the target depends on the cookie.
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Cookie')
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

// Everything except Next internals, Vercel internals and files with an
// extension (public assets, robots.txt, sitemap.xml, favicon.ico).
export const config = { matcher: ['/((?!_next|_vercel|.*\\..*).*)'] }
