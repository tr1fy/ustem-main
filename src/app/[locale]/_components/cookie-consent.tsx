'use client'

/*
 * Analytics cookie banner + GA4 loader (TZ §10).
 * GA4 loads only after explicit consent; this is the only place it loads.
 * Without NEXT_PUBLIC_GOOGLE_ANALYTICS nothing is rendered or stored.
 */

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Link } from '@/i18n/routing'
import { localize, ui, words } from '@/lib/site-content'

const COOKIE = 'ustem-consent'
const ONE_YEAR = 60 * 60 * 24 * 365

type Consent = 'granted' | 'denied'

const text = {
  region: words('Cookie келісімі', 'Согласие на cookie', 'Cookie consent'),
  message: words(
    'Сайт қай бөлімдердің пайдалы екенін түсіну үшін Google Analytics cookie файлдарын қолданады.',
    'Сайт использует cookie Google Analytics, чтобы понимать, какие разделы полезны.',
    'This site uses Google Analytics cookies to understand which sections are useful.'
  ),
  accept: words('Қабылдау', 'Принять', 'Accept'),
  decline: words('Бас тарту', 'Отклонить', 'Decline')
}

function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)ustem-consent=(granted|denied)/)
  return match ? (match[1] as Consent) : null
}

function writeConsent(value: Consent) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${value}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`
}

function setBannerFlag(open: boolean) {
  document.documentElement.dataset.cookieBanner = open ? 'open' : 'closed'
}

export default function CookieConsent() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ''
  const locale = useLocale()
  // undefined = not read yet (server render and first client render)
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)

  useEffect(() => {
    if (!gaId) return
    setConsent(readConsent())
  }, [gaId])

  const bannerOpen = Boolean(gaId) && consent === null

  useEffect(() => {
    if (!gaId || consent === undefined) return
    setBannerFlag(bannerOpen)
  }, [gaId, consent, bannerOpen])

  useEffect(() => {
    if (!gaId) return
    return () => {
      delete document.documentElement.dataset.cookieBanner
    }
  }, [gaId])

  if (!gaId) return null
  if (consent === 'granted') return <GoogleAnalytics gaId={gaId} />
  if (!bannerOpen) return null

  const choose = (value: Consent) => {
    writeConsent(value)
    setConsent(value)
  }

  // White card in the support window's language; Accept and Decline share
  // the same size and weight (filled / outlined), see footer.css.
  return (
    <div className='ck' role='region' aria-labelledby='ck-title'>
      <div>
        <p id='ck-title' className='ck-title'>
          {localize(text.region, locale)}
        </p>
        <p className='ck-text'>
          {localize(text.message, locale)}{' '}
          <Link href='/privacy' className='ck-link'>
            {localize(ui.privacy, locale)}
          </Link>
        </p>
      </div>
      <div className='ck-actions'>
        <button
          type='button'
          className='btn btn-primary ck-btn'
          onClick={() => choose('granted')}
        >
          {localize(text.accept, locale)}
        </button>
        <button
          type='button'
          className='btn ck-btn ck-decline'
          onClick={() => choose('denied')}
        >
          {localize(text.decline, locale)}
        </button>
      </div>
    </div>
  )
}
