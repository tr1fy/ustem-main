import type { Metadata } from 'next'
import { alternatesFor, htmlLang } from '@/lib/seo'
import {
  flagshipEvents,
  localize,
  navItems,
  site,
  ui,
  words
} from '@/lib/site-content'
import { coverSize } from '../_components/competition-card'
import { PageHead } from '../_components/ui'
import CompetitionsShowcase from '../_components/competitions-showcase'

const pageTitle = navItems.find(item => item.key === 'competitions')!.label

/** Describes only what the photo shows. */
const photoAlt = words(
  'Қазақстандық оқушылар FIRST Tech Challenge роботымен',
  'Школьники из Казахстана с роботом FIRST Tech Challenge',
  'Students from Kazakhstan with a FIRST Tech Challenge robot'
)

/** Transparent cut-out (WebP) in /public/images/people. */
const people = {
  src: '/images/people/ftc-robot-cutout-1391.webp',
  srcSet: [
    '/images/people/ftc-robot-cutout-960.webp 960w',
    '/images/people/ftc-robot-cutout-1391.webp 1391w'
  ].join(', '),
  width: 1391,
  height: 1202
}

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const title = localize(pageTitle, locale)
  const description = localize(ui.competitionsLead, locale)
  const cover = flagshipEvents[0].cover
  const [width, height] = coverSize(cover)
  return {
    title,
    description,
    alternates: alternatesFor(locale, '/competitions'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      locale: htmlLang(locale),
      url: `/${locale}/competitions`,
      images: [{ url: cover, width, height }]
    }
  }
}

/**
 * /competitions — catalogue of 3 flagships + 8 directions (TZ §7.4).
 * The head echoes the homepage hero at a smaller scale: the cut-out FIRST
 * Tech Challenge team stands on the head's baseline in front of a partially
 * cropped Aral circle (one flourish; CSS-only entrance and drift).
 */
export default function CompetitionsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main id='main-content'>
      <div className='cmp-head'>
        <PageHead
          locale={locale}
          title={localize(pageTitle, locale)}
          lead={localize(ui.competitionsLead, locale)}
        >
          <div className='cmp-head-visual'>
            <span className='cmp-head-circle' aria-hidden='true' />
            <img
              className='cmp-head-people'
              src={people.src}
              srcSet={people.srcSet}
              sizes='(min-width: 1024px) 44vw, (min-width: 768px) 520px, 92vw'
              alt={localize(photoAlt, locale)}
              width={people.width}
              height={people.height}
              loading='eager'
              decoding='async'
              fetchPriority='high'
            />
          </div>
        </PageHead>
      </div>
      <div className='container section cmp-catalog'>
        <CompetitionsShowcase variant='catalog' />
      </div>
    </main>
  )
}
