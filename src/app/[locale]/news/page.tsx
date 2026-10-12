import type { Metadata } from 'next'
import { localize, site, ui, words } from '@/lib/site-content'
import { alternatesFor, htmlLang } from '@/lib/seo'
import { PageHead } from '../_components/ui'
import {
  NewsCard,
  categoryLabels,
  latestNews
} from '../_components/news-card'
import NewsList from '../_components/news-list'
import { Reveal } from '../_components/reveal'

/* TZ §8.4. One list pattern only: the two USTEM Academy public discussions
 * are linked from the /academy «Ашық диалог» table, not repeated here.
 * The newest item is featured (full row from 1024px), the rest follow in an
 * airy 3/2/1 grid; cards rise in a short stagger once the list is seen. */

const description = words(
  'USTEM Foundation жаңалықтары: жарыстар, жеңістер, жобалар және USTEM Academy.',
  'Новости USTEM Foundation: соревнования, победы, проекты и USTEM Academy.',
  'USTEM Foundation news: competitions, victories, projects and USTEM Academy.'
)
const categoriesLabel = words(
  'Жаңалықтар санаты',
  'Категории новостей',
  'News categories'
)

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const title = localize(ui.newsTitle, locale)
  return {
    title,
    description: localize(description, locale),
    alternates: alternatesFor(locale, '/news'),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description: localize(description, locale),
      url: `/${locale}/news`,
      locale: htmlLang(locale),
      images: [{ url: '/images/panama.jpg', width: 1600, height: 900 }]
    }
  }
}

export default function NewsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const items = latestNews()
  const categories = Array.from(new Set(items.map(item => item.category)))
  const tabs =
    categories.length > 1
      ? [
          { id: 'all', label: localize(ui.newsAll, locale) },
          ...categories.map(category => ({
            id: category,
            label: localize(categoryLabels[category], locale)
          }))
        ]
      : []

  return (
    <main id='main-content' className='nws-page'>
      <PageHead locale={locale} title={localize(ui.newsTitle, locale)} />

      <section className='container nws-section' aria-labelledby='news-list'>
        {/* Keeps H1 → H2 → H3 order for the card titles. */}
        <h2 id='news-list' className='visually-hidden'>
          {localize(ui.allNews, locale)}
        </h2>
        <Reveal className='ct-rise'>
          <NewsList
            items={items.map((item, index) => ({
              key: item.slug,
              category: item.category,
              featured: index === 0 && items.length > 1,
              node: (
                <NewsCard
                  item={item}
                  locale={locale}
                  featured={index === 0 && items.length > 1}
                />
              )
            }))}
            tabs={tabs}
            tabsLabel={localize(categoriesLabel, locale)}
            showMoreLabel={localize(ui.showMore, locale)}
          />
        </Reveal>
      </section>
    </main>
  )
}
