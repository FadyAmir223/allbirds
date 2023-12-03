import { cn } from '@/utils/cn.util'
import CartSvg from '@/assets/svg/cart.svg?react'
import { useAppSelector } from '@/store/hooks'

export const CartIcon = () => {
  const totalAmount = useAppSelector((store) => store.cart.totalAmount)

  return (
    <div className='relative'>
      <CartSvg />
      <span
        className={cn('absolute top-0 text-xs font-bold', {
          'left-[10px]': totalAmount === 0,
          'left-[11px]': totalAmount > 0 && totalAmount <= 9,
          'left-[8px] text-[11px]': totalAmount > 9,
        })}
      >
        {totalAmount}
      </span>
    </div>
  )
}
