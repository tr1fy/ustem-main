/**
 * Homepage hero (TZ §6.1), Figma «Hero» (node 400-1048): a full-bleed Aral
 * panel of concentric circles on the left, a photo on the right. The circles
 * share one centre near the bottom-left of the copy; the outer two sit
 * behind the people and the inner two in front of the table, so the people
 * step out of the photo over the blue.
 * Four photos take turns, 5s each (a CSS crossfade; reduced motion keeps
 * the first), each with a glass label naming where that team competed.
 * Layers, back to front: the photos → circles 4 and 3 → the same photos
 * masked to the people's silhouettes → circles 2 and 1 → labels → copy. A
 * photo and its silhouette share one src, so each is downloaded and decoded
 * once; the masks are the alpha of each cut-out on its photo's own canvas.
 * The line above the heading names the three countries (text only; the
 * flags are in the footer).
 * Server component — the entrance and the crossfade are pure CSS.
 */
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { localize, site, ui } from '@/lib/site-content'

/* Framing per slide and breakpoint lives in home.css (.hero-s1 … .hero-s4). */
const slides = [
  {
    id: 's1',
    srcSet: [
      '/images/people/team-fll-hero-1000.webp 1000w',
      '/images/people/team-fll-hero-1800.webp 1800w',
      '/images/people/team-fll-hero-2600.webp 2600w'
    ].join(', '),
    src: '/images/people/team-fll-hero-1800.webp',
    /* 1140px of the 1440 frame (≈79vw), 108vw, 136vw */
    sizes: '(min-width: 1024px) 80vw, (min-width: 768px) 108vw, 136vw',
    width: 3797,
    height: 2447,
    alt: ui.heroPhotoAlt,
    label: ui.heroLabelFll
  },
  {
    id: 's2',
    srcSet: [
      '/images/people/fll-referee-hero-1000.webp 1000w',
      '/images/people/fll-referee-hero-1600.webp 1600w',
      '/images/people/fll-referee-hero-2200.webp 2200w'
    ].join(', '),
    src: '/images/people/fll-referee-hero-1600.webp',
    /* 999px of the 1440 frame (≈69vw), 122vw, 132vw */
    sizes: '(min-width: 1024px) 70vw, (min-width: 768px) 122vw, 132vw',
    width: 3258,
    height: 2604,
    alt: ui.heroPhoto2Alt,
    label: ui.heroLabelFll
  },
  {
    id: 's3',
    srcSet: [
      '/images/people/ftc-team-hero-1000.webp 1000w',
      '/images/people/ftc-team-hero-1700.webp 1700w',
      '/images/people/ftc-team-hero-2500.webp 2500w'
    ].join(', '),
    src: '/images/people/ftc-team-hero-1700.webp',
    /* 1241px of the 1440 frame (≈86vw), 104vw, 140vw */
    sizes: '(min-width: 1024px) 86vw, (min-width: 768px) 104vw, 140vw',
    width: 2913,
    height: 2335,
    alt: ui.heroPhoto3Alt,
    label: ui.heroLabelFtc
  },
  {
    id: 's4',
    srcSet: [
      '/images/people/fgc-team-hero-1200.webp 1200w',
      '/images/people/fgc-team-hero-2000.webp 2000w',
      '/images/people/fgc-team-hero-3000.webp 3000w'
    ].join(', '),
    src: '/images/people/fgc-team-hero-2000.webp',
    /* 1526px of the 1440 frame (≈106vw), 140vw, 145vw */
    sizes: '(min-width: 1024px) 106vw, (min-width: 768px) 140vw, 145vw',
    width: 4240,
    height: 2384,
    alt: ui.heroPhoto4Alt,
    label: ui.heroLabelFgc
  }
]

/** «FIRST» is always set in italics (FIRST brand rule). */
function brand(text: string) {
  return text
    .split(/(\bFIRST\b)/)
    .map((part, i) => (part === 'FIRST' ? <em key={i}>FIRST</em> : part))
}

export default function Hero({ locale }: { locale: string }) {
  const t = (value: Parameters<typeof localize>[0]) => localize(value, locale)
  // One sentence per block: each wraps (balanced) on its own, as in the
  // layout, instead of the second sentence starting mid-line. One- and
  // two-letter words («и», «в», «на») are tied to the next word, so a line
  // never ends on one.
  const sentences = t(ui.heroText)
    .replace(/(?<=^|\s)(\p{L}{1,2})\s+/gu, '$1\u00a0')
    .split(/(?<=\.)\s+/)

  return (
    <section className='hero' aria-labelledby='hero-title'>
      <div className='container hero-content'>
        <p className='hero-geo'>{t(site.geography)}</p>
        <h1 id='hero-title'>{t(ui.heroTitle)}</h1>
        <p className='hero-text'>
          {sentences.map(sentence => (
            <span key={sentence}>{sentence} </span>
          ))}
        </p>
        <div className='hero-actions'>
          <Link className='btn hero-btn hero-btn-primary' href='/competitions'>
            {t(ui.heroCta)}
            <ArrowRightIcon aria-hidden='true' />
          </Link>
          <Link className='btn hero-btn hero-btn-ghost' href='/about'>
            {t(ui.heroAbout)}
          </Link>
        </div>
      </div>

      {/* After the copy in the DOM, so the heading is read first. */}
      <div className='hero-art'>
        {/* Each image sits in its own slide layer: the layer crossfades, the
            image runs the entrance, so the two animations never fight. */}
        {slides.map((slide, i) => (
          <span
            className={`hero-slide hero-slide-photo hero-${slide.id}`}
            key={slide.id}
          >
            <img
              className='hero-photo'
              src={slide.src}
              srcSet={slide.srcSet}
              sizes={slide.sizes}
              alt={t(slide.alt)}
              width={slide.width}
              height={slide.height}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding='async'
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </span>
        ))}
        <span className='hero-ring hero-ring-4' />
        <span className='hero-ring hero-ring-3' />
        {slides.map((slide, i) => (
          <span
            className={`hero-slide hero-slide-cut hero-${slide.id}`}
            key={slide.id}
          >
            <img
              className='hero-photo hero-cutout'
              src={slide.src}
              srcSet={slide.srcSet}
              sizes={slide.sizes}
              alt=''
              aria-hidden='true'
              width={slide.width}
              height={slide.height}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding='async'
            />
          </span>
        ))}
        <span className='hero-ring hero-ring-2' />
        <span className='hero-ring hero-ring-1' />
        {/* The alt texts already say where each team is; the labels repeat
            it visually, so screen readers skip them. Each label fades on
            its own (not through a wrapper), so its backdrop blur keeps
            seeing the photo behind it. */}
        <span className='container hero-label-row' aria-hidden='true'>
          {slides.map(slide => (
            <span className={`hero-label hero-${slide.id}`} key={slide.id}>
              {/* one inline box, so the flex label keeps the spaces around
                  the italic «FIRST» */}
              <span>{brand(t(slide.label))}</span>
            </span>
          ))}
        </span>
      </div>
    </section>
  )
}
