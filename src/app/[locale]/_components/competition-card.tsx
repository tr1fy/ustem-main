import type { MouseEvent } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { imageVariant } from '@/lib/image-variant'
import { localize, ui, type Localized, type SiteEvent } from '@/lib/site-content'

/**
 * Competition card (TZ §6.3, §7.4) in the brand-guideline style. Flagship:
 * the photo sits in a rounded mask, the title and one-liner sit BELOW it,
 * and a small arrow-in-circle signals the action. Tile: the same markup
 * laid over the photo (competitions.css), for the directions bento. The title is a real
 * <a href="/{locale}/competitions/{slug}"> stretched over the whole card, so
 * it works without JS, with modifier keys and for SEO. A plain click is
 * intercepted by `onOpen` to show the competition panel.
 */

/** Intrinsic sizes of the covers in /public, for width/height attributes. */
const coverSizes: Record<string, [number, number]> = {
  '/images/projects/almaty-tech-cup-cover.jpg': [1800, 900],
  '/images/projects/alem-tech-fest-cover.jpg': [1800, 900],
  '/images/competitions/first-robotics.jpg': [1600, 881],
  '/images/competitions/alem-drone-league.jpg': [1600, 899],
  '/images/competitions/wso.jpg': [1591, 1356],
  '/images/competitions/future-race.jpg': [1600, 1066],
  '/images/competitions/battle-of-bots.jpg': [1600, 1066],
  '/images/competitions/robocup.jpg': [1473, 982],
  '/images/competitions/abu-robocon.jpg': [1614, 982],
  '/images/competitions/digital-bridge-2026.jpg': [1266, 792],
  '/images/competitions/digital-bridge-2026-poster.jpg': [1200, 675]
}

export const coverSize = (src: string): [number, number] =>
  coverSizes[src] || [1600, 1000]

/**
 * Responsive covers (TZ §10: WebP + srcset). The variants come from Next's
 * built-in image optimizer (/_next/image), or from files pre-rendered for the
 * static build (lib/image-variant.ts); `w` must be one of the optimizer's
 * default device/image sizes. The original JPEG stays as `src`, so
 * width/height and the OG image are unchanged.
 */
const variantWidths = {
  /** Bento photo tiles: half / full phone width, up to ~520px on desktop. */
  tile: [384, 640, 828, 1080],
  /** Flagship cards, panel and page covers. */
  wide: [640, 828, 1080, 1200]
} as const

export function coverImage(
  src: string,
  variant: keyof typeof variantWidths,
  sizes: string
) {
  const [width, height] = coverSize(src)
  const srcSet = variantWidths[variant]
    .filter(w => w <= width)
    .map(w => `${imageVariant(src, w)} ${w}w`)
    .join(', ')
  return { src, srcSet, sizes, width, height }
}

const tileSizes = '(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 100vw'
const flagshipSizes = '(min-width: 768px) 50vw, 100vw'

export type OpenCompetition = (
  event: MouseEvent<HTMLAnchorElement>,
  slug: string
) => void

/** Age / format / season values that the foundation has filled in (TZ §7.3). */
export function eventFacts(event: SiteEvent) {
  const facts: { key: string; label: Localized; value: Localized }[] = []
  if (event.age) facts.push({ key: 'age', label: ui.age, value: event.age })
  if (event.format)
    facts.push({ key: 'format', label: ui.format, value: event.format })
  if (event.season)
    facts.push({ key: 'season', label: ui.season, value: event.season })
  return facts
}

export function CompetitionCard({
  event,
  locale,
  size,
  onOpen,
  details = false,
  priority = false
}: {
  event: SiteEvent
  locale: string
  size: 'flagship' | 'tile'
  onOpen?: OpenCompetition
  /**
   * Catalogue cards (TZ §7.4) also show format, season and the confirmed
   * edition line. Homepage previews (TZ §6.3) stay at title + one line.
   */
  details?: boolean
  /**
   * The LCP candidate (first flagship on /competitions): load eagerly with
   * high fetch priority. Everything else stays lazy.
   */
  priority?: boolean
}) {
  const image = coverImage(
    event.cover,
    size === 'flagship' ? 'wide' : 'tile',
    size === 'flagship' ? flagshipSizes : tileSizes
  )
  // Homepage tiles stay at title + one line; ages live in the catalogue.
  const facts = details ? eventFacts(event) : []
  return (
    <article className={`cmp-card cmp-card--${size}`}>
      <div className='cmp-card-media'>
        <img
          {...image}
          alt=''
          loading={priority ? 'eager' : 'lazy'}
          decoding='async'
          fetchPriority={priority ? 'high' : undefined}
          style={
            event.coverPosition
              ? { objectPosition: event.coverPosition }
              : undefined
          }
        />
      </div>
      <div className='cmp-card-body'>
        <h3 className='cmp-card-title'>
          <Link
            className='cmp-card-link'
            href={`/competitions/${event.slug}`}
            data-cmp-slug={event.slug}
            onClick={onOpen ? click => onOpen(click, event.slug) : undefined}
          >
            {event.title}
          </Link>
        </h3>
        <p className='cmp-card-fact'>{localize(event.fact, locale)}</p>
        {size === 'flagship' && event.next && (
          <p className='cmp-card-next'>
            <strong>{localize(ui.nextEdition, locale)}:</strong>{' '}
            {localize(event.next, locale)}
          </p>
        )}
        {details && size === 'flagship' && event.meta && (
          <p className='cmp-card-meta'>{localize(event.meta, locale)}</p>
        )}
        {facts.length > 0 && size === 'flagship' && (
          <ul className='cmp-chips' role='list'>
            {facts.map(fact => (
              <li key={fact.key} className='chip'>
                <span className='cmp-chip-key'>
                  {localize(fact.label, locale)}
                </span>
                {localize(fact.value, locale)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Photo tiles: the facts sit in the top corner, away from the title
          and line at the bottom, so a long age never covers them. */}
      {facts.length > 0 && size === 'tile' && (
        <ul className='cmp-chips cmp-card-tags' role='list'>
          {facts.map(fact => (
            <li key={fact.key} className='chip'>
              <span className='visually-hidden'>
                {localize(fact.label, locale)}:{' '}
              </span>
              {localize(fact.value, locale)}
            </li>
          ))}
        </ul>
      )}
      {/* Decorative: the stretched title link is the real target. */}
      <span className='cmp-card-go' aria-hidden='true'>
        <ArrowRightIcon />
      </span>
    </article>
  )
}
