import { TfiClose } from 'react-icons/tfi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Overlay from '@/components/overlay.component';
import Modal from '@/components/modal.component';
import CartIcon from '@/assets/svg/cart.svg?react';
import { cn } from '@/utils/cn';
import { toggle } from '../store/cart.slice';
import LinkCustom from '@/components/link-custom.component';

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

      <Modal>
        <Overlay
          isOpen={cart.isOpen}
          className='top-0 left-0 z-40 opacity-[85%]'
          onClick={() => dispatch(toggle())}
        />

        <div
          className={cn(
            'absolute h-screen w-full md:w-[395px] bg-white top-0 right-0 z-50 duration-[250ms] p-4',
            cart.isOpen ? 'right-0' : '-right-[395px]',
          )}
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
                      className='block w-full bg-white hover:bg-bule-dark hover:text-white duration-150'
                    >
                      {shopItem.title}
                    </LinkCustom>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className=''></div>
          )}
        </div>
      </Modal>
    </>
  );
};
