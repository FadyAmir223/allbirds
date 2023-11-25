import { TfiClose } from 'react-icons/tfi';
import { Link } from 'react-router-dom';

import Drawer from '@/components/drawer.component';
import LinkCustom from '@/components/link-custom.component';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCartItem,
  deleteCartItem,
  removeCartItem,
  toggleCart,
} from '../store/cart.slice';
import { cn } from '@/utils/cn.util';
import CartIcon from '@/assets/svg/cart.svg?react';
import type { CartProduct } from '../types/cart.type';

type CartProps = {
  handleNavClose: () => void;
};

const shopItems = [
  { title: "shop men's", url: '/collections/mens' },
  { title: "shop women's", url: '/collections/womens' },
  { title: 'shop socks', url: '/collections/socks' },
  { title: "shop men's sale", url: '/collections/sale-mens-shoes' },
  { title: "shop women's sale", url: '/collections/sale-womens-shoes' },
];

export const Cart = ({ handleNavClose }: CartProps) => {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const handleCartToggle = () => {
    handleNavClose();
    dispatch(toggleCart());
  };

  const handleCartClose = () => {
    dispatch(toggleCart());
  };

  const handleAddCartItem = (item: CartProduct) => {
    dispatch(addCartItem(item));
  };

  const handleRemoveCartItem = (item: CartProduct) => {
    const { handle, editionId, size } = item;
    dispatch(removeCartItem({ handle, editionId, size }));
  };

  const handleDeleteCartItem = (item: CartProduct) => {
    const { handle, editionId, size } = item;
    dispatch(deleteCartItem({ handle, editionId, size }));
  };

  return (
    <>
      <button
        className='ml-3 block scale-75 relative'
        onClick={handleCartToggle}
      >
        <CartIcon />
        <span className='absolute top-0 left-[10px] font-bold text-xs'>
          {cart.totalAmount}
        </span>
      </button>

      <Drawer
        isOpen={cart.isOpen}
        className='p-4'
        handleClose={handleCartClose}
      >
        <div className='relative text-center border-b-4 border-b-silver pb-2'>
          <button
            className='absolute left-0 top-0 hover:rotate-90 duration-[400ms] scale-125'
            onClick={handleCartClose}
          >
            <TfiClose />
          </button>

          <div className='scale-75 relative mb-1 inline-block'>
            <CartIcon />
            <span className='absolute top-0 left-[10px] font-bold text-xs'>
              {cart.totalAmount}
            </span>
          </div>

          <p className='text-gray text-[10px] leading-[10px]'>
            You're<span className='font-semibold text-[9.7px]'> 75$ </span>
            away from the free shipping!
          </p>
        </div>

        {cart.totalAmount === 0 ? (
          <div className='text-center'>
            <p className='capitalize mt-4 mb-4 font-medium text-sm'>
              your cart is empty
            </p>
            <ul className='flex flex-col gap-2 w-3/5 items-center mx-auto'>
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
          <div className=''>
            <ul className=''>
              {cart.items.map((item) => (
                <li
                  className='py-5 border-b last-of-type:border-b-2 border-b-gray flex items-center gap-x-5'
                  key={item.editionId + item.size}
                >
                  <Link to={'/products/' + item.handle}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-[6.25rem] bg-silver object-fit aspect-square'
                    />
                  </Link>
                  <div className='flex flex-col justify-between flex-grow text-gray gap-y-3'>
                    <div className='flex justify-between'>
                      <Link to={'/products/' + item.handle}>
                        <div className=''>
                          <h4 className='font-bold'>{item.name}</h4>
                          <p className='text-[0.85rem]'>{item.colorName}</p>
                          <p className=' text-[0.85rem]'>size: {item.size}</p>
                        </div>
                      </Link>

                      <button onClick={() => handleDeleteCartItem(item)}>
                        <TfiClose />
                      </button>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='border-2 border-gray-light p-0.5 flex gap-x-4'>
                        <button
                          className='text-gray-light text-lg w-5 h-5 flex justify-center items-center'
                          onClick={() => handleRemoveCartItem(item)}
                        >
                          −
                        </button>
                        <span className='text-sm text-gray pointer-events-none'>
                          {item.amount}
                        </span>
                        <button
                          className='text-gray-light text-lg w-5 h-5 flex justify-center items-center'
                          onClick={() => handleAddCartItem(item)}
                        >
                          +
                        </button>
                      </div>

                      <div className=''>
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

            <div className='flex justify-between items-center mt-3 mb-6'>
              <span className=''>subtotal</span>
              <span className=''>${cart.totalPrice}</span>
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
  );
};
