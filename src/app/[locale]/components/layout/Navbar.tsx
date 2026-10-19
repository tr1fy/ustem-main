'use client'

/**
 * Site header — TZ v1.0 §5.1 (menu), §5.2 (competitions dropdown),
 * §5.3 (sticky / frosted on scroll / mobile menu), §5.5 (language),
 * in the brand-guideline style (white, Inter, Aral-gradient accents).
 * States on <header>: .is-solid (top of the page) · .is-scrolled (frosted
 * white + 1px line) · .is-menu-open. The homepage hero starts below the
 * bar (it is a blue panel now), so no page gets a transparent bar.
 * Styles: src/styles/header.css (prefix .hdr-).
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent
} from 'react'

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useLocale } from 'next-intl'

import { Link, usePathname, useRouter } from '@/i18n/routing'
import { track } from '@/lib/analytics'
import {
  connectEnabled,
  directionEvents,
  flagshipEvents,
  languages,
  localize,
  navItems,
  site,
  ui,
  words,
  type Locale,
  type Localized
} from '@/lib/site-content'

import { UstemLogo } from '../shared/FirstLogo'

/** Header-only copy that is not part of the shared `ui` dictionary. */
const text = {
  mainMenu: words('Негізгі мәзір', 'Основное меню', 'Main menu'),
  mobileMenu: words('Мобильді мәзір', 'Мобильное меню', 'Mobile menu'),
  submenu: words('мәзір', 'меню', 'menu'),
  newTab: words(
    'жаңа бетте ашылады',
    'откроется в новой вкладке',
    'opens in a new tab'
  )
}

const SCROLL_THRESHOLD = 80
const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 250
const DESKTOP_QUERY = '(min-width: 1200px)'

type Opener = 'hover' | 'click' | 'keyboard'
/** Stagger index for the mobile-menu row entrance (header.css, 40ms steps). */
const row = (index: number) => ({ '--i': index }) as CSSProperties
type FocusIntent = 'first' | 'last' | 'current' | null

const isShown = (el: HTMLElement) =>
  el.getClientRects().length > 0 &&
  window.getComputedStyle(el).visibility !== 'hidden'

const focusablesIn = (root: HTMLElement | null) =>
  Array.from(
    root?.querySelectorAll<HTMLElement>(
      'a[href]:not(.skip-link), button:not([disabled])'
    ) ?? []
  ).filter(isShown)

/** ArrowUp/ArrowDown/Home/End roving focus inside a list of links. */
function moveFocus(event: ReactKeyboardEvent, items: HTMLElement[]) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  if (!items.length) return
  event.preventDefault()
  const index = items.indexOf(document.activeElement as HTMLElement)
  const last = items.length - 1
  let next = 0
  if (event.key === 'End') next = last
  else if (event.key === 'ArrowDown')
    next = index < 0 || index === last ? 0 : index + 1
  else if (event.key === 'ArrowUp') next = index <= 0 ? last : index - 1
  items[next]?.focus()
}

