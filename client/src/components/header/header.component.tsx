import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiHelpCircle, BiSearch } from 'react-icons/bi'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { HiOutlineUser } from 'react-icons/hi'
import SearchField from '@/components/header/search-field.component'
import ShopAd from '@/components/header/shopAd.component'
import Overlay from '@/components/overlay.component'
import { cn } from '@/utils/cn.util'
import headerNavData from '@/data/header.json'
import { Cart } from '@/features/cart'

const headerLeftItems = [
  { text: 'men', url: '' },
  { text: 'women', url: '' },
  { text: 'kids', url: '' },
  { text: 'socks', url: '/collections/socks' },
  { text: 'sale', url: '' },
]

const headerRightItems = [
  { text: 'sustainability', url: '' },
  { text: 'return', url: '/pages/return' },
]

const headerIconItems = [
  { text: '', url: 'pages/search', hiddenSm: true, icon: <BiSearch /> },
  { text: 'account', url: 'account', hiddenSm: false, icon: <HiOutlineUser /> },
  { text: 'help', url: 'pages/help', hiddenSm: false, icon: <BiHelpCircle /> },
]

const headerItemsMd = [
  ...headerLeftItems,
  ...headerRightItems,
  ...headerIconItems,
].filter((headerItem) => headerItem.text !== '')

const emptyCategory = {
  categoryName: '',
  sections: [{ title: { text: '', url: '' }, routes: [{ text: '', url: '' }] }],
  featured: [{ text: '', url: '', imageUrl: '', imageUrlMobile: '' }],
}

type Nav = {
  isOpen: boolean
  category: typeof emptyCategory
  subCategoryMobile: string
  tabMobile: 'left' | 'middle' | 'right'
}

