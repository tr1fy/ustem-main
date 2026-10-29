/**
 * Homepage sections after the hero (TZ §6; order revised 2026-10-29):
 * Numbers → Audiences → Competitions → Academy → Projects → Trust →
 * Partner logos → News → Partners card.
 * The partner logo band follows Trust (who stands behind the foundation),
 * so the page no longer ends on three blue blocks in a row (logo band,
 * Partners card, footer).
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
  audiences,
  localize,
  projects,
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
import PartnerLogos from './partner-logos'
import { Reveal } from './reveal'
import Squircle from './squircle'
import Testimonials from './testimonials'
import { ArrowLink, SectionHead } from './ui'

type Project = (typeof projects)[number]

const newTab = words(
  '(жаңа бетте ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

/** The Partners card photo: Team Kazakhstan tossing a teammate at the
    FIRST Championship in Houston (houston306). */
const partnersPhotoAlt = words(
  'Қазақстан командасы Хьюстондағы FIRST Championship жарысында командаласын аспанға лақтырып жатыр',
  'Команда Казахстана подбрасывает товарища на FIRST Championship в Хьюстоне',
  'Team Kazakhstan tossing a teammate into the air at the FIRST Championship in Houston'
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

/** One photo, two layers: the right panel shows it, and the same src masked
    to the tossed boy and the raised hands (houston-toss-mask, same canvas)
    lets him fly out over the blue half. */
const partnersPhoto = {
  src: '/images/people/houston-toss-1886.webp',
  srcSet: [
    '/images/people/houston-toss-1000.webp 1000w',
    '/images/people/houston-toss-1886.webp 1886w'
  ].join(', '),
  /* home.css: 1184px on desktop, 159cqw of the card below 1024px */
  sizes: '(min-width: 1024px) 1184px, 160vw',
  width: 1886,
  height: 1472
}

/** «Who it is for»: one plain row of four entry points under the numbers —
    a title, one line and a small arrow each, split by hairlines. No cards
    and no icons, so it reads as an index rather than another block. */
function Audiences({ locale }: { locale: string }) {
  return (
    <section className='section home-audiences' aria-labelledby='audiences-title'>
      <div className='container'>
        <h2 id='audiences-title' className='visually-hidden'>
          {localize(ui.audiencesTitle, locale)}
        </h2>
        <Reveal className='home-rv'>
          <ul className='aud-list' role='list'>
            {audiences.map((item, i) => (
              <li className='rv' style={order(i)} key={item.key}>
                <Link className='aud-link' href={item.href}>
                  <span className='aud-title'>
                    {localize(item.title, locale)}
                    <ArrowRightIcon aria-hidden='true' />
                  </span>
                  <span className='aud-text'>{localize(item.text, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
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
          <div className='rv' style={order(3 + rest.length)}>
            <Testimonials />
          </div>
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

/** Partner logo band (TZ §6.7) right after Trust: the President, the
    testimonials, then the organisations that support the foundation. */
function PartnerLogoBand({ locale }: { locale: string }) {
  return (
    <section
      id='partner-logos'
      className='section home-logos'
      aria-labelledby='partner-logos-title'
    >
      <div className='container'>
        <Reveal className='home-rv'>
          <div className='rv'>
            <PartnerLogos locale={locale} id='partner-logos-title' />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Public reports (moved here from the About page on 2026-10-29): the
    published PDFs and how to ask for the rest. The last content block
    before the partners call to action; the footer «Есептер» link lands here. */
function Reports({ locale }: { locale: string }) {
  return (
    <section id='reports' className='section home-reports' aria-labelledby='reports-title'>
      <div className='container'>
        <Reveal className='home-rv home-reports-inner'>
          <div className='rv' style={order(0)}>
            <SectionHead id='reports-title' title={localize(ui.reports, locale)} />
          </div>
          <div className='rv home-reports-body' style={order(1)}>
            <ul className='home-reports-list'>
              {publicReports.map(report => (
                <li key={report.file}>
                  <span className='home-reports-meta'>{localize(report.meta, locale)}</span>
                  <a
                    className='link-arrow is-external'
                    href={report.file}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {localize(report.title, locale)}
                    <ArrowUpRightIcon aria-hidden='true' />
                  </a>
                  <span className='home-reports-note'>{localize(report.note, locale)}</span>
                </li>
              ))}
            </ul>
            <p className='home-reports-text'>{localize(reportsText, locale)}</p>
            <a
              className='link-arrow'
              href={`mailto:${site.email}?subject=${encodeURIComponent(localize(ui.reports, locale))}`}
            >
              {site.email}
              <ArrowRightIcon aria-hidden='true' />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Partners({ locale }: { locale: string }) {
  const photo = (cutout: boolean) => (
    <img
      className={`home-partners-img${cutout ? ' home-partners-cutout' : ''}`}
      src={partnersPhoto.src}
      srcSet={partnersPhoto.srcSet}
      sizes={partnersPhoto.sizes}
      alt={cutout ? '' : localize(partnersPhotoAlt, locale)}
      aria-hidden={cutout ? true : undefined}
      width={partnersPhoto.width}
      height={partnersPhoto.height}
      loading='lazy'
      decoding='async'
    />
  )
  return (
    <section
      id='partners'
      className='section home-partners'
      aria-labelledby='partners-title'
    >
      <div className='container'>
        <Reveal className='home-rv home-partners-shadow'>
          <Squircle className='home-partners-card rv'>
            <div className='home-partners-copy'>
              <h2 id='partners-title'>{localize(ui.partnersTitle, locale)}</h2>
              <p>{localize(ui.partnersText, locale)}</p>
              <Link className='btn home-partners-cta' href='/partners'>
                {localize(ui.becomePartner, locale)}
                <ArrowRightIcon aria-hidden='true' />
              </Link>
            </div>
            <div className='home-partners-photo'>
              <div className='home-partners-frame'>{photo(false)}</div>
              {photo(true)}
            </div>
          </Squircle>
        </Reveal>
      </div>
    </section>
  )
}

export default function HomeSections({ locale }: { locale: string }) {
  return (
    <>
      <ImpactCard variant='overlap' />
      <Audiences locale={locale} />
      <Competitions locale={locale} />
      <Academy locale={locale} />
      <Projects locale={locale} />
      <Trust locale={locale} />
      <PartnerLogoBand locale={locale} />
      <News locale={locale} />
      <Reports locale={locale} />
      <Partners locale={locale} />
    </>
  )
}
