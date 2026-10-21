/**
 * Two-sided medal for one FIRST Global Challenge season on the numbers-card
 * timeline. Front: a gold rim around white enamel with the season's
 * official logo (public/images/seasons/fgc-{year}.webp, cut from the logos
 * on first.global). Back: struck gold carrying `children` (the year and
 * city). On hover, keyboard focus or a tap the coin turns 180° (home.css);
 * a stack of gold discs between the faces gives it a visible edge mid-turn.
 * The back is real text, so screen readers read the year and city.
 */
import type { CSSProperties, ReactNode } from 'react'

/** Discs between the two faces (translateZ steps) that form the edge. */
const EDGE = [-2, -1, 0, 1, 2]

function Rim({ id }: { id: string }) {
  return (
    <>
      <circle r={49} fill={`url(#${id}-rim)`} />
      <circle r={45.2} fill={`url(#${id}-bevel)`} />
    </>
  )
}

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
      <radialGradient id={`${id}-enamel`} cx='0.4' cy='0.32' r='0.75'>
        <stop offset='0' stopColor='#ffffff' />
        <stop offset='0.7' stopColor='#f6f8fb' />
        <stop offset='1' stopColor='#e4e9f0' />
      </radialGradient>
      <radialGradient id={`${id}-gold`} cx='0.38' cy='0.32' r='0.8'>
        <stop offset='0' stopColor='#fff0b3' />
        <stop offset='0.45' stopColor='#f2c860' />
        <stop offset='0.8' stopColor='#d29b33' />
        <stop offset='1' stopColor='#b07a22' />
      </radialGradient>
    </defs>
  )
}

export default function SeasonMedal({
  year,
  children
}: {
  year: number
  children: ReactNode
}) {
  const id = `sm${year}`
  return (
    <span className='sm'>
      <span className='sm-flip'>
        {EDGE.map(z => (
          <span
            key={z}
            className='sm-edge'
            style={{ '--z': z } as CSSProperties}
            aria-hidden='true'
          />
        ))}
        <span className='sm-face sm-front' aria-hidden='true'>
          <svg viewBox='-50 -50 100 100' focusable='false'>
            <Gradients id={id} />
            <Rim id={id} />
            <circle r={42.6} fill={`url(#${id}-enamel)`} />
            <circle
              r={42.6}
              fill='none'
              stroke='#b98424'
              strokeOpacity={0.55}
              strokeWidth={0.8}
            />
          </svg>
          <img
            className='sm-logo'
            src={`/images/seasons/fgc-${year}.webp`}
            alt=''
            width={256}
            height={256}
            loading='lazy'
            decoding='async'
          />
        </span>
        <span className='sm-face sm-back'>
          <svg viewBox='-50 -50 100 100' aria-hidden='true' focusable='false'>
            <Rim id={`${id}b`} />
            <Gradients id={`${id}b`} />
            <circle r={42.6} fill={`url(#${id}b-gold)`} />
            <circle
              r={37.4}
              fill='none'
              stroke='#fff4cc'
              strokeOpacity={0.55}
              strokeWidth={0.7}
            />
            <circle
              r={36.6}
              fill='none'
              stroke='#9c6b17'
              strokeOpacity={0.5}
              strokeWidth={0.9}
            />
          </svg>
          <span className='sm-info'>{children}</span>
        </span>
      </span>
    </span>
  )
}
