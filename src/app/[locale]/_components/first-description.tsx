import React from 'react';
import { useTranslations } from 'next-intl';

const MissionBox = () => {
  const t = useTranslations('FirstDescription');
  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-[14px] object-cover px-4 pb-4 pt-[100px] lg:pt-[140px] text-[#FFFFFF] sm:px-6 sm:pb-5 sm:pt-[100px] md:px-8 md:pb-7 md:pt-[60px]'>
      <img
        loading='lazy'
        src='https://i.imgur.com/ybJpytr.png'
        className='absolute inset-0 h-full w-full object-cover'
        alt='Background'
      />
      <div className='relative mt-[100px] text-lg font-bold lg:mt-[80px] lg:text-2xl'>
        {t('presidentDescription')}
      </div>
      <div className='relative mt-2 text-sm sm:text-base md:text-lg lg:mt-2'>
        {t('presidentTitle')}
      </div>
    </div>
  )
}

const FirstDescription = (): React.ReactNode => {
  const t = useTranslations('FirstDescription');

  return (
    <>
      <div>
        <div className='mb-10 mt-8 flex gap-8 max-md:flex-col max-md:gap-0 md:mt-10 md:px-10'>
          <div className='flex w-6/12 flex-col max-md:order-last max-md:ml-0 max-md:w-full'>
            <div className='justify-right relative order-last flex min-h-[370px] grow flex-col overflow-hidden px-10 py-10 max-md:mt-5 max-md:max-w-full max-md:px-7'>
              <MissionBox />
            </div>
          </div>
          <div className='ml-[10px] flex w-8/12 flex-col px-[10px] max-md:order-first max-md:ml-0 max-md:w-full md:px-0'>
            <div className='my-auto flex flex-col self-stretch px-5 max-md:mt-10 max-md:max-w-full'>
              <div className='text-neutral-800 w-full text-6xl font-bold max-md:max-w-full max-md:text-4xl'>
                {t('missionTitle')}
              </div>
              <div className='text-stone-600 mt-3 w-full text-2xl font-light max-md:max-w-full lg:mt-5'>
                {t('missionDescription').split('\n').map((line, index) => (
                  <div key={index}>
                    {line}
                    <br /> <br />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='my-[50px] flex items-center space-x-4 lg:my-[45px]'>
        <div className='h-0.5 w-[20px] bg-[#9BCFFF] lg:w-[80px]'></div>
        <span className='text-gray-700 text-lg text-[#939393]'>
          {t('resultsTitle')}
        </span>
        <div className='h-[2px] flex-grow bg-[#9BCFFF]'></div>
      </div>
    </>
  )
}

export default FirstDescription;
