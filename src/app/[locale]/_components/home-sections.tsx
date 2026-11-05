/**
 * Homepage sections after the hero (TZ §6; order revised 2026-10-29):
 * Numbers → Competitions → Academy → Projects → Trust → News → Reports.
 * Trimmed 2026-11-05: no audience row, no testimonials, no partner logo
 * wall (it lives on the Partners page), no support popup.
 * The global footer is the contacts section, so there is no contacts block.
 *
 * Motion: each section's content sits in a <Reveal className='home-rv'>;
 * its direct pieces carry `.rv` and a `--i` index, so they fade up in a
 * short stagger once the section enters the viewport (home.css, "Reveals").
 * Reveal only arms itself after mount and skips reduced motion, so the page
 * always rests fully visible without JS.
 */
import type { CSSProperties } from 'react'
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { imageVariant } from '@/lib/image-variant'
import {
  academyPrograms,
  localize,
  projects,
  homeReportsLimit,
  publicReports,
  reportsText,
  site,
  trustItems,
  ui,
  words
} from '@/lib/site-content'
import CompetitionsShowcase from './competitions-showcase'
import ImpactCard from './impact-card'
import { NewsCard, latestNews } from './news-card'
import ReportsDialog from './reports-dialog'
import { Reveal } from './reveal'
import { ArrowLink, SectionHead } from './ui'

type Project = (typeof projects)[number]

