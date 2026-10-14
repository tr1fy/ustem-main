import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import {
  copy,
  formatDate,
  localize,
  news,
  site,
  ui,
  words
} from '@/lib/site-content'
import { alternatesFor, htmlLang, siteUrl } from '@/lib/seo'
import { ArrowLink, PageHead, SectionHead } from '../../_components/ui'
import {
  NewsCard,
  categoryLabels,
  latestNews,
  newsImage
} from '../../_components/news-card'
import ShareLinks from '../../_components/share-links'
import { Reveal } from '../../_components/reveal'
import { articles, getArticleBySlug, type Article } from '../articles'

type Params = { params: { locale: string; slug: string } }

/** News items and the public-discussion archives (articles.ts). */
export function generateStaticParams() {
  return [...news, ...articles].map(({ slug }) => ({ slug }))
}

const archiveLabel = words('Мұрағат', 'Архив', 'Archive')
const archiveLanguages = words(
  'Жарияланым қазақ және орыс тілдерінде қолжетімді, сондықтан төменде орыс тіліндегі мәтін берілген.',
  'Публикация доступна на казахском и русском языках, поэтому ниже приведён русский текст.',
  'This publication is available in Kazakh and Russian only, so the Russian text is shown below.'
)
const opensInNewTab = words(
  '(жаңа қойындыда ашылады)',
  '(откроется в новой вкладке)',
  '(opens in a new tab)'
)
const defaultOgImage = '/images/panama.jpg'
/* The USTEM Connect item links to the platform itself, not to a publisher. */
const openConnect = words(
  'USTEM Connect ашу',
  'Открыть USTEM Connect',
  'Open USTEM Connect'
)

const newsItem = (slug: string) => news.find(item => item.slug === slug)

/** Archive dates are stored as DD.MM.YYYY. */
const isoDate = (dotted: string) => dotted.split('.').reverse().join('-')

/** Archive articles exist in Kazakh and Russian; English falls back to Russian. */
const archiveText = (article: Article, locale: string) => {
  const kz = locale === 'kz'
  return {
    title: kz ? article.titleKz : article.titleRu,
    paragraphs: (kz ? article.contentKz : article.contentRu).flatMap(section =>
      section.type === 'paragraph' && section.text ? [section.text] : []
    ),
    lang: locale === 'en' ? 'ru' : undefined
  }
}

