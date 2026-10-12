import type { Metadata } from 'next'

export const siteUrl = 'https://www.ustem.kz'
export const locales = ['kz', 'ru', 'en'] as const

/** URL segment `kz` is kept for compatibility; the language itself is Kazakh (`kk`). */
export const htmlLang = (locale: string) => (locale === 'kz' ? 'kk' : locale)

/** Canonical + hreflang links for a locale-less path such as `/about` or ''. */
export function alternatesFor(
  locale: string,
  path: string
): NonNullable<Metadata['alternates']> {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      kk: `/kz${path}`,
      ru: `/ru${path}`,
      en: `/en${path}`,
      'x-default': `/kz${path}`
    }
  }
}
