import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['kz', 'ru', 'en'],

  // Used when no locale matches
  defaultLocale: 'kz',
  // next-intl's own middleware is not used: src/middleware.ts sends '/' and
  // unprefixed paths to kz every time. No language cookie is kept, so a new
  // visit always opens in Kazakh; the chosen language lives in the URL.
  localeDetection: false,
  localeCookie: false
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
