import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { localize, navItems, site, ui, words, type Localized } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead } from '../_components/ui'
import { NewsCard, latestNews } from '../_components/news-card'
import { Reveal } from '../_components/reveal'

/* TZ §8.6 in the brand style: an airy list of channels (large values,
 * hairlines, a 2px Aral rule on top), topic pills and the #media block.
 * The feedback form needs a mail transport / CRM (not available), so each
 * topic opens a pre-addressed e-mail instead; all topics go to the one
 * address until the foundation names per-topic recipients. The channel
 * list ends with every official account (site.socials, the same list as
 * the footer). Hidden until provided (TZ §14 items 11–12): office map,
 * named press contact, press kit and logo rules. */

const title = navItems.find(item => item.key === 'contacts')!.label

const description = words(
  'USTEM Foundation байланыстары: e-mail, телефон және БАҚ сұраулары.',
  'Контакты USTEM Foundation: e-mail, телефон и запросы СМИ.',
  'USTEM Foundation contacts: e-mail, phone and media enquiries.'
)
const lead = words(
  'Жарыстар, USTEM Academy, серіктестік және БАҚ сұраулары бойынша жазыңыз немесе қоңырау шалыңыз.',
  'Пишите или звоните по вопросам соревнований, USTEM Academy, партнёрства и СМИ.',
  'Write or call about competitions, USTEM Academy, partnerships and media enquiries.'
)
const phoneLabel = words('Телефон', 'Телефон', 'Phone')
const opensInNewTab = words(
  '(жаңа қойындыда ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

const writeTitle = words('Бізге жазыңыз', 'Напишите нам', 'Write to us')
const writeText = words(
  'Тақырыпты таңдаңыз — хат поштаңызда ашылады.',
  'Выберите тему — письмо откроется в вашей почте.',
  'Choose a topic and the e-mail will open in your mail app.'
)
/* TZ topics; «СМИ» is the single action of the #media block next to it. */
const topics = [
  words('Жарыстар', 'Соревнования', 'Competitions'),
  words('Academy', 'Academy', 'Academy'),
  words('Серіктестік', 'Партнёрство', 'Partnership'),
  words('Басқа', 'Другое', 'Other')
]
const mediaSubject = words('БАҚ', 'СМИ', 'Media')
const mediaText = words(
  'Журналистердің сұрауларын «БАҚ» тақырыбымен хат арқылы қабылдаймыз.',
  'Запросы журналистов принимаем письмом с темой «СМИ».',
  'We take journalists’ requests by e-mail with the subject “Media”.'
)
const mediaAction = words('БАҚ сұрауы', 'Запрос от СМИ', 'Media enquiry')
const pressReleases = words('Баспасөз хабарламалары', 'Пресс-релизы', 'Press releases')

const mailto = (subject: Localized, locale: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(localize(subject, locale))}`

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  return {
    title: localize(title, locale),
    description: localize(description, locale),
    alternates: alternatesFor(locale, '/contacts'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${localize(title, locale)} — ${site.name}`,
      description: localize(description, locale),
      url: `/${locale}/contacts`,
      locale: htmlLang(locale),
      images: [{ url: '/images/panama.jpg', width: 1600, height: 900 }]
    }
  }
}

export default function ContactsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)
  const releases = latestNews().filter(item => item.category === 'press-release')
  const channels: {
    label: string
    value: string
    href: string
    external?: boolean
  }[] = [
    { label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
    { label: t(phoneLabel), value: site.phone.display, href: site.phone.href },
    ...site.socials.map(item => ({
      label:
        item.network === 'instagram'
          ? 'Instagram'
          : item.network === 'telegram'
            ? 'Telegram'
            : 'YouTube',
      value: item.network === 'telegram' ? 'FIRST Central Asia' : item.label,
      href: item.url,
      external: true
    }))
  ]

  return (
    <main id='main-content' className='ct-page'>
      <PageHead locale={locale} title={t(title)} lead={t(lead)} />

      <div className='container'>
        <Reveal className='ct-rise'>
          <ul className='ct-channels'>
            {channels.map((channel, index) => (
              <li
                key={channel.href}
                className='ct-rise-item'
                style={{ '--i': index } as CSSProperties}
              >
                <a
                  className='ct-channel'
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  <span className='ct-channel-label'>{channel.label}</span>
                  <span className='ct-channel-value'>{channel.value}</span>
                  <span className='ct-channel-go' aria-hidden='true'>
                    {channel.external ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
                  </span>
                  {channel.external && (
                    <span className='visually-hidden'> {t(opensInNewTab)}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className='section ct-reach'>
        <div className='container ct-columns'>
          <section aria-labelledby='contacts-write' className='ct-write'>
            <h2 id='contacts-write'>{t(writeTitle)}</h2>
            <p className='muted'>{t(writeText)}</p>
            <ul className='ct-topics'>
              {topics.map(topic => (
                <li key={topic.en}>
                  <a className='ct-topic' href={mailto(topic, locale)}>
                    {t(topic)}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section id='media' aria-labelledby='contacts-media' className='ct-media'>
            <h2 id='contacts-media'>{t(ui.forMedia)}</h2>
            <p className='muted'>{t(mediaText)}</p>
            <div className='ct-actions'>
              <a className='btn btn-secondary' href={mailto(mediaSubject, locale)}>
                {t(mediaAction)}
                <ArrowRightIcon aria-hidden='true' />
              </a>
            </div>
          </section>
        </div>
      </div>

      {releases.length > 0 && (
        <section className='section' aria-labelledby='contacts-releases'>
          <div className='container'>
            <h2 id='contacts-releases' className='ct-subtitle'>
              {t(pressReleases)}
            </h2>
            <ul className='nws-grid'>
              {releases.slice(0, 3).map(item => (
                <li key={item.slug}>
                  <NewsCard item={item} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
