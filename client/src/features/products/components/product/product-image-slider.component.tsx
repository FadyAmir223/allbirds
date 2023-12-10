import { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import screenSize from '@/data/screen-size.json'

type ProductImageSliderProps = {
  images: string[]
  editionIndex: number
  productIndex: number
}

const ProductImageSlider = ({
  images,
  editionIndex,
  productIndex,
}: ProductImageSliderProps) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)

  const handleImageSlide = (index: number) => {
    swiper?.slideTo(index)
  }

  useEffect(() => {
    if (swiper) swiper.slideTo(0, 0)
  }, [editionIndex, productIndex]) // eslint-disable-line

  return (
    <div className='flex gap-x-6'>
      <div
        className='hidden flex-col gap-y-2.5 lg:flex'
        style={{ minWidth: `calc((100% - ${(8 - 1) * 11.5}px) / 8)` }}
      >
        {images.map((image, idx) => (
          <button
            key={image}
            className='relative aspect-square w-full bg-silver pb-[100%]'
            onClick={() => handleImageSlide(idx)}
          >
            <img src={image} alt='' className='absolute inset-0' />
          </button>
        ))}
      </div>

      <div className='relative w-full lg:w-[calc(100%-12.5%-10px)]'>
        <div className='overflow-hidden'>
          <div className='relative'>
            <Swiper
              onSwiper={setSwiper}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                renderBullet: (_, className) =>
                  `<span class='${className} !w-1.5 !h-1.5 !bg-blue-light duration-[250ms] transition-transform'></span>`,
                bulletActiveClass: '!bg-blue-dark scale-[2] !opacity-100',
              }}
              breakpoints={{ [screenSize.lg]: { pagination: false } }}
            >
              {images.map((image) => (
                <SwiperSlide
                  key={image}
                  className='relative aspect-square bg-silver pb-[100%]'
                >
                  <img src={image} alt='' className='absolute inset-0' />
                </SwiperSlide>
              ))}

              <SlideNavButtons />
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  )
}

const SlideNavButtons = () => {
  const swiper = useSwiper()

  const handleNeighbourSlide = (direction: 1 | -1) => {
    const slides = swiper.slides.length
    const index = (swiper.realIndex + direction + slides) % slides
    swiper.slideToLoop(index)
  }

  return (
    <div className='absolute bottom-3.5 right-2 z-10 hidden gap-x-3 lg:flex'>
      <button
        className='grid h-12 w-12 place-items-center rounded-full border-silver bg-white text-gray'
        onClick={() => handleNeighbourSlide(-1)}
      >
        <span className='scale-125'>
          <FaAngleLeft />
        </span>
      </button>
      <button
        className='grid h-12 w-12 place-items-center rounded-full border-silver bg-white text-gray'
        onClick={() => handleNeighbourSlide(1)}
      >
        <span className='scale-125'>
          <FaAngleRight />
        </span>
      </button>
    </div>
  )
}

export default ProductImageSlider
