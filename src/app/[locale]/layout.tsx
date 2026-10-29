// one entry that @imports globals → areas, so production keeps the order
import '@/styles/index.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { localize, site, ui, words } from '@/lib/site-content'
import { alternatesFor, htmlLang, siteUrl } from '@/lib/seo'

import AppShell from '@/app/[locale]/components/layout/AppShell'

// Inter is the brand typeface (USTEM guideline) and covers the full Kazakh
// Cyrillic set Ә Ғ Қ Ң Ө Ұ Ү Һ І (TZ §9.2).
const sans = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-sans'
})

const description = words(
  'USTEM Foundation — инженерлік білімді дамытатын қор. FIRST бағдарламаларының Қазақстан, Өзбекстан және Қырғызстандағы операторы: жарыстар, педагогтерді оқыту, жас инженерлердің жобалары.',
  'USTEM Foundation — фонд развития инженерного образования, оператор программ FIRST в Казахстане, Узбекистане и Кыргызстане: соревнования, обучение педагогов, проекты молодых инженеров.',
  'USTEM Foundation advances engineering education and operates FIRST programs in Kazakhstan, Uzbekistan and Kyrgyzstan: competitions, teacher training and young engineers’ projects.'
)

/** Every page exists in the three languages and is rendered at build time. */
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Metadata {
  const title = `${site.name} — ${localize(ui.heroTitle, locale).replace(/\.$/, '')}`
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${site.name}` },
    description: localize(description, locale),
    alternates: alternatesFor(locale, ''),
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description: localize(description, locale),
      locale: htmlLang(locale),
      images: [{ url: '/images/panama.jpg', width: 1600, height: 900 }]
    },
    icons: { icon: '/favicon.ico' }
  }
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  email: site.email,
  telephone: site.phone.display,
  areaServed: ['Kazakhstan', 'Uzbekistan', 'Kyrgyzstan'],
  legalName: site.legalName.ru,
  taxID: site.bin,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'пр. Достык, 134',
    addressLocality: 'Алматы',
    addressCountry: 'KZ'
  },
  sameAs: site.socials.map(item => item.url)
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  // The locale comes from the URL, not from the header middleware.ts sets,
  // so pages render statically (and in the static build, where there is no
  // middleware at all).
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={htmlLang(locale)} suppressHydrationWarning>
      <body className={sans.variable}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