const newTab = words(
  '(жаңа бетте ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

/** Stagger index for `.rv` children (see home.css, "Reveals"). */
const order = (i: number) => ({ '--i': i }) as CSSProperties

/** WebP copies in /public/images/home plus the original, so the artwork
    stays sharp on retina screens; width/height are the original's. */
const projectCovers: Record<
  string,
  { srcSet: string; width: number; height: number }
> = {
  'stem-hanym': {
    srcSet: [
      '/images/home/stem-hanym-480.webp 480w',
      '/images/home/stem-hanym-960.webp 960w',
      '/images/projects/stem-hanym-cover.jpg 1800w'
    ].join(', '),
    width: 1800,
    height: 900
  },
  'jasampaz-urpaq': {
    srcSet: [
      '/images/home/jasampaz-urpaq-480.webp 480w',
      '/images/home/jasampaz-urpaq-960.webp 960w',
      '/images/projects/jasampaz-urpaq-cover.jpg 1800w'
    ].join(', '),
    width: 1800,
    height: 900
  },
  academy: {
    srcSet: [
      '/images/home/ustem-academy-480.webp 480w',
      '/images/home/ustem-academy-800.webp 800w'
    ].join(', '),
    width: 800,
    height: 540
  }
}

function Competitions({ locale }: { locale: string }) {
  return (
    <section
      id='competitions'
      className='section home-competitions'
      aria-labelledby='competitions-title'
    >
      <div className='container'>
        {/* The single «Барлық жарыстар» → /competitions CTA (TZ §6.3); the
            showcase itself repeats no "all competitions" link. */}
        <Reveal className='home-rv'>
          <div className='rv'>
            <SectionHead
              id='competitions-title'
              title={localize(ui.competitionsTitle, locale)}
              action={
                <ArrowLink href='/competitions'>
                  {localize(ui.allCompetitions, locale)}
                </ArrowLink>
              }
            />
          </div>
        </Reveal>
        <CompetitionsShowcase variant='home' />
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  locale
}: {
  project: Project
  locale: string
}) {
  const Arrow = project.external ? ArrowUpRightIcon : ArrowRightIcon
  const label = (
    <>
      {project.title}
      {project.external && (
        <span className='visually-hidden'> {localize(newTab, locale)}</span>
      )}
    </>
  )
  const cover = projectCovers[project.slug]
  return (
    <article className='card home-project'>
      {/* Sub-brand artwork full-bleed in a rounded mask, like the flagship
          competition covers above. */}
      <div className='card-media home-project-media'>
        {project.cover && (
          <img
            src={project.cover}
            srcSet={cover?.srcSet}
            sizes='(min-width: 1280px) 600px, (min-width: 768px) 48vw, 92vw'
            alt=''
            width={cover?.width ?? 1800}
            height={cover?.height ?? 900}
            loading='lazy'
            decoding='async'
          />
        )}
      </div>
      <div className='card-body home-project-body'>
        <span className='chip'>{localize(project.label, locale)}</span>
        <h3 className='home-project-title'>
          {project.external ? (
            <a
              className='card-link'
              href={project.href}
              target='_blank'
              rel='noreferrer'
            >
              {label}
            </a>
          ) : (
            <Link className='card-link' href={project.href}>
              {label}
            </Link>
          )}
        </h3>
        <p>{localize(project.fact, locale)}</p>
        {/* the site-wide "go" circle (same look as on /projects) */}
        <span
          className={`home-project-go${project.external ? ' is-external' : ''}`}
          aria-hidden='true'
        >
          <Arrow />
        </span>
      </div>
    </article>
  )
}

/** USTEM Academy as its own block between Competitions and Projects (the
    order chosen on 2026-10-29): the artwork beside the two programs as
    plain rows — the name with an arrow, one line and the scope — each
    leading to that program on /academy. */
function Academy({ locale }: { locale: string }) {
  const academy = projects.find(project => project.slug === 'academy')
  const cover = projectCovers.academy
  if (!academy) return null
  return (
    <section
      id='academy'
      className='section home-academy'
      aria-labelledby='academy-title'
    >
      <div className='container'>
        <Reveal className='home-rv'>
          <div className='rv' style={order(0)}>
            <SectionHead
              id='academy-title'
              title={academy.title}
              lead={localize(academy.fact, locale)}
              action={
                <ArrowLink href='/academy'>
                  {localize(ui.moreDetails, locale)}
                </ArrowLink>
              }
            />
          </div>
          <div className='home-academy-grid'>
            <div className='home-academy-media rv' style={order(1)}>
              <img
                src={academy.cover}
                srcSet={cover.srcSet}
                sizes='(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 92vw'
                alt=''
                width={cover.width}
                height={cover.height}
                loading='lazy'
                decoding='async'
              />
            </div>
            <ul className='home-academy-list' role='list'>
              {academyPrograms.map((program, i) => (
                <li
                  className='home-academy-item rv'
                  style={order(2 + i)}
                  key={program.slug}
                >
                  <h3 className='home-academy-title'>
                    {/* stretched over the whole row (.card-link) */}
                    <Link
                      className='card-link'
                      href={`/academy#pg-${program.slug}`}
                    >
                      {program.title}
                      <ArrowRightIcon aria-hidden='true' />
                    </Link>
                  </h3>
                  <p className='home-academy-text'>
                    {localize(program.text, locale)}
                  </p>
                  {/* keep «80» and «академиялық» on one line */}
                  <p className='home-academy-meta'>
                    {localize(program.meta, locale).replace(/(\d) /g, '$1\u00a0')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Projects({ locale }: { locale: string }) {
  return (
    <section
      id='projects'
      className='section home-projects'
      aria-labelledby='projects-title'
    >
      <div className='container'>
        {/* Heading row like Competitions, then two equal cards on one
            baseline: every artwork the same size, text always below.
            USTEM Academy has its own block above (Academy). */}
        <Reveal className='home-rv'>
          <div className='rv' style={order(0)}>
            <SectionHead
              id='projects-title'
              title={localize(ui.projectsTitle, locale)}
              lead={localize(ui.projectsLead, locale)}
              action={
                <ArrowLink href='/projects'>
                  {localize(ui.allProjects, locale)}
                </ArrowLink>
              }
            />
          </div>
          <ul className='home-projects-grid' role='list'>
            {projects
              .filter(project => project.slug !== 'academy')
              .map((project, i) => (
                <li className='rv' style={order(i + 1)} key={project.slug}>
                  <ProjectCard project={project} locale={locale} />
                </li>
              ))}
          </ul>
        </Reveal>
        {/* Supporter logos (TZ §6.4) appear here once written consent exists. */}
      </div>
    </section>
  )
}

function Trust({ locale }: { locale: string }) {
  // The newest official mention is the large card, the rest are rows.
  const [feature, ...rest] = trustItems
  return (
    <section
      id='trust'
      className='section section-paper home-trust'
      aria-labelledby='trust-title'
    >
      <div className='container'>
        <Reveal className='home-rv'>
          <div className='rv' style={order(0)}>
            <SectionHead id='trust-title' title={localize(ui.trustTitle, locale)} />
          </div>
          <article
            className='home-president'
            aria-labelledby='trust-feature-title'
          >
            {/* the photo at its own ratio in a rounded mask (never a
                fixed-height crop); WebP sizes from image-variant */}
            <div className='home-president-media rv' style={order(1)}>
              <img
                src={feature.photo.src}
                srcSet={[640, 828, 1080, 1200]
                  .map(w => `${imageVariant(feature.photo.src, w)} ${w}w`)
                  .join(', ')}
                sizes='(min-width: 1440px) 750px, (min-width: 1024px) 56vw, 100vw'
                alt={localize(feature.alt, locale)}
                width={feature.photo.width}
                height={feature.photo.height}
                loading='lazy'
                decoding='async'
              />
            </div>
            <div className='home-president-body rv' style={order(2)}>
              <p className='home-president-meta'>
                {localize(feature.meta, locale)}
              </p>
              <h3 id='trust-feature-title'>
                {localize(feature.title, locale)}
              </h3>
              <p className='home-president-text'>
                {localize(feature.text, locale)}
              </p>
              <ArrowLink href={feature.url} external>
                {localize(feature.link, locale)}
                <span className='visually-hidden'> {localize(newTab, locale)}</span>
              </ArrowLink>
            </div>
          </article>
          {/* The older official mentions as plain rows: a small photo, the
              source and date, the title and its link. No card boxes. */}
          <ul className='trust-more' role='list'>
            {rest.map((item, i) => (
              <li className='trust-item rv' style={order(3 + i)} key={item.key}>
                <div className='trust-thumb'>
                  <img
                    src={item.photo.src}
                    srcSet={`${imageVariant(item.photo.src, 384)} 384w, ${imageVariant(item.photo.src, 640)} 640w`}
                    sizes='(min-width: 768px) 176px, 104px'
                    alt={localize(item.alt, locale)}
                    width={item.photo.width}
                    height={item.photo.height}
                    loading='lazy'
                    decoding='async'
                    style={
                      item.photo.position
                        ? { objectPosition: item.photo.position }
                        : undefined
                    }
                  />
                </div>
                <div className='trust-body'>
                  <p className='trust-meta'>{localize(item.meta, locale)}</p>
                  <h3 className='trust-title'>{localize(item.title, locale)}</h3>
                  <p className='trust-text'>{localize(item.text, locale)}</p>
                  <ArrowLink href={item.url} external>
                    {localize(item.link, locale)}
                    <span className='visually-hidden'> {localize(newTab, locale)}</span>
                  </ArrowLink>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function News({ locale }: { locale: string }) {
  return (
    <section id='news' className='section home-news' aria-labelledby='news-title'>
      <div className='container'>
        <Reveal className='home-rv'>
          <div className='rv' style={order(0)}>
            <SectionHead
              id='news-title'
              title={localize(ui.newsTitle, locale)}
              action={
                <ArrowLink href='/news'>{localize(ui.allNews, locale)}</ArrowLink>
              }
            />
          </div>
          <ul className='home-news-grid'>
            {latestNews(3).map((item, i) => (
              <li className='rv' style={order(i + 1)} key={item.slug}>
                <NewsCard item={item} locale={locale} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/** Public reports: one light-blue block, one white row per report
    (date · title and project · PDF), and a line below on how to ask for
    the rest. Shows the latest `homeReportsLimit`; «Барлық есептер» opens
    the full list. The footer «Есептер» link lands here. */
function Reports({ locale }: { locale: string }) {
  return (
    <section id='reports' className='section home-reports' aria-labelledby='reports-title'>
      <div className='container'>
        <Reveal className='home-rv home-reports-inner'>
          <div className='rv' style={order(0)}>
            <SectionHead
              id='reports-title'
              title={localize(ui.reports, locale)}
              action={<ReportsDialog locale={locale} />}
            />
          </div>
          <div className='rv' style={order(1)}>
            <ul className='home-reports-list'>
              {publicReports.slice(0, homeReportsLimit).map(report => (
                <li key={report.file}>
                  <a
                    className='home-reports-row'
                    href={report.file}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <span className='home-reports-date'>{localize(report.date, locale)}</span>
                    <span className='home-reports-main'>
                      <span className='home-reports-title'>{localize(report.title, locale)}</span>
                      <span className='home-reports-meta'>{localize(report.meta, locale)}</span>
                    </span>
                    <span className='home-reports-file'>
                      {localize(report.note, locale)}
                      <ArrowUpRightIcon aria-hidden='true' />
                    </span>
                    <span className='visually-hidden'> {localize(newTab, locale)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className='home-reports-text'>
              {localize(reportsText, locale)}{' '}
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(localize(ui.reports, locale))}`}>
                {site.email}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function HomeSections({ locale }: { locale: string }) {
  return (
    <>
      <ImpactCard variant='overlap' />
      <Competitions locale={locale} />
      <Academy locale={locale} />
      <Projects locale={locale} />
      <Trust locale={locale} />
      <News locale={locale} />
      <Reports locale={locale} />
    </>
  )
}
