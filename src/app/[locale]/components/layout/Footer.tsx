'use client'

/*
 * Site footer (TZ 5.4) — the brand's blue identity moment and the contacts
 * block of the homepage. Deep Aral-blue surface with two partially cropped
 * lighter-blue circles in the top-right corner (never behind small text),
 * the white logo (guideline «Logo on blue»), a large H2, e-mail, phone and
 * Instagram, link columns (navigation, about, social accounts), the legal
 * line (©, name, BIN, address) and «Back to top».
 * On /contacts the contact block is left out: the page itself lists the same
 * e-mail, phone and Instagram just above.
 * Keeps the class .site-footer: Navbar makes it inert while the mobile menu
 * is open; the «Көмектесу» window steps aside when it reaches it.
 */

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useLocale } from 'next-intl'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { Link, usePathname } from '@/i18n/routing'
import { localize, navItems, site, ui, words } from '@/lib/site-content'

/** Focus target rendered first in AppShell ("Back to top" moves focus here). */
const PAGE_TOP_ID = 'page-top'

const text = {
  newTab: words(
    'жаңа қойындыда ашылады',
    'откроется в новой вкладке',
    'opens in a new tab'
  )
}

/** Stagger index for the entrance cascade (see footer.css). */
const order = (i: number) => ({ '--i': i }) as CSSProperties

function InstagramIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='5'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
      <circle
        cx='12'
        cy='12'
        r='4.2'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
      <circle cx='17.3' cy='6.7' r='1.15' fill='currentColor' />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <rect
        x='2.5'
        y='5.5'
        width='19'
        height='13'
        rx='4'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.7'
      />
      <path fill='currentColor' d='M10 9.2v5.6l4.8-2.8L10 9.2Z' />
    </svg>
  )
}

const socialIcons = {
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  youtube: YouTubeIcon
}

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

/**
 * Entrance cascade: armed only after mount and only without reduced motion,
 * so the footer is always fully visible without JS.
 */
function useFooterEntrance() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = ref.current
    if (
      !node ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    // Already on screen (short page): stay as rendered, no flash.
    if (node.getBoundingClientRect().top < window.innerHeight) return
    node.classList.add('is-armed')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.classList.add('is-in')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function Footer() {
  const locale = useLocale()
  const t = (value: Parameters<typeof localize>[0]) => localize(value, locale)
  const ref = useFooterEntrance()
  const compact = usePathname() === '/contacts'

  const aboutLinks = [
    { href: '/about#reports', label: ui.reports },
    { href: '/contacts#media', label: ui.forMedia },
    { href: '/privacy', label: ui.privacy }
  ]

  const backToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // Return keyboard focus to the start of the page without a visual jump.
    document.getElementById(PAGE_TOP_ID)?.focus({ preventScroll: true })
  }

  return (
    <footer
      ref={ref}
      className={`site-footer ftr on-dark${compact ? ' ftr-compact' : ''}`}
    >
      <div className='ftr-art' aria-hidden='true'>
        <span className='ftr-circle ftr-circle-a' />
        <span className='ftr-circle ftr-circle-b' />
      </div>

      <div className='ftr-inner container'>
        {compact ? null : (
          <div className='ftr-contact'>
            <h2 className='ftr-title ftr-in' style={order(0)}>
              {t(ui.footerTitle)}
            </h2>
            <p className='ftr-lead ftr-in' style={order(1)}>
              {t(ui.footerLead)}
            </p>
            <div className='ftr-reach'>
              <a
                className='ftr-email ftr-in'
                style={order(2)}
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
              <div className='ftr-reach-row ftr-in' style={order(3)}>
                <a className='ftr-phone' href={site.phone.href}>
                  {site.phone.display}
                </a>
                <ul className='ftr-social'>
                  <li>
                    <a
                      className='ftr-social-link'
                      href={site.instagram.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <span className='ftr-social-icon'>
                        <InstagramIcon />
                      </span>
                      <span className='ftr-social-handle'>
                        <span className='visually-hidden'>Instagram </span>
                        {site.instagram.handle}
                      </span>
                      <span className='visually-hidden'>
                        {' '}
                        ({t(text.newTab)})
                      </span>
                    </a>
                  </li>
                  {site.telegram ? (
                    <li>
                      <a
                        className='ftr-social-link'
                        href={site.telegram}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <span className='ftr-social-icon'>
                          <TelegramIcon />
                        </span>
                        <span className='ftr-social-handle'>Telegram</span>
                        <span className='visually-hidden'>
                          {' '}
                          ({t(text.newTab)})
                        </span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className='ftr-grid'>
          <div className='ftr-brand ftr-in' style={order(4)}>
            <Link href='/' className='ftr-logo' aria-label={site.name}>
              {/* Official white logo (guideline «Logo on blue»). */}
              <img
                src='/images/brand/ustem-logo-white-480.webp'
                srcSet='/images/brand/ustem-logo-white-480.webp 480w, /images/brand/ustem-logo-white-960.webp 960w'
                sizes='152px'
                alt=''
                width={152}
                height={45}
                loading='lazy'
                decoding='async'
              />
            </Link>
            <p className='ftr-about'>{t(ui.footerDescription)}</p>
            {/* The three countries with their flags. The visible «·» between
                them is CSS; a hidden «, » keeps the names apart for screen
                readers. */}
            <p className='ftr-geo'>
              {site.countries.map((country, i) => (
                <span className='ftr-geo-item' key={country.code}>
                  {i > 0 && <span className='visually-hidden'>, </span>}
                  <img
                    className='ftr-flag'
                    src={country.flag}
                    alt=''
                    width={country.width}
                    height={country.height}
                    loading='lazy'
                    decoding='async'
                  />
                  {t(country.name)}
                </span>
              ))}
            </p>
          </div>

          <nav
            className='ftr-col ftr-col-nav ftr-in'
            style={order(5)}
            aria-labelledby='ftr-nav-title'
          >
            <h3 id='ftr-nav-title'>{t(ui.navigation)}</h3>
            <ul>
              {navItems.map(item => (
                <li key={item.key}>
                  <Link href={item.href}>{t(item.label)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className='ftr-col ftr-in'
            style={order(6)}
            aria-labelledby='ftr-about-title'
          >
            <h3 id='ftr-about-title'>{t(ui.aboutFund)}</h3>
            <ul>
              {aboutLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}>{t(link.label)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className='ftr-col ftr-col-social ftr-in'
            style={order(7)}
            aria-labelledby='ftr-social-title'
          >
            <h3 id='ftr-social-title'>{t(ui.socials)}</h3>
            <ul>
              {site.socials.map(item => {
                const Icon = socialIcons[item.network]
                return (
                  <li key={item.key}>
                    <a href={item.url} target='_blank' rel='noopener noreferrer'>
                      <Icon />
                      <span>
                        {item.network === 'instagram' && (
                          <span className='visually-hidden'>Instagram </span>
                        )}
                        {item.label}
                      </span>
                      <span className='visually-hidden'> ({t(text.newTab)})</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className='ftr-bottom'>
          <p className='ftr-legal' suppressHydrationWarning>
            <span>
              © {new Date().getFullYear()} {t(site.legalName)}
            </span>
            <span>
              {t(ui.bin)} {site.bin}
            </span>
            <span>{t(site.address)}</span>
          </p>
          <button type='button' className='ftr-top' onClick={backToTop}>
            {t(ui.backToTop)}
            <span className='ftr-top-icon' aria-hidden='true'>
              <ArrowUpIcon />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
