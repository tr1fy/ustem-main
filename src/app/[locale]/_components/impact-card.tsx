/**
 * Numbers block (TZ §6.2, §11) rendered from `publishedMetrics` only, so an
 * unverified figure can never reach the page. Matches the client's reference
 * card: big "4×" next to its label, a timeline of the four titles, a note and
 * an "i Source" popover. Renders its own <section id="numbers"> + container.
 *   variant 'overlap' — homepage: H2 on top of the card, the card rises over
 *                       the bottom of the hero
 *   variant 'plain'   — /partners and /about (TZ §8.5: same component), H2
 *                       as a regular section head above a flat card
 * Brand guideline: a white radius-lg card, the "4×" numeral filled with the
 * Aral gradient, a blue timeline. On the homepage the card, the timeline
 * rule and its markers draw in with a CSS-only entrance (home.css, 6.2).
 * Server component: only the count-up (./reveal) and the source popover
 * (./impact-source) run on the client.
 */
import type { CSSProperties } from 'react'
import { useLocale } from 'next-intl'
import {
  localize,
  publishedMetrics,
  ui,
  words,
  type Locale
} from '@/lib/site-content'
import ImpactSource from './impact-source'
import { Count } from './reveal'

type Metric = (typeof publishedMetrics)[number]

const newTab = words(
  '(жаңа бетте ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

const months: Record<'kz' | 'ru', string[]> = {
  kz: [
    'қаңтар',
    'ақпан',
    'наурыз',
    'сәуір',
    'мамыр',
    'маусым',
    'шілде',
    'тамыз',
    'қыркүйек',
    'қазан',
    'қараша',
    'желтоқсан'
  ],
  ru: [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь'
  ]
}

/** '2025-11' → «2025 ж. қараша» / «ноябрь 2025» / «November 2025». */
function monthYear(value: string, locale: string) {
  const [year, month] = value.split('-').map(Number)
  if (!month) return String(year)
  if (locale === 'kz') return `${year} ж. ${months.kz[month - 1]}`
  if (locale === 'ru') return `${months.ru[month - 1]} ${year}`
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, 15)))
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Pieces of a label that must never split across lines: the programme
    name and a year range such as «(2022–2025)» (browsers break after «–»). */
const keepTogether = /(FIRST Global Challenge|\(?\d{4}–\d{4}\)?)/

/** Wraps each `keepTogether` match in a no-wrap span (.imp-keep). */
function Label({ text }: { text: string }) {
  return (
    <>
      {text.split(keepTogether).map((part, i) =>
        i % 2 ? (
          <span className='imp-keep' key={i}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

/** Numeral with an accessible text equivalent (the count-up is decorative).
    Only the lead «4×» counts up; the other figures are printed as they are,
    so a screenshot or a slow phone never shows a half-counted «18 122+». */
function Value({
  metric,
  locale,
  count = false
}: {
  metric: Metric
  locale: Locale
  count?: boolean
}) {
  const text = metric.display
    ? localize(metric.display, locale)
    : `${metric.value ?? ''}${metric.suffix ?? ''}`
  return (
    <>
      <span aria-hidden='true'>
        {count && metric.value !== null ? (
          <Count value={metric.value} suffix={metric.suffix} />
        ) : (
          text
        )}
      </span>
      <span className='visually-hidden'>{text} </span>
    </>
  )
}

function Source({ metric, locale }: { metric: Metric; locale: Locale }) {
  const source = metric.source
  if (!source) return null
  return (
    <ImpactSource
      button={localize(ui.source, locale)}
      label={localize(source.label, locale)}
      asOf={`${localize(ui.sourceAsOf, locale)}: ${monthYear(source.asOf, locale)}`}
      url={source.url}
      host={hostOf(source.url)}
      newTab={localize(newTab, locale)}
    />
  )
}

export default function ImpactCard({
  variant = 'plain'
}: {
  variant?: 'overlap' | 'plain'
}) {
  const locale = useLocale() as Locale
  const [main, ...more] = publishedMetrics
  if (!main) return null
  const timeline = main.timeline ?? []
  const title = (
    <h2 id='numbers-title' className='imp-title'>
      {localize(ui.numbersTitle, locale)}
    </h2>
  )

  return (
    <section
      id='numbers'
      className={`section imp imp-${variant}`}
      aria-labelledby='numbers-title'
    >
      <div className='container'>
        {/* Inner pages: the same full-size section heading as every other
            section. Homepage: the heading sits inside the overlapping card. */}
        {variant === 'plain' && <div className='section-head'>{title}</div>}
        <div className='imp-card'>
          {variant === 'overlap' && title}

          <div className='imp-main'>
            <p className='imp-stat'>
              <span className='imp-value'>
                <Value metric={main} locale={locale} count />
              </span>
              <span className='imp-label'>
                <Label text={localize(main.label, locale)} />
              </span>
            </p>

            <div className='imp-side'>
              {timeline.length > 0 && (
                <ol className='imp-timeline'>
                  {timeline.map((step, i) => (
                    <li
                      className='imp-step'
                      key={step.year}
                      style={{ '--i': i } as CSSProperties}
                    >
                      <span className='imp-year'>{step.year}</span>
                      <span className='imp-place'>
                        {localize(step.place, locale)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <div className='imp-foot'>
                {main.note && (
                  <p className='imp-note'>{localize(main.note, locale)}</p>
                )}
                <Source metric={main} locale={locale} />
              </div>
            </div>
          </div>

          {more.length > 0 && (
            <ul className='imp-more'>
              {more.map(metric => (
                <li className='imp-tile' key={metric.id}>
                  <p>
                    <span className='imp-tile-value'>
                      <Value metric={metric} locale={locale} />
                    </span>
                    <span className='imp-tile-label'>
                      {localize(metric.label, locale)}
                    </span>
                  </p>
                  <Source metric={metric} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
