import type { Metadata } from 'next'
import {
  connectEnabled,
  localize,
  site,
  ui,
  words,
  type Localized
} from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead } from '../_components/ui'

/* TZ §4, §10: a short factual policy. It describes only what this site
 * actually does and makes no claims about legal status or storage location.
 * Long-form typography (contact.css .ct-prose): 68ch column, 18px body,
 * 28–32px section headings separated by hairlines. */

const version = words(
  '2026 жылғы 1 қазандағы редакция',
  'Редакция от 1 октября 2026',
  'Version of 1 October 2026'
)
const description = words(
  'USTEM Foundation сайты қандай деректерді сақтайды және келісімді қалай қайтарып алуға болады.',
  'Какие данные хранит сайт USTEM Foundation и как отозвать согласие.',
  'What data the USTEM Foundation website stores and how to withdraw consent.'
)

type Block = { title: Localized; text?: Localized; list?: Localized[] }

const blocks: Block[] = [
  {
    title: words('Деректерге кім жауап береді', 'Кто отвечает за данные', 'Who is responsible'),
    text: words(
      `Сайт операторы — ${site.name}. Деректерге қатысты сұрақтарды ${site.email} мекенжайына жіберіңіз.`,
      `Оператор сайта — ${site.name}. Вопросы о данных присылайте на ${site.email}.`,
      `The site is operated by ${site.name}. Send questions about your data to ${site.email}.`
    )
  },
  {
    title: words('Сайт нені сақтайды', 'Что сохраняет сайт', 'What the site stores'),
    list: [
      words(
        'NEXT_LOCALE cookie файлы — сайттың таңдалған тілі. 1 жыл сақталады.',
        'Cookie NEXT_LOCALE — выбранный язык сайта. Хранится 1 год.',
        'The NEXT_LOCALE cookie — your chosen site language, kept for 1 year.'
      ),
      words(
        `Браузеріңіздің localStorage жадындағы белгілер: «${ui.supportLabel.kz}» карточкасын жапқаныңыз және аналитика баннерінде жасаған таңдауыңыз.`,
        `Отметки в localStorage вашего браузера: что вы закрыли карточку «${ui.supportLabel.ru}» и какой выбор сделали в баннере аналитики.`,
        `Flags in your browser’s localStorage: that you closed the “${ui.supportLabel.en}” card and the choice you made in the analytics banner.`
      ),
      words(
        'Google Analytics cookie файлдары — тек баннерде келісім бергеннен кейін. Олар арқылы біз сайтқа кіру статистикасын көреміз.',
        'Cookie Google Analytics — только после вашего согласия в баннере. По ним мы видим статистику посещений.',
        'Google Analytics cookies — only after you consent in the banner. They show us visit statistics.'
      )
    ]
  },
  {
    title: words('Хат алмасу', 'Переписка', 'Correspondence'),
    text: words(
      'Сайт формалар арқылы деректер жинамайды. Бізге e-mail арқылы жазсаңыз немесе қоңырау шалсаңыз, деректеріңізді тек сізге жауап беру үшін пайдаланамыз.',
      'Сайт не собирает данные через формы. Если вы пишете нам на e-mail или звоните, ваши данные используются только для ответа вам.',
      'The site does not collect data through forms. If you e-mail or call us, your details are used only to reply to you.'
    )
  },
  {
    title: words(
      'Келісімді қалай қайтарып алуға болады',
      'Как отозвать согласие',
      'Withdrawing consent'
    ),
    text: words(
      'Браузер баптауларында осы сайттың cookie файлдары мен деректерін өшіріңіз: баннер қайта шығады және аналитикадан бас тарта аласыз.',
      'Удалите cookie и данные этого сайта в настройках браузера: баннер появится снова, и вы сможете отказаться от аналитики.',
      'Clear this site’s cookies and data in your browser settings: the banner will appear again and you can decline analytics.'
    )
  },
  {
    title: words('Деректерді жою', 'Удаление данных', 'Deleting your data'),
    text: words(
      `Хат алмасуыңыз бен байланыс деректеріңізді жоюды сұрау үшін ${site.email} мекенжайына жазыңыз.`,
      `Чтобы мы удалили вашу переписку и контактные данные, напишите на ${site.email}.`,
      `To ask us to delete your correspondence and contact details, write to ${site.email}.`
    )
  },
  {
    title: words('Сыртқы сайттар', 'Внешние сайты', 'External websites'),
    text: connectEnabled
      ? words(
          'Instagram, USTEM Connect және жарыстардың ресми сайттары өз ережелерімен жұмыс істейді.',
          'Instagram, USTEM Connect и официальные сайты соревнований работают по своим правилам.',
          'Instagram, USTEM Connect and the official competition websites follow their own policies.'
        )
      : words(
          'Instagram және жарыстардың ресми сайттары өз ережелерімен жұмыс істейді.',
          'Instagram и официальные сайты соревнований работают по своим правилам.',
          'Instagram and the official competition websites follow their own policies.'
        )
  },
  {
    title: words('Өзгерістер', 'Изменения', 'Changes'),
    text: words(
      'Сайттың жұмысы өзгерсе, осы бетті және редакция күнін жаңартамыз.',
      'Если работа сайта изменится, мы обновим эту страницу и дату редакции.',
      'If the way the site works changes, we will update this page and its version date.'
    )
  }
]

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  return {
    title: localize(ui.privacy, locale),
    description: localize(description, locale),
    alternates: alternatesFor(locale, '/privacy'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${localize(ui.privacy, locale)} — ${site.name}`,
      description: localize(description, locale),
      url: `/${locale}/privacy`,
      locale: htmlLang(locale),
      images: [{ url: '/images/panama.jpg', width: 1600, height: 900 }]
    }
  }
}

/** Turns the contact address inside a sentence into a mailto link. */
function withEmail(text: string) {
  const [before, ...rest] = text.split(site.email)
  if (!rest.length) return text
  return (
    <>
      {before}
      <a href={`mailto:${site.email}`}>{site.email}</a>
      {rest.join(site.email)}
    </>
  )
}

export default function PrivacyPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = (value: Localized) => localize(value, locale)
  return (
    <main id='main-content' className='ct-page'>
      <PageHead
        locale={locale}
        title={t(ui.privacy)}
        lead={<time dateTime='2026-10-01'>{t(version)}</time>}
      />
      <div className='container ct-prose'>
        {blocks.map((block, index) => (
          <section key={index} aria-labelledby={`privacy-${index}`}>
            <h2 id={`privacy-${index}`}>{t(block.title)}</h2>
            {block.text && <p>{withEmail(t(block.text))}</p>}
            {block.list && (
              <ul>
                {block.list.map((item, i) => (
                  <li key={i}>{t(item)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  )
}
