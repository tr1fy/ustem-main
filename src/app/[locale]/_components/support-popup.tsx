'use client'

/*
 * «Көмектесу» window (TZ 5.6): a small non-modal window that never steals
 * focus.
 * - starts appearing ~1.2–1.5 s after navigation start (measured from the
 *   page load, not from hydration), without waiting for a scroll;
 * - phones, tablets, laptops (< 1280px wide or < 900px tall): a compact
 *   one-row bar (text · round arrow button · ×), full width on phones and
 *   a small corner bar from 768px; large screens: a small 300px card;
 * - from 768px it sits 24px from the bottom-left corner (TZ 5.6: always
 *   the left corner — the owner chose to keep the TZ placement);
 * - steps aside (fades out) once the visitor scrolls the footer up to it, so
 *   it never covers the footer's contacts, links or «Back to top»; it comes
 *   back on scrolling up. No room is reserved in the footer;
 * - never hides the keyboard focus (WCAG 2.4.11): while shown it publishes
 *   the band it takes as --sup-space, which footer.css turns into
 *   scroll-padding-bottom so focused elements are scrolled above it; if a
 *   focused element (with its ring) still lies under it, it tucks away
 *   until the focus moves on or the page scrolls it clear;
 * - closing hides it for 30 days (localStorage);
 * - never shown on /partners and /contacts;
 * - hidden while the mobile menu or the cookie banner is open
 *   (<html data-menu-open="true"> / <html data-cookie-banner="open">);
 * - while shown it sets <html data-support-popup="open">.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, usePathname } from '@/i18n/routing'
import { localize, ui } from '@/lib/site-content'
import { track } from '@/lib/analytics'

const STORAGE_KEY = 'ustem-support-dismissed'
const HIDE_FOR_MS = 30 * 24 * 60 * 60 * 1000
/** Shown this long after navigation start (or right after hydration if that
 *  is later), so it starts appearing within ~1.5 s on any device. */
const SHOW_AT_MS = 1200
/** Longest wait for running entrance animations before measuring. */
const SETTLE_CAP_MS = 300
const CLOSE_MS = 220
const EXCLUDED = ['/partners', '/contacts']
const DESKTOP = 768

type Side = 'left' | 'right'
type Box = { left: number; right: number; top: number; bottom: number }

/**
 * What the card should not land on when it appears, most important first.
 * Any overlap in an earlier tier outweighs any overlap in a later one.
 */
const KEEP_CLEAR = [
  'h1, h2, h3',
  '.imp-stat, .imp-timeline',
  '.btn, .link-arrow, input, select, textarea',
  'p, .chip, figcaption, blockquote',
  'img, video, .card-media, .cmp-card-media'
]

function dismissedRecently() {
  try {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY))
    return (
      Number.isFinite(stored) && stored > 0 && Date.now() - stored < HIDE_FOR_MS
    )
  } catch {
    return false
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    /* storage unavailable: hide for this visit only */
  }
}

function overlayOpen() {
  const { dataset } = document.documentElement
  return dataset.menuOpen === 'true' || dataset.cookieBanner === 'open'
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Resolves when the page's finite entrance animations and transitions have
 * finished (they move content with transforms), or after `cap` ms.
 * Scroll-driven and infinite animations are ignored.
 */
function settled(cap: number) {
  const running = document.getAnimations().filter(animation => {
    if (animation.timeline !== document.timeline) return false
    if (animation.playState !== 'running') return false
    const end = animation.effect?.getComputedTiming().endTime
    return typeof end === 'number' && Number.isFinite(end)
  })
  if (!running.length) return Promise.resolve()
  return Promise.race([
    Promise.all(running.map(animation => animation.finished.catch(() => null))),
    new Promise(resolve => window.setTimeout(resolve, cap))
  ])
}

/**
 * Headings count by their text lines (not the full-width box), without the
 * empty band above the capitals.
 */
function rectsOf(node: Element): Box[] {
  if (/^H[1-3]$/.test(node.tagName)) {
    const range = document.createRange()
    range.selectNodeContents(node)
    return Array.from(range.getClientRects(), r => ({
      left: r.left,
      right: r.right,
      top: r.top + r.height * 0.18,
      bottom: r.bottom
    }))
  }
  return [node.getBoundingClientRect()]
}

/** Covered area of important content per KEEP_CLEAR tier. */
function coverage(box: Box) {
  return KEEP_CLEAR.map(selector => {
    let area = 0
    for (const node of Array.from(document.querySelectorAll(selector))) {
      if (node.closest('.sup, .ck, .site-header')) continue
      for (const r of rectsOf(node)) {
        const w = Math.min(r.right, box.right) - Math.max(r.left, box.left)
        const h = Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top)
        if (w > 0 && h > 0) area += w * h
      }
    }
    return area
  })
}

/** Tier by tier: the first tier that differs decides. */
function lighter(a: number[], b: number[]) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i]
  }
  return false
}

/** TZ 5.6: the window always lives in the bottom-left corner. */
function chooseSide(_node: HTMLElement): Side {
  return 'left'
}

/**
 * The window's resting spot in the viewport: its layout box, not the rect
 * of the entrance / tuck animation (those only translate it vertically).
 */
function spotOf(node: HTMLElement): Box {
  const { left, right } = node.getBoundingClientRect()
  const offset = parseFloat(window.getComputedStyle(node).bottom) || 0
  const bottom = window.innerHeight - offset
  return { left, right, top: bottom - node.offsetHeight, bottom }
}

/** Room for the focus ring (3px outline + 3px offset) around the target. */
const RING = 6

