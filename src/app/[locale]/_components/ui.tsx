import type { ReactNode } from 'react'
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { localize, ui } from '@/lib/site-content'

/**
 * Shared layout primitives for the TZ v1.0 design system.
 * Internal hrefs are locale-less ("/about"); the i18n Link adds the prefix.
 */

export function ArrowLink({
  href,
  children,
  className = '',
  external = false
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}) {
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    const isWeb = /^https?:/.test(href)
    return (
      <a
        className={`link-arrow ${isWeb ? 'is-external' : ''} ${className}`}
        href={href}
        target={isWeb ? '_blank' : undefined}
        rel={isWeb ? 'noreferrer' : undefined}
      >
        {children}
        {isWeb ? (
          <ArrowUpRightIcon aria-hidden='true' />
        ) : (
          <ArrowRightIcon aria-hidden='true' />
        )}
      </a>
    )
  }
  return (
    <Link className={`link-arrow ${className}`} href={href}>
      {children}
      <ArrowRightIcon aria-hidden='true' />
    </Link>
  )
}

/** H2 + optional one-line lead + optional trailing action. */
export function SectionHead({
  id,
  title,
  lead,
  action
}: {
  id?: string
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className='section-head'>
      <div className='stack'>
        <h2 id={id}>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {action}
    </div>
  )
}

/** Inner-page header: breadcrumbs, H1, one-line lead (TZ §8). */
export function PageHead({
  locale,
  title,
  lead,
  crumbs = [],
  children
}: {
  locale: string
  title: ReactNode
  lead?: ReactNode
  crumbs?: { href: string; label: string }[]
  children?: ReactNode
}) {
  return (
    <header className='page-head container'>
      <nav aria-label='Breadcrumb'>
        <ol className='breadcrumbs'>
          <li>
            <Link href='/'>{localize(ui.home, locale)}</Link>
          </li>
          {crumbs.map(crumb => (
            <li key={crumb.href}>
              <Link href={crumb.href}>{crumb.label}</Link>
            </li>
          ))}
          {/* Top-level pages: name the current page so the trail never
              reads as a lone «Главная» link. Nested pages end at the
              parent; their H1 follows directly below. */}
          {crumbs.length === 0 && typeof title === 'string' && (
            <li aria-current='page'>{title}</li>
          )}
        </ol>
      </nav>
      <h1>{title}</h1>
      {lead && <p>{lead}</p>}
      {children}
    </header>
  )
}
