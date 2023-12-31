import { cn } from '@/utils/cn.util'

type ProductPriceProps = {
  price: number
  salePrice: number | undefined
  className?: string
}

const ProductPrice = ({ price, salePrice, className }: ProductPriceProps) => {
  return (
    <div className={className}>
      <span
        className={cn('text-sm', {
          'line-through': salePrice,
        })}
      >
        ${price}
      </span>
      {salePrice && <span className='ml-1 text-sm text-red'>{salePrice}</span>}
    </div>
  )
}

export default ProductPrice
