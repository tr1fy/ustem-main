import AnimatedCounter from '@/app/[locale]/components/counter'
import Link from 'next/link'
import { useTranslations } from 'next-intl';



const projects = [
  {
    title: 'FIRST® Kazakhstan',
    subtitle: 'programs.firstSubtitle',
    link: '/',
    image: '/program-photos/first-photo.jpeg'
  },
  {
    title: 'World Space Olympiad',
    subtitle: 'programs.wsoSubtitle',
    link: '/',
    image: '/program-photos/wso-photo.jpeg'
  },
  {
    title: 'Smart Sarbaz',
    subtitle: 'programs.smartSubtitle',
    link: '/',
    image: '/program-photos/smart-photo.jpeg'
  },
  {
    title: 'Ashyq Aspan',
    subtitle: 'programs.ashyqSubtitle',
    link: 'https://www.instagram.com/ashyqaspan.kz/',
    image: '/program-photos/ashyq-photo.jpeg'
  },
  {
    title: 'AI Cup',
    subtitle: 'programs.aiSubtitle',
    link: '/',
    image: '/program-photos/aicup-photo.jpeg'
  },
]

const OurResults = (): React.ReactNode => {
  const t = useTranslations('OurResults');

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='max-w-3xl mx-auto text-center mb-16'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#001F3F] to-[#0085FF] bg-clip-text text-transparent mb-6'>
            {t('title')}
          </h2>
          <p className='text-lg md:text-xl text-gray-600'>
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24'>
          {[
            { count: 21000, label: 'studentsParticipating' },
            { count: 3, label: 'winners' },
            { count: 94, label: 'graduatesInSTEM', suffix: '%' },
            { count: 100, label: 'participatingSchools' }
          ].map((stat, index) => (
            <div key={index} className='transform hover:-translate-y-2 transition-all duration-300'>
              <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100'>
                <div className='flex items-start gap-4'>
                  <div className='w-1 h-16 bg-gradient-to-b from-[#0085FF] to-[#00C2FF] rounded-full' />
                  <div>
                    <p className='text-4xl lg:text-5xl font-bold text-[#0085FF] mb-3'>
                      <AnimatedCounter from={0} to={stat.count} />
                      {stat.suffix}
                    </p>
                    <p className='text-gray-600 font-medium'>
                      {t(stat.label)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure Section */}
        <div className='mb-24'>
          <div className='relative rounded-3xl bg-white p-6 sm:p-8 lg:p-12 shadow-2xl overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50' />
            <div className='relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12'>
              <div className='w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left'>
                <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#001F3F] to-[#0085FF] bg-clip-text text-transparent'>
                  {t('infrastructureTitle')}
                </h3>
                <p className='text-base sm:text-lg text-gray-600 max-w-2xl lg:max-w-none mx-auto lg:mx-0'>
                  {t('infrastructureSubtitle')}
                </p>
              </div>
              <div className='w-full lg:w-1/2'>
                <div className='flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 lg:gap-8 justify-center'>
                  {['mit', 'fablab'].map((logo) => (
                    <div key={logo} className='group w-[140px] sm:w-[160px] lg:w-[180px]'>
                      <div className='aspect-square bg-white rounded-2xl flex items-center justify-center p-4 sm:p-6 lg:p-8
                                    shadow-lg hover:shadow-2xl transition-all duration-500 
                                    transform hover:-translate-y-2 hover:scale-105'>
                        <img
                          src={`/assets/${logo}.svg`}
                          alt={`${logo.toUpperCase()} Logo`}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24'>
          {projects.map((item) => (
            <div key={item.title} className='transform hover:-translate-y-2 transition-all duration-300'>
              <ProjectCard
                title={item.title}
                link={item.link}
                image={item.image}
                subtitle={item.subtitle}
              />
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className='rounded-3xl overflow-hidden'>
          <SupportCard />
        </div>
      </div>
    </section>
  )
}

const ProjectCard = ({ title, link, image, subtitle }: {
  title: string;
  link: string;
  image: string;
  subtitle: string;
}) => {
  const t = useTranslations();

  return (
    <Link href={link}>
      <div className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500'>
        <div
          className='h-[240px] w-full bg-cover bg-center transform transition-transform duration-500 group-hover:scale-105'
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
        <div className='p-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0085FF] transition-colors duration-300'>
            {title}
          </h3>
          <p className='text-gray-600'>
            {t(subtitle)}
          </p>
        </div>
      </div>
    </Link>
  )
}

const SupportCard = () => {
  const t = useTranslations('OurResults');

  return (
    <div className='relative bg-gradient-to-br from-[#0085FF] via-[#00A3FF] to-[#0085FF]'>
      {/* Background Patterns */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute w-full h-full'>
          <div className='absolute -top-1/2 -left-1/2 w-full h-full rotate-12 transform opacity-10'>
            <div className='w-full h-full bg-white/20'
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>
          </div>
        </div>
      </div>


      <div className='relative mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-8 lg:p-16'>

          <div className='flex flex-col justify-center space-y-6 lg:space-y-8'>
            <div className='relative'>

              <div className='absolute -left-4 top-0 w-1 h-16 bg-white/30 rounded-full'></div>
              <h3 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                {t('supportTitle')}
              </h3>
            </div>
            <p className='text-lg text-white/90 leading-relaxed'>
              {t('supportMessage')}
            </p>
          </div>


          <div className='relative'>
            <div className='group relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden rounded-2xl 
                          shadow-2xl transition-transform duration-500 hover:scale-[1.02]'>
              <div className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110'
                style={{ backgroundImage: 'url(https://i.imgur.com/q0ooLmO.png)' }}>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>
              </div>

              <div className='absolute inset-0 flex flex-col justify-end p-6 md:p-8'>
                <a href='https://kaspi.kz/pay/UStemRobotics'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='transform transition-all duration-300 hover:translate-y-[-4px]'>
                  <button className='w-full bg-white rounded-xl p-4 md:p-5 
                                   shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                                   transition-all duration-300 group/btn'>
                    <div className='flex items-center justify-center gap-4'>
                      <img src='https://i.imgur.com/6Kd7st9.png'
                        alt="Kaspi"
                        className='w-6 h-6 md:w-7 md:h-7 object-contain transition-transform duration-300 group-hover/btn:scale-110' />
                      <span className='text-base md:text-lg font-semibold text-gray-900'>
                        {t('supportButtonText')}
                      </span>
                    </div>
                  </button>
                </a>
              </div>
            </div>

            <div className='absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-white/20 rounded-tr-3xl'></div>
            <div className='absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-white/20 rounded-bl-3xl'></div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default OurResults