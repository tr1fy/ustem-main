import clsx from 'clsx'
import React from 'react'
import Marquee from 'react-fast-marquee'
import { useTranslations } from 'next-intl';

const logos = [
  'https://i.imgur.com/c3f6m91.png',
  'https://i.imgur.com/4BkduHm.png',
  'https://i.imgur.com/rfPrkxj.png',
  'https://i.imgur.com/APbVQpX.png',
  'https://i.imgur.com/XkOkUC9.png',
  'https://i.imgur.com/TMMRKcE.png',
  'https://i.imgur.com/c3f6m91.png',
  'https://i.imgur.com/4BkduHm.png',
  'https://i.imgur.com/rfPrkxj.png'
]

const logos2 = [
  'https://i.imgur.com/XkWUN4J.png',
  'https://i.imgur.com/e0xgSqD.png',
  'https://i.imgur.com/HowvcS0.png',
  'https://i.imgur.com/nxV44lZ.png',
  'https://i.imgur.com/keNRPmf.png',
  'https://i.imgur.com/90QpE3w.png',
  'https://i.imgur.com/XkWUN4J.png',
  'https://i.imgur.com/e0xgSqD.png',
  'https://i.imgur.com/HowvcS0.png'
]

const OurPrograms = () => {
  const t = useTranslations('Universities');
  return (
    <div className='mb-[50px] mt-[100px] px-4 sm:px-6 md:mb-[100px] md:mt-[150px] md:px-[80px]'>
      <h2 className='mb-[30px] text-center text-2xl sm:text-3xl md:text-[35px] font-semibold md:mb-[50px] max-w-[90%] mx-auto leading-tight'>
        {t('participantUniversities')}
      </h2>
      <div className='mx-auto mt-[30px] md:mt-[50px]'>
        <Marquee speed={80} gradient={true} gradientColor='rgb(255, 255, 255)'>
          {logos.map(item => (
            <div
              key={item}
              className='bg-white mr-[20px] sm:mr-[30px] flex min-h-[60px] sm:min-h-[79px] w-[150px] sm:w-[197px] items-center justify-center rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <img src={item} alt='' className='max-w-[80%] h-auto object-contain' />
            </div>
          ))}
        </Marquee>
        <Marquee
          speed={80}
          direction='right'
          className='mt-[20px] sm:mt-[30px]'
          gradient={true}
          gradientColor='rgb(255, 255, 255)'
        >
          {logos2.map(item => (
            <div
              key={item}
              className='bg-white mr-[20px] sm:mr-[30px] flex min-h-[60px] sm:min-h-[79px] w-[150px] sm:w-[197px] items-center justify-center rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <img src={item} alt='' className='max-w-[80%] h-auto object-contain' />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  )
}

export default OurPrograms