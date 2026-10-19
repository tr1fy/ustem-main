'use client'

import { useId } from 'react'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { track } from '@/lib/analytics'
import {
  connectEnabled,
  eventBySlug,
  localize,
  site,
  ui,
  words,
  type Localized,
  type SiteEvent
} from '@/lib/site-content'
import { eventFacts } from './competition-card'

const text = {
  newTab: words(
    '(жаңа бетте ашылады)',
    '(откроется в новой вкладке)',
    '(opens in a new tab)'
  )
}

/**
 * Competition content shared by the side panel and the full page (TZ §7.2).
 * Facts the foundation has not supplied yet (age, format, season, rules PDF)
 * are simply not rendered. External sites appear only here, as secondary
 * links (TZ §3, §5.2).
 *
 * Panel mode clamps the description to four lines (TZ §7.2) and puts
 * «Подробнее» right under it; the full text lives on the page. Internal
 * links there use `replace`: the panel URL is a history entry we pushed
 * ourselves, so leaving the panel for a full page swaps that entry instead
 * of stacking a second one.
 */
export default function CompetitionDetail({
  event,
  locale,
  mode,
  titleId
}: {
  event: SiteEvent
  locale: string
  mode: 'panel' | 'page'
  titleId?: string
}) {
  const t = (value: Localized) => localize(value, locale)
  const joinId = useId()
  const inPanel = mode === 'panel'
  const Title = inPanel ? 'h2' : 'h1'
  const Subtitle = inPanel ? 'h3' : 'h2'
  const parent = event.partOf ? eventBySlug(event.partOf) : undefined
  const facts = eventFacts(event)
  return (
    <div className={`cmp-detail cmp-detail--${mode}`}>
      <div className='cmp-detail-head'>
        <Title id={titleId} className='cmp-detail-title'>
          {event.title}
        </Title>
        <p className='cmp-detail-fact'>{t(event.fact)}</p>
      </div>

      {(facts.length > 0 || parent) && (
        <div className='cmp-detail-tags'>
          {facts.length > 0 && (
            <ul className='cmp-chips' role='list'>
              {facts.map(fact => (
                <li key={fact.key} className='chip'>
                  <span className='cmp-chip-key'>{t(fact.label)}</span>
                  {t(fact.value)}
                </li>
              ))}
            </ul>
          )}
          {parent && (
            <Link
              className='cmp-partof'
              href={`/competitions/${parent.slug}`}
              replace={inPanel}
            >
              <span className='cmp-partof-key'>{t(ui.partOf)}</span>{' '}
              <span className='cmp-partof-name'>{parent.title}</span>
              <ArrowRightIcon aria-hidden='true' />
            </Link>
          )}
        </div>
      )}

      <div className='cmp-detail-copy'>
        <p className='cmp-detail-text'>{t(event.detail)}</p>
        {event.next && (
          <p className='cmp-card-next'>
            <strong>{t(ui.nextEdition)}:</strong> {t(event.next)}
          </p>
        )}
        {inPanel && (
          <Link
            className='link-arrow cmp-detail-more'
            href={`/competitions/${event.slug}`}
            replace
          >
            {t(ui.moreDetails)}
            <ArrowRightIcon aria-hidden='true' />
          </Link>
        )}
      </div>

      {connectEnabled && (
        <section className='cmp-join' aria-labelledby={joinId}>
          <Subtitle id={joinId} className='cmp-join-title'>
            {t(ui.howToJoin)}
          </Subtitle>
          <ol className='cmp-steps'>
            {ui.joinSteps.map((step, index) => (
              <li key={index}>{t(step)}</li>
            ))}
          </ol>
          <a
            className='btn btn-primary cmp-join-cta'
            href={site.connectUrl}
            target='_blank'
            rel='noreferrer'
            onClick={() =>
              track('connect_click', { place: 'competition', slug: event.slug })
            }
          >
            {t(ui.joinInConnect)}
            <span className='visually-hidden'> {t(text.newTab)}</span>
            {/* last child: rendered in its own circle by .btn */}
            <ArrowUpRightIcon aria-hidden='true' />
          </a>
        </section>
      )}

      {(event.officialUrl || event.rulesPdf) && (
        <ul className='cmp-detail-links' role='list'>
          {event.officialUrl && (
            <li>
              <a
                className='link-arrow is-external'
                href={event.officialUrl}
                target='_blank'
                rel='noreferrer'
              >
                {t(ui.officialSite)}
                <ArrowUpRightIcon aria-hidden='true' />
                <span className='visually-hidden'>{t(text.newTab)}</span>
              </a>
            </li>
          )}
          {event.rulesPdf && (
            <li>
              <a
                className='link-arrow'
                href={event.rulesPdf}
                target='_blank'
                rel='noreferrer'
              >
                {t(ui.rules)}
                <DocumentArrowDownIcon aria-hidden='true' />
                <span className='visually-hidden'>{t(text.newTab)}</span>
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
