import { Eye, MessageCircle, ThumbsUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { articles } from './articles'

export default function NewsPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const isRu = locale === 'ru'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">
        {isRu ? 'Новости и объявления' : 'Жаңалықтар мен хабарламалар'}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <Link
            key={article.slug}
            href={`/${locale}/news/${article.slug}`}
            className="block"
          >
            <div className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-200 hover:shadow-xl">
              {/* Announcement banner image */}
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1d6f7a] via-[#2a8c9a] to-[#1a5f6e]">
                {/* Subtle wave pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                  }}
                />

                {/* ОБЪЯВЛЕНИЕ tag */}
                <div className="absolute left-0 top-6 flex items-center gap-2 bg-[#e0483a] px-4 py-1.5 shadow-md">
                  <span className="text-xs font-bold tracking-widest text-white">
                    {isRu ? 'ОБЪЯВЛЕНИЕ' : 'ХАБАРЛАМА'}
                  </span>
                </div>

                {/* Megaphone icon */}
                <div className="absolute right-4 top-3 text-5xl leading-none">
                  📢
                </div>

                {/* Body text */}
                <div className="absolute left-0 right-0 top-16 px-4">
                  <p className="text-sm font-semibold leading-snug text-white">
                    {isRu
                      ? 'О ПУБЛИЧНОМ ОБСУЖДЕНИИ ОБРАЗОВАТЕЛЬНЫХ ПРОГРАММ КУРСОВ'
                      : 'БІЛІМ БЕРУ БАҒДАРЛАМАЛАРЫ КУРСТАРЫН ЖАРИЯ ТАЛҚЫЛАУ ТУРАЛЫ'}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-snug text-[#f4b183]">
                    {isRu
                      ? 'ПОВЫШЕНИЯ КВАЛИФИКАЦИИ ПЕДАГОГОВ'
                      : 'ПЕДАГОГ БІЛІКТІЛІГІН АРТТЫРУ'}
                  </p>
                </div>

                {/* USTEM Academy logo circle */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0483a] shadow">
                    <span className="text-center text-[7px] font-bold leading-tight text-white">
                      USTEM
                      <br />
                      Academy
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="px-4 py-4">
                <p className="line-clamp-4 text-sm font-semibold leading-snug text-gray-900">
                  {isRu ? article.titleRu : article.titleKz}
                </p>
              </div>

              {/* Metadata footer */}
              <div className="flex items-center justify-between border-t border-gray-100 px-4 pb-4 pt-3 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {article.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {article.likes}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
