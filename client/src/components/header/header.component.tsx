import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHelpCircle, BiSearch } from 'react-icons/bi';
import { HiOutlineUser } from 'react-icons/hi';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import ShopAd from '@/components/header/shopAd.component';
import SearchField from '@/components/header/search-field.component';
import { Cart } from '@/features/cart';
import Overlay from '@/components/overlay.component';
import headerNavData from '@/data/header-nav.data.json';
import { cn } from '@/utils/cn';

const headerLeftItems = [
  { text: 'men', url: '' },
  { text: 'women', url: '' },
  { text: 'kids', url: '' },
  { text: 'socks', url: '/products/socks' },
  { text: 'sale', url: '' },
];

const headerRightItems = [
  { text: 'sustainability', url: '' },
  { text: 'return', url: '/pages/return' },
];

const headerIconItems = [
  { text: '', url: 'pages/search', hiddenSm: true, icon: <BiSearch /> },
  { text: 'account', url: 'account', hiddenSm: false, icon: <HiOutlineUser /> },
  { text: 'help', url: 'pages/help', hiddenSm: false, icon: <BiHelpCircle /> },
];

const headerItemsMd = [
  ...headerLeftItems,
  ...headerRightItems,
  ...headerIconItems,
].filter((headerItem) => headerItem.text !== '');

const emptyCategory = {
  categoryName: '',
  sections: [{ title: { text: '', url: '' }, routes: [{ text: '', url: '' }] }],
  featured: [{ text: '', url: '', imageUrl: '', imageUrlMobile: '' }],
};

type Nav = {
  isOpen: boolean;
  category: typeof emptyCategory;
  subCategoryMobile: string;
  tabMobile: 'left' | 'middle' | 'right';
};

