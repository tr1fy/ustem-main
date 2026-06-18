import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Roboto, Martian_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from 'react-hot-toast'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import AppShell from '@/app/[locale]/components/layout/AppShell'
// import { AuthProvider } from '@/lib/Auth';

import { Providers } from './providers'

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-roboto'
})

const martianMono = Martian_Mono({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-martian-mono'
})

export const metadata: Metadata = {
  title: 'USTEM Foundation',
  description: 'Ustem Foundation'
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className='scroll-smooth'
      style={{ overflowX: 'hidden' }}
    >
      <body
        className={`${roboto.variable} ${martianMono.variable}`}
        style={{ overflowX: 'hidden', width: '100%' }}
      >
        <Toaster position='top-center' />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {/*<AuthProvider>*/}
            <AppShell>{children}</AppShell>
            {/*</AuthProvider>*/}
          </Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ''} />
    </html>
  )
}
