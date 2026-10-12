import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { copy, localize, site, words, type Localized } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead, SectionHead } from '../_components/ui'
import { Reveal } from '../_components/reveal'
import PublicDiscussion from '../_components/public-discussion'

/*
 * USTEM Academy — TZ §8.2. The name is never translated (TZ §5.1).
 * Brand-guideline layout: head with the FLL photo in a rounded mask and an
 * oversized «Academy» wordmark rising behind it; two airy program cards with
 * a partially cropped Aral circle; the «Ашық диалог» table.
 * Program PDFs live in one place — the «Ашық диалог» table (TZ §3, §8.2) —
 * so each program card links down to it instead of repeating the files.
 * Where an application goes (USTEM Connect or a form) is the customer's call
 * (TZ §14 item 8), so the page offers one neutral contact action meanwhile.
 */
const text = {
  lead: words(
    'Педагогтерге арналған робототехниканы сабақта қолдану бағдарламасы.',
    'Программа для педагогов по применению робототехники на уроке.',
    'A program for teachers on using robotics in the classroom.'
  ),
  description: words(
    'USTEM Academy — педагогтерге арналған Robotics Lab және Space Lab бағдарламалары және олардың жария талқылауы.',
    'USTEM Academy — программы Robotics Lab и Space Lab для педагогов и их публичное обсуждение.',
    'USTEM Academy: the Robotics Lab and Space Lab programs for teachers and their public consultation.'
  ),
  programs: words('Бағдарламалар', 'Программы', 'Programs'),
  scope: words('Көлемі', 'Объём', 'Duration'),
  audience: words('Кімге арналған', 'Для кого', 'Who it is for'),
  teachers: words('Педагогтер', 'Педагоги', 'Teachers'),
  documents: words(
    'Бағдарлама құжаттары (PDF)',
    'Документы программы (PDF)',
    'Program documents (PDF)'
  ),
  // TZ §2: «Оставить заявку или связаться по USTEM Academy».
  contact: words(
    'USTEM Academy бойынша байланысу',
    'Связаться по USTEM Academy',
    'Contact USTEM Academy'
  ),
  // Describes only what the frame shows.
  photoAlt: words(
    'Қазақстаннан келген екі қатысушы FIRST LEGO League алаңында роботты баптап жатыр',
    'Две участницы из Казахстана настраивают робота на поле FIRST LEGO League',
    'Two participants from Kazakhstan setting up a robot on a FIRST LEGO League field'
  ),
  caption: words(
    'FIRST LEGO League · Қазақстаннан келген қатысушылар',
    'FIRST LEGO League · участницы из Казахстана',
    'FIRST LEGO League · participants from Kazakhstan'
  )
}

const photo = {
  srcSet: [
    '/images/people/girls-fll-800.webp 800w',
    '/images/people/girls-fll-1085.webp 1085w'
  ].join(', '),
  src: '/images/people/girls-fll-1085.webp',
  width: 1085,
  height: 1628
}

const programs: {
  slug: string
  title: string
  text: Localized
  meta: Localized
}[] = [
  {
    slug: 'robotics-lab',
    title: 'Robotics Lab',
    text: copy.roboticsLabText,
    meta: copy.roboticsLabMeta
  },
  {
    slug: 'space-lab',
    title: 'Space Lab',
    text: copy.spaceLabText,
    meta: copy.spaceLabMeta
  }
]

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const description = localize(text.description, locale)
  return {
    title: 'USTEM Academy',
    description,
    alternates: alternatesFor(locale, '/academy'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `USTEM Academy — ${site.name}`,
      description,
      url: `/${locale}/academy`,
      locale: htmlLang(locale),
      images: [{ url: photo.src, width: photo.width, height: photo.height }]
    }
  }
}

export default function AcademyPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)

  return (
    <main id='main-content' className='pg-main'>
      <div className='pg-intro pg-intro-academy'>
        <div className='container pg-intro-grid'>
          <PageHead locale={locale} title='USTEM Academy' lead={t(text.lead)}>
            <a
              className='btn btn-primary pg-head-action'
              href={`mailto:${site.email}?subject=USTEM%20Academy`}
            >
              {t(text.contact)}
              <ArrowRightIcon aria-hidden='true' />
            </a>
          </PageHead>
          <figure className='pg-intro-media'>
            <div className='pg-word' aria-hidden='true'>
              Academy
            </div>
            <div className='pg-photo pg-photo-tall'>
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes='(min-width: 1280px) 540px, (min-width: 1024px) 42vw, 100vw'
                alt={t(text.photoAlt)}
                width={photo.width}
                height={photo.height}
                loading='eager'
                decoding='async'
                fetchPriority='high'
              />
            </div>
            <figcaption className='pg-caption'>{t(text.caption)}</figcaption>
          </figure>
        </div>
      </div>

      <section className='section' aria-labelledby='pg-programs-title'>
        <div className='container'>
          <SectionHead id='pg-programs-title' title={t(text.programs)} />
          <Reveal className='pg-stagger'>
            <div className='pg-programs'>
              {programs.map((program, index) => (
                <article
                  className='pg-program pg-item'
                  key={program.slug}
                  aria-labelledby={`pg-${program.slug}`}
                  style={{ '--i': index } as CSSProperties}
                >
                  <span className='pg-program-circle' aria-hidden='true' />
                  <h3 id={`pg-${program.slug}`}>{program.title}</h3>
                  <p>{t(program.text)}</p>
                  <dl className='pg-meta'>
                    <div>
                      <dt>{t(text.scope)}</dt>
                      {/* keep "80" and "академических" on one line */}
                      <dd>{t(program.meta).replace(/(\d) /g, '$1\u00a0')}</dd>
                    </div>
                    <div>
                      <dt>{t(text.audience)}</dt>
                      <dd>{t(text.teachers)}</dd>
                    </div>
                  </dl>
                  <a className='link-arrow pg-down' href='#discussion'>
                    {t(text.documents)}
                    <span className='visually-hidden'> — {program.title}</span>
                    <ArrowDownIcon aria-hidden='true' />
                  </a>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <PublicDiscussion locale={locale} />
    </main>
  )
}
