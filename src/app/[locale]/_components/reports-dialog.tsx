'use client'

/**
 * «Барлық есептер»: the arrow link in the Reports section head and the
 * plain list dialog it opens. Same dialog shell as the flagship page's
 * site notice (.fp-backdrop / .fp-dialog): closes on Escape and on the
 * backdrop, returns focus to the link. Rendered through a portal: the
 * section head sits inside a transformed Reveal, which would otherwise
 * anchor the fixed backdrop to it.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  localize,
  publicReports,
  reportsText,
  site,
  ui
} from '@/lib/site-content'

export default function ReportsDialog({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const openRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      openRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={openRef}
        type='button'
        className='link-arrow home-reports-all'
        onClick={() => setOpen(true)}
      >
        {localize(ui.allReports, locale)}
        <ArrowRightIcon aria-hidden='true' />
      </button>
      {open &&
        createPortal(
          <div className='fp-backdrop' onClick={() => setOpen(false)}>
            <div
              className='fp-dialog home-reports-dialog'
              role='dialog'
              aria-modal='true'
              aria-labelledby={titleId}
              onClick={e => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                type='button'
                className='fp-dialog-x'
                onClick={() => setOpen(false)}
                aria-label={localize(ui.close, locale)}
              >
                <XMarkIcon aria-hidden='true' />
              </button>
              <h2 id={titleId} className='fp-dialog-title'>
                {localize(ui.reports, locale)}
              </h2>
              <ul className='home-reports-dlist'>
                {publicReports.map(report => (
                  <li key={report.file}>
                    <a
                      className='home-reports-drow'
                      href={report.file}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <span className='home-reports-ddate'>
                        {localize(report.date, locale)}
                      </span>
                      <span className='home-reports-dbody'>
                        <span className='home-reports-dtitle'>
                          {localize(report.title, locale)}
                        </span>
                        <span className='home-reports-dmeta'>
                          {localize(report.meta, locale)}
                        </span>
                      </span>
                      <span className='home-reports-dfile'>
                        {localize(report.note, locale)}
                        <ArrowUpRightIcon aria-hidden='true' />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className='home-reports-dtext'>
                {localize(reportsText, locale)}{' '}
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(
                    localize(ui.reports, locale)
                  )}`}
                >
                  {site.email}
                </a>
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
