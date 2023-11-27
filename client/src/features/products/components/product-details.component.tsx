import { Fragment, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';

import ProductImageSlider from '../components/product-image-slider.component';
import ColorButton from '@/components/product/color-button.component';
import SizeButton from '@/components/product/size-button.component';
import LinkCustom from '@/components/link-custom.component';
import SizeChart from '../components/size-shart.component';
import AddToCart from '../components/add-to-cart.component';
import MarkdownLink from '@/components/markdown-link.component';
import { SlideCard } from '@/features/misc';
import { useScroll } from '@/hooks/useScroll';
import { useAppDispatch } from '@/store/hooks';
import { productQuery, productReviewsQuery } from '../services/product.query';
import { cn } from '@/utils/cn.util';
import { type PureCartProduct, addCartItem } from '@/features/cart';
import { type ProductDetailed, type Reviews } from '..';

type ProductDetailsProps = {
  initProduct: ProductDetailed;
  initReviews: Reviews;
};

const ProductDetails = ({ initProduct, initReviews }: ProductDetailsProps) => {
  const params = useParams();
  const productName = params.productName as string;

  const [{ data: detailedProduct }, { data: reviews }] = useQueries({
    queries: [
      { ...productQuery(productName), initialData: initProduct },
      {
        ...productReviewsQuery({ name: productName }),
        initialData: initReviews,
      },
    ],
  });

  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const prevSizeVal = searchParams.get('size') || '';
  const prevSizeIdx = detailedProduct?.product.sizes.indexOf(prevSizeVal);

  const [nav, setNav] = useState({
    edition: 0,
    product: 0,
    image: 0,
    size: prevSizeIdx || 0,
    dropdown: -1,
  });

  const [isOpen, setOpen] = useState({ sizeChart: false, addToCart: false });
  useScroll(isOpen.sizeChart, isOpen.addToCart);

  const elMarkdowns = useRef<(HTMLDivElement | null)[]>([]);
  const lastAddedItem = useRef<PureCartProduct | null>(null);

  const { product } = detailedProduct || {};
  if (!product || !reviews) return;

  const selectedProduct = product.editions[nav.edition].products[nav.product];

  const handleImageChange = (index: number) => setNav({ ...nav, image: index });

  const handleNeighbourImage = (direction: -1 | 1) => {
    const images = selectedProduct.images.length;
    const index = (nav.image + direction + images) % images;
    setNav({ ...nav, image: index });
  };

  const handleProductChange = (editionIndex: number, productIndex: number) =>
    setNav({ ...nav, image: 0, edition: editionIndex, product: productIndex });

  const handleSizeChange = (sizeIndex: number) => {
    setNav({ ...nav, size: sizeIndex });
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set('size', product.sizes[sizeIndex]);
      return prevSearchParams;
    });
  };

  const handleAddToCart = () => {
    handleAddToCartToggle();

    const sideViewRegex = /left|profile|lat|1-min|^((?!closeup).)*pink-1/i;
    const sideImage = selectedProduct.images.find((image) =>
      sideViewRegex.test(image),
    );

    lastAddedItem.current = {
      handle: product.handle,
      editionId: selectedProduct.id,
      size: product.sizes[nav.size],
      name: product.name,
      price: product.price,
      salePrice: selectedProduct.salePrice,
      colorName: selectedProduct.colorName,
      image: sideImage || selectedProduct.images[0],
    };

    dispatch(addCartItem(lastAddedItem.current));
  };

  const handleAddToCartToggle = () =>
    setOpen({ ...isOpen, addToCart: !isOpen.addToCart });

  const handleSizeChartToggle = () =>
    setOpen({ ...isOpen, sizeChart: !isOpen.sizeChart });

  const handleDropdownToggle = (index: number) =>
    setNav({ ...nav, dropdown: nav.dropdown === index ? -1 : index });

  return (
    <main className='py-10 px-6 relative'>
      <section className='flex gap-16'>
        <div className='w-3/5 '>
          <ProductImageSlider
            images={selectedProduct.images}
            currImgIndex={nav.image}
            handleImageChange={handleImageChange}
            handleNeighbourImage={handleNeighbourImage}
          />

          <div className='my-6 mb-10 text-center text-gray'>
            <h2 className='capitalize font-bold bg-silver border-b border-b-gray-light p-4'>
              {product.name} highlights
            </h2>
            {product.highlights.map((highlight) => (
              <p
                key={highlight}
                className='bg-silver border-b border-b-gray-light last-of-type:border-b-0 p-3 text-[14px]'
              >
                {highlight}
              </p>
            ))}
          </div>

          <div className='text-gray'>
            <ul className=''>
              {product.dropdown.map((item, idx) => (
                <li
                  key={item.title}
                  className='border-t border-t-gray-light last-of-type:border-b last-of-type:border-b-gray-light'
                >
                  <button
                    className='flex justify-between items-center w-full py-5'
                    onClick={() => handleDropdownToggle(idx)}
                  >
                    <span className='uppercase text-[12px] tracking-[2px] font-semibold'>
                      {item.title}
                    </span>
                    <span
                      className={cn('duration-[250ms]', {
                        'rotate-180': nav.dropdown === idx,
                      })}
                    >
                      <FaChevronDown />
                    </span>
                  </button>

                  <div
                    ref={(el) => (elMarkdowns.current[idx] = el)}
                    className='text-sm leading-6 overflow-hidden duration-[250ms] transition-[height]'
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

        <div className='w-2/5'>
          <Link to='/' className='hover:underline font-semibold text-[10px]'>
            Home /
          </Link>
          <h1 className='text-3xl font-bold mb-1'>{product.name}</h1>

          <div className='flex items-center m-2.5'>
            <span
              className={cn('text-sm', {
                'line-through': selectedProduct.salePrice,
              })}
            >
              ${product.price}
            </span>
            {selectedProduct.salePrice && (
              <span className='text-sm ml-1 text-red'>
                {selectedProduct.salePrice}
              </span>
            )}
            {product.freeShipping && (
              <span className='ml-2 text-[12px] p-1.5 bg-silver uppercase italic font-semibold tracking-[0.5px]'>
                free shipping
              </span>
            )}
          </div>

          <div className='flex gap-2 mb-5'>
            <div className='flex items-center gap-x-0.5'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Fragment key={idx}>
                  {idx + 1 <= reviews.rating ? (
                    <span className='text-gray scale-110'>
                      <MdStar />
                    </span>
                  ) : idx + 1 > reviews.rating && idx < reviews.rating ? (
                    <span className='text-gray scale-110'>
                      <MdStarHalf />
                    </span>
                  ) : (
                    <span className='scale-110'>
                      <MdStarBorder />
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <span className='underline'>({reviews.pagination.total})</span>
          </div>

          <div className='mb-8'>
            {product.editions.map((edition, editionIdx) => (
              <div key={edition.edition} className='mb-5 last:mb-0'>
                <h3 className='uppercase text-[12px] font-semibold tracking-[2px] mb-2'>
                  {edition.edition}
                </h3>

                <div className='grid grid-cols-6 md:grid-cols-8 gap-5'>
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

          <div className=''>
            <p className='uppercase text-[12px] font-semibold tracking-[2px] mb-2'>
              select size
            </p>

            <div className='grid grid-cols-5 md:grid-cols-7 gap-1.5 mb-3'>
              {product.sizes.map((size, sizeIdx) => (
                <SizeButton
                  key={size}
                  size={size}
                  product={selectedProduct}
                  selected={nav.size === sizeIdx}
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
                className='underline font-semibold text-[13px]'
                onClick={handleSizeChartToggle}
              >
                See Size Chart
              </button>
            </p>

            <LinkCustom
              className='w-full text-[15.5px]'
              element='button'
              onClick={handleAddToCart}
            >
              add to cart -{' '}
              <span
                className={cn('text-sm', {
                  'line-through': selectedProduct.salePrice,
                })}
              >
                ${product.price}
              </span>
              {selectedProduct.salePrice && (
                <span className='text-sm'> ${selectedProduct.salePrice}</span>
              )}
            </LinkCustom>

            <p className='mt-3 mb-14 text-[12px] text-center'>
              Free shipping on orders over $75. Free returns.
            </p>

            <div className=''>
              <p className='font-semibold text-xl mb-4'>Also Cosider</p>
              <div className='flex gap-x-4'>
                {product.recommendations.map((recommendation) => (
                  // path not scraped
                  // workaround option 2: GET /api/product/recommendations
                  <SlideCard
                    key={recommendation.name}
                    imgUrl={recommendation.image}
                    title={recommendation.name}
                    className='shadow-md w-1/2 cursor-pointer'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SizeChart
        isOpen={isOpen.sizeChart}
        handleClose={handleSizeChartToggle}
      />
      <AddToCart
        isOpen={isOpen.addToCart}
        handleClose={handleAddToCartToggle}
        item={lastAddedItem.current}
      />
    </main>
  );
};

export default ProductDetails;
