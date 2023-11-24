import { useRef, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import SideButton from '@/components/product/size-button.component';
import ColorButton from '@/components/product/color-button.component';
import { useAppDispatch } from '@/store/hooks';
import { cn } from '@/utils/cn';
import screenSize from '@/data/screen-size.json';
import { addCartItem, toggleCart } from '@/features/cart';
import type { Product } from '../types/collection.type';
import type { SelectedFilters } from '..';

type ProductCardProps = {
  product: Product;
  hasGender: boolean;
  selectedFilters: SelectedFilters;
};

const isSmall = innerWidth > screenSize.sm && innerWidth < screenSize.md;
const isMedium = innerWidth > screenSize.md;

// 24 sm:20 md:8
const gap = isSmall ? 20 : isMedium ? 8 : 4;
const itemsPerSlide = isMedium ? 6 : 4;

const style = {
  width: `calc((100% - ${(itemsPerSlide - 1) * gap}px) / ${itemsPerSlide})`,
};

// workaround until generic equaion is found
const getMaxSections = (productsLength: number) => {
  let sections = 0;
  if (productsLength <= itemsPerSlide) return sections;

  let remain = productsLength;
  const maxItems = itemsPerSlide - 1;

  for (let i = 0; ; i++) {
    if (i === 0) remain -= maxItems;
    else if (remain <= maxItems) break;
    else remain -= itemsPerSlide - 2;
    sections += 1;
  }

  return sections;
};

const ProductCard = ({
  product,
  hasGender,
  selectedFilters,
}: ProductCardProps) => {
  const [nav, setNav] = useState({ index: 0, section: 0 });
  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const divEl = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  if (!hasGender)
    product.sizes = product.sizes.map((size) => size.split('.')[0]);

  const editions = product.editions
    .flatMap((edition) => edition.products)
    .filter((product) => {
      const bySize =
        !product.sizesSoldOut.some(
          (sizeSoldOut) => selectedFilters.sizes?.includes(sizeSoldOut),
        ) ?? true;

      const byHue =
        selectedFilters.hues?.some((hue) => product.hues.includes(hue)) ?? true;

      return bySize && byHue;
    });

  if (editions.length === 0) return <></>;

  const currProduct = editions[nav.index];
  const MaxSections = getMaxSections(editions.length - 1);

  const section = {
    first: nav.section === 0,
    last: nav.section === MaxSections,
  };

  const imagesPerSlide =
    MaxSections === 0
      ? itemsPerSlide
      : section.first || section.last
      ? itemsPerSlide - 1
      : itemsPerSlide - 2;

  const slice = {
    min: nav.section * imagesPerSlide,
    max: (nav.section + 1) * imagesPerSlide,
  };

  const handleIndexChange = (index: number) =>
    setNav({
      index: index + nav.section * imagesPerSlide,
      section: nav.section,
    });

  const handleSectionChange = (direction: 1 | -1) =>
    setNav({ index: nav.index, section: nav.section + direction });

  const handleToggleQuickAdd = () => setQuickAddOpen(!isQuickAddOpen);

  const AddCartItem = (size: string) => {
    const edition = editions[nav.index];

    const productToCart = {
      editionId: edition.id,
      size,
      handle: product.handle,
      name: product.name,
      price: product.price,
      salePrice: edition.salePrice,
      colorName: edition.colorName,
      image: edition.image,
    };

    dispatch(addCartItem(productToCart));
    dispatch(toggleCart());
  };

  return (
    <div className='text-gray relative bg-blue group bg-white h-fit'>
      <div className='hidden md:block absolute w-[calc(100%+32px)] h-[calc(100%+32px)] -top-4 -left-4 group-hover:shadow-2xl group-hover:shadow-gray z-10' />

      <div className='relative pb-[100%]'>
        <img
          src={currProduct.image}
          alt={product.name}
          className='absolute top-0 left-0 w-full h-full object-cover bg-silver'
        />
      </div>

      <Link to={product.handle} className='relative z-10'>
        <p className='font-semibold text-[11px] mt-2 uppercase px-3 md:px-0 z-10 relative'>
          {product.name}
        </p>
      </Link>

      <div className='text-[11.2px] mb-1 px-3 md:px-0 z-10 relative'>
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

      <div className='whitespace-nowrap flex gap-x-1 sm:gap-x-5 md:gap-x-2 px-3 md:px-0'>
        {!section.first && (
          <button
            className='bg-white border border-gray z-10 rounded-full md:rounded-none'
            onClick={() => handleSectionChange(-1)}
            style={style}
          >
            <span className='scale-90 sm:scale-100 md:scale-125 grid place-items-center w-full h-full'>
              <FaAngleLeft />
            </span>
          </button>
        )}

        {editions.slice(slice.min, slice.max).map((edition, idx) => (
          <Fragment key={edition.id}>
            <button
              className='bg-silver z-10 hidden md:block'
              onClick={() => handleIndexChange(idx)}
              style={style}
            >
              <div className='relative pb-[100%]'>
                <img
                  src={edition.image}
                  alt=''
                  className='absolute top-0 left-0 w-full h-full object-cover'
                />
              </div>
            </button>

            <ColorButton
              hues={edition.colors}
              className='block md:hidden z-10'
              style={style}
              onClick={() => handleIndexChange(idx)}
            />
          </Fragment>
        ))}

        {!section.last && (
          <button
            className='bg-white border border-gray z-10 rounded-full md:rounded-none'
            onClick={() => handleSectionChange(1)}
            style={style}
          >
            <span className='scale-90 sm:scale-100 md:scale-125 grid place-items-center w-full h-full'>
              <FaAngleRight />
            </span>
          </button>
        )}
      </div>

      <div className='box-content pb-4 pl-4 -translate-x-4 pr-4 hidden md:group-hover:block absolute w-full z-20 bg-white group-hover:shadow-2xl group-hover:shadow-gray'>
        <p className='font-semibold text-[11px] mt-2 uppercase mb-1'>
          quick add
        </p>
        <div
          className={cn(
            'grid gap-[6px]',
            hasGender ? ' grid-cols-4 md:grid-cols-6' : 'grid-cols-4',
          )}
        >
          {product.sizes.map((size) => (
            <SideButton
              key={size}
              size={size}
              product={currProduct}
              onClick={() => AddCartItem(size)}
            />
          ))}
        </div>
      </div>

      <div className='mt-3 mb-1 pt-2 pb-1 border-t border-t-gray md:hidden px-3 md:px-0'>
        <div>
          <div className='flex justify-between items-center w-full'>
            <p className='font-semibold text-[10px] uppercase'>quick add</p>
            <button
              className='w-[14px] h-[14px] relative'
              onClick={handleToggleQuickAdd}
            >
              <span
                className={cn(
                  'absolute w-[1.9px] h-full bg-black top-0 left-1/2 -translate-x-1/2 duration-[250ms]',
                  { 'rotate-90': isQuickAddOpen },
                )}
              />
              <span className='absolute w-full h-[1.7px] bg-black top-1/2 left-0 -translate-y-1/2' />
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
                'grid gap-[6px] w-full mt-1',
                hasGender
                  ? 'grid-cols-5 sm:grid-cols-7 md:sm:grid-cols-9'
                  : 'grid-cols-4',
              )}
            >
              {product.sizes.map((size) => (
                <SideButton
                  key={size}
                  size={size}
                  product={currProduct}
                  onClick={() => AddCartItem(size)}
                  className={cn(
                    hasGender ? 'text-[9.8px]' : 'uppercase text-sm',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
