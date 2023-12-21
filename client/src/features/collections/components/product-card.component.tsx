import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import ColorButton from '@/components/product/color-button.component'
import SizeButton from '@/components/product/size-button.component'
import { cn } from '@/utils/cn.util'
import screenSize from '@/data/screen-size.json'
import { type CollectionProduct, type SelectedFilters } from '..'
import { addCartItem, toggleCart } from '@/features/cart'
import { useAppDispatch } from '@/store/hooks'

type ProductCardProps = {
  product: CollectionProduct
  hasGender: boolean
  selectedFilters: SelectedFilters
}

const isSmall = innerWidth > screenSize.sm && innerWidth < screenSize.md
const isMedium = innerWidth > screenSize.md

// 24 sm:20 md:8
const gap = isSmall ? 20 : isMedium ? 8 : 4
const itemsPerSlide = isMedium ? 6 : 4

const style = {
  width: `calc((100% - ${(itemsPerSlide - 1) * gap}px) / ${itemsPerSlide})`,
}

// workaround until generic equaion is found
const getMaxSections = (productsLength: number) => {
  let sections = 0
  if (productsLength <= itemsPerSlide) return sections

  let remain = productsLength
  const maxItems = itemsPerSlide - 1

  for (let i = 0; ; i++) {
    if (i === 0) remain -= maxItems
    else if (remain <= maxItems) break
    else remain -= itemsPerSlide - 2
    sections += 1
  }

  return sections
}

