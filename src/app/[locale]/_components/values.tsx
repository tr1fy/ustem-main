import { motion } from 'framer-motion'

const ValueBox = ({ logo, title, text }: any) => {
  return (
    <div className='flex gap-[15px]'>
      <img
        src='https://i.imgur.com/tX3jIUH.png'
        className='mt-[10px] max-h-[140px]'
      />
      <div className='flex max-w-[300px] flex-col px-5'>
        <div className='flex aspect-square h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0085FF]'>
          <img loading='lazy' alt='' src={logo} className=' h-[28px] w-auto' />
        </div>
        <div className='mt-3 w-full text-xl font-bold text-[#0085FF] md:text-3xl'>
          {title}
        </div>
        <div className='text-md mt-2 w-full text-[#696969] md:text-lg'>
          {text}
        </div>
      </div>
    </div>
  )
}

const valuesArray = [
  {
    title: 'Открытие',
    text: 'Мы осваиваем новые навыки и идеи.',
    logo: 'https://i.imgur.com/7whSURK.png'
  },
  {
    title: 'Инновации',
    text: 'Мы используем творческий подход и настойчивость для решения проблем.',
    logo: 'https://i.imgur.com/4TYImqY.png'
  },
  {
    title: 'Влияние',
    text: 'Мы применяем то, чему научились, для улучшения нашего мира.',
    logo: 'https://i.imgur.com/5oygHlQ.png'
  },
  {
    title: 'Командная работа',
    text: 'Мы становимся сильнее, когда работаем вместе.',
    logo: 'https://i.imgur.com/9FQUzZj.png'
  },
  {
    title: 'Веселье',
    text: 'Мы получаем удовольствие от того, что делаем, и празднуем это!',
    logo: 'https://i.imgur.com/rDUUrnc.png'
  },
  {
    title: 'Инклюзивность',
    text: 'Мы уважаем друг друга и принимаем наши различия.',
    logo: 'https://i.imgur.com/ft131ea.png'
  }
]

const Values = () => {
  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className='mb-[50px] mt-[50px] px-[10px] md:mb-[100px] md:mt-[100px] md:px-[80px]'>
          <div className='flex max-w-[597px] flex-col px-5'>
            <div className='text-black w-full text-5xl font-bold italic max-md:max-w-full max-md:text-4xl'>
              Ценности FIRST®
            </div>
            <div className='text-stone-500 mt-6 w-full text-lg max-md:max-w-full'>
              Мы воплощаем основные принципы Благородного <br />
              профессионализма и сотрудничества в наших основных ценностях
            </div>
          </div>
          <div className='mt-[60px] grid grid-cols-2 gap-2 px-[10px] sm:grid-cols-2 md:grid-cols-3'>
            {valuesArray.map(item => (
              <ValueBox
                key={item.title}
                title={item.title}
                text={item.text}
                logo={item.logo}
              />
            ))}
          </div>
        </div>
      </motion.section>
      <div className='mb-[40px] flex items-center space-x-4 md:my-[50px]'>
        <div className='h-0.5 w-[40px] bg-[#9BCFFF] md:w-[80px]'></div>
        <span className='text-gray-700 text-lg text-[#696969]'>Программы</span>
        <div className='h-[2px] flex-grow bg-[#9BCFFF]'></div>
      </div>
    </>
  )
}

export default Values
