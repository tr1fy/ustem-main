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
  // mistyped links) go to the same path under /kz. Without
  // this, /xyz would reach [locale]/layout.tsx with locale 'xyz', whose
  // notFound() no boundary can catch, and Next would answer with a blank
  // error shell. Unknown paths then get the localized 404 ([...rest]).
  // Every visit that does not name a language opens in Kazakh. The browser
  // language is ignored (owner's decision, 2026-10-29) and so is any earlier
  // choice: a visitor who switched to Russian and later comes back to
  // ustem.kz sees Kazakh again (owner's decision, 2026-11-05). The chosen
  // language lives only in the URL (/ru/..., /en/...), so it holds while the
  // visitor clicks around and is gone once they leave.
  const url = request.nextUrl.clone()
  url.pathname = `/${routing.defaultLocale}${pathname === '/' ? '' : pathname}`
  // Temporary (307), so the language of '/' can still change later.
  return NextResponse.redirect(url)
}

// Everything except Next internals, Vercel internals and files with an
// extension (public assets, robots.txt, sitemap.xml, favicon.ico).
export const config = { matcher: ['/((?!_next|_vercel|.*\\..*).*)'] }
