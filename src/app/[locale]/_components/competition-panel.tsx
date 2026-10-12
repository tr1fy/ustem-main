'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { localize, navItems, ui, type SiteEvent } from '@/lib/site-content'
import { coverImage } from './competition-card'
import CompetitionDetail from './competition-detail'

/** Matches the 280ms closing transition in competitions.css. */
const DURATION = 280
const sheetLabel = navItems.find(item => item.key === 'competitions')!.label
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Competition panel (TZ §7.2): side sheet on desktop, full-screen sheet on
 * phones. Opening pushes /{locale}/competitions/{slug} so the link can be
 * shared; Back, Esc, × and the overlay close it. A direct visit to that URL
 * renders the full page instead.
 *
 * Next 13.5 detail: the entry is pushed with a NULL state. The app router
 * ignores popstate events whose state is null, while a non-null state without
 * its private `__NA` marker would make it reload the page.
 */
export default function CompetitionPanel({
  event,
  locale,
  origin,
  onClosed
}: {
  event: SiteEvent
  locale: string
  /** Element that opened the panel; focus returns to it on close. */
  origin: HTMLElement | null
  onClosed: () => void
}) {
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const pushedRef = useRef(false)
  const closingRef = useRef(false)
  const releaseRef = useRef<() => void>(() => {})
  const onClosedRef = useRef(onClosed)
  onClosedRef.current = onClosed
  const [state, setState] = useState<'closed' | 'open'>('closed')
  const panelUrl = `/${locale}/competitions/${event.slug}`
  const cover = coverImage(event.cover, 'wide', '(min-width: 768px) 560px, 100vw')

  /** Animate out, release the page, return focus, then unmount. */
  const finish = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setState('closed')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(
      () => {
        releaseRef.current()
        if (origin?.isConnected) origin.focus({ preventScroll: true })
        onClosedRef.current()
      },
      reduce ? 0 : DURATION
    )
  }, [origin])

  /** ×, Esc, overlay: undo our history entry; popstate then closes. */
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    if (pushedRef.current && window.location.pathname === panelUrl) {
      pushedRef.current = false
      window.history.back()
      // Safety net in case no popstate arrives.
      window.setTimeout(finish, 600)
    } else {
      finish()
    }
  }, [finish, panelUrl])

  // History: push the shareable URL; close when the user navigates away.
  useEffect(() => {
    if (window.location.pathname !== panelUrl) {
      window.history.pushState(null, '', panelUrl)
      pushedRef.current = true
    } else {
      // Re-opened by "Forward" onto the entry we pushed earlier.
      pushedRef.current = window.history.state === null
    }
    const onPopState = () => {
      if (window.location.pathname !== panelUrl) {
        pushedRef.current = false
        finish()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [panelUrl, finish])

  // Modal behaviour: inert background, scroll lock, focus, enter transition.
  useEffect(() => {
    const root = rootRef.current
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const previousGutter = html.style.getPropertyValue('scrollbar-gutter')
    const inerted: Element[] = []
    Array.from(document.body.children).forEach(node => {
      if (
        node === root ||
        node.hasAttribute('inert') ||
        /^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(node.tagName)
      )
        return
      node.setAttribute('inert', '')
      inerted.push(node)
    })
    html.style.setProperty('scrollbar-gutter', 'stable')
    html.style.overflow = 'hidden'
    let released = false
    releaseRef.current = () => {
      if (released) return
      released = true
      inerted.forEach(node => node.removeAttribute('inert'))
      html.style.overflow = previousOverflow
      html.style.setProperty('scrollbar-gutter', previousGutter)
    }
    closeRef.current?.focus({ preventScroll: true })
    // Commit the closed position first so the sheet slides in.
    void sheetRef.current?.offsetWidth
    setState('open')
    return () => releaseRef.current()
  }, [])

  // Esc closes; Tab stays inside the panel.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }
      if (event.key !== 'Tab') return
      const sheet = sheetRef.current
      if (!sheet) return
      const items = Array.from(
        sheet.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter(item => item.getClientRects().length > 0)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !sheet.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (active === last || !sheet.contains(active))
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  return createPortal(
    <div ref={rootRef} className='cmp-panel-root' data-state={state}>
      <div className='cmp-overlay' aria-hidden='true' onClick={requestClose} />
      <div
        ref={sheetRef}
        className='cmp-sheet'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
      >
        {/* Guideline-style header: a quiet label, the close button and a
            slim Aral-gradient rule underneath (::after). */}
        <div className='cmp-sheet-bar'>
          <span className='cmp-sheet-label' aria-hidden='true'>
            {localize(sheetLabel, locale)}
          </span>
          <button
            ref={closeRef}
            type='button'
            className='cmp-close'
            onClick={requestClose}
            aria-label={localize(ui.close, locale)}
          >
            <XMarkIcon aria-hidden='true' />
          </button>
        </div>
        <div className='cmp-sheet-body'>
          <div className='cmp-sheet-media'>
            <img
              {...cover}
              alt=''
              decoding='async'
              style={
                event.coverPosition
                  ? { objectPosition: event.coverPosition }
                  : undefined
              }
            />
          </div>
          <CompetitionDetail
            event={event}
            locale={locale}
            mode='panel'
            titleId={titleId}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
