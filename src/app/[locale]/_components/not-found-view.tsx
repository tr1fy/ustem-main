import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from '@/i18n/routing'
import { localize, navItems, ui, words } from '@/lib/site-content'

/**
 * Localized 404 (TZ §4 «Служебные», §5.5 own title per language), echoing
 * the hero: a white page, a partially cropped Aral circle and an oversized
 * light «404» wordmark behind the H1. CSS-only entrance (contact.css).
 * Rendered by [locale]/not-found.tsx and, in the static build, by
 * [locale]/[...rest] as /{locale}/404.
 */
export const notFoundTitle = words(
  'Бет табылмады',
  'Страница не найдена',
  'Page not found'
)
const text = words(
  'Сілтеме ескірген немесе мекенжай қате терілген болуы мүмкін.',
  'Возможно, ссылка устарела или в адресе опечатка.',
  'The link may be out of date, or the address may contain a typo.'
)
const competitions = navItems.find(item => item.key === 'competitions')!

export default function NotFoundView({ locale }: { locale: string }) {
  return (
    <main id='main-content' className='ct-404'>
      <div className='ct-404-art' aria-hidden='true'>
        <div className='ct-404-circle' />
      </div>
      <div className='container ct-404-inner'>
        <div className='ct-404-word' aria-hidden='true'>
          404
        </div>
        <h1>{localize(notFoundTitle, locale)}</h1>
        <p className='lead'>{localize(text, locale)}</p>
        <div className='ct-actions'>
          <Link className='btn btn-primary' href='/'>
            {localize(ui.home, locale)}
            <ArrowRightIcon aria-hidden='true' />
          </Link>
          <Link className='btn btn-secondary' href={competitions.href}>
            {localize(competitions.label, locale)}
          </Link>
        </div>
      </div>
    </main>
  )
}
