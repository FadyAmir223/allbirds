import { BsMinecartLoaded } from 'react-icons/bs';

type CartProps = {
  handleNavClose: () => void;
};

const Cart = ({ handleNavClose }: CartProps) => {
  const handleCartToggle = () => {
    handleNavClose();
  };

  return (
    <button className="header-icons" onClick={handleCartToggle}>
      <BsMinecartLoaded size={22} />
    </button>
  );
};

export default Cart;
