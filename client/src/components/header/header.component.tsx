import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiHelpCircle, BiSearch } from 'react-icons/bi'
import { HiOutlineUser } from 'react-icons/hi'

import Cart from '@/components/cart.component'
import ShopAd from '@/components/header/shopAd.component'
import headerNavData from '@/data/header-nav.data.json'

const emptyCategory = {
  categoryName: '',
  sections: [{ title: { text: '', url: '' }, routes: [{ text: '', url: '' }] }],
  featured: [{ text: '', imageUrl: '', url: '' }],
}

const Header = () => {
  const [nav, setNav] = useState({
    isOpen: false,
    category: emptyCategory,
  })

  const handleNavClose = () => {
    if (nav.isOpen)
      setNav((prevNav) => ({
        ...prevNav,
        isOpen: false,
      }))
  }

  const handleNavClick = (headerCategoryText: string) => {
    setNav((prevNav) => {
      const isOpen =
        !prevNav.isOpen || headerCategoryText !== prevNav.category.categoryName

      const category = isOpen
        ? headerNavData.find(
            (headerNavItem) =>
              headerNavItem.categoryName === headerCategoryText,
          ) || emptyCategory
        : emptyCategory

      return { ...prevNav, isOpen, category }
    })
  }

  return (
    <>
      <ShopAd />
      <div className='relative'>
        <nav className='px-6 py-1 flex items-center justify-between text-gray shadow-md'>
          <ul className='flex gap-5'>
            {[
              { text: 'men', url: '' },
              { text: 'women', url: '' },
              { text: 'socks', url: '/products/socks' },
              { text: 'sale', url: '' },
            ].map((navCategory) => (
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
                    className={`header-nav ${
                      navCategory.text === 'sale' ? 'text-[#AD1F00]' : null
                    }`}
                    onClick={() => handleNavClick(navCategory.text)}
                  >
                    {navCategory.text}
                  </button>
                )}
              </li>
            ))}
          </ul>

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
              <li>
                <button
                  className='header-nav'
                  onClick={() => handleNavClick('sustainability')}
                >
                  sustainability
                </button>
              </li>
              <li>
                <Link
                  to='/pages/return'
                  className='header-nav'
                  onClick={handleNavClose}
                >
                  return
                </Link>
              </li>
            </ul>

            <ul className='flex items-center'>
              {[
                { url: 'pages/search', icon: <BiSearch /> },
                { url: 'account', icon: <HiOutlineUser /> },
                { url: 'pages/help', icon: <BiHelpCircle /> },
              ].map((iconElement) => (
                <li>
                  <Link
                    to={iconElement.url}
                    className='header-icons scale-125'
                    onClick={handleNavClose}
                  >
                    {iconElement.icon}
                  </Link>
                </li>
              ))}

              <li>
                <Cart handleNavClose={handleNavClose} />
              </li>
            </ul>
          </div>
        </nav>

        <div
          className={`absolute z-50 overflow-hidden w-full ${
            nav.isOpen ? 'h-96 duration-300' : 'h-0'
          }`}
        >
          <div className='pt-[78px] pb-6 px-[103px] bg-white grid grid-cols-5 gap-x-6'>
            {nav.category.categoryName === 'sustainability' && <div />}

            {nav.category.sections.map((section) => (
              <div key={section.title.text}>
                {section.title.url ? (
                  <Link
                    to={section.title.url}
                    className='uppercase hover:underline mb-[22px] block leading-[1.5] text-[12.7px] font-bold tracking-[2px]'
                    onClick={handleNavClose}
                  >
                    {section.title.text}
                  </Link>
                ) : (
                  <h3
                    className='uppercase mb-[22px] block leading-[1.5] text-[12.7px] font-bold tracking-[2px]'
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
              <h3 className='uppercase mb-[22px] leading-[1.5] text-[12.7px] font-bold tracking-[2px]'>
                featured
              </h3>
              {nav.category.featured.map((feature) => (
                <ul key={feature.text}>
                  <li className='first-of-type:mb-6 relative group'>
                    <Link to={feature.url} onClick={handleNavClose}>
                      <span className='absolute grid place-items-center w-full h-full uppercase leading-[1.5] text-[12.7px] font-bold tracking-[2px] group-hover:underline'>
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

        {nav.isOpen && (
          <button
            className='fixed w-screen h-[calc(100vh-50px)] bg-black opacity-50 animate-[fade_250ms_linear]'
            onClick={handleNavClose}
          />
        )}
      </div>
    </>
  )
}

export default Header
