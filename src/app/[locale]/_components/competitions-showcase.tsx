'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react'
import { useLocale } from 'next-intl'
import { track } from '@/lib/analytics'
import {
  directionEvents,
  eventBySlug,
  events,
  flagshipEvents,
  localize,
  ui,
  words,
  type SiteEvent
} from '@/lib/site-content'
import { CompetitionCard, type OpenCompetition } from './competition-card'
import CompetitionPanel from './competition-panel'
import { SectionHead } from './ui'

const text = {
  allAges: words('Барлығы', 'Все', 'All'),
  found: words('Табылған жарыстар: {n}', 'Найдено соревнований: {n}', 'Competitions found: {n}'),
  empty: words(
    'Бұл жасқа сәйкес жарыстар әзірге жоқ.',
    'Для этого возраста пока нет соревнований.',
    'No competitions for this age yet.'
  )
}

/** Age buckets of the "My age" filter (TZ §7.4). */
const ageBuckets: { id: string; label: string; range: [number, number] }[] = [
  { id: '6-9', label: '6–9', range: [6, 9] },
  { id: '10-13', label: '10–13', range: [10, 13] },
  { id: '14-18', label: '14–18', range: [14, 18] },
  { id: '18+', label: '18+', range: [18, 120] }
]

type PanelState = { slug: string; origin: HTMLElement | null }

/** The full set of seven directions is laid out as a fixed bento
    (competitions.css, .cmp-tiles--bento); any other count — e.g. after the
    age filter — falls back to the even grid below. */
const BENTO_COUNT = 7

/**
 * Column spans of the fallback tiles on the 12-column desktop grid, so any
 * count fills its rows without an empty cell: rows of four (span 3), and the
 * remainder closes on wider tiles — 6 = 4 + 2, 5 = 3 + 2.
 */
function tileSpans(count: number) {
  const spans: number[] = []
  const rest = count % 4
  const lead = rest === 1 && count >= 5 ? count - 5 : count - rest
  for (let i = 0; i < lead; i++) spans.push(3)
  if (rest === 3) spans.push(4, 4, 4)
  else if (rest === 2) spans.push(6, 6)
  else if (rest === 1) spans.push(...(count >= 5 ? [4, 4, 4, 6, 6] : [12]))
  return spans
}

/** Stagger index (--i) and desktop span (--span) for one list item. */
const itemStyle = (index: number, span?: number) =>
  ({ '--i': index, ...(span ? { '--span': span } : {}) }) as CSSProperties

/**
 * Staggered entrance for card lists: items rise 24px and fade in, 70ms
 * apart (competitions.css, .cmp-stagger). Lists that are already on screen
 * at mount are left alone, so nothing visible ever blinks out; without JS
 * or with reduced motion everything simply stays visible.
 */
