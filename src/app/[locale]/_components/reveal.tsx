'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Reveal({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    node.classList.add('will-reveal')
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}

export function Count({
  value,
  suffix = ''
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(value)
  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1450, 1)
          setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden='true'>
        {String(count).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009')}
        {suffix}
      </span>
    </span>
  )
}
