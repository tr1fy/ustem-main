import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const text = {
    company: 'О нас',
    getInTouch: 'Свяжитесь с нами',
    statement:
      'We don’t use children to build robots. We use robots to build children.',
    phone: '+7 (708) 021 0101',
    email: 'info@ustemrobotics.kz',
    instagram: '@firstroboticskz',
    instagram_link: 'https://www.instagram.com/firstroboticskz/'
  };

  return (
    <footer
      className='bg-[#1c1c1c] text-[#FFFFFF]'
      aria-labelledby='footer-heading'
    >
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='mx-auto px-8 py-8 sm:px-6 sm:py-10 lg:px-20 lg:py-12 '>
        <div className='grid grid-cols-1 gap-14 md:grid-cols-2'>
          <div className='flex flex-col items-start'>
            <img
              alt='FIRST® Kazakhstan'
              src='https://i.imgur.com/mswmmQ5.png'
              className='mb-6 w-24'
            />
            <p className='text-lg font-bold mb-4 md:text-xl'>
              {text.statement}
            </p>
          </div>

          <div className='flex flex-col'>
            <ul role='list' className='space-y-3'>
              <li className='flex items-center gap-2'>
                <PhoneIcon className='h-6 w-6 text-[#5B5B5B]' />
                <a
                  href={`tel:${text.phone}`}
                  className='text-sm text-[#CCCCCC] hover:text-white'
                >
                  {text.phone}
                </a>
              </li>

              <li className='flex items-center gap-2'>
                <EnvelopeIcon className='h-6 w-6 text-[#5B5B5B]' />
                <a
                  href={`mailto:${text.email}`}
                  className='text-sm text-[#CCCCCC] hover:text-white'
                >
                  {text.email}
                </a>
              </li>

              <li className='flex items-center gap-2'>
                <img
                  className='h-6 w-6'
                  src='https://i.imgur.com/YDQzcnD.png'
                  alt='Instagram'
                />
                <a
                  href={text.instagram_link}
                  className='text-sm text-[#CCCCCC] hover:text-white'
                >
                  {text.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
