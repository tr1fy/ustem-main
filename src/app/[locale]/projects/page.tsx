import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import {
  localize,
  projects,
  site,
  ui,
  words,
  type Localized
} from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead } from '../_components/ui'
import { Reveal } from '../_components/reveal'

/*
 * Жобалар / Проекты — TZ §8.3: STEM Hanym (external ↗) + Jasampaz Urpaq.
 * Two large airy cards: the sub-brand artwork framed on brand paper (never
 * full-bleed, so the page stays USTEM's), text below it, the whole card is
 * one link (stretched .card-link). The head closes with one 2px Aral rule.
 */
const text = {
  description: words(
    'USTEM Foundation жобалары: STEM Hanym және Jasampaz Urpaq.',
    'Проекты USTEM Foundation: STEM Hanym и Jasampaz Urpaq.',
    'USTEM Foundation projects: STEM Hanym and Jasampaz Urpaq.'
  ),
  newTab: words('(жаңа бетте ашылады)', '(откроется в новой вкладке)', '(opens in a new tab)')
}

/* Phone artwork made for these covers (public/images/projects/*-mobile.jpg):
   the logo mark only, so it stays legible in a 358px-wide card. */
const mobileCovers: Record<string, { src: string; width: number; height: number }> = {
  'stem-hanym': { src: '/images/projects/stem-hanym-mobile.jpg', width: 1200, height: 900 },
  'jasampaz-urpaq': {
    src: '/images/projects/jasampaz-urpaq-mobile.jpg',
    width: 800,
    height: 1200
  }
}

/* From 768px: the 2:1 covers, as the light WebP sizes the homepage uses
   (5–25 KB) before the 1800px JPEG. Framed width ≈ 536px at 1440. */
const desktopCovers: Record<string, string> = {
  'stem-hanym': [
    '/images/home/stem-hanym-480.webp 480w',
    '/images/home/stem-hanym-960.webp 960w',
    '/images/projects/stem-hanym-cover.jpg 1800w'
  ].join(', '),
  'jasampaz-urpaq': [
    '/images/home/jasampaz-urpaq-480.webp 480w',
    '/images/home/jasampaz-urpaq-960.webp 960w',
    '/images/projects/jasampaz-urpaq-cover.jpg 1800w'
  ].join(', ')
}

// USTEM Academy is a program with its own page, not a project card here.
const items = projects.filter(item => item.slug !== 'academy')

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const title = localize(ui.projectsTitle, locale)
  const description = localize(text.description, locale)
  return {
    title,
    description,
    alternates: alternatesFor(locale, '/projects'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: `/${locale}/projects`,
      locale: htmlLang(locale),
      images: [{ url: '/images/projects/jasampaz-urpaq-cover.jpg', width: 1800, height: 900 }]
    }
  }
}

export default function ProjectsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)

  return (
    <main id='main-content' className='pg-main'>
      <div className='pg-intro pg-intro-plain'>
        <PageHead locale={locale} title={t(ui.projectsTitle)} lead={t(ui.projectsLead)}>
          <span className='pg-head-rule' aria-hidden='true' />
        </PageHead>
      </div>
      <div className='section pg-projects-section'>
        <Reveal className='container pg-stagger'>
          <ul className='pg-projects'>
            {items.map((project, index) => {
              const mobile = mobileCovers[project.slug]
              return (
                <li
                  className='pg-project pg-item'
                  key={project.slug}
                  style={{ '--i': index } as CSSProperties}
                >
                  {project.cover && (
                    <div className='pg-project-media'>
                      <picture>
                        {mobile && (
                          <source
                            media='(max-width: 767px)'
                            srcSet={mobile.src}
                            width={mobile.width}
                            height={mobile.height}
                          />
                        )}
                        <img
                          src={project.cover}
                          srcSet={desktopCovers[project.slug]}
                          sizes='(min-width: 1280px) 540px, (min-width: 768px) 42vw, 100vw'
                          alt=''
                          width={1800}
                          height={900}
                          decoding='async'
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </picture>
                    </div>
                  )}
                  <div className='pg-project-body'>
                    <span className='chip'>{t(project.label)}</span>
                    <h2>
                      {project.external ? (
                        <a
                          className='card-link'
                          href={project.href}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {project.title}
                          <span className='visually-hidden'> {t(text.newTab)}</span>
                        </a>
                      ) : (
                        <Link className='card-link' href={project.href}>
                          {project.title}
                        </Link>
                      )}
                    </h2>
                    <p>{t(project.fact)}</p>
                    <span
                      className={`pg-project-arrow${project.external ? ' is-external' : ''}`}
                      aria-hidden='true'
                    >
                      {project.external ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </main>
  )
}
