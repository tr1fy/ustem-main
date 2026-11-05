'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { track } from '@/lib/analytics'
import {
  localize,
  navItems,
  site,
  ui,
  words,
  type FlagshipTrackIcon,
  type Localized,
  type SiteEvent
} from '@/lib/site-content'
import { Count } from './reveal'

/*
 * Full flagship page (owner's brief of 2026-11-05, mockup approved the same
 * day): name + one-sentence description with a six-photo mosaic, last
 * year's numbers counting up from zero, mission, the six tracks in one
 * divided rectangle, the next edition, two steps to take part, contacts.
 * Nothing else: cost, deadlines, rules, partners and reports live on the
 * event's own site. «Official website» opens a small notice first, because
 * that site still shows last season until the new rules are published.
 */

const text = {
  flagship: words('Флагман жарыс', 'Флагманское событие', 'Flagship event'),
  howToJoin: words(
    'Қалай қатысуға болады',
    'Как принять участие',
    'How to take part'
  ),
  stats: words(
    'Өткен жыл сандармен',
    'Прошлый год в цифрах',
    'Last year in numbers'
  ),
  mission: words('Мақсаты', 'Миссия', 'Mission'),
  tracks: words(
    'Чемпионат жарыс бағыттары',
    'Направления чемпионата',
    'Championship tracks'
  ),
  nextEvent: words('Келесі жарыс', 'Следующее соревнование', 'Next event'),
  join: words('Қатысу', 'Участие', 'Take part'),
  step1: words(
    'Жарыс ережесімен танысыңыз',
    'Ознакомьтесь с правилами соревнования',
    'Read the competition rules'
  ),
  step1note: words(
    'Жарыс ережесі ресми арналарда жарияланады.',
    'Правила публикуются в официальных каналах.',
    'The rules are published on the official channels.'
  ),
  step2: words(
    'USTEM Connect арқылы тіркеліңіз',
    'Зарегистрируйтесь через USTEM Connect',
    'Register via USTEM Connect'
  ),
  goConnect: words(
    'USTEM Connect-ке өту',
    'Перейти в USTEM Connect',
    'Open USTEM Connect'
  ),
  contacts: words('Байланыс', 'Контакты', 'Contacts'),
  email: words('Пошта', 'Почта', 'Email'),
  notice: words('Хабарландыру', 'Уведомление', 'Notice'),
  close: words('Жабу', 'Закрыть', 'Close'),
  newTab: words(
    '(жаңа бетте ашылады)',
    '(откроется в новой вкладке)',
    '(opens in a new tab)'
  )
}
const catalogLabel = navItems.find(item => item.key === 'competitions')!.label

/* Outline icons, 24-unit grid, stroke 1.8 (same weight as Heroicons). */
const icons: Record<FlagshipTrackIcon, ReactNode> = {
  robot: (
    <>
      <rect x='4' y='8' width='16' height='12' rx='3' />
      <path d='M12 8V4M9 4h6M8 14h.01M16 14h.01M10 17h4' />
    </>
  ),
  wrench: (
    <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
  ),
  drone: (
    <>
      <circle cx='5' cy='5' r='2.5' />
      <circle cx='19' cy='5' r='2.5' />
      <circle cx='5' cy='19' r='2.5' />
      <circle cx='19' cy='19' r='2.5' />
      <rect x='9' y='9' width='6' height='6' rx='1.5' />
      <path d='M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2' />
    </>
  ),
  rocket: (
    <>
      <path d='M12 2c3 3 4 7 4 11l-4 4-4-4c0-4 1-8 4-11z' />
      <path d='M8 13l-3 3 2 2M16 13l3 3-2 2M10 21h4' />
      <circle cx='12' cy='10' r='1.5' />
    </>
  ),
  shield: (
    <>
      <path d='M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z' />
      <path d='M9 12l2 2 4-4' />
    </>
  ),
  chip: (
    <>
      <rect x='6' y='6' width='12' height='12' rx='2' />
      <rect x='10' y='10' width='4' height='4' />
      <path d='M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4' />
    </>
  )
}

function TrackIcon({ icon }: { icon: FlagshipTrackIcon }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {icons[icon]}
    </svg>
  )
}

/**
 * The notice shown before the official site: a small modal dialog. It
 * traps nothing heavier than focus on its close button, closes on Escape
 * and on the backdrop, and gives focus back to the button that opened it.
 */
