/**
 * NewsCard: cover, category, date, title (TZ §6.6, §8.4).
 * Brand style: the cover sits in a rounded mask with a small arrow badge;
 * the category chip, date and title sit BELOW it on the page.
 * Server-compatible (no hooks), so the homepage, /news, competition and
 * article pages can all render it. The title is the card's single
 * stretched link. `featured` (the newest item on /news) adds the summary;
 * from 1024px its cover keeps one grid column and the text takes two.
 */
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { imageVariant } from '@/lib/image-variant'
import {
  formatDate,
  localize,
  news,
  ui,
  words,
  type Localized,
  type NewsCategory
} from '@/lib/site-content'

export type NewsItem = (typeof news)[number]

const pressRelease = words('Баспасөз хабарламасы', 'Пресс-релиз', 'Press release')

export const categoryLabels: Record<NewsCategory, Localized> = {
  foundation: ui.newsFoundation,
  media: ui.newsMedia,
  'press-release': pressRelease
}

const opensInNewTab = words(
  '(жаңа қойындыда ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

/* Intrinsic sizes of the news photos (unknown files fall back to 16:10). */
const imageSizes: Record<string, [number, number]> = {
  '/images/panama.jpg': [1600, 900],
  '/images/robocon.jpg': [1280, 960],
  '/images/selection.jpg': [1280, 854],
  '/images/forbes-30-under-30-ermatov.jpg': [1190, 1684],
  '/images/fgc-2026-team.jpg': [1360, 768],
  '/images/competitions/digital-bridge-2026.jpg': [1266, 792]
}
/* Widths must be in Next's default device/image sizes, or /_next/image
   answers 400 (480 is not one of them; see lib/image-variant.ts). */
const variantWidths = {
  card: [384, 640, 828, 1080],
  wide: [640, 828, 1080, 1200]
} as const

/** Card slots: 3 columns from 1024px (≈405px max), 2 from 768px, else full. */
export const cardSizes =
  '(min-width: 1280px) 405px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw'

/**
 * Responsive news image (TZ §10): WebP variants from Next's optimizer, the
 * original file as `src` and as the largest candidate. SVGs are served as is.
 */
export function newsImage(
  src: string,
  variant: keyof typeof variantWidths,
  sizes: string
) {
  const [width, height] = imageSizes[src] || [1280, 800]
  if (src.endsWith('.svg')) return { src, width, height }
  const srcSet = [
    ...variantWidths[variant]
      .filter(w => w < width)
      .map(w => `${imageVariant(src, w)} ${w}w`),
    `${src} ${width}w`
  ].join(', ')
  return { src, srcSet, sizes, width, height }
}

/** Media coverage lives on the publisher's site (TZ §6.6). */
export const isExternalNews = (item: NewsItem) => item.category === 'media'

export function NewsCard({
  item,
  locale,
  featured = false
}: {
  item: NewsItem
  locale: string
  featured?: boolean
}) {
  const title = localize(item.title, locale)
  const external = isExternalNews(item)
  const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon
  return (
    <article className={`card nws-card${featured ? ' nws-card--featured' : ''}`}>
      <div className='card-media nws-card-media'>
        {/* Decorative: the title link below already names the card (TZ §9.3). */}
        <img
          {...newsImage(item.image, 'card', cardSizes)}
          alt=''
          loading={featured ? 'eager' : 'lazy'}
          decoding='async'
          style={
            item.imagePosition
              ? { objectPosition: item.imagePosition }
              : undefined
          }
        />
        <span className='nws-card-go' aria-hidden='true'>
          <Arrow />
        </span>
      </div>
      <div className='card-body nws-card-body'>
        <p className='nws-card-meta'>
          <span className='chip nws-chip'>
            {localize(categoryLabels[item.category], locale)}
          </span>
          <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
        </p>
        <h3 className='nws-card-title'>
          {external ? (
            <a
              className='card-link'
              href={item.source}
              target='_blank'
              rel='noreferrer'
            >
              {title}
              <span className='visually-hidden'>
                {' '}
                {localize(opensInNewTab, locale)}
              </span>
            </a>
          ) : (
            <Link className='card-link' href={`/news/${item.slug}`}>
              {title}
            </Link>
          )}
        </h3>
        {featured && (
          <p className='nws-card-text'>{localize(item.text, locale)}</p>
        )}
      </div>
    </article>
  )
}

/** Newest first. */
export const latestNews = (limit?: number) =>
  [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
