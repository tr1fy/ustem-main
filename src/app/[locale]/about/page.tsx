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
import { publicReports, reportsText } from '@/lib/site-content'

/*
 * Біз туралы / О нас — the site's own style, structured like a large
 * company's About page (owner's brief of 2026-10-29):
 *   intro       — title and the mission as a short statement
 *   facts band  — four figures on the Aral gradient
 *   directions  — three numbered rows with links
 *   path        — 2020 → 2022–2025 → 2026
 *   leadership  — the two co-founders
 *   team        — photo and a short text
 *   recognition — Akorda mentions (trustItems) and the ministry orders
 *   join        — USTEM Connect and the partners page
 * Reports live at the bottom of the home page (#reports).
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
  since: words(
    '2020 жылдан бері · More than robots',
    'С 2020 года · More than robots',
    'Since 2020 · More than robots'
  ),
  facts: [
    { value: '2020', label: words('10 ақпанда Алматыда құрылды', 'основан 10 февраля в Алматы', 'founded on 10 February in Almaty') },
    { value: '1 000+', label: words('өңірлік жарыс өткізілді', 'региональных соревнований', 'regional competitions held') },
    { value: '3', label: words('ел: Қазақстан, Өзбекстан, Қырғызстан', 'страны: Казахстан, Узбекистан, Кыргызстан', 'countries: Kazakhstan, Uzbekistan, Kyrgyzstan') },
    { value: '4×', label: words('FIRST Global Challenge әлем чемпионы, 2022–2025', 'чемпион мира FIRST Global Challenge, 2022–2025', 'FIRST Global Challenge world champion, 2022–2025') }
  ],
  path: words('Біздің жол', 'Наш путь', 'Our path'),
  pathSteps: [
    { year: '2020', title: words('Алғашқы чемпионат', 'Первый чемпионат', 'First championship'), line: words('3 өңірден 150 команда.', '150 команд из 3 регионов.', '150 teams from 3 regions.') },
    { year: '2022', title: words('Әлем чемпионы', 'Чемпион мира', 'World champion'), line: words('FIRST Global Challenge, Женева.', 'FIRST Global Challenge, Женева.', 'FIRST Global Challenge, Geneva.') },
    { year: '2023', title: words('Әлем чемпионы', 'Чемпион мира', 'World champion'), line: words('FIRST Global Challenge, Сингапур.', 'FIRST Global Challenge, Сингапур.', 'FIRST Global Challenge, Singapore.') },
    { year: '2024', title: words('Әлем чемпионы', 'Чемпион мира', 'World champion'), line: words('FIRST Global Challenge, Афина.', 'FIRST Global Challenge, Афины.', 'FIRST Global Challenge, Athens.') },
    { year: '2025', title: words('Әлем чемпионы', 'Чемпион мира', 'World champion'), line: words('FIRST Global Challenge, Панама.', 'FIRST Global Challenge, Панама.', 'FIRST Global Challenge, Panama.') },
    { year: '2026', title: words('Alem Tech Fest', 'Alem Tech Fest', 'Alem Tech Fest'), line: words('Астана, EXPO: 5 000+ қатысушы, 7 ел.', 'Астана, EXPO: 5 000+ участников, 7 стран.', 'Astana, EXPO: 5,000+ participants, 7 countries.') }
  ],
  leadership: words('Басшылық', 'Руководство', 'Leadership'),
  leaders: [
    {
      photo: '/images/people/founder-asylbek-512.jpg',
      name: words('Асылбек Мырзахметов', 'Асылбек Мырзахметов', 'Asylbek Myrzakhmetov'),
      role: words('Тең құрылтайшы, қор басшысы', 'Сооснователь, руководитель фонда', 'Co-founder, head of the foundation'),
      line: words('FIRST Program Delivery Partner · ҚР робототехника құрамасының жаттықтырушысы', 'FIRST Program Delivery Partner · тренер сборной РК по робототехнике', 'FIRST Program Delivery Partner · coach of the national robotics team')
    },
    {
      photo: '/images/people/founder-nurdaulet-512.jpg',
      name: words('Нұрдәулет Досмағамбет', 'Нурдаулет Досмагамбет', 'Nurdaulet Dosmagambet'),
      role: words('Тең құрылтайшы', 'Сооснователь', 'Co-founder'),
      line: words('FIRST Program Delivery Partner · ҚР робототехника құрамасының жаттықтырушысы', 'FIRST Program Delivery Partner · тренер сборной РК по робототехнике', 'FIRST Program Delivery Partner · coach of the national robotics team')
    }
  ],
  team: words('Команда', 'Команда', 'Team'),
  teamText: words(
    'Инженерлер, педагогтер, іс-шара менеджерлері және жаттықтырушылар — 30-дан астам маман. Жарыстарды, оқытуды және жобаларды Қазақстанда, Өзбекстанда және Қырғызстанда осы команда жүргізеді.',
    'Инженеры, педагоги, менеджеры мероприятий и тренеры — более 30 специалистов. Соревнования, обучение и проекты в Казахстане, Узбекистане и Кыргызстане ведёт эта команда.',
    'Engineers, educators, event managers and coaches: more than 30 specialists. This team runs the competitions, training and projects in Kazakhstan, Uzbekistan and Kyrgyzstan.'
  ),
  teamAlt: words(
    'USTEM Foundation командасы жарыс алаңында',
    'Команда USTEM Foundation на площадке соревнований',
    'The USTEM Foundation team at a competition venue'
  ),
  ctaTitle: words('Бізге қосылыңыз', 'Присоединяйтесь', 'Join us'),
  ctaRegister: words('Команда тіркеу', 'Зарегистрировать команду', 'Register a team'),
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
  statement: words(
    'FIRST бағдарламаларының Қазақстан, Өзбекстан және Қырғызстандағы ресми операторы. Қазақстан құрамасы FIRST Global Challenge-те қатарынан 4 рет әлем чемпионы атанды.',
    'Официальный оператор программ FIRST в Казахстане, Узбекистане и Кыргызстане. Сборная Казахстана четыре года подряд становилась чемпионом мира FIRST Global Challenge.',
    'The official operator of FIRST programs in Kazakhstan, Uzbekistan and Kyrgyzstan. Team Kazakhstan has been FIRST Global Challenge world champion four years in a row.'
  ),
  statusFirst: {
    meta: words('FIRST', 'FIRST', 'FIRST'),
    title: words(
      'FIRST бағдарламаларының Қазақстан, Өзбекстан және Қырғызстандағы ресми операторы.',
      'Официальный оператор программ FIRST в Казахстане, Узбекистане и Кыргызстане.',
      'Official operator of FIRST programs in Kazakhstan, Uzbekistan and Kyrgyzstan.'
    )
  },
  forbes: {
    meta: words('Forbes Kazakhstan · 2026', 'Forbes Kazakhstan · 2026', 'Forbes Kazakhstan · 2026'),
    title: words(
      'Данияр Ерматов Forbes Kazakhstan «30 до 30» рейтингіне енді.',
      'Данияр Ерматов вошёл в рейтинг Forbes Kazakhstan «30 до 30».',
      'Daniyar Yermatov named to Forbes Kazakhstan’s 30 Under 30.'
    ),
    url: 'https://forbes.kz/articles/forbes-kazakhstan-predstavlyaet-reyting-30-do-30-e11bed'
  },
  results: words('Нәтижелер', 'Результаты', 'Results'),
  attention: words('Мемлекет басшысының назары', 'Внимание Главы государства', 'Recognition by the Head of State'),
  projectsTitle: words('Жобалар', 'Проекты', 'Projects'),
  allProjects: words('Барлық жобалар', 'Все проекты', 'All projects'),
  contact: words('Байланыс', 'Контакты', 'Contact'),
  emailLabel: words('E-mail', 'E-mail', 'Email'),
  phoneLabel: words('Телефон', 'Телефон', 'Phone'),
  addressLabel: words('Мекенжай', 'Адрес', 'Address'),
  teamNote: words(
    'Командада 30-дан астам маман: инженерлер, педагогтер, іс-шара менеджерлері және жаттықтырушылар.',
    'В команде более 30 специалистов: инженеры, педагоги, менеджеры мероприятий и тренеры.',
    'A team of more than 30 specialists: engineers, educators, event managers and coaches.'
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
  const akorda = trustItems.filter(item => item.key === 'akorda-2025' || item.key === 'akorda-2023')
  const projectList = projects.filter(item => item.slug !== 'academy')
  const report = publicReports[0]
  const proof = [
    { meta: text.statusFirst.meta, title: text.statusFirst.title, url: '' },
    ...text.orders,
    { meta: text.forbes.meta, title: text.forbes.title, url: text.forbes.url }
  ]

  return (
    <main id='main-content' className='pg-main ab'>
      <div className='pg-intro pg-intro-plain pg-v2-intro'>
        <PageHead locale={locale} title={t(navLabel('about'))}>
          <p className='pg-v2-statement'>{t(copy.aboutText)}</p>
        </PageHead>
      </div>

      <section className='ab-proof' aria-label={t(text.recognition)}>
        <div className='container ab-proof-grid'>
          <p className='ab-statement'>{t(text.statement)}</p>
          <ul className='pg-recog ab-docs'>
            {proof.map(item => (
              <li key={item.meta.en}>
                <span className='pg-recog-meta'>{t(item.meta)}</span>
                {item.url ? (
                  <a href={item.url} target='_blank' rel='noreferrer'>
                    {t(item.title)}
                    <ArrowUpRightIcon aria-hidden='true' />
                  </a>
                ) : (
                  <span>{t(item.title)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='section section-paper' aria-labelledby='ab-results-title'>
        <div className='container'>
          <SectionHead id='ab-results-title' title={t(text.results)} />
          <dl className='pg-facts ab-facts'>
            {text.facts.map(fact => (
              <div className='pg-fact' key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{t(fact.label)}</dd>
              </div>
            ))}
          </dl>
          <Reveal className='pg-stagger'>
            <ol className='ab-steps'>
              {text.pathSteps.map((step, index) => (
                <li className='ab-step pg-item' key={step.year} style={stagger(index)}>
                  <span className='ab-year'>{step.year}</span>
                  <strong>{t(step.title)}</strong>
                  <span>{t(step.line)}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className='section' aria-labelledby='ab-akorda-title'>
        <div className='container'>
          <SectionHead id='ab-akorda-title' title={t(text.attention)} />
          <ul className='ab-pair'>
            {akorda.map(item => (
              <li key={item.key}>
                <a className='ab-pair-link' href={item.url} target='_blank' rel='noreferrer'>
                  <span className='ab-pair-media'>
                    <img
                      src={item.photo.src}
                      alt={t(item.alt)}
                      width={item.photo.width}
                      height={item.photo.height}
                      loading='lazy'
                      decoding='async'
                      style={item.photo.position ? { objectPosition: item.photo.position } : undefined}
                    />
                  </span>
                  <span className='pg-recog-meta'>{t(item.meta)}</span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.text)}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='section section-paper' aria-labelledby='ab-leaders-title'>
        <div className='container'>
          <SectionHead id='ab-leaders-title' title={t(text.leadership)} />
          <ul className='ab-leaders'>
            {text.leaders.map(person => (
              <li key={person.name.en}>
                <h3>{t(person.name)}</h3>
                <p className='pg-person-role'>{t(person.role)}</p>
                <p>{t(person.line)}</p>
              </li>
            ))}
          </ul>
          <p className='ab-note'>{t(text.teamNote)}</p>
        </div>
      </section>

      <section className='section' aria-labelledby='ab-projects-title'>
        <div className='container'>
          <SectionHead
            id='ab-projects-title'
            title={t(text.projectsTitle)}
            action={
              <Link className='link-arrow' href='/projects'>
                {t(text.allProjects)}
                <ArrowRightIcon aria-hidden='true' />
              </Link>
            }
          />
          <ul className='ab-projects'>
            {projectList.map(project => (
              <li key={project.slug}>
                <Link className='ab-project' href={`/projects/${project.slug}`}>
                  <h3>{project.title}</h3>
                  <p>{t(project.fact)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='section ab-bottom' aria-labelledby='ab-contact-title'>
        <div className='container'>
          {report && (
            <p className='ab-report'>
              <span>
                <strong>{t(ui.reports)}.</strong> {t(report.date)}: {t(report.title)}
              </span>
              <a className='link-arrow' href={report.file} target='_blank' rel='noreferrer'>
                {t(report.note)}
                <ArrowUpRightIcon aria-hidden='true' />
              </a>
            </p>
          )}
          <h2 id='ab-contact-title'>{t(text.contact)}</h2>
          <dl className='ab-contact'>
            <div>
              <dt>{t(text.emailLabel)}</dt>
              <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
            </div>
            <div>
              <dt>{t(text.phoneLabel)}</dt>
              <dd><a href={site.phone.href}>{site.phone.display}</a></dd>
            </div>
            <div>
              <dt>{t(text.addressLabel)}</dt>
              <dd>{t(site.address)}</dd>
            </div>
          </dl>
          <p className='ab-note'>{t(reportsText)} <a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
      </section>
    </main>
  )
}
