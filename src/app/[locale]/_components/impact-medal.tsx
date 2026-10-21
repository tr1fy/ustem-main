'use client'

/**
 * Slot for the 3D FIRST Global medal next to «4×» (medal-scene.ts). It is
 * decorative only (aria-hidden). three.js is fetched when the card comes
 * within 600px of the viewport; the medal falls in on its lanyard once half
 * of the slot is on screen. The same moment starts the timeline medals'
 * entrance: the card goes from .imp-wait to .imp-in (home.css).
 *   Reduced motion: the medal simply hangs, nothing moves.
 *   No WebGL / load error: a flat CSS medal with the logo takes its place.
 */
import { useEffect, useRef, useState } from 'react'

import type { MedalScene } from './medal-scene'

const LOGO = '/images/brand/first-global-logo.png'
/** The card's own rise (home.css imp-rise: 380 ms delay + 1 s) ends here. */
const CARD_SETTLED = 1400

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })

export default function ImpactMedal() {
  const box = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [flat, setFlat] = useState(false)

  useEffect(() => {
    const node = box.current
    const canvas = canvasRef.current
    if (!node || !canvas) return undefined
    const card = node.closest('.imp-card')
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    let scene: MedalScene | null = null
    let disposed = false
    let inView = false
    let started = false
    let timer = 0

    if (!reduced) card?.classList.add('imp-wait')

    const fit = () => scene?.resize(canvas.clientWidth, canvas.clientHeight)
    const sized = new ResizeObserver(fit)
    const live = () => scene?.setVisible(inView && !document.hidden)

    const drop = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(
        () => scene?.drop(),
        Math.max(0, CARD_SETTLED - performance.now())
      )
    }

    const load = async () => {
      try {
        const [{ createMedalScene }, logo] = await Promise.all([
          import('./medal-scene'),
          loadImage(LOGO)
        ])
        if (disposed) return
        scene = createMedalScene(canvas, logo)
        fit()
        sized.observe(canvas)
        live()
        if (reduced) scene.still()
        else if (started) drop()
      } catch {
        if (!disposed) setFlat(true)
      }
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        load()
      },
      { rootMargin: '600px 0px' }
    )
    const seen = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        live()
        if (started || entry.intersectionRatio < 0.5) return
        started = true
        card?.classList.remove('imp-wait')
        card?.classList.add('imp-in')
        if (scene && !reduced) drop()
      },
      { threshold: [0, 0.5] }
    )
    near.observe(node)
    seen.observe(node)
    document.addEventListener('visibilitychange', live)

    return () => {
      disposed = true
      window.clearTimeout(timer)
      near.disconnect()
      seen.disconnect()
      sized.disconnect()
      document.removeEventListener('visibilitychange', live)
      scene?.dispose()
      card?.classList.remove('imp-wait', 'imp-in')
    }
  }, [])

  return (
    <div ref={box} className='imp-medal' aria-hidden='true'>
      <canvas ref={canvasRef} className='imp-medal-canvas' hidden={flat} />
      {flat && <span className='imp-medal-flat' />}
    </div>
  )
}
