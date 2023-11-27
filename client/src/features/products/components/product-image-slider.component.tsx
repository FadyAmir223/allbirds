import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// TODO: mobile image slider

type ProductImageSliderProps = {
  images: string[];
  currImgIndex: number;
  handleImageChange: (index: number) => void;
  handleNeighbourImage: (direction: -1 | 1) => void;
};

const ProductImageSlider = ({
  images,
  currImgIndex,
  handleImageChange,
  handleNeighbourImage,
}: ProductImageSliderProps) => {
  return (
    <div className='flex gap-x-6'>
      <div
        className='flex flex-col gap-y-2.5'
        style={{ width: `calc((100% - ${(8 - 1) * 12}px) / 8)` }}
      >
        {images.map((image, idx) => (
          <button
            key={image}
            className='bg-silver relative pb-[100%] aspect-square w-full'
            onClick={() => handleImageChange(idx)}
          >
            <img src={image} alt='' className='absolute inset-0' />
          </button>
        ))}
      </div>

      <div className='relative select-none flex-1'>
        <div className='overflow-hidden'>
          <div className='relative'>
            <div
              className='flex duration-300 relative'
              style={{ transform: `translateX(-${currImgIndex * 100}%)` }}
            >
              {images.map((image) => (
                <div
                  key={image}
                  className='aspect-square bg-silver relative pb-[100%]'
                >
                  <img src={image} alt='' className='absolute inset-0' />
                </div>
              ))}
            </div>

            <div className='absolute bottom-3.5 right-2 flex gap-x-3'>
              <button
                className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                onClick={() => handleNeighbourImage(-1)}
              >
                <span className='scale-125'>
                  <FaAngleLeft />
                </span>
              </button>
              <button
                className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                onClick={() => handleNeighbourImage(1)}
              >
                <span className='scale-125'>
                  <FaAngleRight />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider;
