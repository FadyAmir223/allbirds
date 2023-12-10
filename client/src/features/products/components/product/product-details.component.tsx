import { ReactNode, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FaChevronDown } from 'react-icons/fa'
import Markdown from 'react-markdown'
import AddToCartModal from './add-to-cart-modal.component'
import GetNotifiedModal from './get-notified-modal.component'
import ProductImageSlider from './product-image-slider.component'
import ProductMainInfo from './product-main-info.component'
import SizeChartModal from './size-shart-modal.component'
import LinkCustom from '@/components/link-custom.component'
import MarkdownLink from '@/components/markdown-link.component'
import ColorButton from '@/components/product/color-button.component'
import SizeButton from '@/components/product/size-button.component'
import { productQuery } from '../../services/product.query'
import { cn } from '@/utils/cn.util'
import type { ProductDetailed, ReviewsHeadline } from '../..'
import type { PureCartProduct } from '@/features/cart'
import { addCartItem } from '@/features/cart'
import { SlideCard } from '@/features/misc'
import { useAppDispatch } from '@/store/hooks'

type ProductDetailsProps = {
  initProduct: ProductDetailed
  reviews: ReviewsHeadline
  children: ReactNode
}

const ProductDetails = ({
  initProduct,
  reviews,
  children,
}: ProductDetailsProps) => {
  const params = useParams()
  const productName = params.productName as string

  const {
    data: { product },
  } = useQuery({ ...productQuery(productName), initialData: initProduct })

  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()

  const prevSizeVal = searchParams.get('size') || ''
  const prevSizeIdx = product.sizes.indexOf(prevSizeVal)

  const [nav, setNav] = useState({
    edition: 0,
    product: 0,
    size: prevSizeIdx !== -1 ? prevSizeIdx : null,
    dropdown: -1,
  })

  const imageIndex = useRef(0)

  const [isOpen, setOpen] = useState({
    sizeChart: false,
    addToCart: false,
    getNotified: false,
  })

  const elMarkdowns = useRef<(HTMLDivElement | null)[]>([])
  const lastAddedItem = useRef<PureCartProduct | null>(null)

  const selectedProduct = product.editions[nav.edition].products[nav.product]
  const isSelectedSizeSoldOut = selectedProduct.sizesSoldOut.includes(
    product.sizes[nav.size || 0],
  )

  const getCartButtonText = () => {
    if (isSelectedSizeSoldOut) return 'get notified'
    else if (!nav.size) return 'select size'
    else
      return (
        <>
          add to cart -{' '}
          {nav.size && (
            <span
              className={cn('text-sm', {
                'line-through': selectedProduct.salePrice,
              })}
            >
              ${product.price}
            </span>
          )}
          {selectedProduct.salePrice && (
            <span className='text-sm'> ${selectedProduct.salePrice}</span>
          )}
        </>
      )
  }

  const handleProductChange = (editionIndex: number, productIndex: number) => {
    setNav({ ...nav, edition: editionIndex, product: productIndex })
    imageIndex.current = 0
  }

  const handleSizeChange = (sizeIndex: number) => {
    setNav({ ...nav, size: sizeIndex })
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set('size', product.sizes[sizeIndex])
      return prevSearchParams
    })
  }

  const addToCart = () => {
    handleAddToCartToggle()

    const sideViewRegex = /left|profile|lat|1-min|^((?!closeup).)*pink-1/i
    const sideImage = selectedProduct.images.find((image) =>
      sideViewRegex.test(image),
    )

    lastAddedItem.current = {
      handle: product.handle,
      editionId: selectedProduct.id,
      size: product.sizes[nav.size || 0],
      name: product.name,
      price: product.price,
      salePrice: selectedProduct.salePrice,
      colorName: selectedProduct.colorName,
      image: sideImage || selectedProduct.images[0],
    }

    dispatch(addCartItem(lastAddedItem.current))
  }

  const handleModalPopup = () =>
    isSelectedSizeSoldOut ? handleGetNotifiedToggle() : addToCart()

  const handleAddToCartToggle = () =>
    setOpen({ ...isOpen, addToCart: !isOpen.addToCart })

  const handleGetNotifiedToggle = () =>
    setOpen({ ...isOpen, getNotified: !isOpen.getNotified })

  const handleSizeChartToggle = () =>
    setOpen({ ...isOpen, sizeChart: !isOpen.sizeChart })

  const handleDropdownToggle = (index: number) =>
    setNav({ ...nav, dropdown: nav.dropdown === index ? -1 : index })

  return (
    <main className='relative px-6 py-10'>
      <section className='flex flex-col gap-y-4 lg:flex-row lg:gap-x-16'>
        <div className='w-full lg:w-3/5'>
          <ProductMainInfo
            name={product.name}
            freeShipping={product.freeShipping}
            price={product.price}
            salePrice={selectedProduct.salePrice}
            rating={reviews.rating}
            totalReviews={reviews.total}
            mobile
          />

          <ProductImageSlider
            images={selectedProduct.images}
            editionIndex={nav.edition}
            productIndex={nav.product}
          />

          <div className='mb-6 hidden text-center text-gray lg:my-6 lg:mb-10 lg:block'>
            <h2 className='border-b border-b-gray-light bg-silver p-4 font-bold capitalize'>
              {product.name} highlights
            </h2>
            {product.highlights.map((highlight) => (
              <p
                key={highlight}
                className='border-b border-b-gray-light bg-silver p-3 text-[14px] last-of-type:border-b-0'
              >
                {highlight}
              </p>
            ))}
          </div>

          <div className='hidden text-gray lg:block'>
            <ul>
              {product.dropdown.map((item, idx) => (
                <li
                  key={item.title}
                  className='border-t border-t-gray-light last-of-type:border-b last-of-type:border-b-gray-light'
                >
                  <button
                    className='flex w-full items-center justify-between py-3'
                    onClick={() => handleDropdownToggle(idx)}
                  >
                    <span className='text-[10px] font-semibold uppercase tracking-[2px]'>
                      {item.title}
                    </span>
                    <span
                      className={cn('text-[13px] duration-[250ms]', {
                        'rotate-180': nav.dropdown === idx,
                      })}
                    >
                      <FaChevronDown />
                    </span>
                  </button>

                  <div
                    ref={(el) => (elMarkdowns.current[idx] = el)}
                    className='overflow-hidden text-sm leading-6 transition-[height] duration-[250ms]'
                    style={{
                      height:
                        nav.dropdown === idx
                          ? elMarkdowns?.current[idx]?.scrollHeight
                          : '0px',
                    }}
                  >
                    <Markdown
                      components={{ a: (props) => <MarkdownLink {...props} /> }}
                    >
                      {item.content}
                    </Markdown>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='w-full lg:w-2/5'>
          <ProductMainInfo
            name={product.name}
            freeShipping={product.freeShipping}
            price={product.price}
            salePrice={selectedProduct.salePrice}
            rating={reviews.rating}
            totalReviews={reviews.total}
          />

          <div className='mb-8'>
            {product.editions.map((edition, editionIdx) => (
              <div
                key={edition.edition}
                className='mb-5 hidden last:mb-0 lg:block'
              >
                <h3 className='mb-2 text-[12px] font-semibold uppercase tracking-[2px]'>
                  {edition.edition}
                </h3>

                <div className='grid grid-cols-8 gap-5'>
                  {edition.products.map((editionProduct, productIdx) => (
                    <ColorButton
                      key={editionProduct.id}
                      hues={editionProduct.colors}
                      selectable
                      selected={
                        nav.edition === editionIdx && nav.product === productIdx
                      }
                      className='w-8 lg:w-10'
                      onClick={() =>
                        handleProductChange(editionIdx, productIdx)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className='mb-8 flex flex-wrap gap-5 lg:hidden'>
            {product.editions.map((edition, editionIdx) =>
              edition.products.map((editionProduct, productIdx) => (
                <ColorButton
                  key={editionProduct.id}
                  hues={editionProduct.colors}
                  selectable
                  selected={
                    nav.edition === editionIdx && nav.product === productIdx
                  }
                  className='w-8 lg:w-10'
                  onClick={() => handleProductChange(editionIdx, productIdx)}
                />
              )),
            )}
          </div>

          <div>
            <p className='mb-2 text-[12px] font-semibold uppercase tracking-[2px]'>
              select size
            </p>

            <div className='mb-3 grid grid-cols-7 gap-1.5'>
              {product.sizes.map((size, sizeIdx) => (
                <SizeButton
                  key={size}
                  size={size}
                  product={selectedProduct}
                  selected={nav.size === sizeIdx}
                  enabledOnSoldOut
                  onClick={() => handleSizeChange(sizeIdx)}
                />
              ))}
            </div>

            <p className='mb-5'>
              <span className='text-sm'>
                This style is available in whole sizes only. In between sizes?
                We recommend you size up.{' '}
              </span>
              <button
                className='text-[13px] font-semibold underline'
                onClick={handleSizeChartToggle}
              >
                See Size Chart
              </button>
            </p>

            <LinkCustom
              className='w-full text-[15.5px]'
              element='button'
              onClick={handleModalPopup}
              disabled={!nav.size}
            >
              {getCartButtonText()}
            </LinkCustom>

            <p className='mb-14 mt-3 text-center text-[12px]'>
              Free shipping on orders over $75. Free returns.
            </p>

            <div>
              <p className='mb-4 text-xl font-semibold'>Also Cosider</p>
              <div className='grid grid-cols-2 gap-x-4'>
                {product.recommendations.map((recommendation) => (
                  // path not scraped
                  // option 2: GET /api/product/recommendations
                  <SlideCard
                    key={recommendation.name}
                    imgUrl={recommendation.image}
                    title={recommendation.name}
                    className='w-full cursor-pointer shadow-md'
                    titleStyle='p-2'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {children}

      <SizeChartModal
        isOpen={isOpen.sizeChart}
        handleClose={handleSizeChartToggle}
      />
      <AddToCartModal
        isOpen={isOpen.addToCart}
        handleClose={handleAddToCartToggle}
        item={lastAddedItem.current}
      />
      <GetNotifiedModal
        isOpen={isOpen.getNotified}
        handleClose={handleGetNotifiedToggle}
      />
    </main>
  )
}

export default ProductDetails
