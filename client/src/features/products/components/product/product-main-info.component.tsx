import { Link } from 'react-router-dom'
import StarRating from '../star-rating.component'
import ProductPrice from './product-price.component'
import { cn } from '@/utils/cn.util'

type ProductMainInfoProps = {
  name: string
  freeShipping: boolean
  price: number
  salePrice: number | undefined
  rating: number
  totalReviews: number
  mobile?: boolean
}

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
      <Link to='/' className='text-[10px] font-[500] hover:underline'>
        Home /
      </Link>

      <div className='flex justify-between'>
        <h1 className='mb-1 text-xl font-bold lg:text-3xl'>{name}</h1>
        <ProductPrice
          price={price}
          salePrice={salePrice}
          className='lg:hidden'
        />
      </div>

      <div className='mb-2 mt-1 hidden items-center lg:flex'>
        <ProductPrice price={price} salePrice={salePrice} />

        {freeShipping && (
          <span className='ml-2 bg-silver p-1.5 text-[12px] font-[500] uppercase italic tracking-[0.5px]'>
            free shipping
          </span>
        )}
      </div>

      <div className='mb-5 flex justify-between'>
        <div className='flex items-center gap-2'>
          <StarRating rating={rating} scale='sm' />
          <span className='underline'>({totalReviews})</span>
        </div>

        {freeShipping && (
          <span className='ml-2 bg-silver p-1.5 text-[12px] font-[500] uppercase italic tracking-[0.5px] lg:hidden'>
            free shipping
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductMainInfo
