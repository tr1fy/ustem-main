import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { alternatesFor, htmlLang, siteUrl } from '@/lib/seo'
import {
  eventBySlug,
  events,
  localize,
  navItems,
  site,
  ui,
  words,
  type SiteEvent
} from '@/lib/site-content'
import { coverImage, coverSize } from '../../_components/competition-card'
import CompetitionDetail from '../../_components/competition-detail'
import { StaggerReveal } from '../../_components/competitions-showcase'
import { NewsCard, latestNews } from '../../_components/news-card'
import { SectionHead } from '../../_components/ui'

const text = {
  breadcrumb: words('Навигация жолы', 'Хлебные крошки', 'Breadcrumb'),
  others: words('Басқа жарыстар', 'Другие соревнования', 'Other competitions'),
  spaceLab: words(
    'Педагогтерге арналған Space Lab бағдарламасы:',
    'Программа Space Lab для педагогов:',
    'Space Lab program for teachers:'
  )
}
const catalogLabel = navItems.find(item => item.key === 'competitions')!.label

/**
 * Dates and venues of the last flagship editions, as ISO values for the
 * schema.org Event markup (TZ §10). They restate the verified facts already
 * published in each event's `detail`/`meta` (TZ §7.1); move them into
 * site-content once the content model gets date fields.
 */
const editions: Record<
  string,
  { start: string; end: string; venue: string; city: string }
> = {
  'almaty-techcup': {
    start: '2026-06-30',
    end: '2026-07-01',
    venue: 'Almaty Arena',
    city: 'Almaty'
  },
  'alem-tech-fest': {
    start: '2026-02-11',
    end: '2026-02-13',
    venue: 'EXPO',
    city: 'Astana'
  }
}

function eventJsonLd(event: SiteEvent, locale: string) {
  const edition = editions[event.slug]
  if (!edition) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: localize(event.detail, locale),
    url: `${siteUrl}/${locale}/competitions/${event.slug}`,
    image: [`${siteUrl}${event.cover}`],
    inLanguage: htmlLang(locale),
    startDate: edition.start,
    endDate: edition.end,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: edition.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: edition.city,
        addressCountry: 'KZ'
      }
    },
    organizer: { '@type': 'Organization', name: site.name, url: siteUrl }
  }
}

type Params = { params: { locale: string; slug: string } }

export function generateStaticParams() {
  return events.map(({ slug }) => ({ slug }))
}

export function generateMetadata({ params: { locale, slug } }: Params): Metadata {
  const event = eventBySlug(slug)
  if (!event) return {}
  const description = localize(event.fact, locale)
  const [width, height] = coverSize(event.cover)
  return {
    title: event.title,
    description,
    alternates: alternatesFor(locale, `/competitions/${slug}`),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${event.title} — ${site.name}`,
      description,
      locale: htmlLang(locale),
      url: `/${locale}/competitions/${slug}`,
      images: [{ url: event.cover, width, height }]
    }
  }
}

/** Full competition page (TZ §7.2 direct visit, §7.3). */
export default function CompetitionPage({ params: { locale, slug } }: Params) {
  const event = eventBySlug(slug)
  if (!event) notFound()
  const t = (value: Parameters<typeof localize>[0]) => localize(value, locale)
  const cover = coverImage(event.cover, 'wide', '(min-width: 1024px) 40vw, 100vw')
  // TZ §7.3: related news are matched automatically by their tag.
  const related = latestNews()
    .filter(item => item.tag === event.title)
    .slice(0, 3)
  const others = events.filter(item => item.slug !== event.slug)
  const jsonLd = eventJsonLd(event, locale)
  return (
    <main id='main-content'>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
          }}
        />
      )}
      <div className='container cmp-page'>
        <nav aria-label={t(text.breadcrumb)}>
          <ol className='breadcrumbs'>
            <li>
              <Link href='/'>{t(ui.home)}</Link>
            </li>
            <li>
              <Link href='/competitions'>{t(catalogLabel)}</Link>
            </li>
          </ol>
        </nav>
        <div className='cmp-page-grid'>
          <div className='cmp-page-main'>
            <CompetitionDetail event={event} locale={locale} mode='page' />
            {event.slug === 'world-space-olympiad' && (
              <p className='cmp-page-note'>
                {t(text.spaceLab)} <Link href='/academy'>USTEM Academy</Link>
              </p>
            )}
          </div>
          <div className='cmp-page-media'>
            {/* One flourish: an Aral circle peeking out behind the cover. */}
            <span className='cmp-page-circle' aria-hidden='true' />
            <div className='cmp-page-cover'>
              {/* The H1 already names the event, so the photo is decorative. */}
              <img
                {...cover}
                alt=''
                loading='eager'
                fetchPriority='high'
                decoding='async'
                style={
                  event.coverPosition
                    ? { objectPosition: event.coverPosition }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className='container cmp-related' aria-labelledby='cmp-news-title'>
          <SectionHead id='cmp-news-title' title={t(ui.newsTitle)} />
          <ul className='cmp-news-grid' role='list'>
            {related.map(item => (
              <li key={item.slug}>
                <NewsCard item={item} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        className='section section-paper cmp-others'
        aria-labelledby='cmp-others-title'
      >
        <div className='container'>
          <SectionHead id='cmp-others-title' title={t(text.others)} />
          <StaggerReveal>
            <ul className='cmp-others-list' role='list'>
              {others.map((item, index) => (
                <li
                  key={item.slug}
                  style={{ '--i': index } as CSSProperties}
                >
                  <Link
                    className='cmp-other'
                    href={`/competitions/${item.slug}`}
                  >
                    <span className='cmp-other-thumb'>
                      <img
                        {...coverImage(item.cover, 'tile', '64px')}
                        alt=''
                        loading='lazy'
                        decoding='async'
                        style={
                          item.coverPosition
                            ? { objectPosition: item.coverPosition }
                            : undefined
                        }
                      />
                    </span>
                    <span className='cmp-other-name'>{item.title}</span>
                    <span className='cmp-other-go' aria-hidden='true'>
                      <ArrowRightIcon />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerReveal>
        </div>
      </section>
    </main>
  )
}
