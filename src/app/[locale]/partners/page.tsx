import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'
import { localize, navItems, site, words, type Localized } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead, SectionHead } from '../_components/ui'
import PartnerLogos from '../_components/partner-logos'
import { Reveal } from '../_components/reveal'

/* TZ §8.5 in the brand style: head with the FTC photo in a rounded mask
 * over a cropped Aral circle → partner types → the partner logo wall. The
 * presentation PDF, the partner form and the format packages are not
 * published yet (TZ §14 items 5, 10): the lead says they come on request,
 * and the footer (which shows the e-mail itself on this page) is the one
 * call to action. */

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
      'Поддержка соревнований, проектов и команд в рамках корпоративной социальной ответственности.',
      'Supporting competitions, projects and teams as part of corporate social responsibility.'
    )
  },
  {
    icon: NewspaperIcon,
    title: words('БАҚ', 'СМИ', 'Media'),
    text: words(
      'Жарыстар, жеңістер және жас инженерлер туралы материалдар.',
      'Материалы о соревнованиях, победах и молодых инженерах.',
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

/* The packages behind the formats are provided on request (TZ §14 item
 * 10), so the lead says that instead of listing bare format names. */
const packagesNote = words(
  'Серіктестік пакеттері мен шарттарын сұрау бойынша ұсынамыз.',
  'Пакеты и условия партнёрства предоставляем по запросу.',
  'Partnership packages and terms are available on request.'
)

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
        <PageHead locale={locale} title={t(title)} lead={`${t(lead)} ${t(packagesNote)}`}>
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

      <section className='section' aria-labelledby='partners-logos'>
        <div className='container'>
          <PartnerLogos locale={locale} id='partners-logos' />
        </div>
      </section>

    </main>
  )
}
