import React from 'react'
import {
  Navbar as NavbarNext,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react'
import { UstemLogo } from '../shared/FirstLogo'
import { Button } from '@/app/[locale]/components/ui/button'
import { useLocale, useTranslations } from 'next-intl'

const Navbar = (): React.ReactNode => {
  const currentLanguage = useLocale()
  const targetLanguage = currentLanguage === 'ru' ? 'kz' : 'ru'
  const targetLanguageLabel = targetLanguage === 'ru' ? 'РУ' : 'ҚҚ'

  const toggleLanguage = () => {
    window.location.assign(`/${targetLanguage}`);
  };

  const menuItems = [
    {
      text: 'Instagram',
      link: 'https://www.instagram.com/ustem_foundation',
      image: 'https://i.imgur.com/Oq8XfAY.png'
    },
    {
      text: 'Whatsapp',
      link: '/',
      image: 'https://i.imgur.com/FS3q4bi.png'
    },
    {
      text: 'Youtube',
      link: 'https://www.youtube.com/@ustem_foundation',
      image: 'https://i.imgur.com/bGLXRa2.png'
    }
  ];

  const t = useTranslations('OurResults')

  return (
    <NavbarNext
      maxWidth='full'
      className='py-[10px] shadow-lg md:px-[10px] lg:px-[10px]'
    >
      <NavbarContent className='justify-between'>
        <NavbarItem>
          <button
            onClick={toggleLanguage}
            className="text-gray-700 hover:text-gray-900 rounded-md text-sm font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {targetLanguageLabel}
          </button>
        </NavbarItem>

        <NavbarBrand className="justify-center">
          <UstemLogo />
        </NavbarBrand>

        <NavbarItem>
          <a href='https://kaspi.kz/pay/UStemRobotics' >
            <Button variant='default' size='lg' className='flex p-5 bg-blue-600 hover:bg-blue-700 text-white'>
              <img src='https://i.imgur.com/f5kwkSp.png' className='h-[16px]' alt='support' />
              <p className='hidden sm:flex sm:ml-3 text-lg text-white'>{t('supportButtonText')}</p>
            </Button>
          </a>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden w-full items-center justify-between">
        <NavbarBrand className="justify-left ml-20">
          <UstemLogo />
        </NavbarBrand>

        <div className='flex items-center'>
          {menuItems.map(item => (
            <NavbarItem key={item.image} className='mr-4'>
              <Link color='foreground' href={item.link}>
                <img src={item.image} className='h-[23px] w-auto' alt={item.text} />
              </Link>
            </NavbarItem>
          ))}

          <NavbarItem className='mr-4'>
            <button
              onClick={toggleLanguage}
              className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium flex items-center'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {targetLanguageLabel}
            </button>
          </NavbarItem>

          <NavbarItem>
            <a href='https://kaspi.kz/pay/UStemRobotics'>
              <Button variant='default' size='lg' className='flex gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
                <img
                  src='https://i.imgur.com/f5kwkSp.png'
                  className='h-[16px] w-auto'
                  alt='help'
                />
                <p className='text-lg text-white'>{t('supportButtonText')}</p>
              </Button>
            </a>
          </NavbarItem>
        </div>
      </NavbarContent>
    </NavbarNext>
  )
}

export default Navbar
