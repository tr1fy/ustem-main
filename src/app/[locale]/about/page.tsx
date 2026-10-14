import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import {
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  LightBulbIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import {
  copy,
  localize,
  navItems,
  projects,
  publishedMetrics,
  site,
  ui,
  words,
  type Localized
} from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead, SectionHead } from '../_components/ui'
import { Reveal } from '../_components/reveal'

/*
 * Біз туралы / О нас — TZ §8.1, brand-guideline layout:
 *   head       — mission beside the Team Kazakhstan photo (rounded mask) with
 *                one partially covered Aral circle behind it
 *   directions — three airy tiles (icon in a tint circle, arrow)
 *   milestones — 2022–2025 timeline from the verified metric + note + source
 *                (not the full ImpactCard: it already lives on / and /partners)
 *   #reports   — reports and documents on request (the footer link target)
 * Not rendered until the foundation supplies the data (TZ §14 item 9):
 * leadership message, team grid and the yearly report PDFs.
 */
const text = {
  description: words(
    'USTEM Foundation миссиясы, қызмет бағыттары және 2022–2025 жылдардағы жеңістері.',
    'Миссия USTEM Foundation, направления работы и победы 2022–2025 годов.',
    'USTEM Foundation’s mission, areas of work and 2022–2025 victories.'
  ),
  // Verified fact, TZ §1 and §11. It also states the geography (TZ §8.1).
  operator: words(
    'Қор — FIRST бағдарламаларының Қазақстан, Өзбекстан және Қырғызстандағы ресми операторы.',
    'Фонд — официальный оператор программ FIRST в Казахстане, Узбекистане и Кыргызстане.',
    'The foundation is the official operator of FIRST programs in Kazakhstan, Uzbekistan and Kyrgyzstan.'
  ),
  competitionsLine: words(
    'Үш флагман іс-шара және сегіз жарыс бағыты.',
    'Три флагманских события и восемь направлений.',
    'Three flagship events and eight competition tracks.'
  ),
  teacherTraining: words('Педагогтерді оқыту', 'Обучение педагогов', 'Teacher training'),
  milestones: words(
    'Негізгі белестер 2022–2025',
    'Ключевые вехи 2022–2025',
    'Milestones 2022–2025'
  ),
  reportsText: words(
    'Қордың есептері мен құжаттары сұрау бойынша беріледі — бізге хат жазыңыз.',
    'Отчёты и документы фонда предоставляются по запросу — напишите нам.',
    'The foundation’s reports and documents are available on request — write to us.'
  ),
  newTab: words(
    '(жаңа бетте ашылады)',
    '(откроется в новой вкладке)',
    '(opens in a new tab)'
  )
}

const photo = {
  srcSet: [
    '/images/people/team-fll-800.webp 800w',
    '/images/people/team-fll-1600.webp 1600w'
  ].join(', '),
  src: '/images/people/team-fll-1600.webp',
  width: 1600,
  height: 1331
}

const navLabel = (key: (typeof navItems)[number]['key']) =>
  navItems.find(item => item.key === key)!.label

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

/** Stagger index for the reveal cascade (pages.css, `.pg-item`). */
const stagger = (index: number) => ({ '--i': index }) as CSSProperties

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const title = localize(navLabel('about'), locale)
  const description = localize(text.description, locale)
  return {
    title,
    description,
    alternates: alternatesFor(locale, '/about'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: `/${locale}/about`,
      locale: htmlLang(locale),
      images: [{ url: photo.src, width: photo.width, height: photo.height }]
    }
  }
}

export default function AboutPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)
  const academy = projects.find(item => item.slug === 'academy')!
  const directions = [
    {
      href: '/competitions',
      icon: TrophyIcon,
      title: t(navLabel('competitions')),
      line: t(text.competitionsLine)
    },
    {
      href: '/academy',
      icon: AcademicCapIcon,
      title: t(text.teacherTraining),
      line: t(academy.fact)
    },
    {
      href: '/projects',
      icon: LightBulbIcon,
      title: t(navLabel('projects')),
      line: t(ui.projectsLead)
    }
  ]
  const champions = publishedMetrics.find(item => item.id === 'world-champions')
  const timeline = champions?.timeline ?? []
  const source = champions?.source

  return (
    <main id='main-content' className='pg-main'>
      <div className='pg-intro pg-intro-about'>
        <div className='container pg-intro-grid'>
          <PageHead
            locale={locale}
            title={t(navLabel('about'))}
            lead={`${t(copy.aboutText)} ${t(text.operator)}`}
          />
          <figure className='pg-intro-media'>
            <div className='pg-orb' aria-hidden='true'>
              <div className='pg-circle' />
            </div>
            <div className='pg-photo pg-photo-wide'>
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes='(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 100vw'
                alt={t(ui.heroPhotoAlt)}
                width={photo.width}
                height={photo.height}
                loading='eager'
                decoding='async'
                fetchPriority='high'
              />
            </div>
            <figcaption className='pg-caption'>{t(ui.heroCaption)}</figcaption>
          </figure>
        </div>
      </div>

      <section className='section' aria-labelledby='pg-directions-title'>
        <div className='container'>
          <SectionHead id='pg-directions-title' title={t(copy.directions)} />
          <Reveal className='pg-stagger'>
            <ul className='pg-tiles'>
              {directions.map(({ icon: Icon, ...item }, index) => (
                <li className='pg-tile pg-item' key={item.href} style={stagger(index)}>
                  <span className='pg-tile-icon' aria-hidden='true'>
                    <Icon />
                  </span>
                  <h3>
                    <Link className='card-link' href={item.href}>
                      {item.title}
                    </Link>
                  </h3>
                  <p>{item.line}</p>
                  <span className='pg-tile-arrow' aria-hidden='true'>
                    <ArrowRightIcon />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {champions && timeline.length > 0 && (
        <section
          className='section section-paper pg-milestones'
          aria-labelledby='pg-milestones-title'
        >
          <div className='container'>
            <SectionHead
              id='pg-milestones-title'
              title={t(text.milestones)}
              lead={capitalize(t(champions.label))}
            />
            <Reveal className='pg-stagger'>
              <ol className='pg-timeline'>
                {timeline.map((step, index) => (
                  <li className='pg-step pg-item' key={step.year} style={stagger(index)}>
                    <span className='pg-step-year'>{step.year}</span>
                    <span className='pg-step-place'>{t(step.place)}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <div className='pg-milestones-foot'>
              {champions.note && <p className='pg-note'>{t(champions.note)}</p>}
              {source && (
                <p className='pg-source'>
                  {t(ui.source)}: {t(source.label)} ·{' '}
                  <a href={source.url} target='_blank' rel='noreferrer'>
                    {hostOf(source.url)}
                    <ArrowUpRightIcon aria-hidden='true' />
                    <span className='visually-hidden'> {t(text.newTab)}</span>
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section id='reports' className='section pg-reports' aria-labelledby='pg-reports-title'>
        <Reveal className='container pg-reports-inner'>
          <h2 id='pg-reports-title'>{t(ui.reports)}</h2>
          <div className='pg-reports-body'>
            <p>{t(text.reportsText)}</p>
            <a
              className='link-arrow'
              href={`mailto:${site.email}?subject=${encodeURIComponent(t(ui.reports))}`}
            >
              {site.email}
              <ArrowRightIcon aria-hidden='true' />
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
