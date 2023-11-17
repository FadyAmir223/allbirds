import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import GiftCard from './gift-card.component';
import SlideNavButtons from './slide-nav-buttons.component';
import { cn } from '@/utils/cn';
import gifts from '../data/gifts.json';
import screenSize from '@/data/screen-size.json';

type SliderProps = {
  title: string;
  sectionDesctop?: 'on' | 'off';
  cardAppendix?: 'on' | 'off';
};

const SECTION_SIZE = 3;
const totalGifts = gifts.flatMap((gift) => gift.items).length;
const imagesPerSlide =
  innerWidth < screenSize.sm ? 1 : innerWidth < screenSize.md ? 2 : 3;

const Slider = ({
  title,
  sectionDesctop = 'off',
  cardAppendix = 'off',
}: SliderProps) => {
  const [gift, setGift] = useState({
    section: 0,
    card: 0,
    total: totalGifts,
  });

  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const handleSectionChange = (idx: number) => {
    const cardIdx = idx * SECTION_SIZE;
    setGift((prevGift) => ({
      ...prevGift,
      section: idx,
      card: cardIdx,
    }));
    swiper?.slideTo(cardIdx);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setGift((prevGift) => ({
      ...prevGift,
      card: swiper.realIndex,
      section:
        Math.ceil((swiper.realIndex + imagesPerSlide) / SECTION_SIZE) - 1,
    }));
  };

  return (
    <section className='px-6 pb-9'>
      <div className='lg:px-9'>
        <h2
          className={cn(
            'capitalize font-bold mb-2',
            sectionDesctop === 'on'
              ? 'text-[26px] text-center'
              : 'text-xl mb-6',
          )}
        >
          {title}
        </h2>

        {sectionDesctop === 'on' && (
          <>
            <div className='border-b-2 border-gray-light flex justify-center mb-8'>
              <div className='flex justify-center relative'>
                <span
                  className='absolute -bottom-[2px] w-44 bg-black left-0 h-[2px] duration-[250ms]'
                  style={{ translate: `${100 * gift.section}%` }}
                />

                {gifts.map((gift, idx) => (
                  <button
                    key={gift.text}
                    className={cn(
                      'allbirds-font p-3 border-b-2 border-b-transparent w-44 tracking-[1px]',
                    )}
                    onClick={() => handleSectionChange(idx)}
                  >
                    {gift.text}
                  </button>
                ))}
              </div>
            </div>

            <div className='gap-x-2 justify-center hidden md:flex'>
              {gifts[gift.section].items.map((giftItem) => (
                <GiftCard
                  key={giftItem.title}
                  {...giftItem}
                  className='w-full'
                  appendix={cardAppendix}
                />
              ))}
            </div>
          </>
        )}

        <div
          className={cn('relative', { 'md:hidden': sectionDesctop === 'on' })}
        >
          <Swiper
            spaceBetween={8}
            slidesPerView={imagesPerSlide}
            onSlideChange={handleSlideChange}
            onSwiper={setSwiper}
          >
            <div className='whitespace-nowrap'>
              {gifts.map((gift) =>
                gift.items.map((giftItem) => (
                  <SwiperSlide>
                    {cardAppendix === 'off' ? (
                      <Link to='/'>
                        <GiftCard
                          key={giftItem.title}
                          {...giftItem}
                          appendix={cardAppendix}
                        />
                      </Link>
                    ) : (
                      <GiftCard
                        key={giftItem.title}
                        {...giftItem}
                        appendix={cardAppendix}
                      />
                    )}
                  </SwiperSlide>
                )),
              )}
            </div>

            <div
              className={cn({
                'hidden md:block': cardAppendix === 'off',
              })}
            >
              <SlideNavButtons
                total={gift.total}
                imagesPerSlide={imagesPerSlide}
              />
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Slider;
