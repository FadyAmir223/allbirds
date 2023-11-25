import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';
import { RiCloseLine } from 'react-icons/ri';

import SizeButton from '@/components/product/size-button.component';
import Checkbox from './checkbox.component';
import Drawer from '@/components/drawer.component';
import { cn } from '@/utils/cn.util';
import { type FilterKey, type Filters } from '..';

type SideBarProps = {
  filters: Filters['filters'];
  selectedFilters: {
    [key in FilterKey]: string[] | undefined;
  };
  delimiter: string;
  isFilterOpen: boolean;
  hasGender: boolean;
  handleFilterMobileToggle: () => void;
};

const SideBar = ({
  isFilterOpen,
  handleFilterMobileToggle,
  ...props
}: SideBarProps) => {
  return (
    <>
      <aside className='hidden lg:block p-4 w-[265px] text-gray self-start'>
        <Link to='/' className='text-[10px] font-semibold'>
          Home /
        </Link>
        <SideBarFilters {...props} />
      </aside>

      <Drawer isOpen={isFilterOpen} handleClose={handleFilterMobileToggle}>
        <div className='fixed px-6 py-3 top-0 w-full border-b border-b-gray bg-white z-10'>
          <button
            className='scale-150 duration-[400ms] hover:translate-x-2'
            onClick={handleFilterMobileToggle}
          >
            <FaArrowRightLong />
          </button>
        </div>
        <SideBarFilters drawer {...props} />
      </Drawer>
    </>
  );
};

const checkboxFilters: { label: string; filterType: FilterKey }[] = [
  { label: 'best for', filterType: 'bestFor' },
  { label: 'material', filterType: 'material' },
];

type SideBarFiltersProps = Omit<
  SideBarProps,
  'isFilterOpen' | 'handleFilterMobileToggle'
> & { drawer?: boolean };

const SideBarFilters = ({
  filters,
  selectedFilters,
  delimiter,
  hasGender,
  drawer = false,
}: SideBarFiltersProps) => {
  const [, setSearchParams] = useSearchParams();

  const hasFilters = !Object.values(selectedFilters).every(
    (value) => value === undefined,
  );

  if (!hasGender)
    filters.sizes = filters.sizes.map((size) => size.split('.')[0]);

  const handleFilterBy = (key: string, value: string) => {
    setSearchParams(
      (prevSearchParams) => {
        const queryValue = prevSearchParams.get(key);

        const values = queryValue?.split(delimiter) || [];
        const index = values.indexOf(value);
        index === -1 ? values.push(value) : values.splice(index, 1);

        if (!isNaN(Number(values[0]))) values.sort((a, b) => +a - +b);
        const stringValues = values?.join(delimiter);

        stringValues
          ? prevSearchParams.set(key, stringValues)
          : prevSearchParams.delete(key);

        return prevSearchParams;
      },
      { replace: true },
    );
  };

  const clearFilterBy = () => {
    setSearchParams(
      (prevSearchParams) => {
        Object.keys(selectedFilters).map((selectedFilter) => {
          prevSearchParams.delete(selectedFilter);
        });
        return prevSearchParams;
      },
      { replace: true },
    );
  };

  return (
    <aside className={cn({ 'mt-16 pl-4': drawer })}>
      <div className='border-b border-b-gray mt-2 mb-3 pb-2'>
        <div className='flex items-center pb-2 mb-3'>
          <p className='text-[15px] font-bold'>Filter By:</p>
          {drawer && hasFilters && (
            <button
              className='underline mx-14 text-[#e8e6e3]'
              onClick={clearFilterBy}
            >
              clear All
            </button>
          )}
        </div>
        <div className='flex gap-1 flex-wrap'>
          {Object.entries(selectedFilters).map(
            ([filterKey, filterList]) =>
              filterList?.map((filterValue) => (
                <button
                  key={filterValue}
                  className='text-[12px] pl-[7px] pr-[4px] py-[3px] rounded-full flex items-center gap-2 border border-gray-light hover:border-silver-dark duration-[250ms]'
                  onClick={() => handleFilterBy(filterKey, filterValue)}
                >
                  <p className='capitalize whitespace-nowrap'>{filterValue}</p>
                  <span className='bg-silver-dark rounded-full text-white p-[2px]'>
                    <RiCloseLine />
                  </span>
                </button>
              )),
          )}
        </div>
      </div>

      <div className='border-b border-b-gray mt-2 mb-3 pb-2 pr-4'>
        <h5 className='uppercase font-bold text-sm tracking-[1px] mb-2'>
          sizes
        </h5>
        <p className='text-[10px] tracking-[0.3px] mb-3'>
          Most of our shoes only come in full sizes. If you’re a half size,
          select your nearest whole size too.
        </p>
        <ul
          className={cn(
            'grid gap-2',
            hasGender ? 'grid-cols-6' : 'grid-cols-2',
          )}
        >
          {filters.sizes.map((size) => (
            <SizeButton
              key={size}
              size={size}
              selected={selectedFilters.sizes?.includes(size)}
              className={cn(
                hasGender ? 'text-[10px]' : 'uppercase font-bold text-[16px]',
              )}
              onClick={() => handleFilterBy('sizes', size)}
            />
          ))}
        </ul>
      </div>

      {checkboxFilters.map(({ label, filterType }) => (
        <div key={label} className='border-b border-b-gray mt-2 mb-3 pb-2'>
          <h5 className='uppercase font-bold text-sm tracking-[1px] mb-2'>
            {label}
          </h5>
          <ul>
            {filters[filterType].map((tag) => (
              <Checkbox
                key={tag}
                tag={tag}
                checked={selectedFilters[filterType]?.includes(tag) ?? false}
                onChange={() => handleFilterBy(filterType, tag)}
              />
            ))}
          </ul>
        </div>
      ))}

      <div>
        <h5 className='uppercase font-bold text-sm tracking-[1px] mb-2'>hue</h5>
        <ul>
          {filters.hues?.map((hue) => (
            <Checkbox
              key={hue}
              tag={hue}
              isColor
              checked={selectedFilters.hues?.includes(hue) ?? false}
              onChange={() => handleFilterBy('hues', hue)}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
