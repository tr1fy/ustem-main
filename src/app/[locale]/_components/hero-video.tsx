'use client'

/**
 * Hero background loop (TZ §6.1). Rendered by hero.tsx only when a local clip
 * is configured. Mounts the <video> after hydration and only on ≥768px
 * screens without prefers-reduced-motion or Data Saver; otherwise the poster
 * photo underneath stays on its own.
 */
import { useEffect, useState } from 'react'

export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    const wide = window.matchMedia('(min-width: 768px)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (wide && !calm && connection?.saveData !== true) setPlay(true)
  }, [])

  if (!play) return null
  return (
    <video
      className='hero-video'
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload='none'
      aria-hidden='true'
      ref={node => {
        if (node) node.muted = true
      }}
    />
  )
}