/** Whether the keyboard focus, ring included, overlaps the window's spot. */
function focusUnder(node: HTMLElement, spot: Box) {
  const target = document.activeElement
  if (!target || target === document.body || node.contains(target)) {
    return false
  }
  try {
    // Pointer focus (a click) shows no ring and was aimed past the window.
    if (!target.matches(':focus-visible')) return false
  } catch {
    /* no :focus-visible support: treat every focus as keyboard focus */
  }
  return Array.from(target.getClientRects()).some(
    r =>
      r.left - RING < spot.right &&
      r.right + RING > spot.left &&
      r.top - RING < spot.bottom &&
      r.bottom + RING > spot.top
  )
}

export default function SupportPopup() {
  const locale = useLocale()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const sideRef = useRef<Side | null>(null)
  const [ready, setReady] = useState(false)
  const [side, setSide] = useState<Side | null>(null)
  const [closing, setClosing] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [covered, setCovered] = useState(false)
  const [tucked, setTucked] = useState(false)

  useEffect(() => {
    if (dismissedRecently()) {
      setDismissed(true)
      return
    }
    const wait = Math.max(0, SHOW_AT_MS - window.performance.now())
    const timer = window.setTimeout(() => setReady(true), wait)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const sync = () => setCovered(overlayOpen())
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-menu-open', 'data-cookie-banner']
    })
    return () => observer.disconnect()
  }, [])

  const close = useCallback(() => {
    rememberDismissal()
    track('support_popup_close')
    if (reducedMotion()) {
      setDismissed(true)
      return
    }
    setClosing(true)
    window.setTimeout(() => setDismissed(true), CLOSE_MS)
  }, [])

  const excluded = EXCLUDED.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  )
  const active = ready && !dismissed && !covered && !excluded
  const visible = active && side !== null

  // Rendered invisibly to measure its spot once the page has settled, then
  // revealed. The side is chosen once per visit so the card never jumps.
  useEffect(() => {
    if (!active) {
      setSide(null)
      return
    }
    if (sideRef.current) {
      setSide(sideRef.current)
      return
    }
    let cancelled = false
    settled(SETTLE_CAP_MS).then(() => {
      const node = ref.current
      if (cancelled || !node) return
      sideRef.current = chooseSide(node)
      setSide(sideRef.current)
    })
    return () => {
      cancelled = true
    }
  }, [active])

  // Publish the state for other parts of the page, and the band the window
  // takes at the bottom of the viewport (--sup-space). footer.css turns that
  // into scroll-padding-bottom, so keyboard focus and anchor scrolling keep
  // their target above the window (WCAG 2.4.11 Focus Not Obscured).
  useEffect(() => {
    const node = ref.current
    if (!visible || !node) return
    const root = document.documentElement
    root.dataset.supportPopup = 'open'
    const publish = () => {
      const space = spotOf(node)
      root.style.setProperty(
        '--sup-space',
        `${Math.ceil(window.innerHeight - space.top + 16)}px`
      )
    }
    publish()
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(publish)
    observer?.observe(node)
    window.addEventListener('resize', publish)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', publish)
      delete root.dataset.supportPopup
      root.style.removeProperty('--sup-space')
    }
  }, [visible])

  // Step aside (data-tucked) while
  // - the footer is under the window (after the visitor has scrolled),
  //   unless the window holds keyboard focus;
  // - the keyboard focus (with its ring) lies under the window: a safeguard
  //   for whatever scroll-padding cannot move, e.g. the end of the page or
  //   a browser that does not scroll an element already in view.
  // Re-checked on focus moves, scroll and resize; it comes back as soon as
  // neither holds.
  useEffect(() => {
    const node = ref.current
    if (!visible || !node) return
    const footer = document.querySelector<HTMLElement>('.site-footer')
    let frame = 0
    let scrolled = false
    const check = () => {
      frame = 0
      const spot = spotOf(node)
      const reached =
        scrolled &&
        footer !== null &&
        footer.getBoundingClientRect().top < spot.top &&
        !node.contains(document.activeElement)
      setTucked(reached || focusUnder(node, spot))
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check)
    }
    const onScroll = () => {
      scrolled = true
      schedule()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('focusin', schedule)
    document.addEventListener('focusout', schedule)
    schedule()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('focusin', schedule)
      document.removeEventListener('focusout', schedule)
      window.cancelAnimationFrame(frame)
      setTucked(false)
    }
  }, [visible])

  if (!active) return null

  const label = localize(ui.supportLabel, locale)
  const state = closing ? 'closing' : visible ? 'open' : 'pending'

  // data-state 'pending' = visibility: hidden (not focusable, not
  // announced). data-tucked only fades it out: its controls stay focusable,
  // and focusing one un-tucks it (see check() above).
  return (
    <div
      ref={ref}
      className='sup'
      data-state={state}
      data-side={side ?? 'left'}
      data-tucked={tucked ? 'true' : undefined}
      role='region'
      aria-label={label}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          close()
        }
      }}
    >
      <p className='sup-text'>{localize(ui.supportText, locale)}</p>
      <Link
        href='/partners'
        className='btn btn-primary sup-cta'
        onClick={() => track('support_popup_click')}
      >
        <span className='sup-cta-label'>
          {localize(ui.becomePartner, locale)}
        </span>
        <ArrowRightIcon aria-hidden='true' />
      </Link>
      <button
        type='button'
        className='sup-close'
        aria-label={localize(ui.close, locale)}
        onClick={close}
      >
        <XMarkIcon aria-hidden='true' />
      </button>
    </div>
  )
}