function SiteNotice({
  event,
  locale,
  open,
  onClose,
  returnTo
}: {
  event: SiteEvent
  locale: string
  open: boolean
  onClose: () => void
  returnTo: React.RefObject<HTMLButtonElement>
}) {
  const t = (value: Localized) => localize(value, locale)
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const page = event.page!
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      returnTo.current?.focus()
    }
  }, [open, onClose, returnTo])
  if (!open) return null
  return (
    <div className='fp-backdrop' onClick={onClose}>
      <div
        className='fp-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onClick={e => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type='button'
          className='fp-dialog-x'
          onClick={onClose}
          aria-label={t(text.close)}
        >
          <XMarkIcon aria-hidden='true' />
        </button>
        <span className='chip fp-dialog-chip'>{t(text.notice)}</span>
        <h2 id={titleId} className='fp-dialog-title'>
          {t(page.siteNotice.title)}
        </h2>
        <p className='fp-dialog-text'>{t(page.siteNotice.text)}</p>
        <div className='fp-dialog-actions'>
          {page.rules.map((channel, index) => (
            <a
              key={channel.url}
              className={`btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`}
              href={channel.url}
              target='_blank'
              rel='noreferrer'
              onClick={() =>
                track('rules_channel_click', {
                  slug: event.slug,
                  channel: channel.label
                })
              }
            >
              {channel.label}
              <span className='visually-hidden'> {t(text.newTab)}</span>
            </a>
          ))}
          <button type='button' className='btn btn-secondary' onClick={onClose}>
            {t(text.close)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FlagshipPage({
  event,
  locale
}: {
  event: SiteEvent
  locale: string
}) {
  const t = (value: Localized) => localize(value, locale)
  const page = event.page!
  const [noticeOpen, setNoticeOpen] = useState(false)
  const openerRef = useRef<HTMLButtonElement>(null)
  const openNotice = () => {
    track('official_site_notice', { slug: event.slug })
    setNoticeOpen(true)
  }
  const statsId = useId()
  const missionId = useId()
  const tracksId = useId()
  const nextId = useId()
  const contactsId = useId()
  const [titleA, titleB] = event.title.split(' Tech ')
  return (
    <div className='fp'>
      {/* 1. Hero: breadcrumb, name, description, buttons, six-photo mosaic */}
      <section className='fp-hero'>
        <span className='fp-hero-circle' aria-hidden='true' />
        <div className='container'>
          <nav aria-label='Breadcrumb'>
            <ol className='breadcrumbs'>
              <li>
                <Link href='/competitions'>{t(catalogLabel)}</Link>
              </li>
              <li aria-current='page'>{event.title}</li>
            </ol>
          </nav>
          <div className='fp-hero-grid'>
            <div className='fp-hero-copy'>
              <ul className='cmp-chips' role='list'>
                <li className='chip fp-chip-solid'>{t(text.flagship)}</li>
                <li className='chip fp-chip-tint'>{t(page.nextShort)}</li>
              </ul>
              <h1 className='fp-title'>
                {titleB ? (
                  <>
                    {titleA}
                    <br />
                    Tech {titleB}
                  </>
                ) : (
                  event.title
                )}
              </h1>
              <p className='fp-lead'>{t(page.description)}</p>
              <div className='fp-actions'>
                <button
                  ref={openerRef}
                  type='button'
                  className='btn btn-primary'
                  onClick={openNotice}
                >
                  {t(ui.officialSite)}
                </button>
                <a className='btn btn-secondary' href='#fp-join'>
                  {t(text.howToJoin)}
                </a>
              </div>
            </div>
            <div className='fp-hero-media'>
              {page.heroStyle === 'cover' ? (
                <div className='fp-cover'>
                  {/* The H1 names the event; the cover is decorative. */}
                  <img
                    src={event.cover}
                    alt=''
                    loading='eager'
                    fetchPriority='high'
                    decoding='async'
                    style={
                      event.coverPosition
                        ? { objectPosition: event.coverPosition }
                        : undefined
                    }
                  />
                </div>
              ) : (
                <ul className='fp-mosaic' role='list'>
                  {page.photos.map(photo => (
                    <li key={photo.src}>
                      <img
                        src={photo.src}
                        alt={t(photo.alt)}
                        loading='eager'
                        decoding='async'
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Last year's numbers, counting up from zero */}
      <section
        className='fp-section fp-section--paper'
        aria-labelledby={statsId}
      >
        <div className='container'>
          <div className='fp-head'>
            <h2 id={statsId}>{t(text.stats)}</h2>
            <p className='fp-head-note'>{t(page.stats.note)}</p>
          </div>
          <ul className='fp-stats' role='list'>
            {page.stats.items.map(item => (
              <li key={t(item.label)}>
                <span className='fp-stat-value'>
                  <Count value={item.value} suffix={item.suffix} />
                </span>
                <span className='fp-stat-label'>{t(item.label)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Mission */}
      <section className='fp-section' aria-labelledby={missionId}>
        <div className='fp-mission container'>
          <div className='fp-mission-key'>
            <span id={missionId} className='label fp-label'>
              {t(text.mission)}
            </span>
            <span className='fp-rule' aria-hidden='true' />
          </div>
          <div className='fp-mission-body'>
            <p className='fp-mission-lead'>{t(page.mission.lead)}</p>
            <p className='fp-mission-text'>{t(page.mission.text)}</p>
          </div>
        </div>
      </section>

      {/* 4. Tracks: one rectangle divided into six */}
      <section
        className='fp-section fp-section--paper'
        aria-labelledby={tracksId}
      >
        <div className='container'>
          <h2 id={tracksId} className='fp-h2'>
            {t(text.tracks)}
          </h2>
          <ol
            className={`fp-tracks${
              page.trackStyle === 'photos' ? ' fp-tracks--photos' : ''
            }`}
            role='list'
          >
            {page.tracks.map((item, index) => {
              const photo =
                page.trackStyle === 'photos' ? page.photos[index] : undefined
              return (
                <li key={item.icon}>
                  {photo ? (
                    <span className='fp-track-photo'>
                      {/* The name below says what it is. */}
                      <img
                        src={photo.src}
                        alt=''
                        loading='lazy'
                        decoding='async'
                      />
                    </span>
                  ) : (
                    <div className='fp-track-top'>
                      <span className='fp-track-icon'>
                        <TrackIcon icon={item.icon} />
                      </span>
                      <span className='fp-track-n'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  <span className='fp-track-name'>
                    {photo && (
                      <span className='fp-track-n'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    {t(item.name)}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* 4. Next edition + last year's numbers */}
      <section className='fp-section' aria-labelledby={nextId}>
        <div className='container'>
          {/* One banner: the next edition left, its date and size right */}
          <div className='fp-next on-dark'>
            <span className='fp-next-circle' aria-hidden='true' />
            <div className='fp-next-main'>
              <span className='label fp-label-dark'>{t(text.nextEvent)}</span>
              <h2 id={nextId} className='fp-next-title'>
                {page.next.title}
              </h2>
            </div>
            <p className='fp-next-line'>{t(page.next.line)}</p>
          </div>
        </div>
      </section>

      {/* 5. Two steps to take part */}
      <section
        id='fp-join'
        className='fp-section fp-section--paper'
        aria-labelledby='fp-join-title'
      >
        <div className='container'>
          <h2 id='fp-join-title' className='fp-h2'>
            {t(text.join)}
          </h2>
          <ol className='fp-steps' role='list'>
            <li>
              <span className='fp-step-n' aria-hidden='true'>
                1
              </span>
              <div className='fp-step-body'>
                <span className='fp-step-title'>{t(text.step1)}</span>
                <span className='fp-step-note'>{t(text.step1note)}</span>
                <ul className='fp-links' role='list'>
                  {page.rules.map(channel => (
                    <li key={channel.url}>
                      <a
                        className='fp-pill'
                        href={channel.url}
                        target='_blank'
                        rel='noreferrer'
                        onClick={() =>
                          track('rules_channel_click', {
                            slug: event.slug,
                            channel: channel.label
                          })
                        }
                      >
                        {channel.label}
                        <span className='visually-hidden'>
                          {' '}
                          {t(text.newTab)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <span className='fp-step-n' aria-hidden='true'>
                2
              </span>
              <div className='fp-step-body'>
                <span className='fp-step-title'>{t(text.step2)}</span>
                <div>
                  <a
                    className='btn btn-primary fp-step-cta'
                    href={site.connectUrl}
                    target='_blank'
                    rel='noreferrer'
                    onClick={() =>
                      track('connect_click', {
                        place: 'competition',
                        slug: event.slug
                      })
                    }
                  >
                    {t(text.goConnect)}
                    <span className='visually-hidden'> {t(text.newTab)}</span>
                    <ArrowUpRightIcon aria-hidden='true' />
                  </a>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 6. Contacts */}
      <section
        className='fp-section fp-section--last'
        aria-labelledby={contactsId}
      >
        <div className='container'>
          <h2 id={contactsId} className='fp-h2'>
            {t(text.contacts)}
          </h2>
          <ul className='fp-contacts' role='list'>
            <li>
              <button type='button' className='fp-contact' onClick={openNotice}>
                <span className='fp-contact-key'>{t(ui.officialSite)}</span>
                <span className='fp-contact-value'>
                  {event.officialUrl?.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              </button>
            </li>
            <li>
              <a className='fp-contact' href={`mailto:${page.contacts.email}`}>
                <span className='fp-contact-key'>{t(text.email)}</span>
                <span className='fp-contact-value'>{page.contacts.email}</span>
              </a>
            </li>
            <li>
              <a
                className='fp-contact'
                href={page.contacts.instagram.url}
                target='_blank'
                rel='noreferrer'
              >
                <span className='fp-contact-key'>Instagram</span>
                <span className='fp-contact-value'>
                  {page.contacts.instagram.handle}
                </span>
              </a>
            </li>
            <li>
              <a
                className='fp-contact'
                href={page.contacts.telegram.url}
                target='_blank'
                rel='noreferrer'
              >
                <span className='fp-contact-key'>Telegram</span>
                <span className='fp-contact-value'>
                  {page.contacts.telegram.handle}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <SiteNotice
        event={event}
        locale={locale}
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        returnTo={openerRef}
      />
    </div>
  )
}
