/**
 * Vector medals for the FIRST Global Challenge timeline. Each is a gold
 * medal with its season's emblem struck in relief, drawn after the official
 * season logos: 2022 Geneva (petal rosette), 2023 Singapore (orchid
 * pinwheel), 2024 Athens (flame of leaves), 2025 Panamá City (topographic
 * globe). The relief is three copies of the emblem (shade, light, gold);
 * a fourth copy in the season's colours fades in on hover (home.css).
 * Decorative: the year and city are real text next to it in impact-card.
 */
import type { ReactNode } from 'react'

type Paint = 'mono' | 'color'

const leaf = (base: number, tip: number, width: number) => {
  const mid = -(base + tip) / 2
  return `M0 ${-base}Q${width} ${mid} 0 ${-tip}Q${-width} ${mid} 0 ${-base}Z`
}

const fill = (paint: Paint, color: string) =>
  paint === 'mono' ? 'currentColor' : color

/** 2022 Geneva: two rings of twelve petals in red, cyan and slate. */
function geneva(paint: Paint) {
  const tones = ['#d8392b', '#1cb7d9', '#33506b']
  const outer = leaf(16.5, 29.5, 6)
  const inner = leaf(8.5, 18.5, 4.8)
  return (
    <>
      {Array.from({ length: 12 }, (_, k) => (
        <path
          key={`o${k}`}
          d={outer}
          transform={`rotate(${k * 30})`}
          fill={fill(paint, tones[k % 3])}
        />
      ))}
      {Array.from({ length: 12 }, (_, k) => (
        <path
          key={`i${k}`}
          d={inner}
          transform={`rotate(${15 + k * 30})`}
          fill={fill(paint, tones[(k + 1) % 3])}
        />
      ))}
    </>
  )
}

/** 2023 Singapore: a five-arm orchid pinwheel of curved leaves. */
function singapore(paint: Paint) {
  return (
    <>
      {Array.from({ length: 5 }, (_, k) => (
        <g key={k} transform={`rotate(${k * 72})`}>
          <path
            d='M0 -1C8 -7 11 -18 6 -29C2 -21 -3 -11 0 -1Z'
            fill={fill(paint, '#e5313d')}
          />
          <path
            d='M4 -9C10 -12 15 -15 18 -22C12 -20 7 -16 4 -9Z'
            fill={fill(paint, '#f0646e')}
          />
        </g>
      ))}
    </>
  )
}

/** 2024 Athens: a central leaf flanked by two pairs, like a flame. */
function athens(paint: Paint) {
  const sides = (
    <>
      <path
        d='M1.5 16C9.5 10 14 -1 11.5 -15C6.5 -6 3 4 1.5 16Z'
        fill={fill(paint, '#3aa3ec')}
      />
      <path
        d='M2 18C13.5 15 21 6 22.5 -7C15.5 -0.5 8.5 8 2 18Z'
        fill={fill(paint, '#63c1f3')}
      />
    </>
  )
  return (
    <g transform='translate(0 4)'>
      <path
        d='M0 15C6 5 6 -9 0 -26C-6 -9 -6 5 0 15Z'
        fill={fill(paint, '#2386df')}
      />
      {sides}
      <g transform='scale(-1 1)'>{sides}</g>
    </g>
  )
}

/** 2025 Panamá City: a globe of wavy contour lines with a green branch. */
function panama(paint: Paint, clip: string) {
  const tones = [
    '#f59a3f',
    '#f7b558',
    '#a6d23f',
    '#7dc242',
    '#45b3e8',
    '#2b93e2',
    '#5cc8f2',
    '#2c76d2',
    '#1f63c0'
  ]
  return (
    <g clipPath={`url(#${clip})`} fill='none' strokeLinecap='round'>
      {tones.map((tone, i) => {
        const y = -24 + i * 6
        return (
          <path
            key={tone}
            d={`M-30 ${y}C-18 ${y - 5} -8 ${y + 5} 0 ${y}S18 ${y - 5} 30 ${y}`}
            stroke={fill(paint, tone)}
            strokeWidth={3.2}
          />
        )
      })}
      <path
        d='M1 27C-3 16 5 9 0 -1C-4 -9 3 -16 -1 -27'
        stroke={fill(paint, '#b5d84a')}
        strokeWidth={4.2}
      />
    </g>
  )
}

function emblem(year: number, paint: Paint, clip: string): ReactNode {
  if (year === 2022) return geneva(paint)
  if (year === 2023) return singapore(paint)
  if (year === 2024) return athens(paint)
  if (year === 2025) return panama(paint, clip)
  return <circle r={14} fill={fill(paint, '#2386df')} />
}

export default function SeasonMedal({ year }: { year: number }) {
  const id = `sm${year}`
  return (
    <svg
      className='sm'
      viewBox='-50 -62 100 112'
      aria-hidden='true'
      focusable='false'
    >
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
        <radialGradient id={`${id}-face`} cx='0.38' cy='0.32' r='0.8'>
          <stop offset='0' stopColor='#fff0b3' />
          <stop offset='0.45' stopColor='#f2c860' />
          <stop offset='0.8' stopColor='#d29b33' />
          <stop offset='1' stopColor='#b07a22' />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle r={26} />
        </clipPath>
      </defs>
      {/* jump ring and lug */}
      <circle
        cy={-56}
        r={5.4}
        fill='none'
        stroke={`url(#${id}-rim)`}
        strokeWidth={2.6}
      />
      <rect
        x={-4.5}
        y={-52.5}
        width={9}
        height={6}
        rx={2.4}
        fill={`url(#${id}-rim)`}
      />
      {/* rim, bevel, field */}
      <circle r={48} fill={`url(#${id}-rim)`} />
      <circle r={43.6} fill={`url(#${id}-bevel)`} />
      <circle r={41.6} fill={`url(#${id}-face)`} />
      <circle
        r={37.6}
        fill='none'
        stroke='#fff4cc'
        strokeOpacity={0.55}
        strokeWidth={0.7}
      />
      <circle
        r={36.8}
        fill='none'
        stroke='#9c6b17'
        strokeOpacity={0.5}
        strokeWidth={0.9}
      />
      {/* emblem in relief */}
      <g className='sm-relief'>
        <g color='#7a5214' opacity={0.55} transform='translate(0.9 1.1)'>
          {emblem(year, 'mono', `${id}-clip`)}
        </g>
        <g color='#fff4c8' opacity={0.85} transform='translate(-0.7 -0.8)'>
          {emblem(year, 'mono', `${id}-clip`)}
        </g>
        <g color='#c9962c'>{emblem(year, 'mono', `${id}-clip`)}</g>
      </g>
      <g className='sm-color'>{emblem(year, 'color', `${id}-clip`)}</g>
    </svg>
  )
}
