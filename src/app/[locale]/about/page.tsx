import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import {
  copy,
  localize,
  navItems,
  projects,
  site,
  trustItems,
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
  since: words(
    '2020 жылдан бері · More than robots',
    'С 2020 года · More than robots',
    'Since 2020 · More than robots'
  ),
  facts: [
    { value: '2020', label: words('10 ақпанда Алматыда құрылды', 'основан 10 февраля в Алматы', 'founded on 10 February in Almaty') },
    { value: '30+', label: words('инженер, педагог, жаттықтырушы', 'инженеров, педагогов, тренеров', 'engineers, educators and coaches') },
    { value: '1 000+', label: words('өңірлік жарыс өткізілді', 'региональных соревнований', 'regional competitions held') },
    { value: '3', label: words('ел: Қазақстан, Өзбекстан, Қырғызстан', 'страны: Казахстан, Узбекистан, Кыргызстан', 'countries: Kazakhstan, Uzbekistan, Kyrgyzstan') }
  ],
  path: words('Біздің жол', 'Наш путь', 'Our path'),
  pathSteps: [
    {
      year: '2020',
      title: words('Алғашқы чемпионат', 'Первый чемпионат', 'First championship'),
      line: words('3 өңірден 150 команда.', '150 команд из 3 регионов.', '150 teams from 3 regions.')
    },
    {
      year: '2022–2025',
      title: words('FIRST Global Challenge', 'FIRST Global Challenge', 'FIRST Global Challenge'),
      line: words('Қазақстан құрамасы — қатарынан 4 рет әлем чемпионы.', 'Сборная Казахстана — 4 раза подряд чемпион мира.', 'Team Kazakhstan — world champion 4 years in a row.')
    },
    {
      year: '2026',
      title: words('Alem Tech Fest', 'Alem Tech Fest', 'Alem Tech Fest'),
      line: words('Астана, EXPO: 5 000+ қатысушы, 7 ел.', 'Астана, EXPO: 5 000+ участников, 7 стран.', 'Astana, EXPO: 5,000+ participants, 7 countries.')
    }
  ],
  leadership: words('Басшылық', 'Руководство', 'Leadership'),
  leaders: [
    {
      name: words('Асылбек Мырзахметов', 'Асылбек Мырзахметов', 'Asylbek Myrzakhmetov'),
      role: words('Тең құрылтайшы, қор басшысы', 'Сооснователь, руководитель фонда', 'Co-founder, head of the foundation'),
      line: words('FIRST Program Delivery Partner · ҚР робототехника құрамасының жаттықтырушысы', 'FIRST Program Delivery Partner · тренер сборной РК по робототехнике', 'FIRST Program Delivery Partner · coach of the national robotics team')
    },
    {
      name: words('Нұрдәулет Досмағамбет', 'Нурдаулет Досмагамбет', 'Nurdaulet Dosmagambet'),
      role: words('Тең құрылтайшы', 'Сооснователь', 'Co-founder'),
      line: words('FIRST Program Delivery Partner · ҚР робототехника құрамасының жаттықтырушысы', 'FIRST Program Delivery Partner · тренер сборной РК по робототехнике', 'FIRST Program Delivery Partner · coach of the national robotics team')
    }
  ],
  where: words('Қайда жұмыс істейміз', 'Где мы работаем', 'Where we work'),
  countryLines: {
    kz: words('Бас кеңсе — Алматы. FIRST маусымдары, флагман іс-шаралар, USTEM Academy.', 'Головной офис — Алматы. Сезоны FIRST, флагманские события, USTEM Academy.', 'Head office in Almaty. FIRST seasons, flagship events, USTEM Academy.'),
    uz: words('Uzbekistan FIRST Championship — Ташкент, 2027 жылғы ақпан–наурыз.', 'Uzbekistan FIRST Championship — Ташкент, февраль–март 2027.', 'Uzbekistan FIRST Championship — Tashkent, February–March 2027.'),
    kg: words('Scrimmage, Regional және Kyrgyzstan FIRST Championship — Бішкек, 2027 жылғы ақпан.', 'Scrimmage, Regional и Kyrgyzstan FIRST Championship — Бишкек, февраль 2027.', 'Scrimmage, Regional and Kyrgyzstan FIRST Championship — Bishkek, February 2027.')
  } as Record<string, Localized>,
  recognition: words('Ресми мәртебе және мойындау', 'Официальный статус и признание', 'Official status and recognition'),
  orders: [
    {
      meta: words('№ 514 бұйрық · 07.12.2011', 'Приказ № 514 · 07.12.2011', 'Order No. 514 · 07.12.2011'),
      title: words('FIRST Robotics — министрлік ұсынатын олимпиадалар мен жарыстар тізімінде (1–11 сынып).', 'FIRST Robotics — в перечне олимпиад и конкурсов, рекомендованных министерством (1–11 классы).', 'FIRST Robotics is on the ministry’s list of recommended competitions (grades 1–11).'),
      url: 'https://adilet.zan.kz/kaz/docs/V1100007355'
    },
    {
      meta: words('№ 70 бұйрық · 22.01.2016', 'Приказ № 70 · 22.01.2016', 'Order No. 70 · 22.01.2016'),
      title: words('Робототехника және бағдарламалау жинақтары мектеп жабдықтарының нормаларына енгізілген.', 'Наборы по робототехнике и программированию включены в нормы оснащения школ.', 'Robotics and programming kits are included in school equipment standards.'),
      url: ''
    }
  ],
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
  const feature = trustItems.find(item => item.key === 'akorda-2025')
  const academy = projects.find(item => item.slug === 'academy')!
  const directions = [
    {
      href: '/competitions',
      title: t(navLabel('competitions')),
      line: t(text.competitionsLine)
    },
    {
      href: '/academy',
      title: t(text.teacherTraining),
      line: t(academy.fact)
    },
    {
      href: '/projects',
      title: t(navLabel('projects')),
      line: t(ui.projectsLead)
    }
  ]

  return (
    <main id='main-content' className='pg-main'>
      <div className='pg-intro pg-intro-plain pg-v2-intro'>
        <PageHead locale={locale} title={t(navLabel('about'))}>
          <p className='pg-v2-statement'>{t(copy.aboutText)}</p>
          <p className='pg-v2-sub'>{t(text.operator)}</p>
          <p className='pg-since'>{t(text.since)}</p>
        </PageHead>
      </div>

      <section className='pg-v2-band' aria-label={t(text.since)}>
        <div className='container'><dl className='pg-facts'>
          {text.facts.map(fact => (
            <div className='pg-fact' key={fact.value}>
              <dt>{fact.value}</dt>
              <dd>{t(fact.label)}</dd>
            </div>
          ))}
        </dl></div>
      </section>

      <section className='section' aria-labelledby='pg-directions-title'>
        <div className='container pg-v2-split'>
          <div className='pg-v2-split-head'>
            <h2 id='pg-directions-title'>{t(copy.directions)}</h2>
          </div>
          <ol className='pg-v2-rows'>
            {directions.map((item, index) => (
              <li className='pg-v2-row' key={item.href}>
                <span className='pg-v2-num'>0{index + 1}</span>
                <div>
                  <h3>
                    <Link className='card-link' href={item.href}>
                      {item.title}
                    </Link>
                  </h3>
                  <p>{item.line}</p>
                </div>
                <span className='pg-tile-arrow' aria-hidden='true'>
                  <ArrowRightIcon />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className='section section-paper pg-v2-path' aria-labelledby='pg-path-title'>
        <div className='container'>
          <SectionHead id='pg-path-title' title={t(text.path)} />
          <Reveal className='pg-stagger'>
            <ol className='pg-v2-steps'>
              {text.pathSteps.map((step, index) => (
                <li className='pg-v2-step pg-item' key={step.year} style={stagger(index)}>
                  <span className='pg-v2-year'>{step.year}</span>
                  <strong>{t(step.title)}</strong>
                  <span>{t(step.line)}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className='section' aria-labelledby='pg-leaders-title'>
        <div className='container'>
          <SectionHead id='pg-leaders-title' title={t(text.leadership)} />
          <ul className='pg-v2-people'>
            {text.leaders.map(person => (
              <li className='pg-v2-person' key={person.name.en}>
                <div className='pg-v2-portrait' aria-hidden='true'>
                  <span>{t(person.name).split(' ').map(part => part[0]).join('')}</span>
                </div>
                <h3>{t(person.name)}</h3>
                <p className='pg-person-role'>{t(person.role)}</p>
                <p>{t(person.line)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='section' aria-labelledby='pg-where-title'>
        <div className='container pg-v2-split'>
          <div className='pg-v2-split-head'>
            <h2 id='pg-where-title'>{t(text.where)}</h2>
          </div>
          <ul className='pg-v2-rows pg-v2-geo'>
            {site.countries.map(country => (
              <li className='pg-v2-row' key={country.code}>
                <img src={country.flag} alt='' width={40} height={20} />
                <div>
                  <h3>{t(country.name)}</h3>
                  <p>{t(text.countryLines[country.code])}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='section section-paper' aria-labelledby='pg-recog-title'>
        <div className='container'>
          <SectionHead id='pg-recog-title' title={t(text.recognition)} />
          {feature && (
            <article className='home-president pg-v2-feature'>
              <div className='home-president-media'>
                <img
                  src={feature.photo.src}
                  alt={t(feature.alt)}
                  width={feature.photo.width}
                  height={feature.photo.height}
                  loading='lazy'
                  decoding='async'
                  style={feature.photo.position ? { objectPosition: feature.photo.position } : undefined}
                />
              </div>
              <div className='home-president-body'>
                <p className='home-president-meta'>{t(feature.meta)}</p>
                <h3>{t(feature.title)}</h3>
                <p className='home-president-text'>{t(feature.text)}</p>
                <a className='link-arrow' href={feature.url} target='_blank' rel='noreferrer'>
                  {t(feature.link)}
                  <ArrowUpRightIcon aria-hidden='true' />
                </a>
              </div>
            </article>
          )}
          <ul className='pg-recog'>
            {trustItems
              .filter(item => item.key === 'akorda-2023')
              .map(item => (
                <li key={item.key}>
                  <span className='pg-recog-meta'>{t(item.meta)}</span>
                  <a href={item.url} target='_blank' rel='noreferrer'>
                    {t(item.title)}
                    <ArrowUpRightIcon aria-hidden='true' />
                  </a>
                </li>
              ))}
            {text.orders.map(order => (
              <li key={order.meta.en}>
                <span className='pg-recog-meta'>{t(order.meta)}</span>
                {order.url ? (
                  <a href={order.url} target='_blank' rel='noreferrer'>
                    {t(order.title)}
                    <ArrowUpRightIcon aria-hidden='true' />
                  </a>
                ) : (
                  <span>{t(order.title)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

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
