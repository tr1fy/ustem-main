const logos = [
  'https://i.imgur.com/6zux0xx.png',
  'https://i.imgur.com/FCzwXBr.png',
  'https://i.imgur.com/xYQ0AEF.png',
  'https://i.imgur.com/mswmmQ5.png'
]

const Partners = () => {
  return (
    <>
      <div className='mb-[45px] flex items-center space-x-4 md:my-[50px]'>
        <div className='h-0.5 w-[40px] bg-[#9BCFFF] md:w-[80px]'></div>

        <span className='text-gray-700 text-lg text-[#696969]'>
          Наши партнеры
        </span>
        <div className='h-[2px] flex-grow bg-[#9BCFFF]'></div>
      </div>
      <div className='mt-[20px] flex h-[125px] items-center justify-center gap-x-4 bg-[#0085FF] px-[10px] py-[10px] md:mt-[50px] md:gap-x-10 md:px-[80px] md:py-[45px]'>
        {logos.map(item => (
          <img key={item} src={item} className='h-[25px] w-auto md:h-[45px]' alt='' />
        ))}
      </div>
    </>
  )
}

export default Partners
