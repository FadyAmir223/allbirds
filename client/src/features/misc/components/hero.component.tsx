import { Link } from 'react-router-dom'

import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import heroLinks from '../data/men-women-url.json'

const featuredLinks = [
  { text: "women's shoes", url: 'collections/womens' },
  { text: "men's shoes", url: 'collections/mens' },
  { text: "kid's shoes", url: 'collections/little-kids' },
  { text: 'new arrivals', url: 'collections/womens-new-arrivals' },
  { text: 'shoe finder', url: 'pages/style-quiz' },
]

const Hero = () => {
  return (
    <section className='overflow mb-24 h-[calc(80dvh-50px-32px)] lg:px-6'>
      <ul className='flex whitespace-nowrap bg-silver text-silver-dark lg:hidden'>
        {featuredLinks.map((featuredLink) => (
          <li key={featuredLink.text}>
            <Link
              to={featuredLink.url}
              className={cn('allbirds-font block px-3 py-2 tracking-[1px]')}
            >
              {featuredLink.text}
            </Link>
          </li>
        ))}
      </ul>

      <div className='relative lg:mx-9'>
        <img
          src='/images/main-page/hero/Q323-Mizzle-Hero-Desktop.webp'
          alt=''
          className='hidden h-full md:block'
        />

        <img
          src='/images/main-page/hero/Q323-Mizzle-Hero-Mobile.webp'
          alt=''
          className='block h-64 w-full object-cover md:hidden'
        />

        <div className='absolute left-0 top-1/2 hidden -translate-y-1/2 bg-white py-14 pr-14 lg:block'>
          <h4 className={cn('allbirds-font mb-4 font-semibold text-gray')}>
            featured
          </h4>
          <ul className='text-[12px] capitalize tracking-[1px] text-silver-dark'>
            {featuredLinks.map((featuredLink) => (
              <li key={featuredLink.text} className='hover:underline'>
                <Link to={featuredLink.url}>{featuredLink.text}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='absolute left-0 top-1/3 h-2/5 w-full max-w-7xl '>
          <div>
            <div className='text-center font-bold capitalize text-white'>
              <h1 className='mb-3 sm:text-2xl md:text-3xl lg:text-4xl'>
                up to 50% off must-gift styles
              </h1>
              <p className='text-sm'>the black friday event starts now</p>
            </div>
            <div className='absolute bottom-0 left-1/2 flex w-[300px] -translate-x-1/2 justify-center gap-4 sm:w-[340px] lg:w-[384px]'>
              {heroLinks.map((heroLink) => (
                <LinkCustom
                  key={heroLink.text}
                  to={heroLink.url}
                  styleType='invert'
                  className='w-1/2 border-transparent py-[7px] hover:border-2 hover:border-gray lg:py-[10px]'
                >
                  {heroLink.text}
                </LinkCustom>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
