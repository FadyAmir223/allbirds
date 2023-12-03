import { Link } from 'react-router-dom'

import BottomDrawer from '@/components/bottom-drawer.component'
import LinkCustom from '@/components/link-custom.component'
import { CartIcon, toggleCart } from '@/features/cart'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { ModalProps } from '../../types/modal.type'
import type { PureCartProduct } from '@/features/cart'

type AddToCartModalProps = ModalProps & {
  item: PureCartProduct | null
}

const AddToCartModal = ({ item, isOpen, handleClose }: AddToCartModalProps) => {
  const totalPrice = useAppSelector((state) => state.cart.totalPrice)
  const dispatch = useAppDispatch()

  const handleCartOpen = () => {
    handleClose()
    dispatch(toggleCart())
  }

  return (
    item && (
      <BottomDrawer
        className='w-3/5 p-4'
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <div className='mb-3 border-b border-b-silver pb-2'>
          <div className='flex items-center gap-x-3'>
            <h3 className='mb-1 text-[22px] font-bold'>
              You've Got Great Taste
            </h3>
            <CartIcon />
          </div>
          <p className='text-sm'>Congrats! You get free standard shipping.</p>
        </div>

        <div className='flex justify-between'>
          <div className='flex gap-x-3'>
            <Link to={'/products/' + item.handle}>
              <img
                src={item.image}
                alt={item.name}
                className='object-fit aspect-square w-[8.75rem] bg-silver'
              />
            </Link>
            <div>
              <h4 className='font-bold'>{item.name}</h4>
              <p className='text-[0.85rem]'>{item.colorName}</p>
              <p className='text-[0.85rem]'>size: {item.size}</p>
              <p className='text-[0.85rem]'>${item.price}</p>
            </div>
          </div>

          <div className='w-2/5'>
            <div className='mb-3 flex items-center justify-between font-semibold'>
              <span className='text-sm'>Subtotal</span>
              <span className='text-sm'>${totalPrice}</span>
            </div>
            <LinkCustom
              className='mb-1.5 w-full py-3 text-[14px] tracking-[1.5px]'
              element='button'
              onClick={handleCartOpen}
            >
              view cart & checkout
            </LinkCustom>
            <LinkCustom
              className='w-full py-3 text-[14px] tracking-[1.5px]'
              element='button'
              styleType='invert'
              onClick={handleClose}
            >
              continue shoppipng
            </LinkCustom>
          </div>
        </div>
      </BottomDrawer>
    )
  )
}

export default AddToCartModal
