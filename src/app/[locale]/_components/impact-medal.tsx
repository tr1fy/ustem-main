'use client'

/**
 * Slot for the 3D FIRST Global medal next to «4×» (medal-scene.ts). It is
 * decorative only (aria-hidden). Its canvas is stretched from the bottom
 * edge of the hero (homepage) or the card top (inner pages) down to the
 * slot, so the lanyard runs out from under the hero. three.js is fetched
 * when the card comes within 600px of the viewport; the medal falls in
 * once half of the slot is on screen. The same moment starts the season
 * medals' entrance: the card goes from .imp-wait to .imp-in (home.css).
 * On touch screens a tap turns a season medal over (.is-flipped).
 *   Reduced motion: the medal simply hangs, nothing moves.
 *   No WebGL / load error: a flat CSS medal with the logo takes its place.
 */
import { useEffect, useRef, useState } from 'react'

import type { MedalScene } from './medal-scene'

const LOGO = '/images/brand/first-global-logo.png'
/** The card's own rise (home.css imp-rise: 380 ms delay + 1 s) ends here. */
const CARD_SETTLED = 1400
/** Canvas overhang under the slot, room for the bounce (BELOW_PX). */
const BELOW = 28

/** Top of an element in the page layout, ignoring transforms (the card
    rises with a CSS transform on load). */
const layoutTop = (element: HTMLElement) => {
  let y = 0
  let node: HTMLElement | null = element
  while (node) {
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return y
}

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
    const card = node.closest<HTMLElement>('.imp-card')
    const section = node.closest<HTMLElement>('.imp')
    const anchor = section?.classList.contains('imp-overlap') ? section : card
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    let scene: MedalScene | null = null
    let disposed = false
    let inView = false
    let started = false
    let timer = 0

    if (!reduced) card?.classList.add('imp-wait')

    const fit = () => {
      if (anchor) {
        // +1: offsetTop rounds, so tuck the top edge under the hero
        const rise = Math.max(0, layoutTop(node) - layoutTop(anchor) + 1)
        canvas.style.top = `${-rise}px`
        canvas.style.height = `${rise + node.offsetHeight + BELOW}px`
      }
      const radius = Math.min(
        132,
        node.offsetWidth * 0.42,
        node.offsetHeight * 0.42
      )
      scene?.resize(canvas.clientWidth, canvas.clientHeight, radius)
    }
    const sized = new ResizeObserver(fit)
    ;[node, card, section].forEach(element => element && sized.observe(element))
    fit()

    // touch: a tap turns a season medal to its back and back again
    const flip = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return
      const step = (event.target as Element).closest('.imp-step')
      if (step && card?.contains(step)) step.classList.toggle('is-flipped')
    }
    card?.addEventListener('pointerup', flip)
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
      card?.removeEventListener('pointerup', flip)
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