export default function Navbar() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const t = (value: Localized) => localize(value, locale)

  const isHome = pathname === '/'
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)
  /** 'page' only on the exact page; 'true' marks the section on its sub-pages. */
  const currentFor = (href: string) =>
    pathname === href ? 'page' : isActive(href) ? 'true' : undefined
  const current = languages.find(item => item.code === locale) ?? languages[0]

  const [atTop, setAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const compItemRef = useRef<HTMLLIElement>(null)
  const chevronRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const langBoxRef = useRef<HTMLDivElement>(null)
  const langButtonRef = useRef<HTMLButtonElement>(null)
  const langListRef = useRef<HTMLUListElement>(null)
  const hoverTimer = useRef<number>()
  const panelOpener = useRef<Opener>('click')
  const panelFocus = useRef<FocusIntent>(null)
  const langFocus = useRef<FocusIntent>(null)

  const scrolled = !atTop && !menuOpen

  /* ---------- §5.3 frosted after 80px ---------- */
  useEffect(() => {
    const update = () => setAtTop(window.scrollY < SCROLL_THRESHOLD)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])

  /* ---------- close everything on navigation ---------- */
  useEffect(() => {
    setMenuOpen(false)
    setPanelOpen(false)
    setLangOpen(false)
  }, [pathname, locale])

  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  /* ---------- mobile menu: lock, inert, trap, Esc, breakpoint ---------- */
  useEffect(() => {
    if (!menuOpen) return undefined
    const root = document.documentElement
    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    root.dataset.menuOpen = 'true'
    const background = [
      document.getElementById('main-content'),
      document.querySelector<HTMLElement>('.site-footer')
    ]
    background.forEach(node => node?.setAttribute('inert', ''))

    const media = window.matchMedia(DESKTOP_QUERY)
    const onMedia = () => {
      if (media.matches) setMenuOpen(false)
    }
    media.addEventListener('change', onMedia)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusablesIn(headerRef.current)
      if (!items.length) return
      const [first] = items
      const last = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!active || !items.includes(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      body.style.overflow = previousOverflow
      delete root.dataset.menuOpen
      background.forEach(node => node?.removeAttribute('inert'))
      media.removeEventListener('change', onMedia)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  /* ---------- desktop popovers: outside click + Esc ---------- */
  useEffect(() => {
    if (!panelOpen && !langOpen) return undefined
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!compItemRef.current?.contains(target)) setPanelOpen(false)
      if (!langBoxRef.current?.contains(target)) setLangOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const active = document.activeElement
      if (panelOpen) {
        setPanelOpen(false)
        if (compItemRef.current?.contains(active)) chevronRef.current?.focus()
      }
      if (langOpen) {
        setLangOpen(false)
        if (langBoxRef.current?.contains(active)) langButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [panelOpen, langOpen])

  /* ---------- move focus into a popover once it is visible ---------- */
  useEffect(() => {
    if (!panelOpen || !panelFocus.current) return
    const links = focusablesIn(panelRef.current)
    const target =
      panelFocus.current === 'last' ? links[links.length - 1] : links[0]
    panelFocus.current = null
    target?.focus()
  }, [panelOpen])

  useEffect(() => {
    if (!langOpen || !langFocus.current) return
    const options = focusablesIn(langListRef.current)
    let target = options.find(item => item.getAttribute('aria-current'))
    if (langFocus.current === 'first' || !target) [target] = options
    if (langFocus.current === 'last') target = options[options.length - 1]
    langFocus.current = null
    target?.focus()
  }, [langOpen])

  /* ---------- §5.2 competitions dropdown ---------- */
  const openPanel = (opener: Opener, focus: FocusIntent = null) => {
    window.clearTimeout(hoverTimer.current)
    panelOpener.current = opener
    setLangOpen(false)
    if (panelOpen && focus) {
      const links = focusablesIn(panelRef.current)
      ;(focus === 'last' ? links[links.length - 1] : links[0])?.focus()
      return
    }
    panelFocus.current = focus
    setPanelOpen(true)
  }

  const onItemPointerEnter = (event: ReactPointerEvent) => {
    if (event.pointerType === 'touch') return
    window.clearTimeout(hoverTimer.current)
    if (panelOpen) return
    hoverTimer.current = window.setTimeout(
      () => openPanel('hover'),
      HOVER_OPEN_DELAY
    )
  }

  const onItemPointerLeave = (event: ReactPointerEvent) => {
    if (event.pointerType === 'touch') return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      const active = document.activeElement
      // Keep the panel while a keyboard user is working inside it.
      if (
        panelRef.current?.contains(active) &&
        active instanceof HTMLElement &&
        active.matches(':focus-visible')
      )
        return
      setPanelOpen(false)
    }, HOVER_CLOSE_DELAY)
  }

  const onItemBlur = (event: ReactFocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && !event.currentTarget.contains(next)) setPanelOpen(false)
  }

  const onChevronClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const viaKeyboard = event.detail === 0
    if (panelOpen) {
      // A mouse click right after hover-open pins the panel instead of
      // closing it under the pointer.
      if (!viaKeyboard && panelOpener.current === 'hover') {
        window.clearTimeout(hoverTimer.current)
        panelOpener.current = 'click'
        return
      }
      setPanelOpen(false)
      return
    }
    openPanel(viaKeyboard ? 'keyboard' : 'click', viaKeyboard ? 'first' : null)
  }

  const onChevronKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openPanel('keyboard', event.key === 'ArrowDown' ? 'first' : 'last')
    }
  }

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) =>
    moveFocus(event, focusablesIn(panelRef.current))

  /* ---------- §5.5 language ---------- */
  const switchLanguage = (code: Locale) => {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;SameSite=Lax`
    setLangOpen(false)
    setMenuOpen(false)
    if (code === locale) return
    track('language_switch', { to: code })
    router.replace(pathname + window.location.search + window.location.hash, {
      locale: code,
      scroll: false
    })
  }

  const onLanguageLinkClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    code: Locale
  ) => {
    // Let modified clicks open the other language in a new tab/window.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    event.preventDefault()
    switchLanguage(code)
  }

  const onLangButtonClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (langOpen) {
      setLangOpen(false)
      return
    }
    setPanelOpen(false)
    langFocus.current = event.detail === 0 ? 'current' : null
    setLangOpen(true)
  }

  const onLangButtonKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setPanelOpen(false)
    if (langOpen) {
      const options = focusablesIn(langListRef.current)
      ;(event.key === 'ArrowDown'
        ? options[0]
        : options[options.length - 1]
      )?.focus()
      return
    }
    langFocus.current = event.key === 'ArrowDown' ? 'first' : 'last'
    setLangOpen(true)
  }

  const onLangBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && !event.currentTarget.contains(next)) setLangOpen(false)
  }

  const languageHref = (code: Locale) =>
    `/${code}${pathname === '/' ? '' : pathname}`

  /* ---------- mobile menu ---------- */
  const toggleMenu = () => {
    setPanelOpen(false)
    setLangOpen(false)
    if (!menuOpen) setGroupOpen(isActive('/competitions'))
    setMenuOpen(!menuOpen)
  }
  const closeMenu = () => setMenuOpen(false)

  const onConnectClick = (place: string) => () => {
    track('connect_click', { place })
    setMenuOpen(false)
  }

  const headerClass = [
    'site-header',
    scrolled ? 'is-scrolled' : 'is-solid',
    menuOpen ? 'is-menu-open' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header ref={headerRef} className={headerClass}>
      <a className='skip-link' href='#main-content'>
        {t(ui.skip)}
      </a>

      <div className='hdr-bar container'>
        <Link
          href='/'
          className='hdr-logo'
          aria-label={site.name}
          aria-current={isHome ? 'page' : undefined}
          onClick={closeMenu}
        >
          <UstemLogo />
        </Link>

        {/* ---------- desktop navigation (≥1200px) ---------- */}
        <nav className='hdr-nav' aria-label={t(text.mainMenu)}>
          <ul className='hdr-nav-list'>
            {navItems.map(item => {
              const itemCurrent = currentFor(item.href)
              const label = t(item.label)
              if (item.key !== 'competitions') {
                return (
                  <li key={item.key} className='hdr-nav-item'>
                    <Link
                      href={item.href}
                      className='hdr-nav-link'
                      aria-current={itemCurrent}
                    >
                      {label}
                    </Link>
                  </li>
                )
              }
              return (
                <li
                  key={item.key}
                  ref={compItemRef}
                  className='hdr-nav-item hdr-has-panel'
                  onPointerEnter={onItemPointerEnter}
                  onPointerLeave={onItemPointerLeave}
                  onBlur={onItemBlur}
                >
                  <Link
                    href={item.href}
                    className='hdr-nav-link hdr-nav-link-split'
                    aria-current={itemCurrent}
                  >
                    {label}
                  </Link>
                  <button
                    ref={chevronRef}
                    type='button'
                    className='hdr-chevron'
                    aria-expanded={panelOpen}
                    aria-controls='hdr-competitions-panel'
                    aria-label={`${label} — ${t(text.submenu)}`}
                    onClick={onChevronClick}
                    onKeyDown={onChevronKeyDown}
                  >
                    <ChevronDownIcon aria-hidden='true' />
                  </button>

                  <div
                    ref={panelRef}
                    id='hdr-competitions-panel'
                    className={`hdr-panel${panelOpen ? ' is-open' : ''}`}
                    onKeyDown={onPanelKeyDown}
                  >
                    <Link
                      href='/competitions'
                      className='hdr-panel-all'
                      aria-current={
                        pathname === '/competitions' ? 'page' : undefined
                      }
                    >
                      {t(ui.allCompetitions)}
                      <ArrowRightIcon aria-hidden='true' />
                    </Link>
                    <div className='hdr-panel-cols'>
                      <div>
                        <p className='hdr-panel-heading' id='hdr-flagships'>
                          {t(ui.flagships)}
                        </p>
                        <ul
                          className='hdr-panel-list'
                          aria-labelledby='hdr-flagships'
                        >
                          {flagshipEvents.map(event => (
                            <li key={event.slug}>
                              <Link
                                href={`/competitions/${event.slug}`}
                                className='hdr-panel-link'
                                aria-current={currentFor(
                                  `/competitions/${event.slug}`
                                )}
                              >
                                {event.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className='hdr-panel-heading' id='hdr-directions'>
                          {t(ui.directions)}
                        </p>
                        <ul
                          className='hdr-panel-list'
                          aria-labelledby='hdr-directions'
                        >
                          {directionEvents.map(event => (
                            <li key={event.slug}>
                              <Link
                                href={`/competitions/${event.slug}`}
                                className='hdr-panel-link'
                                aria-current={currentFor(
                                  `/competitions/${event.slug}`
                                )}
                              >
                                {event.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className='hdr-actions'>
          {connectEnabled && (
            <a
              className='btn btn-primary hdr-connect'
              href={site.connectUrl}
              target='_blank'
              rel='noreferrer'
              onClick={onConnectClick('header')}
            >
              USTEM Connect
              <span className='visually-hidden'> ({t(text.newTab)})</span>
              <ArrowUpRightIcon aria-hidden='true' />
            </a>
          )}

          {/* ---------- §5.5 language dropdown ---------- */}
          <div ref={langBoxRef} className='hdr-lang' onBlur={onLangBlur}>
            <button
              ref={langButtonRef}
              type='button'
              className='hdr-lang-btn'
              aria-expanded={langOpen}
              aria-controls='hdr-lang-list'
              onClick={onLangButtonClick}
              onKeyDown={onLangButtonKeyDown}
            >
              <span className='visually-hidden'>{t(ui.language)}: </span>
              {current.short}
              <ChevronDownIcon aria-hidden='true' />
            </button>
            <ul
              ref={langListRef}
              id='hdr-lang-list'
              className={`hdr-lang-list${langOpen ? ' is-open' : ''}`}
              aria-label={t(ui.language)}
              onKeyDown={event =>
                moveFocus(event, focusablesIn(langListRef.current))
              }
            >
              {languages.map(item => {
                const active = item.code === locale
                return (
                  <li key={item.code}>
                    <a
                      className='hdr-lang-option'
                      href={languageHref(item.code)}
                      lang={item.lang}
                      hrefLang={item.lang}
                      aria-current={active ? 'true' : undefined}
                      onClick={event => onLanguageLinkClick(event, item.code)}
                    >
                      {item.name}
                      {active && <CheckIcon aria-hidden='true' />}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            ref={burgerRef}
            type='button'
            className='hdr-burger'
            aria-expanded={menuOpen}
            aria-controls='hdr-mobile-menu'
            aria-label={menuOpen ? t(ui.close) : t(ui.openMenu)}
            onClick={toggleMenu}
          >
            {/* two lines that rotate into an ×; header.css */}
            <span className='hdr-burger-lines' aria-hidden='true'>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* ---------- mobile menu (<1200px) ---------- */}
      <div
        id='hdr-mobile-menu'
        className={`hdr-mobile${menuOpen ? ' is-open' : ''}`}
      >
        <div className='hdr-mobile-inner container'>
          <nav aria-label={t(text.mobileMenu)}>
            <ul className='hdr-m-list'>
              {navItems.map((item, index) => {
                const itemCurrent = currentFor(item.href)
                const label = t(item.label)
                if (item.key !== 'competitions') {
                  return (
                    <li
                      key={item.key}
                      className='hdr-m-item'
                      style={row(index)}
                    >
                      <Link
                        href={item.href}
                        className='hdr-m-link'
                        aria-current={itemCurrent}
                        onClick={closeMenu}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                }
                return (
                  <li key={item.key} className='hdr-m-item' style={row(index)}>
                    <button
                      type='button'
                      className={`hdr-m-link hdr-m-toggle${
                        itemCurrent ? ' is-active' : ''
                      }`}
                      aria-expanded={groupOpen}
                      aria-controls='hdr-m-competitions'
                      onClick={() => setGroupOpen(!groupOpen)}
                    >
                      {label}
                      <ChevronDownIcon aria-hidden='true' />
                    </button>
                    <div
                      id='hdr-m-competitions'
                      className='hdr-m-group'
                      hidden={!groupOpen}
                    >
                      <Link
                        href='/competitions'
                        className='hdr-m-all'
                        aria-current={
                          pathname === '/competitions' ? 'page' : undefined
                        }
                        onClick={closeMenu}
                      >
                        {t(ui.allCompetitions)}
                        <ArrowRightIcon aria-hidden='true' />
                      </Link>
                      <p className='hdr-m-heading' id='hdr-m-flagships'>
                        {t(ui.flagships)}
                      </p>
                      <ul
                        className='hdr-m-sublist'
                        aria-labelledby='hdr-m-flagships'
                      >
                        {flagshipEvents.map(event => (
                          <li key={event.slug}>
                            <Link
                              href={`/competitions/${event.slug}`}
                              className='hdr-m-sublink'
                              aria-current={currentFor(
                                `/competitions/${event.slug}`
                              )}
                              onClick={closeMenu}
                            >
                              {event.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className='hdr-m-heading' id='hdr-m-directions'>
                        {t(ui.directions)}
                      </p>
                      <ul
                        className='hdr-m-sublist'
                        aria-labelledby='hdr-m-directions'
                      >
                        {directionEvents.map(event => (
                          <li key={event.slug}>
                            <Link
                              href={`/competitions/${event.slug}`}
                              className='hdr-m-sublink'
                              aria-current={currentFor(
                                `/competitions/${event.slug}`
                              )}
                              onClick={closeMenu}
                            >
                              {event.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className='hdr-m-footer' style={row(navItems.length)}>
            {connectEnabled && (
              <a
                className='btn btn-primary btn-block hdr-m-connect'
                href={site.connectUrl}
                target='_blank'
                rel='noreferrer'
                onClick={onConnectClick('mobile_menu')}
              >
                <span>
                  USTEM Connect
                  <span className='visually-hidden'> ({t(text.newTab)})</span>
                </span>
                <ArrowUpRightIcon aria-hidden='true' />
              </a>
            )}
            <div
              className='hdr-m-langs'
              role='group'
              aria-label={t(ui.language)}
            >
              {languages.map(item => (
                <button
                  key={item.code}
                  type='button'
                  className='hdr-m-lang'
                  lang={item.lang}
                  aria-pressed={item.code === locale}
                  onClick={() => switchLanguage(item.code)}
                >
                  {item.short}
                  <span className='visually-hidden'> — {item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
