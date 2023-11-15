import { useState } from 'react';

import { cn } from '@/utils/cn';
import LinkCustom from '@/components/link-custom.component';
import heroLinks from '../data/men-women-url.json';

const gifts = [
  {
    text: 'for everyday',
    items: [
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-WR2-Carousel-Card-1110x1110.webp',
        miniImgUrl: '/images/main-page/mini-art/Weather.webp',
        title: 'wool runner 2',
        description: 'Step Into Next-Gen Comfort',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-2.webp',
        miniImgUrl: '/images/main-page/mini-art/Weather.webp',
        title: 'wool runner-up mizzle',
        description: 'wet weather high top',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-1 (2).webp',
        miniImgUrl: '/images/main-page/mini-art/Tree.webp',
        title: 'tree runner',
        description: 'breezy, everyday sneaker',
      },
    ],
  },
  {
    text: 'for travel',
    items: [
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-1 (1).webp',
        miniImgUrl: '/images/main-page/mini-art/Tree.webp',
        title: 'tree dasher 2',
        description: 'comfy, breezy, everyday runs',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-2 (1).webp',
        miniImgUrl: '/images/main-page/mini-art/Weather.webp',
        title: 'wool dasher mizzle',
        description: 'comfy, water-repellent, everyday runs',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-3.webp',
        miniImgUrl: '/images/main-page/mini-art/Tree.webp',
        title: 'tree flyer 2',
        description: 'comfortable, springy active shoe',
      },
    ],
  },
  {
    text: 'for lounging',
    items: [
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-1.webp',
        miniImgUrl: '/images/main-page/mini-art/Weather.webp',
        title: 'wool dweller',
        description: 'cozy slipper',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-4.webp',
        miniImgUrl: '/images/main-page/mini-art/Weather.webp',
        title: 'wool lounger',
        description: 'cozy slip-on',
      },
      {
        imgUrl:
          '/images/main-page/favorites/23Q4-Holiday_Ch1-Site-Category_Category_Card-1110x1110-3 (2).webp',
        miniImgUrl: '/images/main-page/mini-art/fluff_pdp_icon.webp',
        title: 'wool lounger fluff',
        description: 'cozy feel, fluffy material',
      },
    ],
  },
];

const BestSellingGifts = () => {
  const [currGift, setCurrGift] = useState(0);

  const handleGiftChange = (idx: number) => {
    setCurrGift(idx);
  };

  return (
    <section className='px-6'>
      <div className='px-9'>
        <h2 className='capitalize font-bold text-[26px] text-center mb-2'>
          our best-selling gifts
        </h2>

        <div className='border-b-2 border-gray-light flex justify-center mb-8'>
          <div className='flex justify-center relative'>
            <span
              className='absolute -bottom-[2px] w-44 bg-black left-0 h-[2px] duration-150'
              style={{ translate: `${100 * currGift}%` }}
            />

            {gifts.map((gift, idx) => (
              <button
                className={cn(
                  'allbirds-font p-3 border-b-2 border-b-transparent w-44 tracking-[1px]',
                )}
                onClick={() => handleGiftChange(idx)}
              >
                {gift.text}
              </button>
            ))}
          </div>
        </div>

        <div className='flex gap-x-5 justify-center'>
          {gifts[currGift].items.map((giftItem) => (
            <div
              key={giftItem.title}
              className='group shadow-lg shadow-gray overflow-hidden group w-1/3'
            >
              <div className='relative group/overlay w-full pb-[100%] overflow-hidden'>
                <img
                  src={giftItem.imgUrl}
                  alt=''
                  className='absolute top-0 left-0 w-full h-full object-cover duration-500 transition-transform group-hover:scale-[105%]'
                />
                <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out bg-gray opacity-0 group-hover/overlay:opacity-40'></div>

                <div className='absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-out opacity-0 group-hover/overlay:opacity-100 flex justify-center items-center'>
                  <div className='flex flex-col gap-y-3'>
                    {heroLinks.map((heroLink) => (
                      <LinkCustom
                        key={heroLink.text}
                        to={heroLink.url}
                        className='z-30 py-[10px] bg-white hover:bg-gray border-none duration-100 block relative w-full'
                      >
                        {heroLink.text}
                      </LinkCustom>
                    ))}
                  </div>
                </div>
              </div>
              <div className='px-6 py-3 text-gray'>
                <h4 className='capitalize border-b-[1px] border-b-gray-light font-bold pb-[10px] mb-[10px] text-[14px] tracking-wide'>
                  {giftItem.title}
                </h4>
                <div className='flex gap-x-2 items-center'>
                  <img src={giftItem.miniImgUrl} alt='' className='w-6' />
                  <p className='leading-[1.4] text-[12px] tracking-[0.3px]'>
                    {giftItem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingGifts;
