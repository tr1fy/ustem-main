'use client'

import { useState, type CSSProperties } from 'react'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { localize, partnerLogos, ui, words } from '@/lib/site-content'

const text = {
  pause: words(
    'Логотиптерді тоқтату',
    'Остановить логотипы',
    'Pause the logos'
  ),
  play: words(
    'Логотиптерді жылжыту',
    'Запустить логотипы',
    'Play the logos'
  )
}

type Logo = (typeof partnerLogos)[number]

/**
 * Partner logo band (TZ §6.7): the supplied white marks on a deep-blue
 * band, in two rows that drift in opposite directions. Each row holds its
 * logos twice and slides by exactly one set, so the loop is seamless; the
 * copy is aria-hidden. Rows pause on hover, the button pauses both (WCAG
 * 2.2.2), and with reduced motion the rows simply wrap and stand still.
 */
export default function PartnerLogos({
  locale,
  id
}: {
  locale: string
  id: string
}) {
  const [paused, setPaused] = useState(false)
  const half = Math.ceil(partnerLogos.length / 2)
  const rows = [partnerLogos.slice(0, half), partnerLogos.slice(half)]

  const set = (row: Logo[], copy: boolean) => (
    <ul className='ptn-set' role='list' aria-hidden={copy || undefined}>
      {row.map(logo => (
        <li key={logo.slug} className='ptn-logo'>
          <img
            src={`/images/partners/${logo.slug}.webp`}
            alt={
              copy
                ? ''
                : typeof logo.name === 'string'
                  ? logo.name
                  : localize(logo.name, locale)
            }
            width={logo.w}
            height={logo.h}
            loading='lazy'
            decoding='async'
            style={{ '--w': logo.w } as CSSProperties}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={`ptn-band${paused ? ' is-paused' : ''}`}>
      <div className='ptn-head'>
        <h2 id={id} className='ptn-title'>
          {localize(ui.partnerLogosTitle, locale)}
        </h2>
        <button
          type='button'
          className='ptn-toggle'
          aria-pressed={paused}
          aria-label={localize(text.pause, locale)}
          title={localize(paused ? text.play : text.pause, locale)}
          onClick={() => setPaused(value => !value)}
        >
          {paused ? <PlayIcon aria-hidden='true' /> : <PauseIcon aria-hidden='true' />}
        </button>
      </div>
      <div className='ptn-rows'>
        {rows.map((row, index) => (
          <div className='ptn-row' key={index}>
            {/* ~5s per logo keeps the drift calm at any count */}
            <div
              className='ptn-track'
              style={{ '--dur': `${row.length * 5}s` } as CSSProperties}
            >
              {set(row, false)}
              {set(row, true)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
