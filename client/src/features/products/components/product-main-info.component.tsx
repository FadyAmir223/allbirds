import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';

import ProductPrice from './product-price.component';
import { cn } from '@/utils/cn.util';

type ProductMainInfoProps = {
  name: string;
  freeShipping: boolean;
  price: number;
  salePrice: number | undefined;
  rating: number;
  totalReviews: number;
  mobile?: boolean;
};

const ProductMainInfo = ({
  name,
  freeShipping,
  price,
  salePrice,
  rating,
  totalReviews,
  mobile = false,
}: ProductMainInfoProps) => {
  return (
    <div className={cn(mobile ? 'block lg:hidden' : 'hidden lg:block')}>
      <Link to='/' className='hover:underline font-semibold text-[10px]'>
        Home /
      </Link>

      <div className='flex justify-between'>
        <h1 className='text-xl lg:text-3xl font-bold mb-1'>{name}</h1>
        <ProductPrice
          price={price}
          salePrice={salePrice}
          className='lg:hidden'
        />
      </div>

      <div className='hidden lg:flex items-center mt-1 mb-2'>
        <ProductPrice price={price} salePrice={salePrice} />

        {freeShipping && (
          <span className='ml-2 text-[12px] p-1.5 bg-silver uppercase italic font-semibold tracking-[0.5px]'>
            free shipping
          </span>
        )}
      </div>

      <div className='flex justify-between mb-5'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-x-0.5'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Fragment key={idx}>
                {idx + 1 <= rating ? (
                  <span className='text-gray scale-110'>
                    <MdStar />
                  </span>
                ) : idx + 1 > rating && idx < rating ? (
                  <span className='text-gray scale-110'>
                    <MdStarHalf />
                  </span>
                ) : (
                  <span className='scale-110'>
                    <MdStarBorder />
                  </span>
                )}
              </Fragment>
            ))}
          </div>
          <span className='underline'>({totalReviews})</span>
        </div>

        {freeShipping && (
          <span className='lg:hidden ml-2 text-[12px] p-1.5 bg-silver uppercase italic font-semibold tracking-[0.5px]'>
            free shipping
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductMainInfo;