const Header = () => {
  const [isAdHidden, setAdHidden] = useState(false);
  const [nav, setNav] = useState<Nav>({
    isOpen: false,
    category: emptyCategory,
    subCategoryMobile: '',
    tabMobile: 'left',
  });

  const handleAdHide = () => {
    setAdHidden(scrollY > 100);
  };

  useEffect(() => {
    addEventListener('scroll', handleAdHide);
    return () => removeEventListener('scroll', handleAdHide);
  }, []);

  useEffect(() => {
    if (!nav.isOpen) {
      const timeout = setTimeout(() => {
        setNav((prevNav) => ({ ...prevNav, tabMobile: 'left' }));
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [nav.isOpen]);

  const handleNavClose = () => {
    if (nav.isOpen)
      setNav((prevNav) => ({
        ...prevNav,
        isOpen: false,
        category: emptyCategory,
      }));
  };

  const handleNavClickDesktop = (headerCategoryText: string) => {
    setNav((prevNav) => {
      const isOpen =
        !prevNav.isOpen || headerCategoryText !== prevNav.category.categoryName;

      const category = isOpen
        ? headerNavData.find(
            (headerNavItem) =>
              headerNavItem.categoryName === headerCategoryText,
          ) || emptyCategory
        : emptyCategory;

      return { ...prevNav, isOpen, category };
    });
  };

  const handleToggleNavMobile = () => {
    setNav((prevNav) => ({ ...prevNav, isOpen: !prevNav.isOpen }));
  };

  const handleNavClickMobile = (headerCategoryText: string) => {
    setNav((prevNav) => {
      const category =
        headerNavData.find(
          (headerNavItem) => headerNavItem.categoryName === headerCategoryText,
        ) || emptyCategory;

      return { ...prevNav, category, tabMobile: 'middle' };
    });
  };

  const handleNavBackMobile = () => {
    setNav((prevNav) => ({ ...prevNav, tabMobile: 'left' }));
  };

  const handleSubCategoryMobile = (subCategory: string) => {
    setNav((prevNav) => ({
      ...prevNav,
      subCategoryMobile: subCategory,
      tabMobile: 'right',
    }));
  };

  const handleSubCategoryBackMobile = () => {
    setNav((prevNav) => ({ ...prevNav, tabMobile: 'middle' }));
  };

  return (
    <header
      className={cn(
        'fixed z-50 bg-white w-full duration-[400ms] transition-transform',
        {
          '-translate-y-8': isAdHidden,
        },
      )}
    >
      <ShopAd onClick={handleNavClose} />
      <div className=''>
        <div className='px-[15px] lg:px-6 py-[9px] md:py-[12px] lg:py-[4px] shadow-md'>
          <nav className='flex items-center justify-between text-gray'>
            <ul className='hidden lg:flex gap-5'>
              {headerLeftItems.map((navCategory) => (
                <li
                  key={navCategory.text}
                  className={
                    nav.category.categoryName === navCategory.text
                      ? 'underline'
                      : ''
                  }
                >
                  {navCategory.url ? (
                    <Link
                      to='/products/socks'
                      className='header-nav'
                      onClick={handleNavClose}
                    >
                      socks
                    </Link>
                  ) : (
                    <button
                      className={cn('header-nav', {
                        'text-red': navCategory.text === 'sale',
                      })}
                      onClick={() => handleNavClickDesktop(navCategory.text)}
                    >
                      {navCategory.text}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <button
              className='flex lg:hidden scale-125'
              onClick={handleToggleNavMobile}
            >
              <div className='relative w-5 h-[15px] group scale-[80%]'>
                <span
                  className={cn(
                    'absolute duration-100 ease-linear bg-black w-full h-[1.5px] left-0',
                    nav.isOpen ? 'top-[6px] rotate-45' : ' top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute duration-100 ease-linear bg-black w-full h-[2px] left-0 top-[6px]',
                    { hidden: nav.isOpen },
                  )}
                />
                <span
                  className={cn(
                    'absolute duration-100 ease-linear bg-black w-full h-[1.5px] left-0',
                    nav.isOpen ? 'top-[6px] -rotate-45' : 'top-[13px]',
                  )}
                />
              </div>
            </button>

            <div className='w-[80px] box-border'>
              <Link to='/' onClick={handleNavClose}>
                <img
                  src='/images/main-page/logo.webp'
                  alt='logo'
                  className='mx-auto'
                />
              </Link>
            </div>

            <div className='flex'>
              <ul className='flex gap-[18px]'>
                {headerRightItems.map((navCategory) => (
                  <li className='hidden lg:block' key={navCategory.text}>
                    {navCategory.url ? (
                      <Link
                        to='/pages/return'
                        className='header-nav'
                        onClick={handleNavClose}
                      >
                        {navCategory.text}
                      </Link>
                    ) : (
                      <button
                        className='header-nav'
                        onClick={() => handleNavClickDesktop(navCategory.text)}
                      >
                        {navCategory.text}
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <ul className='flex items-center'>
                {headerIconItems.map((iconItem) => (
                  <li
                    className={cn({
                      'hidden lg:block': iconItem.text,
                      'hidden md:block': iconItem.hiddenSm,
                    })}
                    key={iconItem.text}
                  >
                    <Link
                      to={iconItem.url}
                      className='ml-3 block scale-125'
                      onClick={handleNavClose}
                    >
                      {iconItem.icon}
                    </Link>
                  </li>
                ))}

                <li>
                  <Cart handleNavClose={handleNavClose} />
                </li>
              </ul>
            </div>
          </nav>
          <SearchField />
        </div>

        <div
          className={cn(
            'absolute z-50 overflow-hidden w-full hidden lg:block',
            nav.isOpen ? 'h-[355px] duration-300 transition-[height]' : 'h-0',
          )}
        >
          <div className='pt-[47px] pb-6 px-[103px] bg-white hidden lg:grid grid-cols-5 gap-x-6'>
            {nav.category.categoryName === 'sustainability' && <div />}

            {nav.category.sections.map((section) => (
              <div key={section.title.text}>
                {section.title.url ? (
                  <Link
                    to={section.title.url}
                    className='allbirds-font mb-[22px] block hover:underline'
                    onClick={handleNavClose}
                  >
                    {section.title.text}
                  </Link>
                ) : (
                  <h3
                    className='allbirds-font mb-[22px] block'
                    onClick={handleNavClose}
                  >
                    {section.title.text}
                  </h3>
                )}
                <ul>
                  {section.routes.map((route) => (
                    <li
                      key={route.text}
                      className='py-[5px] text-[11px] tracking-[0.4px] leading-[1.43]'
                    >
                      <Link
                        to={route.url}
                        className='capitalize hover:underline'
                        onClick={handleNavClose}
                      >
                        {route.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className='col-span-2'>
              <h3 className='allbirds-font mb-[22px]'>featured</h3>
              {nav.category.featured.map((feature) => (
                <ul key={feature.text}>
                  <li className='first-of-type:mb-6 relative group'>
                    <Link to={feature.url} onClick={handleNavClose}>
                      <span className='allbirds-font absolute grid place-items-center w-full h-full group-hover:underline text-white'>
                        {feature.text}
                      </span>
                      <img src={feature.imageUrl} alt='' />
                    </Link>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>

        <Overlay
          isOpen={nav.isOpen}
          className='hidden lg:block relative h-[calc(100vh-50px)]'
          onClick={handleNavClose}
        />

        <div
          className={cn(
            'absolute w-screen bg-white overflow-x-hidden lg:hidden duration-[250ms]',
            nav.isOpen
              ? isAdHidden
                ? 'h-[calc(100vh-45px)]'
                : 'h-[calc(100vh-45px-32px)]'
              : 'h-0',
          )}
        >
          <ul
            className={cn(
              'duration-[250ms] absolute w-full pb-16',
              nav.tabMobile === 'middle' || nav.tabMobile === 'right'
                ? '-translate-x-full'
                : 'translate-x-0',
            )}
          >
            {headerItemsMd.map((headerItem) => (
              <li
                className='border-b-[1px] border-b-gray-light'
                key={headerItem.text}
              >
                {headerItem.url ? (
                  <Link
                    to={headerItem.url}
                    className='dropdown-mobile block'
                    onClick={handleNavClose}
                  >
                    {headerItem.text}
                  </Link>
                ) : (
                  <button
                    className='allbirds-font text-[9px] flex justify-between items-center w-full px-7 py-4'
                    onClick={() => handleNavClickMobile(headerItem.text)}
                  >
                    <span
                      className={headerItem.text === 'sale' ? 'text-red' : ''}
                    >
                      {headerItem.text}
                    </span>
                    <span className='scale-[140%]'>
                      <FaAngleRight />
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>
          <ul
            className={cn(
              'duration-[250ms] absolute w-full pb-16',
              nav.tabMobile === 'right'
                ? '-translate-x-full'
                : nav.tabMobile === 'middle'
                ? 'translate-x-0'
                : 'translate-x-full',
            )}
          >
            <li className='border-b-[1px] border-b-gray-light'>
              <button
                className='dropdown-mobile bg-silver flex justify-center items-center w-full border-b-[1px] border-b-gray-light'
                onClick={handleNavBackMobile}
              >
                <span className='absolute left-7 scale-[150%]'>
                  <FaAngleLeft />
                </span>
                {nav.category.categoryName}
              </button>
            </li>

            {nav.category.sections.map((section) => (
              <li
                key={section.title.text}
                className='border-b-[1px] border-b-gray-light'
              >
                <button
                  className='dropdown-mobile w-full flex justify-between items-center'
                  onClick={() => handleSubCategoryMobile(section.title.text)}
                >
                  {section.title.text}
                  <span className='scale-[140%]'>
                    <FaAngleRight />
                  </span>
                </button>
              </li>
            ))}

            <li>
              <span className='dropdown-mobile block'>featured</span>
              <div className='flex gap-[2.4px]'>
                {nav.category.featured.map((feature) => (
                  <Link
                    key={feature.url}
                    to={feature.url}
                    onClick={handleNavClose}
                  >
                    <img src={feature.imageUrlMobile} alt='' />
                    <p className='text-center capitalize font-semibold text-[11.5px] mt-1 text-gray'>
                      {feature.text}
                    </p>
                  </Link>
                ))}
              </div>
            </li>
          </ul>
          <ul
            className={cn(
              'duration-[250ms] absolute w-full pb-16',
              nav.tabMobile === 'right' ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            <button
              className='dropdown-mobile bg-silver flex justify-center items-center w-full border-b-[1px] border-b-gray-light'
              onClick={handleSubCategoryBackMobile}
            >
              <span className='absolute left-7 scale-[150%]'>
                <FaAngleLeft />
              </span>
              {nav.category.categoryName}
            </button>

            {nav.category.sections
              .filter((section) => section.title.text === nav.subCategoryMobile)
              .map((subCategory) =>
                subCategory.routes.map((route) => (
                  <li
                    className='border-b-[1px] border-b-gray-light'
                    key={route.text}
                  >
                    <Link
                      to={route.url}
                      className='text-[11px] px-7 py-4 block capitalize'
                      onClick={handleNavClose}
                    >
                      {route.text}
                    </Link>
                  </li>
                )),
              )}
          </ul>
          O
        </div>
      </div>
    </header>
  );
};

export default Header;
