import { Link } from 'react-router-dom';

import LinkCustom from '@/components/link-custom.component';
import { cn } from '@/utils/cn';
import heroLinks from '../data/men-women-url.json';

const featuredLinks = [
  { text: "women's shoes", url: 'collections/womens' },
  { text: "men's shoes", url: 'collections/mens' },
  { text: "kid's shoes", url: 'collections/little-kids' },
  { text: 'new arrivals', url: 'collections/womens-new-arrivals' },
  { text: 'shoe finder', url: 'pages/style-quiz' },
];

const Hero = () => {
  return (
    <section className='lg:px-6 h-[calc(80dvh-50px-32px)] mb-24 overflow-x-hidden'>
      <ul className='lg:hidden flex bg-silver text-silver-dark whitespace-nowrap'>
        {featuredLinks.map((featuredLink) => (
          <li key={featuredLink.text} className=''>
            <Link
              to={featuredLink.url}
              className={cn('allbirds-font tracking-[1px] px-3 py-2 block')}
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
          className='h-full hidden md:block'
        />

        <img
          src='/images/main-page/hero/Q323-Mizzle-Hero-Mobile.webp'
          alt=''
          className='block md:hidden h-64 w-full object-cover'
        />

        <div className='hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 bg-white py-14 pr-14'>
          <h4 className={cn('allbirds-font mb-4 font-semibold text-gray')}>
            featured
          </h4>
          <ul className='text-silver-dark capitalize text-[12px] tracking-[1px]'>
            {featuredLinks.map((featuredLink) => (
              <li key={featuredLink.text} className='hover:underline'>
                <Link to={featuredLink.url}>{featuredLink.text}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='absolute top-1/3 left-0 w-full h-2/5 max-w-7xl '>
          <div className=''>
            <div className='capitalize text-white text-center font-bold'>
              <h1 className='mb-3 sm:text-2xl md:text-3xl lg:text-4xl'>
                up to 50% off must-gift styles
              </h1>
              <p className='text-sm'>the black friday event starts now</p>
            </div>
            <div className='absolute bottom-0 flex justify-center gap-4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[340px] lg:w-[384px]'>
              {heroLinks.map((heroLink) => (
                <LinkCustom
                  key={heroLink.text}
                  to={heroLink.url}
                  styleType='invert'
                  className='py-[7px] lg:py-[10px] w-1/2 border-transparent hover:border-2 hover:border-gray'
                >
                  {heroLink.text}
                </LinkCustom>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
