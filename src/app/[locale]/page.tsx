import type { Metadata } from 'next'
import { localize, site, ui, words } from '@/lib/site-content'
import { alternatesFor } from '@/lib/seo'
import Hero from './_components/hero'
import HomeSections from './_components/home-sections'

const description = words(
  'USTEM Foundation — Қазақстан, Өзбекстан және Қырғызстанда жарыстар ұйымдастыратын, педагогтерді оқытатын және жас инженерлерді қолдайтын инженерлік білім беру қоры.',
  'USTEM Foundation — фонд развития инженерного образования: соревнования, обучение педагогов и поддержка молодых инженеров в Казахстане, Узбекистане и Кыргызстане.',
  'USTEM Foundation advances engineering education with competitions, teacher training and support for young engineers in Kazakhstan, Uzbekistan and Kyrgyzstan.'
)

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  return {
    title: {
      absolute: `${site.name} — ${localize(ui.heroTitle, locale).replace(/\.$/, '')}`
    },
    description: localize(description, locale),
    alternates: alternatesFor(locale, '')
  }
}

export default function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main id='main-content' className='home'>
      <Hero locale={locale} />
      <HomeSections locale={locale} />
    </main>
  )
}
