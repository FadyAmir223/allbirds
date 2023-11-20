import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import SlideCard from './slide-card.component';
import SlideNavButtons from './slide-nav-buttons.component';
import { cn } from '@/utils/cn';
import screenSize from '@/data/screen-size.json';

export type Card = {
  imgUrl: string;
  miniImgUrl?: string;
  title: string;
  description: string;
};

type SectionDesktop = {
  text: string;
  items: Card[];
};

type SliderProps = {
  title: string;
  sectionDesctop?: boolean;
  cardAppendix?: boolean;
  slides: SectionDesktop[];
};

const SECTION_SIZE = 3;
const imagesPerSlide =
  innerWidth < screenSize.sm ? 1 : innerWidth < screenSize.md ? 2 : 3;

export const Slider = ({
  title,
  sectionDesctop = false,
  cardAppendix = false,
  slides,
}: SliderProps) => {
  const slidesFlat = slides.flatMap((slide) => slide.items);
  const totalSlides = slidesFlat.length;

  const [slide, setSlide] = useState({
    section: 0,
    card: 0,
  });

  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const handleSectionChange = (idx: number) => {
    const cardIdx = idx * SECTION_SIZE;
    setSlide((prevSlide) => ({
      ...prevSlide,
      section: idx,
      card: cardIdx,
    }));
    swiper?.slideTo(cardIdx);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setSlide((prevSlide) => ({
      ...prevSlide,
      card: swiper.realIndex,
      section:
        Math.ceil((swiper.realIndex + imagesPerSlide) / SECTION_SIZE) - 1,
    }));
  };

  return (
    <section className='px-6 pb-9 overflow-x-hidden'>
      <div className='lg:px-9'>
        <h2
          className={cn(
            'capitalize font-bold mb-2',
            sectionDesctop ? 'text-[26px] text-center' : 'text-xl mb-6',
          )}
        >
          {title}
        </h2>

        {sectionDesctop && (
          <>
            <div className='border-b-2 border-gray-light flex justify-center mb-8'>
              <div className='flex justify-center relative'>
                <span
                  className='absolute -bottom-[2px] w-44 bg-black left-0 h-[2px] duration-[250ms]'
                  style={{ translate: `${100 * slide.section}%` }}
                />

                {slides.map((slide, idx) => (
                  <button
                    key={slide.text}
                    className={cn(
                      'allbirds-font p-3 border-b-2 border-b-transparent w-44 tracking-[1px]',
                    )}
                    onClick={() => handleSectionChange(idx)}
                  >
                    {slide.text}
                  </button>
                ))}
              </div>
            </div>

            <div className='gap-x-2 justify-center hidden md:flex'>
              {slides[slide.section].items.map((slideItem) => (
                <SlideCard
                  key={slideItem.title}
                  {...slideItem}
                  className='w-full'
                  appendix={cardAppendix}
                />
              ))}
            </div>
          </>
        )}

        <div className={cn('relative', { 'md:hidden': sectionDesctop })}>
          <Swiper
            spaceBetween={8}
            slidesPerView={imagesPerSlide}
            onSlideChange={handleSlideChange}
            onSwiper={setSwiper}
          >
            <div className='whitespace-nowrap'>
              {slidesFlat.map((slide) => (
                <SwiperSlide key={slide.title}>
                  {!cardAppendix ? (
                    <Link to='/'>
                      <SlideCard {...slide} appendix={cardAppendix} />
                    </Link>
                  ) : (
                    <SlideCard {...slide} appendix={cardAppendix} />
                  )}
                </SwiperSlide>
              ))}
            </div>

            <div
              className={cn({
                'hidden md:block': !cardAppendix,
              })}
            >
              <SlideNavButtons
                total={totalSlides}
                imagesPerSlide={imagesPerSlide}
              />
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};
