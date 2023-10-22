import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import { BsMinecartLoaded } from 'react-icons/bs';
import { BiSearch, BiHelpCircle } from 'react-icons/bi';
import { HiOutlineUser } from 'react-icons/hi';
import Cart from '../components/cart.component';

const ads = [
  'Free shipping on orders over $75. Free returns.',
  'The Tree Flyer, now $89. <Shop Men> | <Shop Women>',
  'Need A Gift For Dad? Send Him A Digital Gift Card > Save The Day (Whew.) | Shop Now',
];

const collections = ['men', 'women', 'sale'];

const Header = () => {
  const [ad, setAd] = useState(0);
  const [sidebar, setSidebar] = useState(false);

  // redux
  const [cart, setCart] = useState(0);

  const handleAdChange = () => {
    setAd((prevAd) => (prevAd + 1) % ads.length);
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <header>
        <div className="h-10 bg-main contain p-3">
          <div className="relative text-white">
            <p className="text-[11.5px] text-center tracking-wider">
              {ads[ad]}
            </p>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={handleAdChange}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        <div className="flex items-center contain text-black py-[9px] h-[60px]">
          <div className="w-4/5 space-x-9">
            {collections.map((collection) => (
              <button
                className={`uppercase text-sm font-bold ${
                  collection === 'sale' ? 'text-red' : ''
                }`}
              >
                {collection}
              </button>
            ))}
          </div>
          <div className="w-full">
            <img
              src="/images/main-page/logo.png"
              alt="logo"
              className="h-9 m-auto"
            />
          </div>
          <div className="w-4/5 flex justify-between">
            <Link to="pages/stores" className="uppercase text-sm font-bold">
              stores
            </Link>
            <div className="flex space-x-5">
              <Link to="pages/search">
                <BiSearch size={22} />
              </Link>
              <Link to="account">
                <HiOutlineUser size={22} />
              </Link>
              <Link to="pages/help">
                <BiHelpCircle size={22} />
              </Link>
              <button className="relative" onClick={handleSidebar}>
                <BsMinecartLoaded size={22} />
                <span className="absolute text-[9.3px] top-[3px] -translate-x-1/2">
                  {cart}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Cart sidebar={sidebar} handleSidebar={handleSidebar} />
    </>
  );
};

export default Header;
