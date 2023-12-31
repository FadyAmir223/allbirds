import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRightLong } from 'react-icons/fa6'
import { RiCloseLine } from 'react-icons/ri'
import { Checkbox } from './checkbox.component'
import Drawer from '@/components/drawer.component'
import SizeButton from '@/components/product/size-button.component'
import { cn } from '@/utils/cn.util'
import type { FilterKey, Filters } from '..'
import { getSockSize } from '..'

type SideBarProps = {
  filters: Filters['filters']
  selectedFilters: {
    [key in FilterKey]: string[] | undefined
  }
  delimiter: string
  isFilterOpen: boolean
  hasGender: boolean
  handleFilterMobileToggle: () => void
}

const SideBar = ({
  isFilterOpen,
  handleFilterMobileToggle,
  ...props
}: SideBarProps) => {
  return (
    <>
      <aside className='hidden w-[265px] self-start p-4 text-gray lg:block'>
        <Link to='/' className='text-[10px] font-[500]'>
          Home /
        </Link>
        <SideBarFilters {...props} />
      </aside>

      <Drawer isOpen={isFilterOpen} handleClose={handleFilterMobileToggle}>
        <div className='fixed top-0 z-10 w-full border-b border-b-gray bg-white px-6 py-3'>
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
  )
}

const checkboxFilters: { label: string; filterType: FilterKey }[] = [
  { label: 'best for', filterType: 'bestFor' },
  { label: 'material', filterType: 'material' },
]

type SideBarFiltersProps = Omit<
  SideBarProps,
  'isFilterOpen' | 'handleFilterMobileToggle'
> & { drawer?: boolean }

const SideBarFilters = ({
  filters,
  selectedFilters,
  delimiter,
  hasGender,
  drawer = false,
}: SideBarFiltersProps) => {
  const [, setSearchParams] = useSearchParams()

  const hasFilters = !Object.values(selectedFilters).every(
    (value) => value === undefined,
  )

  const handleFilterBy = (key: string, value: string) => {
    setSearchParams(
      (prevSearchParams) => {
        const queryValue = prevSearchParams.get(key)

        const values = queryValue?.split(delimiter) || []
        const index = values.indexOf(value)
        index === -1 ? values.push(value) : values.splice(index, 1)

        if (!isNaN(Number(values[0]))) values.sort((a, b) => +a - +b)
        const stringValues = values?.join(delimiter)

        stringValues
          ? prevSearchParams.set(key, stringValues)
          : prevSearchParams.delete(key)

        return prevSearchParams
      },
      { replace: true },
    )
  }

  const clearFilterBy = () => {
    setSearchParams(
      (prevSearchParams) => {
        Object.keys(selectedFilters).map((selectedFilter) => {
          prevSearchParams.delete(selectedFilter)
        })
        return prevSearchParams
      },
      { replace: true },
    )
  }

  return (
    <aside className={cn({ 'mt-16 pl-4': drawer })}>
      <div className='mb-3 mt-2 border-b border-b-gray pb-2'>
        <div className='mb-3 flex items-center pb-2'>
          <p className='text-[15px] font-bold'>Filter By:</p>
          {drawer && hasFilters && (
            <button className='mx-14 underline' onClick={clearFilterBy}>
              clear All
            </button>
          )}
        </div>
        <div className='flex flex-wrap gap-1'>
          {Object.entries(selectedFilters).map(
            ([filterKey, filterList]) =>
              filterList?.map((filterValue) => (
                <button
                  key={filterValue}
                  className='flex items-center gap-2 rounded-full border border-gray-light py-[3px] pl-[7px] pr-[4px] text-[12px] duration-[250ms] hover:border-silver-dark'
                  onClick={() => handleFilterBy(filterKey, filterValue)}
                >
                  <p className='whitespace-nowrap capitalize'>{filterValue}</p>
                  <span className='rounded-full bg-silver-dark p-[2px] text-white'>
                    <RiCloseLine />
                  </span>
                </button>
              )),
          )}
        </div>
      </div>

      <div className='mb-3 mt-2 border-b border-b-gray pb-2 pr-4'>
        <h5 className='mb-2 text-sm font-bold uppercase tracking-[1px]'>
          sizes
        </h5>
        <p className='mb-3 text-[10px] tracking-[0.3px]'>
          Most of our shoes only come in full sizes. If you’re a half size,
          select your nearest whole size too.
        </p>

        <div
          className={cn(
            'grid gap-2',
            hasGender ? 'grid-cols-6' : 'grid-cols-2',
          )}
        >
          {filters.sizes
            .sort((a, b) => +a - +b)
            .map((size) => {
              let letter, sockSize
              if (!hasGender) {
                // eslint-disable-next-line no-extra-semi
                ;[letter, ...sockSize] = size.split('.')
                sockSize = getSockSize(sockSize || [])
              }

              return (
                <SizeButton
                  key={size}
                  selected={selectedFilters.sizes?.includes(size)}
                  enabledOnSoldOut
                  className={cn({
                    'aspect-auto p-1.5 uppercase': !hasGender,
                  })}
                  onClick={() => handleFilterBy('sizes', size)}
                >
                  {hasGender ? (
                    size
                  ) : (
                    <div>
                      <p className='text-[13px] font-bold'>{letter}</p>
                      <p className='text-[11px]'>({sockSize})</p>
                    </div>
                  )}
                </SizeButton>
              )
            })}
        </div>
      </div>

      {checkboxFilters.map(({ label, filterType }) => (
        <div key={label} className='mb-3 mt-2 border-b border-b-gray pb-2'>
          <h5 className='mb-2 text-sm font-bold uppercase tracking-[1px]'>
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
        <h5 className='mb-2 text-sm font-bold uppercase tracking-[1px]'>hue</h5>
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
  )
}

export default SideBar
