import { Link, useSearchParams } from 'react-router-dom';
import { RiCloseLine } from 'react-icons/ri';

import SizeButton from '@/components/product/size-button.component';
import Checkbox from './checkbox.component';
import { type FilterKey, type Filters } from '..';

type SideBarProps = {
  filters: Filters['filters'];
  selectedFilters: {
    [key in FilterKey]: string[] | undefined;
  };
  delimiter: string;
};

const checkboxFilters: { label: string; filterType: FilterKey }[] = [
  { label: 'best for', filterType: 'bestFor' },
  { label: 'material', filterType: 'material' },
];

const SideBar = ({ filters, selectedFilters, delimiter }: SideBarProps) => {
  const [, setSearchParams] = useSearchParams();

  const handleFilterBy = (key: string, value: string) => {
    setSearchParams((prevSearchParams) => {
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
    });
  };

  return (
    <aside className='hidden lg:block p-4 w-[265px] text-gray self-start'>
      <Link to='/' className='text-[10px] font-semibold'>
        Home /
      </Link>

      <div className='border-b border-b-gray mt-2 mb-3 pb-2'>
        <p className='pb-2 mb-3 text-[15px] font-bold'>Filter By:</p>
        <div className='flex gap-1 flex-wrap'>
          {Object.entries(selectedFilters).map(
            ([filterKey, filterList]) =>
              filterList?.map((filterValue) => (
                <button
                  key={filterValue}
                  className='text-[12px] pl-[7px] pr-[4px] py-[3px] rounded-full flex items-center gap-2 border border-gray-light hover:border-sliver-dark duration-[250ms]'
                  onClick={() => handleFilterBy(filterKey, filterValue)}
                >
                  <p className='capitalize whitespace-nowrap'>{filterValue}</p>
                  <span className='bg-sliver-dark rounded-full text-white p-[2px]'>
                    <RiCloseLine />
                  </span>
                </button>
              )),
          )}
        </div>
      </div>

      <div className='border-b border-b-gray mt-2 mb-3 pb-2'>
        <h5 className='uppercase font-bold text-sm tracking-[1px] mb-2'>
          sizes
        </h5>
        <p className='text-[10px] tracking-[0.3px] mb-3'>
          Most of our shoes only come in full sizes. If you’re a half size,
          select your nearest whole size too.
        </p>
        <ul className='grid grid-cols-6 gap-2'>
          {filters.sizes
            .filter((size) => Number(size))
            .map((size) => (
              <SizeButton
                key={size}
                size={size}
                selected={selectedFilters?.sizes?.includes(size)}
                className='text-[10px]'
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
                checked={selectedFilters[filterType]?.includes(tag)}
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
              checked={selectedFilters.hues?.includes(hue)}
              onChange={() => handleFilterBy('hues', hue)}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;