import CartIcon from '@/assets/svg/cart.svg?react';

type CartProps = {
  handleNavClose: () => void;
};

const Cart = ({ handleNavClose }: CartProps) => {
  const handleCartToggle = () => {
    handleNavClose();
  };

  return (
    <button className='header-icons scale-75' onClick={handleCartToggle}>
      <CartIcon />
    </button>
  );
};

export default Cart;
