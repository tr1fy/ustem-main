import { motion, useViewportScroll, useTransform } from 'framer-motion'
import React from 'react'
import { useTranslations } from 'next-intl';

const Hero: React.FC = () => {
  const { scrollY } = useViewportScroll()
  const yTransform = useTransform(scrollY, [0, 1000], [0, -200])
  const t = useTranslations("Hero");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='personal-plan-page min-vh-full'
    >
      <div
        className='flex flex-col justify-center bg-cover'
        style={{ backgroundImage: 'url(https://i.imgur.com/ENPQnhT.png)' }}
      >
        <div className='w-full rounded-2xl pb-8 pl-20 max-md:max-w-full max-md:pl-7'>
          <div className='flex gap-5 max-md:flex-col max-md:gap-0'>
            <div className='flex w-6/12 flex-col max-md:ml-0 max-md:w-full'>
              <div className='my-auto flex flex-col self-stretch max-md:mt-14 max-md:max-w-full'>
                <div className='text-3xl font-bold uppercase text-[#0066C3] max-md:max-w-full lg:text-5xl'>
                  {t('title')}
                </div>
                <div className='text-gray-500 max-md:max-w- mt-4 text-xl font-light lg:text-3xl'>
                  {t('quote')}
                </div>
              </div>
            </div>
            <div className='ml-8 flex w-6/12 flex-col max-md:ml-5 max-md:w-full'>
              <motion.img
                loading='lazy'
                src='https://i.imgur.com/FMIuAJM.png'
                className='aspect-[0.97] w-full grow max-md:mt-3 max-md:max-w-full'
                style={{ y: yTransform }}
              />
            </div>
          </div>
        </div>
      </div>
      <img
        src='https://i.imgur.com/MbyZ96f.png'
        className='hidden w-full md:block'
        alt=''
      />
      <img
        src='https://i.imgur.com/h3gnNMI.png'
        className='block w-full md:hidden'
        alt=''
      />
    </motion.section>
  )
}

export default Hero