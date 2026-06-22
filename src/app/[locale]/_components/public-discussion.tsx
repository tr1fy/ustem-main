import Link from 'next/link'
import { ArrowRight, CalendarDays, FileText, MessageSquare, Megaphone } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

const formLinks: Record<string, string> = {
  ru: 'https://forms.gle/Tg96KPdvf8Mjo2vB6',
  kz: 'https://forms.gle/PSZ91XMrbVcm78rQA'
}

const programLinks: Record<string, string> = {
  ru: '/docs/robotics-lab-ru.pdf',
  kz: '/docs/robotics-lab-kz.pdf'
}

const PublicDiscussion = () => {
  const t = useTranslations('PublicDiscussion')
  const locale = useLocale()
  const formLink = formLinks[locale] ?? formLinks.kz
  const programLink = programLinks[locale] ?? programLinks.kz
  const detailsLink = `/${locale}/public-discussion`

  return (
    <section className='bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-20 lg:py-16'>
      <div className='mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-100/70 ring-1 ring-blue-100 lg:grid-cols-[0.88fr_1.12fr]'>
        <div className='relative min-h-[300px] overflow-hidden bg-gradient-to-br from-[#3AA6AA] via-[#247C88] to-[#135E71] p-6 text-white sm:p-7 lg:min-h-[390px] lg:p-8'>
          <div
            className='absolute inset-0 opacity-20'
            style={{
              backgroundImage:
                'radial-gradient(circle at 18px 18px, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,0.16) 0 1px, transparent 1px)',
              backgroundSize: '34px 34px, 48px 48px'
            }}
          />
          <div className='absolute -left-20 top-10 h-72 w-72 rounded-full border border-white/25' />
          <div className='absolute -right-24 bottom-0 h-80 w-80 rounded-full border border-white/20' />

          <div className='relative flex h-full flex-col justify-between'>
            <div className='flex items-start justify-between gap-4'>
              <div className='skew-x-[-10deg] bg-[#FF6862] px-6 py-2 shadow-lg shadow-black/20 ring-2 ring-white/70'>
                <p className='skew-x-[10deg] text-xl font-extrabold uppercase tracking-wide sm:text-2xl'>
                  {t('badge')}
                </p>
              </div>
              <div className='rounded-full bg-white p-3 text-[#FF6862] shadow-xl shadow-black/20'>
                <Megaphone className='h-10 w-10 sm:h-14 sm:w-14' strokeWidth={2.4} />
              </div>
            </div>

            <div className='mt-10 max-w-[500px]'>
              <p className='text-xl font-extrabold uppercase leading-tight tracking-wide sm:text-2xl lg:text-3xl'>
                {t('posterTitle')}
              </p>
              <p className='mt-3 text-xl font-extrabold uppercase leading-tight text-[#FF8A86] sm:text-2xl'>
                {t('posterAccent')}
              </p>
            </div>

            <div className='mt-10 flex items-center justify-between'>
              <div className='flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur'>
                <CalendarDays className='h-5 w-5' />
                {t('deadlineShort')}
              </div>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6862] text-center text-xs font-extrabold uppercase leading-none text-white ring-4 ring-white/70 sm:h-[72px] sm:w-[72px]'>
                USTEM
              </div>
            </div>
          </div>
        </div>

        <div className='relative flex flex-col justify-center p-7 sm:p-9 lg:p-11'>
          <div className='absolute right-8 top-8 hidden h-24 w-24 rounded-full bg-blue-50 lg:block' />
          <div className='relative'>
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0085FF]'>
              <MessageSquare className='h-6 w-6' />
            </div>
            <h2 className='max-w-3xl text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl'>
              {t('title')}
            </h2>
            <p className='mt-5 max-w-3xl text-base leading-7 text-gray-600'>
              {t('description')}
            </p>
            <div className='mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='space-y-2 rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-[#0066C3]'>
                <p>{t('publishedAt')}</p>
                <p>{t('deadline')}</p>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Link
                  href={detailsLink}
                  className='inline-flex items-center justify-center gap-3 rounded-xl bg-gray-100 px-5 py-4 text-base font-semibold text-gray-800 transition duration-300 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-100'
                >
                  {t('detailsCta')}
                </Link>
                <a
                  href={programLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center gap-3 rounded-xl border border-[#0085FF] bg-white px-5 py-4 text-base font-semibold text-[#0066C3] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-100'
                  aria-label={t('programAriaLabel')}
                >
                  <FileText className='h-5 w-5' />
                  {t('programCta')}
                </a>
                <a
                  href={formLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center gap-3 rounded-xl bg-[#0085FF] px-5 py-4 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0066C3] hover:shadow-lg hover:shadow-blue-200'
                  aria-label={t('ariaLabel')}
                >
                  {t('cta')}
                  <ArrowRight className='h-5 w-5' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PublicDiscussion