const ProductCard = ({
  product,
  hasGender,
  selectedFilters,
}: ProductCardProps) => {
  const editions = product.editions
    .flatMap((edition) => edition.products)
    .filter((product) => {
      const bySize =
        !product.sizesSoldOut.some(
          (sizeSoldOut) => selectedFilters.sizes?.includes(sizeSoldOut),
        ) ?? true

      const byHue =
        selectedFilters.hues?.some((hue) => product.hues.includes(hue)) ?? true

      return bySize && byHue
    })

  const firstID = editions?.[0]?.id
  const initNav = { id: firstID, index: 0, section: 0 }

  const [nav, setNav] = useState(initNav)
  const [isQuickAddOpen, setQuickAddOpen] = useState(false)
  const divEl = useRef<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch()

  if (!hasGender)
    product.sizes = product.sizes.map((size) => size.split('.')[0])

  const MaxSections = getMaxSections(editions.length - 1)

  const isFiltered = !editions.find((edition) => edition.id === nav.id)

  const section = {
    first: nav.section === 0,
    last: nav.section === MaxSections,
  }

  const imagesPerSlide =
    MaxSections === 0
      ? itemsPerSlide
      : section.first || section.last
      ? itemsPerSlide - 1
      : itemsPerSlide - 2

  useEffect(() => {
    if (isFiltered) setNav(initNav)
    /*
      if (!isFiltered): calculate new { section, index }
      if products after the selected are added/removed
      but the computation is complex and not worth it
    */
  }, [editions.length]) // eslint-disable-line

  if (editions.length === 0) return <></>

  const editionIdx = isFiltered ? 0 : nav.index

  const currProduct = editions[editionIdx]

  const slice = {
    min: nav.section * imagesPerSlide,
    max: (nav.section + 1) * imagesPerSlide,
  }

  const handleIndexChange = (index: number, id: number) =>
    setNav({
      id,
      index: index + nav.section * imagesPerSlide,
      section: nav.section,
    })

  const handleSectionChange = (direction: 1 | -1) =>
    setNav({ ...nav, index: nav.index, section: nav.section + direction })

  const handleToggleQuickAdd = () => setQuickAddOpen(!isQuickAddOpen)

  const AddCartItem = (size: string) => {
    const edition = editions[nav.index]

    const productToCart = {
      editionId: edition.id,
      size,
      handle: product.handle,
      name: product.name,
      price: product.price,
      salePrice: edition.salePrice,
      colorName: edition.colorName,
      image: edition.image,
    }

    dispatch(addCartItem(productToCart))
    dispatch(toggleCart())
  }

  return (
    <div className='bg-blue group relative h-fit bg-white text-gray'>
      <div className='absolute -left-4 -top-4 z-10 hidden h-[calc(100%+32px)] w-[calc(100%+32px)] group-hover:shadow-2xl group-hover:shadow-gray md:block' />

      <div className='relative pb-[100%]'>
        <img
          src={currProduct.image}
          alt={product.name}
          className='absolute left-0 top-0 h-full w-full bg-silver object-cover'
        />
      </div>

      <Link
        to={`/products/${product.handle}?id=${currProduct.id}`}
        className='relative z-10'
      >
        <p className='relative z-10 mt-2 px-3 text-[11px] font-[500] uppercase md:px-0'>
          {product.name}
        </p>
      </Link>

      <div className='relative z-10 mb-1 px-3 text-[11.2px] md:px-0'>
        {currProduct?.salePrice && (
          <span className='mr-1 text-red'>${currProduct.salePrice}</span>
        )}
        <span
          className={cn({
            'text-gray-medium line-through': currProduct?.salePrice,
          })}
        >
          ${product.price}
        </span>
      </div>

      <div className='flex gap-x-1 whitespace-nowrap px-3 sm:gap-x-5 md:gap-x-2 md:px-0'>
        {!section.first && (
          <button
            className='z-10 rounded-full border border-gray bg-white md:rounded-none'
            onClick={() => handleSectionChange(-1)}
            style={style}
          >
            <span className='grid h-full w-full scale-90 place-items-center sm:scale-100 md:scale-125'>
              <FaAngleLeft />
            </span>
          </button>
        )}

        {editions.slice(slice.min, slice.max).map((edition, idx) => (
          <Fragment key={edition.id}>
            <button
              className='z-10 hidden bg-silver md:block'
              onClick={() => handleIndexChange(idx, edition.id)}
              style={style}
            >
              <div className='relative pb-[100%]'>
                <img
                  src={edition.image}
                  alt=''
                  className='absolute left-0 top-0 h-full w-full object-cover'
                />
              </div>
            </button>

            <ColorButton
              hues={edition.colors}
              className='z-10 block md:hidden'
              style={style}
              onClick={() => handleIndexChange(idx, edition.id)}
            />
          </Fragment>
        ))}

        {!section.last && (
          <button
            className='z-10 rounded-full border border-gray bg-white md:rounded-none'
            onClick={() => handleSectionChange(1)}
            style={style}
          >
            <span className='grid h-full w-full scale-90 place-items-center sm:scale-100 md:scale-125'>
              <FaAngleRight />
            </span>
          </button>
        )}
      </div>

      <div className='absolute z-20 box-content hidden w-full -translate-x-4 bg-white pb-4 pl-4 pr-4 group-hover:shadow-2xl group-hover:shadow-gray md:group-hover:block'>
        <p className='mb-1 mt-2 text-[11px] font-[500] uppercase'>quick add</p>
        <div
          className={cn(
            'grid gap-[6px]',
            hasGender ? ' grid-cols-4 md:grid-cols-6' : 'grid-cols-4',
          )}
        >
          {product.sizes.map((size) => (
            <SizeButton
              key={size}
              isSoldOut={currProduct.sizesSoldOut.includes(size)}
              onClick={() => AddCartItem(size)}
            >
              {size}
            </SizeButton>
          ))}
        </div>
      </div>

      <div className='mb-1 mt-3 border-t border-t-gray px-3 pb-1 pt-2 md:hidden md:px-0'>
        <div>
          <div className='flex w-full items-center justify-between'>
            <p className='text-[10px] font-[500] uppercase'>quick add</p>
            <button
              className='relative h-[14px] w-[14px]'
              onClick={handleToggleQuickAdd}
            >
              <span
                className={cn(
                  'absolute left-1/2 top-0 h-full w-[1.9px] -translate-x-1/2 bg-black duration-[250ms]',
                  { 'rotate-90': isQuickAddOpen },
                )}
              />
              <span className='absolute left-0 top-1/2 h-[1.7px] w-full -translate-y-1/2 bg-black' />
            </button>
          </div>

          <div
            className='overflow-hidden transition-[height] duration-[250ms]'
            ref={divEl}
            style={{
              height: isQuickAddOpen ? divEl.current?.scrollHeight : 0 + 'px',
            }}
          >
            <div
              className={cn(
                'mt-1 grid w-full gap-[6px]',
                hasGender
                  ? 'grid-cols-5 sm:grid-cols-7 md:sm:grid-cols-9'
                  : 'grid-cols-4',
              )}
            >
              {product.sizes.map((size) => (
                <SizeButton
                  key={size}
                  isSoldOut={currProduct.sizesSoldOut.includes(size)}
                  onClick={() => AddCartItem(size)}
                  className={cn(
                    hasGender ? 'text-[9.8px]' : 'text-sm uppercase',
                  )}
                >
                  {size}
                </SizeButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
