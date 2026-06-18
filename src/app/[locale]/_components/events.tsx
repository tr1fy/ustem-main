import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/app/[locale]/components/ui/carousel'
import { useState } from 'react'
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, Users2, X, Mail } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/[locale]/components/ui/dialog"

const Review = ({
  text,
  name,
  who,
  photo
}: {
  text: string
  name: string
  who: string
  photo: string
}) => {
  return (
    <div className='text-black flex max-w-[892px] flex-col rounded-2xl border border-solid border-[#D5D5D5] bg-[#FFFFFF] px-9 py-10 text-xl font-light shadow-lg max-md:px-5'>
      <div className='pr-[2px] max-md:max-w-full'>
        <p> {text}</p>
      </div>
      <div className='mt-10 flex items-center gap-4 max-md:max-w-full'>
        <div className='w-16 h-16 rounded-full overflow-hidden flex-shrink-0'>
          <img
            src={photo}
            alt={name}
            className='w-full h-full object-cover'
          />
        </div>
        <div>
          <span className='font-bold'>{name}</span>
          <br />
          {who}
        </div>
      </div>
    </div>
  )
}

const reviews = [
  {
    text: 'review_1',
    name: 'Асхат Аймагамбетов',
    who: 'who_1',
    photo: '/feedback-photos/ashat.jpg'
  },
  {
    text: 'review_2',
    name: 'Гани Бисембаев',
    who: 'who_2',
    photo: '/feedback-photos/gani.jpg'
  },
  {
    text: 'review_3',
    name: 'Бауыржан Оспанов',
    who: 'who_3',
    photo: '/feedback-photos/baurzhan.jpg'
  },
  {
    text: 'review_4',
    name: 'Багдат Мусин',
    who: 'who_4',
    photo: '/feedback-photos/bagdat.jpg'
  },
  {
    text: 'review_5',
    name: 'Сардар Конурбаев',
    who: 'who_5',
    photo: '/feedback-photos/sardar.jpg'
  },
  {
    text: 'review_6',
    name: 'Эльнур Халметов',
    who: 'who_6',
    photo: '/feedback-photos/elnur.jpg'
  },
  {
    text: 'review_7',
    name: 'Амира Махмеджан',
    who: 'who_7',
    photo: '/feedback-photos/amira.jpg'
  }
]

const JobCard = () => {
  const t = useTranslations('Events');
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || e.currentTarget.contains(e.target as Node)) {
      setIsOpen(true);
    }
  };

  return (
    <div onClick={handleCardClick} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <Building2 className="h-10 w-10 text-blue-600" />
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
          {t('location')}
        </span>
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">{t('jobTitle')}</h3>
      <p className="mb-4 text-[15px] leading-relaxed text-gray-600">{t('jobSubtitle')}</p>
      <div className="flex items-center text-blue-600">
        <span className="mr-2 font-medium">{t('readMore')}</span>
        <ArrowRight className="h-4 w-4" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('jobTitle')} ({t('jobSubtitle')})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="mb-2 font-semibold text-blue-600">{t('experience')}</h4>
              <p className="text-gray-700">
                {t('experienceText')}
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-blue-600">{t('skills')}</h4>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <li key={num}>{t(`skillsList.${num}`)}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">hr@ustem.kz</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = 'mailto:hr@ustem.kz';
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const Events = () => {
  const t = useTranslations('Events');
  const [api, setApi] = useState<CarouselApi>()

  const handleNext = () => api?.scrollNext()
  const handlePrev = () => api?.scrollPrev()

  return (
    <div className="w-full overflow-hidden px-4 py-4 md:py-8 md:px-[80px]">
      <div className='relative flex flex-col'>
        <div className='mb-8 flex max-w-[395px] justify-start pl-2 md:justify-center bg-gradient-to-b bg-clip-text text-[35px] font-semibold md:text-7xl'>
          <p className='bg-gradient-to-b from-[#6F6F6F] to-[#FFFFFF] bg-clip-text text-transparent'>
            {t('title')}
          </p>
        </div>

        <div className='relative flex flex-col items-center'>
          <Carousel
            setApi={setApi}
            opts={{
              align: 'center',
              containScroll: 'trimSnaps'
            }}
            className='w-full px-2 md:px-0'
            plugins={[
              Autoplay({
                delay: 20000,
                stopOnInteraction: false
              })
            ]}
          >
            <CarouselContent className='-ml-4'>
              {reviews.map(item => (
                <CarouselItem key={item.name} className='pl-4 md:basis-[892px]'>
                  <div className='h-full'>
                    <Review text={t(item.text)} who={t(item.who)} name={item.name} photo={item.photo} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className='mt-4 mb-6 hidden items-center justify-center gap-4 md:flex'>
            <button
              onClick={handlePrev}
              className='p-2 transition hover:opacity-80'
              aria-label="Previous slide"
            >
              <img
                className='w-[46px]'
                src='https://i.imgur.com/J5onA9n.png'
                alt='Previous'
              />
            </button>
            <button
              onClick={handleNext}
              className='p-2 transition hover:opacity-80'
              aria-label="Next slide"
            >
              <img
                className='w-[46px] rotate-180'
                src='https://i.imgur.com/J5onA9n.png'
                alt='Next'
              />
            </button>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-12 bg-gradient-to-b from-[#6F6F6F] to-[#FFFFFF] bg-clip-text text-[35px] font-semibold text-transparent md:text-center md:text-7xl">
            {t('jobsTitle')}
          </h2>
          <div className="mx-auto max-w-2xl">
            <JobCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events