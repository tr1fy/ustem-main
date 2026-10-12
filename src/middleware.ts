import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

type AppLocale = (typeof routing.locales)[number]

const isLocale = (value: string | undefined): value is AppLocale =>
  routing.locales.includes(value as AppLocale)

/** Accept-Language primary subtags → site locale (TZ §5.5). */
const LANGUAGE_TO_LOCALE: Record<string, AppLocale> = {
  kk: 'kz',
  kz: 'kz',
  ru: 'ru',
  en: 'en'
}

/**
 * First visit: the highest-ranked language the site speaks wins
 * (`ru-RU,ru;q=0.9` → ru, `de,en;q=0.8` → en); anything else → default (kz).
 */
function localeFromAcceptLanguage(header: string | null): AppLocale {
  if (!header) return routing.defaultLocale
  const ranked = header
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = params.map(param => param.trim()).find(p => p.startsWith('q='))
      const quality = q ? Number.parseFloat(q.slice(2)) : 1
      return {
        language: tag.trim().toLowerCase().split('-')[0],
        quality: Number.isFinite(quality) ? quality : 0,
        index
      }
    })
    .filter(entry => entry.language && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)

  for (const { language } of ranked) {
    const locale = LANGUAGE_TO_LOCALE[language]
    if (locale) return locale
  }
  return routing.defaultLocale
}

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
  // A saved NEXT_LOCALE is a manual choice (set by the language switcher):
  // always honour it and never auto-detect over it.
  const saved = request.cookies.get('NEXT_LOCALE')?.value
  const locale = isLocale(saved)
    ? saved
    : localeFromAcceptLanguage(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  // Temporary (307) and uncached: the target depends on cookie and language.
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Accept-Language, Cookie')
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

// Everything except Next internals, Vercel internals and files with an
// extension (public assets, robots.txt, sitemap.xml, favicon.ico).
export const config = { matcher: ['/((?!_next|_vercel|.*\\..*).*)'] }
