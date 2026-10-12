import { useLocale } from 'next-intl'
import { CheckIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { copy, localize, words, type Localized } from '@/lib/site-content'
import { Reveal } from './reveal'
import { ArrowLink, SectionHead } from './ui'

/**
 * «Ашық диалог» — public consultation archive of USTEM Academy programs
 * (TZ §8.2). An accessible two-row table inside one white rounded container
 * on tablets and up; on phones every row stacks into its own white card.
 * Lives on /academy#discussion and is the only place on the page that links
 * the program PDFs (TZ §3 «один факт — одно место»).
 *
 * Dates come from site-content (copy.discussionDate): the site says June for
 * Robotics Lab while TZ §8.2 says 18–26 May 2026 — open question for the
 * foundation, do not change it here.
 */
const text = {
  title: words('Ашық диалог', 'Публичное обсуждение', 'Public consultation'),
  program: words('Бағдарлама', 'Программа', 'Program'),
  dates: words('Мерзімі', 'Даты', 'Dates'),
  status: words('Мәртебесі', 'Статус', 'Status'),
  document: words('Құжат', 'Документ', 'Document'),
  publication: words('Жарияланым', 'Публикация', 'Publication'),
  inKazakh: words('қазақ тілінде', 'на казахском языке', 'in Kazakh'),
  inRussian: words('орыс тілінде', 'на русском языке', 'in Russian'),
  newTab: words(
    '(жаңа бетте ашылады)',
    '(откроется в новой вкладке)',
    '(opens in a new tab)'
  )
}

const rows = [
  {
    program: 'Robotics Lab',
    file: 'robotics-lab',
    date: copy.discussionDate,
    article: '/news/robotics-lab-public-discussion'
  },
  {
    program: 'Space Lab',
    file: 'space-lab',
    date: copy.spaceDiscussionDate,
    article: '/news/space-lab-public-discussion'
  }
]

// Program files exist in Kazakh and Russian; the reader's language goes first.
const fileLangs = (locale: string) =>
  locale === 'kz' ? (['kz', 'ru'] as const) : (['ru', 'kz'] as const)

export default function PublicDiscussion({
  locale: localeProp
}: {
  locale?: string
} = {}) {
  const currentLocale = useLocale()
  const locale = localeProp ?? currentLocale
  const t = (value: Localized) => localize(value, locale)
  const labels = {
    dates: t(text.dates),
    status: t(text.status),
    document: t(text.document),
    publication: t(text.publication)
  }

  return (
    <section
      id='discussion'
      className='section section-paper pg-discussion'
      aria-labelledby='pg-discussion-title'
    >
      <div className='container'>
        <SectionHead
          id='pg-discussion-title'
          title={t(text.title)}
          lead={t(copy.discussionArchiveText)}
        />
        <Reveal className='pg-table-wrap'>
          <table className='pg-table' role='table'>
            <caption className='visually-hidden'>{t(text.title)}</caption>
            <thead role='rowgroup'>
              <tr role='row'>
                <th scope='col' role='columnheader'>
                  {t(text.program)}
                </th>
                <th scope='col' role='columnheader'>
                  {labels.dates}
                </th>
                <th scope='col' role='columnheader'>
                  {labels.status}
                </th>
                <th scope='col' role='columnheader'>
                  {labels.document}
                </th>
                <th scope='col' role='columnheader'>
                  {labels.publication}
                </th>
              </tr>
            </thead>
            <tbody role='rowgroup'>
              {rows.map(row => (
                <tr role='row' key={row.file}>
                  <th scope='row' role='rowheader'>
                    {row.program}
                  </th>
                  <td role='cell' data-label={labels.dates}>
                    {t(row.date)}
                  </td>
                  <td role='cell' data-label={labels.status}>
                    <span className='pg-status'>
                      <CheckIcon aria-hidden='true' />
                      {t(copy.discussionStatus)}
                    </span>
                  </td>
                  <td role='cell' data-label={labels.document}>
                    <span className='pg-docs'>
                      {fileLangs(locale).map(lang => (
                        <a
                          key={lang}
                          className='pg-doc'
                          href={`/docs/${row.file}-${lang}.pdf`}
                          hrefLang={lang === 'kz' ? 'kk' : 'ru'}
                          type='application/pdf'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <DocumentArrowDownIcon aria-hidden='true' />
                          PDF · {lang === 'kz' ? 'KK' : 'RU'}
                          <span className='visually-hidden'>
                            {' '}
                            — {row.program},{' '}
                            {t(lang === 'kz' ? text.inKazakh : text.inRussian)}{' '}
                            {t(text.newTab)}
                          </span>
                        </a>
                      ))}
                    </span>
                  </td>
                  <td role='cell' data-label={labels.publication}>
                    <ArrowLink href={row.article}>
                      {t(copy.discussionDetails)}
                      <span className='visually-hidden'> — {row.program}</span>
                    </ArrowLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}
