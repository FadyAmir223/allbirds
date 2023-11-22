import { TfiClose } from 'react-icons/tfi';

import Drawer from '@/components/drawer.component';
import LinkCustom from '@/components/link-custom.component';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggle } from '../store/cart.slice';
import CartIcon from '@/assets/svg/cart.svg?react';

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
    dispatch(toggle());
  };

  return (
    <>
      <button
        className='ml-3 block scale-75 relative'
        onClick={handleCartToggle}
      >
        <CartIcon />
        <span className='absolute top-0 left-[10px] font-bold text-xs'>
          {cart.amount}
        </span>
      </button>

      <Drawer
        isOpen={cart.isOpen}
        className='p-4'
        handleClose={() => dispatch(toggle())}
      >
        <div className='relative text-center border-b-4 border-b-silver pb-2'>
          <button
            className='absolute left-0 top-0 hover:rotate-90 duration-[400ms] scale-125'
            onClick={() => dispatch(toggle())}
          >
            <TfiClose />
          </button>

          <div className='scale-75 relative mb-1 inline-block'>
            <CartIcon />
            <span className='absolute top-0 left-[10px] font-bold text-xs'>
              {cart.amount}
            </span>
          </div>

          <p className='text-gray text-[10px] leading-[10px]'>
            You're<span className='font-semibold text-[9.7px]'> 75$ </span>
            away from the free shipping!
          </p>
        </div>

        {cart.amount === 0 ? (
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
                    onClick={() => dispatch(toggle())}
                  >
                    {shopItem.title}
                  </LinkCustom>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div></div>
        )}
      </Drawer>
    </>
  );
};
