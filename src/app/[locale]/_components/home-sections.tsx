/**
 * Homepage sections after the hero (TZ §6), in this exact order:
 * Numbers → Competitions → Projects → Trust → News → Partners (logo band
 * + card).
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
import { localize, president, projects, ui, words } from '@/lib/site-content'
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

/** Same caption in every language; only the source name is transliterated. */
const presidentCaption = words(
  'Digital Bridge · 2023 · © Ақорда',
  'Digital Bridge · 2023 · © Акорда',
  'Digital Bridge · 2023 · © Akorda'
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
            sizes='(min-width: 1280px) 400px, (min-width: 768px) 32vw, 92vw'
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

function Projects({ locale }: { locale: string }) {
  return (
    <section
      id='projects'
      className='section home-projects'
      aria-labelledby='projects-title'
    >
      <div className='container'>
        {/* Heading row like Competitions, then three equal cards on one
            baseline: every artwork the same size, text always below. */}
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
            {projects.map((project, i) => (
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
          <article className='home-president' aria-labelledby='president-title'>
            <div className='home-president-media rv' style={order(1)}>
              <picture>
                <source
                  type='image/webp'
                  srcSet={[800, 1200, 1600]
                    .map(w => `/images/home/president-${w}.webp ${w}w`)
                    .join(', ')}
                  sizes='(min-width: 1440px) 750px, (min-width: 1024px) 56vw, 100vw'
                />
                <img
                  src={president.photo}
                  alt={localize(president.alt, locale)}
                  width={6676}
                  height={4684}
                  loading='lazy'
                  decoding='async'
                />
              </picture>
            </div>
            <div className='home-president-body rv' style={order(2)}>
              <h3 id='president-title'>{localize(president.title, locale)}</h3>
              <p className='home-president-text'>
                {localize(president.text, locale)}
              </p>
              <p className='home-president-caption'>
                {localize(presidentCaption, locale)}
              </p>
              <ArrowLink href={president.url} external>
                {localize(president.link, locale)}
                <span className='visually-hidden'> {localize(newTab, locale)}</span>
              </ArrowLink>
            </div>
          </article>
          <div className='rv' style={order(3)}>
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

/** Partner logo band (TZ §6.7) right above the Partners card: the two blue
    blocks sit as a pair — who already supports us, then the invitation. */
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
      <Competitions locale={locale} />
      <Projects locale={locale} />
      <Trust locale={locale} />
      <News locale={locale} />
      <PartnerLogoBand locale={locale} />
      <Partners locale={locale} />
    </>
  )
}
