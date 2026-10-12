import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  NewspaperIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { localize, navItems, site, words, type Localized } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead, SectionHead } from '../_components/ui'
import ImpactCard from '../_components/impact-card'
import PartnerLogos from '../_components/partner-logos'
import { Reveal } from '../_components/reveal'

/* TZ §8.5 in the brand style: head with the FTC photo in a rounded mask
 * over a cropped Aral circle → partner types → the shared numbers block →
 * the partner logo wall → the five formats → contact band. The
 * presentation PDF and the partner form (no mail transport / CRM yet) are
 * not rendered (TZ §14 items 5, 10); the band's mailto with a preset
 * subject stands in for the form. */

const title = navItems.find(item => item.key === 'partners')!.label

const lead = words(
  'Серіктестік балаларға инженерияда алғашқы қадам жасауға, ал Қазақстан құрамаларына әлемдік деңгейде жеңуге көмектеседі.',
  'Партнёрство помогает детям сделать первый шаг в инженерии, а сборным Казахстана — побеждать на мировом уровне.',
  'Partnership helps children take their first step in engineering and helps Kazakhstan’s national teams win on the world stage.'
)

const audienceTitle = words(
  'Кімдермен серіктес боламыз',
  'С кем мы строим партнёрство',
  'Who we partner with'
)
const audiences = [
  {
    icon: BuildingLibraryIcon,
    title: words('Мемлекет', 'Государство', 'Government'),
    text: words(
      'Өңірлерде инженерлік білім беруді дамытатын бірлескен бағдарламалар.',
      'Совместные программы развития инженерного образования в регионах.',
      'Joint programs that develop engineering education across the regions.'
    )
  },
  {
    icon: BriefcaseIcon,
    title: words('Бизнес және КӘЖ', 'Бизнес и КСО', 'Business and CSR'),
    text: words(
      'Корпоративтік әлеуметтік жауапкершілік аясында жарыстарды, жобаларды және командаларды қолдау.',
      'Поддержка соревнований, проектов и команд в рамках социальной ответственности компании.',
      'Supporting competitions, projects and teams as part of corporate social responsibility.'
    )
  },
  {
    icon: NewspaperIcon,
    title: words('БАҚ', 'СМИ', 'Media'),
    text: words(
      'Жарыстар, жеңістер және жас инженерлер туралы материалдар.',
      'Рассказы о соревнованиях, победах и юных инженерах.',
      'Stories about competitions, victories and young engineers.'
    )
  },
  {
    icon: AcademicCapIcon,
    title: words('Мектептер', 'Школы', 'Schools'),
    text: words(
      'Оқушылардың жарыстарға қатысуы және педагогтердің USTEM Academy-де оқуы.',
      'Участие учеников в соревнованиях и обучение педагогов в USTEM Academy.',
      'Students taking part in competitions and teachers training with USTEM Academy.'
    )
  }
]

const formatsTitle = words(
  'Серіктестік форматтары',
  'Форматы партнёрства',
  'Partnership formats'
)
/* TZ §8.5 names the five formats; what each includes is defined by the
 * foundation's packages, which are provided on request (TZ §14 item 10). */
const formats = [
  words('Бас серіктес', 'Генеральный партнёр', 'General partner'),
  words('Жарыс серіктесі', 'Партнёр соревнования', 'Competition partner'),
  words('Жоба серіктесі', 'Партнёр проекта', 'Project partner'),
  words('Білім беру серіктесі', 'Образовательный партнёр', 'Education partner'),
  words('Заттай қолдау', 'Поддержка в натуре', 'In-kind support')
]
const formatsNote = words(
  'Серіктестік пакеттері мен шарттарын сұрау бойынша ұсынамыз.',
  'Пакеты и условия партнёрства предоставляем по запросу.',
  'Partnership packages and terms are available on request.'
)

const contactTitle = words('Серіктес болыңыз', 'Станьте партнёром', 'Become a partner')
const contactText = words(
  'Жазыңыз немесе қоңырау шалыңыз — ұйымыңызға қай формат лайық екенін бірге талқылаймыз.',
  'Напишите или позвоните — вместе обсудим, какой формат подойдёт вашей организации.',
  'Write or call us and we will work out together which format suits your organization.'
)
const contactAction = words(
  'Серіктестікті талқылау',
  'Обсудить партнёрство',
  'Discuss a partnership'
)
const mailSubject = words('Серіктестік', 'Партнёрство', 'Partnership')
const callLabel = words('Қоңырау шалу', 'Позвонить', 'Call')

