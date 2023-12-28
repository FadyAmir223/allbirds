import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import { SlideCard } from './slide-card.component'
import SlideNavButtons from './slide-nav-buttons.component'
import { cn } from '@/utils/cn.util'
import screenSize from '@/data/screen-size.json'

export type Card = {
  imgUrl: string
  miniImgUrl?: string
  title: string
  description?: string
  url?: string
}

export type SectionDesktop = {
  text?: string
  items: Card[]
}

type SliderProps = {
  title: string
  sectionDesctop?: boolean
  cardAppendix?: boolean
  slides: SectionDesktop[]
  imagesPerSlide?: number
}

const SECTION_SIZE = 3
const IMAGES_PER_SLIDE =
  innerWidth < screenSize.sm ? 1 : innerWidth < screenSize.md ? 2 : 3

export const Slider = ({
  title,
  sectionDesctop = false,
  cardAppendix = false,
  slides,
  imagesPerSlide = IMAGES_PER_SLIDE,
}: SliderProps) => {
  const slidesFlat = slides.flatMap((slide) => slide.items)
  const totalSlides = slidesFlat.length

  const [slide, setSlide] = useState({
    section: 0,
    card: 0,
  })

  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const handleSectionChange = (idx: number) => {
    const cardIdx = idx * SECTION_SIZE
    setSlide((prevSlide) => ({
      ...prevSlide,
      section: idx,
      card: cardIdx,
    }))
    swiper?.slideTo(cardIdx)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setSlide((prevSlide) => ({
      ...prevSlide,
      card: swiper.realIndex,
      section:
        Math.ceil((swiper.realIndex + imagesPerSlide) / SECTION_SIZE) - 1,
    }))
  }

  return (
    <section className='overflow-x-hidden px-6 pb-9'>
      <div className='lg:px-9'>
        <h2
          className={cn(
            'mb-2 font-bold capitalize',
            sectionDesctop ? 'text-center text-[26px]' : 'mb-6 text-xl',
          )}
        >
          {title}
        </h2>

        {sectionDesctop && (
          <>
            <div className='mb-8 flex justify-center border-b-2 border-gray-light'>
              <div className='relative flex justify-center'>
                <span
                  className='absolute -bottom-[2px] left-0 h-[2px] w-44 bg-black duration-[250ms]'
                  style={{ translate: `${100 * slide.section}%` }}
                />

                {slides.map((slide, idx) => (
                  <button
                    key={slide.text}
                    className={cn(
                      'allbirds-font w-44 border-b-2 border-b-transparent p-3 tracking-[1px]',
                    )}
                    onClick={() => handleSectionChange(idx)}
                  >
                    {slide.text}
                  </button>
                ))}
              </div>
            </div>

            <div className='hidden justify-center gap-x-2 md:flex'>
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
            className='!overflow-visible'
          >
            <div className='whitespace-nowrap'>
              {slidesFlat.map((slide) => (
                <SwiperSlide key={slide.title}>
                  {!cardAppendix ? (
                    <Link to={slide.url || ''}>
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
  )
}
