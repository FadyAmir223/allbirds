import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useSwiper } from 'swiper/react';

import { cn } from '@/utils/cn.util';

type SlideNavButtonsProps = {
  total: number;
  imagesPerSlide: number;
};

const SlideNavButtons = ({ total, imagesPerSlide }: SlideNavButtonsProps) => {
  const swiper = useSwiper();

  const handleClickNext = () => swiper.slideNext();
  const handleClickPrev = () => swiper.slidePrev();

  return (
    <>
      <button
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray text-gray-light grid place-items-center w-10 h-10 z-10',
          { hidden: swiper.realIndex > total - imagesPerSlide - 1 },
        )}
        onClick={handleClickNext}
        disabled={swiper.realIndex > total - imagesPerSlide - 1}
      >
        <span className='scale-150'>
          <FaAngleRight />
        </span>
      </button>

      <button
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray text-gray-light grid place-items-center w-10 h-10 z-10',
          { hidden: swiper.realIndex === 0 },
        )}
        onClick={handleClickPrev}
        disabled={swiper.realIndex === 0}
      >
        <span className='scale-150'>
          <FaAngleLeft />
        </span>
      </button>
    </>
  );
};

export default SlideNavButtons;
