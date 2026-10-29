import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['kz', 'ru', 'en'],

  // Used when no locale matches
  defaultLocale: 'kz',
  // next-intl's own middleware is not used: src/middleware.ts redirects '/'
  // to the NEXT_LOCALE cookie (manual choice) or else to kz — the browser
  // language is ignored, the site opens in Kazakh for everyone.
  localeDetection: false,
  localeCookie: { maxAge: 60 * 60 * 24 * 365, partitioned: false }
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
