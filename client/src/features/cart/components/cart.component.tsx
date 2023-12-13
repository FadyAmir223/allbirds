import { Link } from 'react-router-dom'
import { TfiClose } from 'react-icons/tfi'
import { CartIcon } from './cart-icon.component'
import CloseButton from '@/components/close-button.component'
import Drawer from '@/components/drawer.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import type { CartProduct } from '../types/cart.type'
import {
  addCartItem,
  deleteCartItem,
  removeCartItem,
  toggleCart,
} from '../store/cart.slice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type CartProps = {
  handleNavClose: () => void
}

const shopItems = [
  { title: "shop men's", url: '/collections/mens' },
  { title: "shop women's", url: '/collections/womens' },
  { title: 'shop socks', url: '/collections/socks' },
  { title: "shop men's sale", url: '/collections/sale-mens-shoes' },
  { title: "shop women's sale", url: '/collections/sale-womens-shoes' },
]

export const Cart = ({ handleNavClose }: CartProps) => {
  const cart = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const handleCartToggle = () => {
    handleNavClose()
    dispatch(toggleCart())
  }

  const handleCartClose = () => {
    dispatch(toggleCart())
  }

  const handleAddCartItem = (item: CartProduct) => {
    dispatch(addCartItem(item))
  }

  const handleRemoveCartItem = (item: CartProduct) => {
    const { handle, editionId, size } = item
    dispatch(removeCartItem({ handle, editionId, size }))
  }

  const handleDeleteCartItem = (item: CartProduct) => {
    const { handle, editionId, size } = item
    dispatch(deleteCartItem({ handle, editionId, size }))
  }

  return (
    <>
      <button className='ml-3 block scale-75' onClick={handleCartToggle}>
        <CartIcon />
      </button>

      <Drawer
        isOpen={cart.isOpen}
        className='p-4'
        handleClose={handleCartClose}
      >
        <div className='relative border-b-4 border-b-silver pb-2 text-center'>
          <CloseButton position='left' onClick={handleCartClose} />

          <div className='mb-1 inline-block scale-75'>
            <CartIcon />
          </div>

          <p className='text-[10px] leading-[10px] text-gray'>
            You're<span className='text-[9.7px] font-[500]'> 75$ </span>
            away from the free shipping!
          </p>
        </div>

        {cart.totalAmount === 0 ? (
          <div className='text-center'>
            <p className='mb-4 mt-4 text-sm font-medium capitalize'>
              your cart is empty
            </p>
            <ul className='mx-auto flex w-3/5 flex-col items-center gap-2'>
              {shopItems.map((shopItem) => (
                <li key={shopItem.url} className='w-full'>
                  <LinkCustom
                    to={shopItem.url}
                    styleType='invert'
                    className='block w-full'
                    onClick={handleCartClose}
                  >
                    {shopItem.title}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <ul>
              {cart.items.map((item) => (
                <li
                  className='flex items-center gap-x-5 border-b border-b-gray py-5 last-of-type:border-b-2'
                  key={item.editionId + item.size}
                >
                  <Link to={'/products/' + item.handle}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='object-fit aspect-square w-[6.25rem] bg-silver'
                    />
                  </Link>
                  <div className='flex flex-grow flex-col justify-between gap-y-3 text-gray'>
                    <div className='flex justify-between'>
                      <Link to={'/products/' + item.handle}>
                        <div>
                          <h4 className='font-bold'>{item.name}</h4>
                          <p className='text-[0.85rem]'>{item.colorName}</p>
                          <p className='text-[0.85rem]'>size: {item.size}</p>
                        </div>
                      </Link>

                      <button
                        className='self-start'
                        onClick={() => handleDeleteCartItem(item)}
                      >
                        <TfiClose />
                      </button>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex gap-x-4 border-2 border-gray-light p-0.5'>
                        <button
                          className='flex h-5 w-5 items-center justify-center text-lg text-gray-light'
                          onClick={() => handleRemoveCartItem(item)}
                        >
                          −
                        </button>
                        <span className='pointer-events-none text-sm text-gray'>
                          {item.amount}
                        </span>
                        <button
                          className='flex h-5 w-5 items-center justify-center text-lg text-gray-light'
                          onClick={() => handleAddCartItem(item)}
                        >
                          +
                        </button>
                      </div>

                      <div>
                        {item.salePrice && (
                          <span className='mr-1 text-red'>
                            ${item.salePrice}
                          </span>
                        )}
                        <span
                          className={cn({
                            'text-gray-medium line-through': item.salePrice,
                          })}
                        >
                          ${item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className='mb-6 mt-3 flex items-center justify-between'>
              <span>subtotal</span>
              <span>${cart.totalPrice}</span>
            </div>

            <LinkCustom
              to='/checkouts'
              className='block w-full text-sm'
              onClick={handleCartClose}
            >
              proceed to checkout
            </LinkCustom>
          </div>
        )}
      </Drawer>
    </>
  )
}
