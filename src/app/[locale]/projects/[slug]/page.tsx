import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { localize, projects, site, ui, words, type Localized } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead } from '../../_components/ui'
import { Reveal } from '../../_components/reveal'

/*
 * Project page template — TZ §8.3, laid out like /competitions/{slug}:
 * text on the left, a 4:3 cover in a rounded mask on the right (sticky),
 * stacked on phones. The facts read as an airy definition list — Goal,
 * Geography, How to join — each opened by a thin Aral-gradient rule.
 * Only Jasampaz Urpaq has an internal page: STEM Hanym lives on its own
 * website and competition slugs are 301-redirected to /competitions/{slug}
 * in next.config.js.
 * Not rendered until the foundation supplies them (TZ §11, §14 item 7):
 * results, «Қолдауымен» partners, gallery and project news.
 */
const SLUG = 'jasampaz-urpaq'

const cover = {
  src: '/images/projects/jasampaz-urpaq-cover.jpg',
  width: 1800,
  height: 900,
  // Logo-mark artwork for phones (public/images/projects).
  mobile: { src: '/images/projects/jasampaz-urpaq-mobile.jpg', width: 800, height: 1200 }
}

const text = {
  description: words(
    'Jasampaz Urpaq — USTEM Foundation-ның Абай облысындағы жобасы.',
    'Jasampaz Urpaq — проект USTEM Foundation в Абайской области.',
    'Jasampaz Urpaq is a USTEM Foundation project in Abai Region.'
  ),
  goal: words('Мақсаты', 'Цель', 'Goal'),
  geography: words('География', 'География', 'Geography'),
  // Confirmed in TZ §11 (DKNews, 13.02.2026).
  region: words('Абай облысы', 'Абайская область', 'Abai Region'),
  join: words('Қалай қосылуға болады', 'Как присоединиться', 'How to join'),
  joinText: words(
    'Жобаға қосылғыңыз келсе, бізге хат жазыңыз.',
    'Чтобы присоединиться к проекту, напишите нам.',
    'To join the project, write to us.'
  ),
  write: words('Бізге жазу', 'Написать нам', 'Write to us'),
  coverAlt: words(
    'Jasampaz Urpaq жобасының логотипі',
    'Логотип проекта Jasampaz Urpaq',
    'Jasampaz Urpaq project logo'
  )
}

const getProject = (slug: string) =>
  slug === SLUG ? projects.find(item => item.slug === SLUG) : undefined

export function generateStaticParams() {
  return [{ slug: SLUG }]
}

export function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string }
}): Metadata {
  const project = getProject(slug)
  if (!project) return {}
  const description = localize(text.description, locale)
  return {
    title: project.title,
    description,
    alternates: alternatesFor(locale, `/projects/${slug}`),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${project.title} — ${site.name}`,
      description,
      url: `/${locale}/projects/${slug}`,
      locale: htmlLang(locale),
      images: [
        { url: project.cover ?? cover.src, width: cover.width, height: cover.height }
      ]
    }
  }
}

export default function ProjectPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string }
}) {
  const project = getProject(slug)
  if (!project) notFound()
  const t = (value: Localized) => localize(value, locale)
  const rows = [
    { key: 'goal', term: t(text.goal), value: <p>{t(project.fact)}</p> },
    { key: 'geography', term: t(text.geography), value: <p>{t(text.region)}</p> },
    {
      key: 'join',
      term: t(text.join),
      value: (
        <>
          <p>{t(text.joinText)}</p>
          <a
            className='btn btn-primary'
            href={`mailto:${site.email}?subject=Jasampaz%20Urpaq`}
          >
            {t(text.write)}
            <ArrowRightIcon aria-hidden='true' />
          </a>
        </>
      )
    }
  ]

  return (
    <main id='main-content' className='pg-main'>
      <div className='container pg-detail'>
        <PageHead
          locale={locale}
          title={project.title}
          crumbs={[{ href: '/projects', label: t(ui.projectsTitle) }]}
        />

        <div className='pg-detail-media'>
          <picture>
            <source
              media='(max-width: 767px)'
              srcSet={cover.mobile.src}
              width={cover.mobile.width}
              height={cover.mobile.height}
            />
            <img
              src={project.cover ?? cover.src}
              alt={t(text.coverAlt)}
              width={cover.width}
              height={cover.height}
              decoding='async'
              loading='eager'
              fetchPriority='high'
            />
          </picture>
        </div>

        <Reveal className='pg-detail-body pg-stagger'>
          <dl className='pg-defs'>
            {rows.map((row, index) => (
              <div
                className={`pg-def pg-item pg-def-${row.key}`}
                key={row.key}
                style={{ '--i': index } as CSSProperties}
              >
                <dt>{row.term}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </main>
  )
}
