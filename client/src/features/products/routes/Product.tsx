import { Fragment, useState } from 'react';
import {
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { MdStar, MdStarHalf, MdStarBorder } from 'react-icons/md';
import ColorButton from '@/components/product/color-button.component';
import SizeButton from '@/components/product/size-button.component';
import LinkCustom from '@/components/link-custom.component';
import SizeChart from '../components/size-shart.component';
import AddToCart from '../components/add-to-cart.component';
import { useScroll } from '@/hooks/useScroll';
import { productQuery, productReviewsQuery } from '../services/product.query';
import { cn } from '@/utils/cn.util';
import { type ProductDetailed, type Reviews } from '..';
import { useAppDispatch } from '@/store/hooks';
import { addCartItem } from '@/features/cart';

export const Product = () => {
  const params = useParams();
  const productName = params.productName as string;

  const [initProduct, initReviews] = useLoaderData() as [
    ProductDetailed,
    Reviews,
  ];

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
  });

  const [isOpen, setOpen] = useState({ sizeChart: false, addToCart: false });
  useScroll(isOpen.sizeChart, isOpen.addToCart);

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

    dispatch(
      addCartItem({
        handle: product.handle,
        editionId: selectedProduct.id,
        size: product.sizes[nav.size],
        name: product.name,
        price: product.price,
        salePrice: selectedProduct.salePrice,
        colorName: selectedProduct.colorName,
        image: sideImage || selectedProduct.images[0],
      }),
    );
  };

  const handleAddToCartToggle = () =>
    setOpen({ ...isOpen, addToCart: !isOpen.addToCart });

  const handleSizeChartToggle = () =>
    setOpen({ ...isOpen, sizeChart: !isOpen.sizeChart });

  return (
    <main className='py-10 px-6 relative'>
      <section className='flex gap-16'>
        <div className='w-3/5 flex gap-x-6'>
          <div className='flex flex-col gap-y-2.5 w-[11%]'>
            {selectedProduct.images.map((image, idx) => (
              <button
                key={image}
                className='bg-silver relative pb-[100%] aspect-square w-full'
                onClick={() => handleImageChange(idx)}
              >
                <img src={image} alt='' className='absolute inset-0' />
              </button>
            ))}
          </div>

          <div className='relative select-none flex-1'>
            <div className='overflow-hidden'>
              <div
                className='flex duration-300 relative'
                style={{ transform: `translateX(-${nav.image * 100}%)` }}
              >
                {selectedProduct.images.map((image) => (
                  <div
                    key={image}
                    className='aspect-square bg-silver relative pb-[100%]'
                  >
                    <img
                      src={image}
                      alt={selectedProduct.handle}
                      className='absolute inset-0'
                    />
                  </div>
                ))}

                <div className='absolute bottom-3.5 right-2 flex gap-x-3'>
                  <button
                    className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                    onClick={() => handleNeighbourImage(-1)}
                  >
                    <span className='scale-125'>
                      <FaAngleLeft />
                    </span>
                  </button>
                  <button
                    className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                    onClick={() => handleNeighbourImage(1)}
                  >
                    <span className='scale-125'>
                      <FaAngleRight />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* <div className='absolute bottom-3.5 right-2 flex gap-x-3'>
              <button
                className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                onClick={() => handleNeighbourImage(-1)}
              >
                <span className='scale-125'>
                  <FaAngleLeft />
                </span>
              </button>
              <button
                className='rounded-full border-silver bg-white w-12 h-12 grid place-items-center text-gray'
                onClick={() => handleNeighbourImage(1)}
              >
                <span className='scale-125'>
                  <FaAngleRight />
                </span>
              </button>
            </div> */}
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

                <div className='grid grid-cols-9 gap-1.5'>
                  {edition.products.map((editionProduct, productIdx) => (
                    <ColorButton
                      key={editionProduct.id}
                      hues={editionProduct.colors}
                      selectable
                      selected={
                        nav.edition === editionIdx && nav.product === productIdx
                      }
                      className='w-10'
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

            <div className='grid grid-cols-8 gap-1.5 mb-3'>
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
      />
    </main>
  );
};