/* Full photo for the page head (its USTEM banner suits the partners page;
 * /competitions uses the cut-out of the same shot). Alt describes only
 * what is visible. */
const photo = {
  srcSet: [
    '/images/people/ftc-robot-800.webp 800w',
    '/images/people/ftc-robot-1600.webp 1600w'
  ].join(', '),
  src: '/images/people/ftc-robot-1600.webp',
  width: 1600,
  height: 1067,
  alt: words(
    'Қыз бен жігіт 34226 нөмірлі FIRST Tech Challenge роботымен, артында көрермендер мен USTEM баннері',
    'Девушка и юноша с роботом FIRST Tech Challenge номер 34226, позади — зрители и баннер USTEM',
    'A girl and a boy with FIRST Tech Challenge robot 34226, with spectators and a USTEM banner behind them'
  )
}

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  return {
    title: localize(title, locale),
    description: localize(lead, locale),
    alternates: alternatesFor(locale, '/partners'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${localize(title, locale)} — ${site.name}`,
      description: localize(lead, locale),
      url: `/${locale}/partners`,
      locale: htmlLang(locale),
      images: [{ url: '/images/panama.jpg', width: 1600, height: 900 }]
    }
  }
}

export default function PartnersPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)
  return (
    <main id='main-content' className='ct-page'>
      <div className='ct-phead'>
        <PageHead locale={locale} title={t(title)} lead={t(lead)}>
          <figure className='ct-stage'>
            <div className='ct-stage-orb' aria-hidden='true'>
              <div className='ct-stage-circle' />
            </div>
            <div className='ct-stage-photo'>
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes='(min-width: 1280px) 592px, (min-width: 1024px) 46vw, 100vw'
                alt={t(photo.alt)}
                width={photo.width}
                height={photo.height}
                loading='eager'
                decoding='async'
                fetchPriority='high'
              />
            </div>
          </figure>
        </PageHead>
      </div>

      <section className='section ct-first' aria-labelledby='partners-who'>
        <div className='container'>
          <SectionHead id='partners-who' title={t(audienceTitle)} />
          <Reveal className='ct-rise'>
            <ul className='ct-audiences'>
              {audiences.map(({ icon: Icon, title: name, text }, index) => (
                <li
                  key={name.en}
                  className='ct-rise-item'
                  style={{ '--i': index } as CSSProperties}
                >
                  <span className='ct-icon' aria-hidden='true'>
                    <Icon />
                  </span>
                  <h3>{t(name)}</h3>
                  <p>{t(text)}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Same numbers component as the homepage (TZ §8.5); renders its own
          <section> and H2. */}
      <ImpactCard variant='plain' />

      <section className='section' aria-labelledby='partners-logos'>
        <div className='container'>
          <PartnerLogos locale={locale} id='partners-logos' />
        </div>
      </section>

      <section className='section' aria-labelledby='partners-formats'>
        <div className='container ct-split'>
          <div className='ct-split-head'>
            <h2 id='partners-formats'>{t(formatsTitle)}</h2>
            <p className='muted'>{t(formatsNote)}</p>
          </div>
          <Reveal className='ct-rise'>
            <ul className='ct-formats'>
              {formats.map((format, index) => (
                <li
                  key={format.en}
                  className='ct-rise-item'
                  style={{ '--i': index } as CSSProperties}
                >
                  {t(format)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className='section ct-band-section' aria-labelledby='partners-contact'>
        <div className='container'>
          <Reveal>
            <div className='ct-cta'>
              <div className='ct-cta-copy'>
                <h2 id='partners-contact'>{t(contactTitle)}</h2>
                <p>{t(contactText)}</p>
              </div>
              <div className='ct-cta-actions'>
                <a
                  className='btn btn-primary'
                  href={`mailto:${site.email}?subject=${encodeURIComponent(t(mailSubject))}`}
                >
                  {t(contactAction)}
                  <ArrowRightIcon aria-hidden='true' />
                </a>
                <a className='ct-cta-phone' href={site.phone.href}>
                  <PhoneIcon aria-hidden='true' />
                  <span className='visually-hidden'>{t(callLabel)}: </span>
                  {site.phone.display}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
