'use client'

/**
 * "ⓘ Source" pill + popover for one verified metric (TZ §6.2: every figure
 * has a small "i" with its source and date). The only interactive part of
 * the numbers block; all strings arrive already localized from impact-card.
 * Esc and an outside click close it; Esc returns focus to the button.
 */
import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowUpRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function ImpactSource({
  button,
  label,
  asOf,
  url,
  host,
  newTab
}: {
  button: string
  label: string
  asOf: string
  url: string
  host: string
  newTab: string
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const popoverId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className='imp-source' ref={box}>
      <button
        ref={trigger}
        type='button'
        className='btn btn-secondary imp-source-btn'
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen(value => !value)}
      >
        <InformationCircleIcon aria-hidden='true' />
        {button}
      </button>
      <div className='imp-pop' id={popoverId} hidden={!open}>
        <p className='imp-pop-label'>{label}</p>
        <p className='imp-pop-date'>{asOf}</p>
        <a
          className='link-arrow is-external'
          href={url}
          target='_blank'
          rel='noreferrer'
        >
          {host}
          <span className='visually-hidden'> {newTab}</span>
          <ArrowUpRightIcon aria-hidden='true' />
        </a>
      </div>
    </div>
  )
}
