'use client'

/**
 * Figma-style smoothed corners ("corner smoothing", iOS squircle) for a
 * block of any size. CSS border-radius only draws circular arcs, so the
 * block is clipped to an SVG path built with Figma's own construction
 * (figma-squircle / Martin Wu's write-up): each corner starts (1 + s)·r
 * from the vertex and blends a shorter circular arc with two Béziers.
 * The path is rebuilt whenever the block resizes.
 *
 * Radius and smoothing come from CSS (--squircle-radius,
 * --squircle-smoothing), so breakpoints can change them; before hydration
 * (and without JS) the block keeps its plain CSS border-radius, which the
 * stylesheet sets to the same radius.
 */
import { useEffect, useRef, type ReactNode } from 'react'

const rad = (deg: number) => (deg * Math.PI) / 180

/** SVG path of a w × h rectangle with smoothed corners of radius r. */
export function squirclePath(w: number, h: number, radius: number, smoothing: number) {
  const budget = Math.min(w, h) / 2
  const r = Math.min(radius, budget)
  // the curve may not run past the middle of the shorter side
  const p = Math.min((1 + smoothing) * r, budget)
  const s = r > 0 ? Math.min(smoothing, p / r - 1) : 0

  const arcMeasure = 90 * (1 - s)
  const arc = Math.sin(rad(arcMeasure / 2)) * r * Math.SQRT2
  const alpha = (90 - arcMeasure) / 2
  const p3p4 = r * Math.tan(rad(alpha / 2))
  const beta = 45 * s
  const c = p3p4 * Math.cos(rad(beta))
  const d = c * Math.tan(rad(beta))
  const b = (p - arc - c - d) / 3
  const a = 2 * b
  const n = (v: number) => +v.toFixed(3)
  const [A, B, C, D, P, R, L] = [a, b, c, d, p, r, arc].map(n)
  const ab = n(a + b)
  const abc = n(a + b + c)
  const bc = n(b + c)

  return [
    `M ${n(w - p)} 0`,
    `c ${A} 0 ${ab} 0 ${abc} ${D}`,
    `a ${R} ${R} 0 0 1 ${L} ${L}`,
    `c ${D} ${C} ${D} ${bc} ${D} ${abc}`,
    `L ${n(w)} ${n(h - p)}`,
    `c 0 ${A} 0 ${ab} ${-D} ${abc}`,
    `a ${R} ${R} 0 0 1 ${-L} ${L}`,
    `c ${-C} ${D} ${-bc} ${D} ${-abc} ${D}`,
    `L ${P} ${n(h)}`,
    `c ${-A} 0 ${-ab} 0 ${-abc} ${-D}`,
    `a ${R} ${R} 0 0 1 ${-L} ${-L}`,
    `c ${-D} ${-C} ${-D} ${-bc} ${-D} ${-abc}`,
    `L 0 ${P}`,
    `c 0 ${-A} 0 ${-ab} ${D} ${-abc}`,
    `a ${R} ${R} 0 0 1 ${L} ${-L}`,
    `c ${C} ${-D} ${bc} ${-D} ${abc} ${-D}`,
    'Z'
  ].join(' ')
}

export default function Squircle({
  className = '',
  children
}: {
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const apply = () => {
      const style = getComputedStyle(node)
      const radius = parseFloat(style.getPropertyValue('--squircle-radius')) || 0
      const smoothing =
        parseFloat(style.getPropertyValue('--squircle-smoothing')) || 0
      // layout size, not the transformed one (the block may be mid-reveal)
      const w = node.offsetWidth
      const h = node.offsetHeight
      if (!w || !h) return
      node.style.clipPath = `path('${squirclePath(w, h, radius, smoothing)}')`
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(node)
    window.addEventListener('resize', apply)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
