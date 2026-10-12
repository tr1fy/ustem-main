'use client'

/**
 * Testimonials carousel (TZ §6.5): 3 cards per view on desktop, 2 on tablets,
 * 1 on phones. Native horizontal scroll with snap gives swipe; arrows and
 * ArrowLeft/ArrowRight move by one card. No autoplay.
 * The arrows use aria-disabled (not `disabled`) at either end so a keyboard
 * user who presses "Next" up to the last card keeps focus on the button.
 * Testimonials have no date field yet (TZ §14 item 4), so none is shown.
 * Brand style: airy white cards (--shadow-soft) with one Aral-gradient quote
 * mark, 48px round photos and 48px round arrows.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { localize, testimonials, ui, words } from '@/lib/site-content'

/** The carousel's own name, distinct from the section heading «Нам доверяют»
    (two landmarks must not share one label). */
const carouselLabel = words('Пікірлер', 'Отзывы', 'Testimonials')

/** 96/144px WebP copies of the 48px avatars (public/images/home/avatars). */
const optimizedAvatars = new Set(['baurzhan', 'bagdat', 'sardar', 'elnur', 'amira'])

function avatarSet(photo: string) {
  const name = photo.split('/').pop()?.replace(/\.\w+$/, '') ?? ''
  if (!optimizedAvatars.has(name)) return undefined
  return `/images/home/avatars/${name}-96.webp 96w, /images/home/avatars/${name}-144.webp 144w`
}

export default function Testimonials() {
  const locale = useLocale()
  const trackId = useId()
  const track = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const total = testimonials.length

  const update = useCallback(() => {
    const node = track.current
    if (!node) return
    setAtStart(node.scrollLeft <= 4)
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const move = (direction: 1 | -1) => {
    const node = track.current
    const card = node?.querySelector<HTMLElement>('.tst-item')
    if (!node || !card) return
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) return
    const gap = parseFloat(getComputedStyle(card.parentElement!).columnGap) || 0
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: calm ? 'auto' : 'smooth'
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      move(event.key === 'ArrowRight' ? 1 : -1)
    }
  }

  return (
    <div className='tst'>
      <div
        id={trackId}
        ref={track}
        className='tst-track'
        tabIndex={0}
        role='region'
        aria-roledescription='carousel'
        aria-label={localize(carouselLabel, locale)}
        onScroll={update}
        onKeyDown={onKeyDown}
      >
        <div className='tst-list'>
          {testimonials.map((item, index) => {
            const srcSet = avatarSet(item.photo)
            return (
              <div
                className='tst-item'
                key={item.photo}
                role='group'
                aria-roledescription='slide'
                aria-label={`${index + 1} / ${total}`}
              >
                <figure className='tst-card'>
                  {/* The card's one accent: an Aral-gradient quote mark. */}
                  <span className='tst-mark' aria-hidden='true' />
                  <blockquote>
                    <p>{localize(item.quote, locale)}</p>
                  </blockquote>
                  <figcaption className='tst-person'>
                    {/* Decorative: the name is printed right next to it. */}
                    <picture>
                      {srcSet && (
                        <source type='image/webp' srcSet={srcSet} sizes='48px' />
                      )}
                      <img
                        className='tst-photo'
                        src={item.photo}
                        alt=''
                        width={48}
                        height={48}
                        loading='lazy'
                        decoding='async'
                      />
                    </picture>
                    <span>
                      <span className='tst-name'>{localize(item.name, locale)}</span>
                      <span className='tst-role'>{localize(item.role, locale)}</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            )
          })}
        </div>
      </div>
      <div className='tst-controls'>
        <button
          type='button'
          className='tst-btn'
          aria-label={localize(ui.previous, locale)}
          aria-controls={trackId}
          aria-disabled={atStart}
          onClick={() => move(-1)}
        >
          <ArrowLeftIcon aria-hidden='true' />
        </button>
        <button
          type='button'
          className='tst-btn'
          aria-label={localize(ui.next, locale)}
          aria-controls={trackId}
          aria-disabled={atEnd}
          onClick={() => move(1)}
        >
          <ArrowRightIcon aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}
