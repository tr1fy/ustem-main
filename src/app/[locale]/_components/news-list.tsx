'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode
} from 'react'
import { ArrowDownIcon } from '@heroicons/react/24/outline'

/**
 * /news list (TZ §8.4): category tabs (a pill segmented control) +
 * "Show more" (12 at a time). Cards are rendered on the server and passed in
 * as nodes, so this client component only owns the filter and paging state.
 * The page passes tabs only when more than one category has items.
 * A `featured` item spans the full row from 1024px (news.css). Each <li>
 * carries `ct-rise-item` + `--i` for the staggered entrance of a wrapping
 * <Reveal className='ct-rise'> (contact.css); without JS it simply shows.
 */
export type NewsListTab = { id: string; label: string }
export type NewsListItem = {
  key: string
  category: string
  node: ReactNode
  featured?: boolean
}

export default function NewsList({
  items,
  tabs,
  tabsLabel,
  showMoreLabel,
  pageSize = 12
}: {
  items: NewsListItem[]
  /** First tab is the "all" tab (id 'all'). Pass [] to hide the tablist. */
  tabs: NewsListTab[]
  tabsLabel: string
  showMoreLabel: string
  pageSize?: number
}) {
  const uid = useId()
  const [active, setActive] = useState(tabs[0]?.id ?? 'all')
  const [visible, setVisible] = useState(pageSize)
  const focusFrom = useRef<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const showTabs = tabs.length > 1
  const filtered =
    active === 'all' ? items : items.filter(item => item.category === active)
  const shown = filtered.slice(0, visible)

  // After "Show more", move keyboard focus to the first newly revealed card.
  useEffect(() => {
    if (focusFrom.current === null) return
    const link = listRef.current?.children[focusFrom.current]?.querySelector('a')
    focusFrom.current = null
    link?.focus()
  }, [visible])

  const select = (index: number) => {
    const tab = tabs[index]
    if (!tab) return
    setActive(tab.id)
    setVisible(pageSize)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1
    const target =
      event.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0 ? last : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (target === null) return
    event.preventDefault()
    select(target)
  }

  const tabId = (id: string) => `${uid}-tab-${id}`
  const panelId = `${uid}-panel`

  const grid = (
    <>
      <ul className='nws-grid' ref={listRef}>
        {shown.map((item, index) => (
          <li
            key={item.key}
            className={`ct-rise-item${item.featured ? ' is-featured' : ''}`}
            style={{ '--i': index } as CSSProperties}
          >
            {item.node}
          </li>
        ))}
      </ul>
      {filtered.length > visible && (
        <div className='nws-more'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => {
              focusFrom.current = visible
              setVisible(count => count + pageSize)
            }}
          >
            {showMoreLabel}
            <ArrowDownIcon aria-hidden='true' />
          </button>
        </div>
      )}
    </>
  )

  if (!showTabs) return grid

  return (
    <>
      <div className='nws-tabs' role='tablist' aria-label={tabsLabel}>
        {tabs.map((tab, index) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={node => {
                tabRefs.current[index] = node
              }}
              id={tabId(tab.id)}
              type='button'
              role='tab'
              className='nws-tab'
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={event => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        id={panelId}
        role='tabpanel'
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className='nws-panel'
      >
        {grid}
      </div>
    </>
  )
}