const Header = () => {
  const [isAdHidden, setAdHidden] = useState(false)
  const [nav, setNav] = useState<Nav>({
    isOpen: false,
    category: headerNavData[0],
    subCategoryMobile: '',
    tabMobile: 'left',
  })

  const divEl = useRef<HTMLDivElement | null>(null)

  const handleAdHide = () => setAdHidden(scrollY > 100)

  useEffect(() => {
    addEventListener('scroll', handleAdHide)
    return () => removeEventListener('scroll', handleAdHide)
  }, [])

  useEffect(() => {
    if (!nav.isOpen) {
      const timeout = setTimeout(() => {
        setNav((prevNav) => ({ ...prevNav, tabMobile: 'left' }))
      }, 250)

      return () => clearTimeout(timeout)
    }
  }, [nav.isOpen])

  const handleNavClose = () => {
    if (nav.isOpen)
      setNav((prevNav) => ({
        ...prevNav,
        isOpen: false,
      }))
  }

  const handleNavClickDesktop = (headerCategoryText: string) =>
    setNav((prevNav) => {
      const isOpen =
        !prevNav.isOpen || headerCategoryText !== prevNav.category.categoryName

      const category = isOpen
        ? headerNavData.find(
            (headerNavItem) =>
              headerNavItem.categoryName === headerCategoryText,
          ) || emptyCategory
        : prevNav.category

      return { ...prevNav, isOpen, category }
    })

  const handleToggleNavMobile = () =>
    setNav((prevNav) => ({ ...prevNav, isOpen: !prevNav.isOpen }))

  const handleNavClickMobile = (headerCategoryText: string) =>
    setNav((prevNav) => {
      const category =
        headerNavData.find(
          (headerNavItem) => headerNavItem.categoryName === headerCategoryText,
        ) || emptyCategory

      return { ...prevNav, category, tabMobile: 'middle' }
    })

  const handleNavBackMobile = () =>
    setNav((prevNav) => ({ ...prevNav, tabMobile: 'left' }))

  const handleSubCategoryMobile = (subCategory: string) =>
    setNav((prevNav) => ({
      ...prevNav,
      subCategoryMobile: subCategory,
      tabMobile: 'right',
    }))

  const handleSubCategoryBackMobile = () =>
    setNav((prevNav) => ({ ...prevNav, tabMobile: 'middle' }))

  return (
    <>
      <header
        className={cn(
          'fixed z-40 w-full bg-white transition-transform duration-[400ms]',
          {
            '-translate-y-8': isAdHidden,
          },
        )}
      >
        <ShopAd onClick={handleNavClose} />
        <div>
          <div className='px-[15px] py-[9px] shadow-md md:py-[12px] lg:px-6 lg:py-[4px]'>
            <nav className='flex items-center justify-between text-gray'>
              <ul className='hidden gap-5 lg:flex'>
                {headerLeftItems.map((navCategory) => (
                  <li
                    key={navCategory.text}
                    className={cn({
                      underline:
                        nav.isOpen &&
                        nav.category.categoryName === navCategory.text,
                    })}
                  >
                    {navCategory.url ? (
                      <Link
                        to={navCategory.url}
                        className='header-nav'
                        onClick={handleNavClose}
                      >
                        {navCategory.text}
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
                className='flex scale-125 lg:hidden'
                onClick={handleToggleNavMobile}
              >
                <div className='group relative h-[15px] w-5 scale-[80%]'>
                  <span
                    className={cn(
                      'absolute left-0 h-[1.5px] w-full bg-black duration-100 ease-linear',
                      nav.isOpen ? 'top-[6px] rotate-45' : ' top-0',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 top-[6px] h-[2px] w-full bg-black duration-100 ease-linear',
                      { hidden: nav.isOpen },
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 h-[1.5px] w-full bg-black duration-100 ease-linear',
                      nav.isOpen ? 'top-[6px] -rotate-45' : 'top-[13px]',
                    )}
                  />
                </div>
              </button>

              <div className='box-border w-[80px]'>
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
                          onClick={() =>
                            handleNavClickDesktop(navCategory.text)
                          }
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
            <SearchField isOpen={nav.isOpen} />
          </div>

          <div
            className={cn(
              'absolute z-50 hidden w-full overflow-hidden transition-[height] duration-300 lg:block',
            )}
            ref={divEl}
            style={{
              height: nav.isOpen ? divEl.current?.scrollHeight : 0 + 'px',
            }}
          >
            <div className='hidden grid-cols-5 gap-x-6 bg-white px-[103px] pb-6 pt-[47px] lg:grid'>
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
                        className='py-[5px] text-[11px] leading-[1.43] tracking-[0.4px]'
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
                    <li className='group relative first-of-type:mb-6'>
                      <Link to={feature.url} onClick={handleNavClose}>
                        <span className='allbirds-font absolute grid h-full w-full place-items-center text-white group-hover:underline'>
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
            className='relative hidden h-[calc(100vh-50px)] lg:block'
            onClick={handleNavClose}
          />

          <div
            className={cn(
              'absolute w-screen overflow-x-hidden bg-white duration-[250ms] lg:hidden',
              nav.isOpen
                ? isAdHidden
                  ? 'h-[calc(100vh-45px)]'
                  : 'h-[calc(100vh-45px-32px)]'
                : 'h-0',
            )}
          >
            <ul
              className={cn(
                'absolute w-full pb-16 duration-[250ms]',
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
                      className='allbirds-font flex w-full items-center justify-between px-7 py-4 text-[9px]'
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
                'absolute w-full pb-16 duration-[250ms]',
                nav.tabMobile === 'right'
                  ? '-translate-x-full'
                  : nav.tabMobile === 'middle'
                  ? 'translate-x-0'
                  : 'translate-x-full',
              )}
            >
              <li className='border-b-[1px] border-b-gray-light'>
                <button
                  className='dropdown-mobile flex w-full items-center justify-center border-b-[1px] border-b-gray-light bg-silver'
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
                    className='dropdown-mobile flex w-full items-center justify-between'
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
                      <p className='mt-1 text-center text-[11.5px] font-[500] capitalize text-gray'>
                        {feature.text}
                      </p>
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
            <ul
              className={cn(
                'absolute w-full pb-16 duration-[250ms]',
                nav.tabMobile === 'right'
                  ? 'translate-x-0'
                  : 'translate-x-full',
              )}
            >
              <button
                className='dropdown-mobile flex w-full items-center justify-center border-b-[1px] border-b-gray-light bg-silver'
                onClick={handleSubCategoryBackMobile}
              >
                <span className='absolute left-7 scale-[150%]'>
                  <FaAngleLeft />
                </span>
                {nav.category.categoryName}
              </button>

              {nav.category.sections
                .filter(
                  (section) => section.title.text === nav.subCategoryMobile,
                )
                .map((subCategory) =>
                  subCategory.routes.map((route) => (
                    <li
                      className='border-b-[1px] border-b-gray-light'
                      key={route.text}
                    >
                      <Link
                        to={route.url}
                        className='block px-7 py-4 text-[11px] capitalize'
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
      <div className='pb-[calc(32px+82px)] md:pb-[calc(32px+50px)]' />
    </>
  )
}

export default Header