const excerpt = (text: string, max = 155) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max))}…`

const notFoundTitle = words(
  'Бет табылмады',
  'Страница не найдена',
  'Page not found'
)

/* The cover fills the 46rem reading column (news.css), full width below it. */
const coverSizes = '(min-width: 800px) 736px, 100vw'

/**
 * Archive articles exist only in Kazakh and Russian (TZ §5.5, §10): the /en
 * URL stays reachable from the English /academy table and explains that, but
 * it is not indexed and is not advertised as an hreflang alternate.
 */
const archiveAlternates = (locale: string, slug: string) => {
  const alternates = alternatesFor(locale, `/news/${slug}`)
  const languages = { ...(alternates.languages as Record<string, string>) }
  delete languages.en
  return { ...alternates, languages }
}

export function generateMetadata({
  params: { locale, slug }
}: Params): Metadata {
  const item = newsItem(slug)
  const archive = item ? undefined : getArticleBySlug(slug)
  if (!item && !archive) return { title: localize(notFoundTitle, locale) }
  const title = item
    ? localize(item.title, locale)
    : archiveText(archive as Article, locale).title
  const description = item
    ? excerpt(localize(item.text, locale))
    : excerpt(archiveText(archive as Article, locale).paragraphs[0] ?? title)
  const image =
    item && !item.image.endsWith('.svg')
      ? { url: item.image }
      : { url: defaultOgImage, width: 1600, height: 900 }
  return {
    title,
    description,
    alternates: item
      ? alternatesFor(locale, `/news/${slug}`)
      : archiveAlternates(locale, slug),
    ...(archive && locale === 'en'
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      type: 'article',
      siteName: site.name,
      title,
      description,
      url: `/${locale}/news/${slug}`,
      locale: archive && locale === 'en' ? 'ru' : htmlLang(locale),
      publishedTime: item ? item.date : isoDate((archive as Article).date),
      images: [image]
    }
  }
}

export default function ArticlePage({ params: { locale, slug } }: Params) {
  const item = newsItem(slug)
  const archive = item ? undefined : getArticleBySlug(slug)
  if (!item && !archive) notFound()

  const url = `${siteUrl}/${locale}/news/${slug}`
  const crumbs = [{ href: '/news', label: localize(ui.newsTitle, locale) }]
  const others = latestNews()
    .filter(other => other.slug !== slug)
    .slice(0, 3)

  let body
  let title: string
  let date: string
  let jsonImage: string | undefined
  let contentLang = htmlLang(locale)

  if (item) {
    title = localize(item.title, locale)
    date = item.date
    jsonImage = `${siteUrl}${item.image}`
    body = (
      <>
        <PageHead locale={locale} title={title} crumbs={crumbs}>
          <p className='nws-meta'>
            <span className='chip nws-chip'>
              {localize(categoryLabels[item.category], locale)}
            </span>
            <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
          </p>
        </PageHead>
        <div className='nws-layout container'>
          <div className='nws-main'>
            <figure className='nws-cover'>
              {/* The H1 above already says what the cover shows; no caption data yet. */}
              <img
                {...newsImage(item.image, 'wide', coverSizes)}
                alt=''
                loading='eager'
                fetchPriority='high'
                decoding='async'
                style={
                  item.imagePosition
                    ? { objectPosition: item.imagePosition }
                    : undefined
                }
              />
            </figure>
            <div className='nws-body'>
              <p className='nws-standfirst'>{localize(item.text, locale)}</p>
              {item.body?.map((paragraph, i) => (
                <p key={i}>{localize(paragraph, locale)}</p>
              ))}
            </div>
          </div>
          {/* Source + share: after the text on phones, a sticky rail at ≥1200px. */}
          <div className='nws-aside'>
            <ArrowLink href={item.source}>
              {localize(
                item.source === site.connectUrl ? openConnect : copy.source,
                locale
              )}
            </ArrowLink>
            <ShareLinks url={url} title={title} id={slug} />
          </div>
        </div>
      </>
    )
  } else {
    const article = archive as Article
    const text = archiveText(article, locale)
    const doc =
      article.slug === 'space-lab-public-discussion'
        ? 'space-lab'
        : 'robotics-lab'
    title = text.title
    date = isoDate(article.date)
    contentLang = text.lang ?? contentLang
    body = (
      <>
        <PageHead
          locale={locale}
          title={<span lang={text.lang}>{text.title}</span>}
          crumbs={crumbs}
        >
          <p className='nws-meta'>
            <span className='chip nws-chip'>
              {localize(archiveLabel, locale)}
            </span>
            <time dateTime={date}>{formatDate(date, locale)}</time>
          </p>
        </PageHead>
        <div className='nws-layout container'>
          <div className='nws-main'>
            <div className='nws-body'>
              <p className='nws-notice'>
                {localize(
                  doc === 'space-lab'
                    ? copy.spaceArchiveText
                    : copy.archiveText,
                  locale
                )}
                {locale === 'en' && <> {localize(archiveLanguages, locale)}</>}
              </p>
              {text.paragraphs.map((paragraph, index) => (
                <p key={index} lang={text.lang}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* Programme PDFs + share: after the text on phones, a sticky rail at ≥1200px. */}
          <div className='nws-aside'>
            <div className='nws-docs'>
              <a
                className='btn btn-secondary'
                href={`/docs/${doc}-kz.pdf`}
                target='_blank'
                rel='noreferrer'
                hrefLang='kk'
              >
                <span>
                  <span lang='kk'>Бағдарлама</span> · KK (PDF)
                </span>
                <ArrowUpRightIcon aria-hidden='true' />
                <span className='visually-hidden'>
                  {' '}
                  {localize(opensInNewTab, locale)}
                </span>
              </a>
              <a
                className='btn btn-secondary'
                href={`/docs/${doc}-ru.pdf`}
                target='_blank'
                rel='noreferrer'
                hrefLang='ru'
              >
                <span>
                  <span lang='ru'>Программа</span> · RU (PDF)
                </span>
                <ArrowUpRightIcon aria-hidden='true' />
                <span className='visually-hidden'>
                  {' '}
                  {localize(opensInNewTab, locale)}
                </span>
              </a>
            </div>
            <ShareLinks url={url} title={title} id={slug} />
          </div>
        </div>
      </>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    datePublished: date,
    inLanguage: contentLang,
    mainEntityOfPage: url,
    ...(jsonImage ? { image: [jsonImage] } : {}),
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.ico` }
    }
  }

  return (
    <main id='main-content' className='nws-page'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className='nws-article'>{body}</article>

      {others.length > 0 && (
        <section className='section nws-others' aria-labelledby='other-news'>
          <div className='container'>
            <SectionHead
              id='other-news'
              title={localize(ui.otherNews, locale)}
              action={
                <ArrowLink href='/news'>
                  {localize(ui.allNews, locale)}
                </ArrowLink>
              }
            />
            <Reveal className='ct-rise'>
              <ul className='nws-grid'>
                {others.map((other, index) => (
                  <li
                    key={other.slug}
                    className='ct-rise-item'
                    style={{ '--i': index } as CSSProperties}
                  >
                    <NewsCard item={other} locale={locale} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}
    </main>
  )
}
