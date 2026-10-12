'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { CheckIcon, LinkIcon } from '@heroicons/react/24/outline'
import { localize, ui, words } from '@/lib/site-content'
import { track } from '@/lib/analytics'

/** Article share row (TZ §8.4): Telegram, WhatsApp, copy link — three 48px
 * round icon buttons; each has a visually hidden name and a tooltip title.
 * The copy confirmation is a visible, polite live region. */

function TelegramIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path
        fill='currentColor'
        d='M20.67 3.72 2.95 10.55c-1.21.49-1.2 1.16-.22 1.46l4.55 1.42 1.74 5.35c.21.58.11.81.72.81.47 0 .68-.22.94-.47l2.27-2.2 4.71 3.48c.87.48 1.49.23 1.71-.81l3.09-14.58c.32-1.27-.48-1.85-1.31-1.47ZM8.3 13.2l9.6-6.06c.48-.29.92-.13.56.19l-8.22 7.42-.32 3.42-1.62-4.97Z'
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      {/* speech bubble */}
      <path
        d='M12 2.75a9.25 9.25 0 0 0-7.95 13.98L2.9 21.1l4.5-1.15A9.25 9.25 0 1 0 12 2.75Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
        strokeLinejoin='round'
      />
      {/* handset */}
      <path
        transform='translate(7.1 7.1) scale(0.41)'
        fill='currentColor'
        d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'
      />
    </svg>
  )
}

const copied = words('Көшірілді', 'Скопировано', 'Copied')
const opensInNewTab = words(
  '(жаңа қойындыда ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)

function copyFallback(text: string) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {}
  field.remove()
  return ok
}

export default function ShareLinks({
  url,
  title,
  id
}: {
  /** Absolute canonical URL of the article. */
  url: string
  title: string
  /** Article slug, for analytics. */
  id: string
}) {
  const locale = useLocale()
  const [done, setDone] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const share = (method: string) =>
    track('share', { method, content_type: 'article', item_id: id })

  const copy = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(url)
      ok = true
    } catch {
      ok = copyFallback(url)
    }
    if (!ok) {
      // Clipboard blocked: let the visitor copy the address by hand.
      window.prompt(localize(ui.copyLink, locale), url)
      return
    }
    share('copy_link')
    setDone(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 2000)
  }

  const external = [
    {
      method: 'telegram',
      label: 'Telegram',
      icon: <TelegramIcon />,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      method: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppIcon />,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    }
  ]
  const copyLabel = localize(done ? copied : ui.copyLink, locale)

  return (
    <div className='nws-share'>
      <p className='nws-share-label' id={`share-${id}`}>
        {localize(ui.share, locale)}
      </p>
      <ul className='nws-share-list' aria-labelledby={`share-${id}`}>
        {external.map(item => (
          <li key={item.method}>
            <a
              className='nws-share-btn'
              href={item.href}
              target='_blank'
              rel='noreferrer'
              title={item.label}
              onClick={() => share(item.method)}
            >
              {item.icon}
              <span className='visually-hidden'>
                {item.label} {localize(opensInNewTab, locale)}
              </span>
            </a>
          </li>
        ))}
        <li>
          <button
            type='button'
            className={`nws-share-btn${done ? ' is-done' : ''}`}
            title={copyLabel}
            onClick={copy}
          >
            {done ? (
              <CheckIcon aria-hidden='true' />
            ) : (
              <LinkIcon aria-hidden='true' />
            )}
            <span className='visually-hidden'>{localize(ui.copyLink, locale)}</span>
          </button>
        </li>
      </ul>
      <span className='nws-share-status' role='status' aria-live='polite'>
        {done ? localize(copied, locale) : ''}
      </span>
    </div>
  )
}