export function StaggerReveal({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (
      !node ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      node.getBoundingClientRect().top < window.innerHeight * 0.9
    )
      return
    node.classList.add('is-pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.classList.add('is-shown')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`cmp-stagger ${className}`}>
      {children}
    </div>
  )
}

/**
 * Competitions showcase (TZ §6.3, §7.2, §7.4).
 *   'home'    — 2 flagship cards + a bento of 7 direction tiles. The heading
 *               and its single "All competitions" link belong to the
 *               homepage (TZ §6.3), so nothing here repeats that link.
 *   'catalog' — /competitions: age filter (only once ages exist) and two
 *               titled groups.
 * A plain click on a card opens the competition panel; modified clicks and
 * no-JS visits follow the real link to the full page.
 */
export default function CompetitionsShowcase({
  variant
}: {
  variant: 'home' | 'catalog'
}) {
  const locale = useLocale()
  const t = (value: Parameters<typeof localize>[0]) => localize(value, locale)
  const [panel, setPanel] = useState<PanelState | null>(null)
  const [age, setAge] = useState<string | null>(null)

  const open = useCallback<OpenCompetition>((click, slug) => {
    if (
      click.defaultPrevented ||
      click.button !== 0 ||
      click.metaKey ||
      click.ctrlKey ||
      click.shiftKey ||
      click.altKey
    )
      return
    click.preventDefault()
    track('competition_panel_open', { slug })
    setPanel({ slug, origin: click.currentTarget })
  }, [])

  // "Forward" back onto a panel entry we pushed earlier (null state) reopens it.
  useEffect(() => {
    if (panel) return
    const prefix = `/${locale}/competitions/`
    const onPopState = () => {
      if (window.history.state !== null) return
      const { pathname } = window.location
      if (!pathname.startsWith(prefix)) return
      const slug = pathname.slice(prefix.length)
      if (!eventBySlug(slug)) return
      setPanel({
        slug,
        origin: document.querySelector<HTMLElement>(
          `[data-cmp-slug="${slug}"]`
        )
      })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [panel, locale])

  const hasAges = events.some(event => event.ageRange)
  const fits = useMemo(() => {
    const bucket = ageBuckets.find(item => item.id === age)
    if (!bucket) return () => true
    const [from, to] = bucket.range
    return (event: SiteEvent) =>
      !!event.ageRange && event.ageRange[0] <= to && event.ageRange[1] >= from
  }, [age])

  const panelEvent = panel ? eventBySlug(panel.slug) : undefined
  const panelNode = panel && panelEvent && (
    <CompetitionPanel
      key={panel.slug}
      event={panelEvent}
      locale={locale}
      origin={panel.origin}
      onClosed={() => setPanel(null)}
    />
  )

  /** `priority` marks the first card as the page's LCP image (catalogue). */
  const flagshipList = (
    list: SiteEvent[],
    details: boolean,
    priority = false
  ) => (
    <StaggerReveal>
      <ul className='cmp-flagships' role='list'>
        {list.map((event, index) => (
          <li key={event.slug} style={itemStyle(index)}>
            <CompetitionCard
              event={event}
              locale={locale}
              size='flagship'
              onOpen={open}
              details={details}
              priority={priority && index === 0}
            />
          </li>
        ))}
      </ul>
    </StaggerReveal>
  )

  const tileList = (list: SiteEvent[], details: boolean) => {
    const bento = list.length === BENTO_COUNT
    const spans = bento ? [] : tileSpans(list.length)
    return (
      <StaggerReveal>
        <ul
          className={`cmp-tiles${bento ? ' cmp-tiles--bento' : ''}`}
          role='list'
        >
          {list.map((event, index) => (
            <li key={event.slug} style={itemStyle(index, spans[index])}>
              <CompetitionCard
                event={event}
                locale={locale}
                size='tile'
                onOpen={open}
                details={details}
              />
            </li>
          ))}
        </ul>
      </StaggerReveal>
    )
  }

  if (variant === 'home') {
    return (
      <div className='cmp-showcase cmp-showcase--home'>
        {flagshipList(flagshipEvents, false)}
        {tileList(directionEvents, false)}
        {panelNode}
      </div>
    )
  }

  const flagships = flagshipEvents.filter(fits)
  const directions = directionEvents.filter(fits)
  const count = flagships.length + directions.length
  return (
    <div className='cmp-showcase cmp-showcase--catalog'>
      {hasAges && (
        <div className='cmp-filter'>
          <span className='cmp-filter-label' id='cmp-age-label'>
            {t(ui.myAge)}
          </span>
          <div
            className='cmp-segments'
            role='group'
            aria-labelledby='cmp-age-label'
          >
            {[{ id: null, label: t(text.allAges) }, ...ageBuckets].map(
              bucket => (
                <button
                  key={bucket.id ?? 'all'}
                  type='button'
                  className='cmp-segment'
                  aria-pressed={age === bucket.id}
                  onClick={() => setAge(bucket.id)}
                >
                  {bucket.label}
                </button>
              )
            )}
          </div>
          <p className='visually-hidden' aria-live='polite'>
            {age ? t(text.found).replace('{n}', String(count)) : ''}
          </p>
        </div>
      )}

      {count === 0 && <p className='cmp-empty'>{t(text.empty)}</p>}

      {flagships.length > 0 && (
        <section className='cmp-group' aria-labelledby='cmp-flagships-title'>
          <SectionHead id='cmp-flagships-title' title={t(ui.flagships)} />
          {flagshipList(flagships, true, true)}
        </section>
      )}

      {directions.length > 0 && (
        <section className='cmp-group' aria-labelledby='cmp-directions-title'>
          <SectionHead id='cmp-directions-title' title={t(ui.directions)} />
          {tileList(directions, true)}
        </section>
      )}
      {panelNode}
    </div>
  )
}
