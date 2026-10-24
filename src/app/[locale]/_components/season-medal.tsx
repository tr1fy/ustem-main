/**
 * Two-sided gold coin for one FIRST Global Challenge season on the
 * numbers-card timeline, in the same gold as the 3D medal next to it.
 * Front: the season's official logo struck in gold relief (a gold gradient
 * cut to the logo's shape, with a light edge above and a shadow below).
 * Back: the same logo in its own colours on white enamel. Hover or a tap
 * turns the coin over (home.css); a stack of gold discs between the faces
 * gives it an edge mid-turn. Logos: public/images/seasons/fgc-{year}.webp,
 * cut from the official files on first.global. Decorative: the year and
 * city are printed under the coin in impact-card.tsx.
 */
import type { CSSProperties } from 'react'

/** Discs between the two faces (translateZ steps) that form the edge. */
const EDGE = [-2, -1, 0, 1, 2]

function Gradients({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-rim`} x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stopColor='#fff1b8' />
        <stop offset='0.35' stopColor='#efc35a' />
        <stop offset='0.7' stopColor='#c48a28' />
        <stop offset='1' stopColor='#8f5f14' />
      </linearGradient>
      <linearGradient id={`${id}-bevel`} x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stopColor='#9b6a1a' />
        <stop offset='0.5' stopColor='#d9a540' />
        <stop offset='1' stopColor='#fde9a6' />
      </linearGradient>
      <radialGradient id={`${id}-gold`} cx='0.38' cy='0.32' r='0.8'>
        <stop offset='0' stopColor='#ffeeb0' />
        <stop offset='0.45' stopColor='#ecc05a' />
        <stop offset='0.8' stopColor='#cf9831' />
        <stop offset='1' stopColor='#ad7722' />
      </radialGradient>
      <radialGradient id={`${id}-enamel`} cx='0.4' cy='0.32' r='0.75'>
        <stop offset='0' stopColor='#ffffff' />
        <stop offset='0.7' stopColor='#f6f8fb' />
        <stop offset='1' stopColor='#e4e9f0' />
      </radialGradient>
    </defs>
  )
}

/** Rim, bevel and field of one face; `field` is the gradient id suffix. */
function Face({ id, field }: { id: string; field: 'gold' | 'enamel' }) {
  return (
    <svg viewBox='-50 -50 100 100' aria-hidden='true' focusable='false'>
      <circle r={49} fill={`url(#${id}-rim)`} />
      <circle r={45.2} fill={`url(#${id}-bevel)`} />
      <circle r={42.6} fill={`url(#${id}-${field})`} />
      {field === 'gold' ? (
        <>
          <circle
            r={38.4}
            fill='none'
            stroke='#fff4cc'
            strokeOpacity={0.5}
            strokeWidth={0.7}
          />
          <circle
            r={37.6}
            fill='none'
            stroke='#9c6b17'
            strokeOpacity={0.45}
            strokeWidth={0.9}
          />
        </>
      ) : (
        <circle
          r={42.6}
          fill='none'
          stroke='#b98424'
          strokeOpacity={0.55}
          strokeWidth={0.8}
        />
      )}
    </svg>
  )
}

export default function SeasonMedal({ year }: { year: number }) {
  const id = `sm${year}`
  const logo = `/images/seasons/fgc-${year}.webp`
  return (
    <span className='sm' aria-hidden='true'>
      <svg className='sm-defs' width='0' height='0' focusable='false'>
        <Gradients id={id} />
      </svg>
      <span className='sm-flip'>
        {EDGE.map(z => (
          <span
            key={z}
            className='sm-edge'
            style={{ '--z': z } as CSSProperties}
          />
        ))}
        <span className='sm-face sm-front'>
          <Face id={id} field='gold' />
          <span className='sm-relief'>
            <span
              className='sm-relief-ink'
              style={{ '--logo': `url(${logo})` } as CSSProperties}
            />
          </span>
        </span>
        <span className='sm-face sm-back'>
          <Face id={id} field='enamel' />
          <img
            className='sm-logo'
            src={logo}
            alt=''
            width={256}
            height={256}
            loading='lazy'
            decoding='async'
          />
        </span>
      </span>
    </span>
  )
}
