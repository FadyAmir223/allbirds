import { useState } from 'react'
import {
  Link,
  useLoaderData,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/product-card.component'
import SideBar from '../components/side-bar.component'
import { collectionQuery } from '../services/collection.query'
import { ensureType } from '../utils/ensureType.util'
import { type FilterKey, type FilterValues, type SelectedFilters } from '..'
import { loader as collectionLoader } from '../services/collection.loader'
import { Slider } from '@/features/misc'

const delimiter = '+'

const genders = [
  { label: 'women', type: 'womens' },
  { label: 'men', type: 'mens' },
]

const Collections = () => {
  const [isFilterOpen, setFilterOpen] = useState(false)
  const [searchParams] = useSearchParams()

  const { pathname } = useLocation()
  const isSale = pathname.includes('/sale')

  const params = useParams()
  const type = params.type as string
  const ensuredType = ensureType(type)
  const hasGender = ensuredType.gender !== undefined

  const [initCollection, filters, initSuggestionSlides] =
    useLoaderData() as Awaited<ReturnType<typeof collectionLoader>>

  const { data: collection } = useQuery({
    ...collectionQuery(ensuredType),
    initialData: initCollection,
  })

  if (!collection) return

  if (!hasGender)
    filters.sizes = filters.sizes.map((size) => size.split('.')[0])

  const selectedFilters: SelectedFilters = {} as Record<FilterKey, FilterValues>

  for (const key in filters)
    selectedFilters[key as FilterKey] = searchParams.get(key)?.split(delimiter)

  const filteredCollection = collection.products.filter((product) => {
    const byMaterial =
      selectedFilters.material?.includes(product.material) ?? true

    const byBestFor =
      selectedFilters.bestFor?.some((selectedFilter) =>
        product.bestFor.includes(selectedFilter),
      ) ?? true

    return byMaterial && byBestFor
  })

  const otherGender =
    hasGender && (type === genders[0].type ? genders[1] : genders[0])

  const handleFilterMobileToggle = () => setFilterOpen(!isFilterOpen)

  return (
    <main className='py-10'>
      <div className='mb-16 flex items-center'>
        <SideBar
          filters={filters}
          selectedFilters={selectedFilters}
          delimiter={delimiter}
          isFilterOpen={isFilterOpen}
          hasGender={hasGender}
          handleFilterMobileToggle={handleFilterMobileToggle}
        />

        {filteredCollection.length !== 0 ? (
          <section className='flex-grow self-start'>
            <div className='mb-4 flex justify-between px-4'>
              <button
                className='flex items-center rounded-full border border-gray-light px-3.5 py-[3px] text-[9.5px] uppercase tracking-[0.7px] duration-[250ms] hover:border-silver-dark lg:hidden'
                onClick={handleFilterMobileToggle}
              >
                <span>filters</span>
                <span className='flex flex-col items-center gap-1 pl-2'>
                  <span className='relative h-[1px] w-5 bg-gray before:absolute before:left-1/4 before:top-[-1px] before:h-[3px] before:w-[3px] before:rounded-full before:border before:border-gray' />
                  <span className='relative h-[1px] w-5 bg-gray before:absolute before:right-1/4 before:top-[-1px] before:h-[3px] before:w-[3px] before:rounded-full before:border before:border-gray' />
                </span>
              </button>

              {otherGender && (
                <span className='flex items-center rounded-full border border-gray text-[9.5px] uppercase tracking-[0.7px] lg:ml-auto'>
                  {genders.map((gender) =>
                    type === gender.type ? (
                      <span
                        key={gender.label}
                        className='rounded-full border-2 border-gray-light bg-gray px-3.5 py-[3px] font-[500] text-white'
                      >
                        {gender.label}
                      </span>
                    ) : (
                      <Link
                        key={gender.label}
                        to={`/collections/${isSale ? 'sale/' : ''}${
                          otherGender.type
                        }`}
                        className='px-3.5 py-[3px]'
                      >
                        {otherGender.label}
                      </Link>
                    ),
                  )}
                </span>
              )}
            </div>

            {isSale && (
              <div className='bg- mx-4 bg-[url(/images/sale-collection.avif)] p-6 text-center'>
                <h3 className='text-lg font-bold'>
                  Sale On Sale: For A Limited Time
                </h3>
                <p className='text-[12px]'>
                  Take an extra 30% off with code
                  <span className='text-base font-bold'> GET30</span>. Final
                  sale excluded.
                </p>
              </div>
            )}

            <article className='grid grid-cols-2 gap-4 bg-silver-2 p-4 md:grid-cols-3 md:bg-transparent'>
              {filteredCollection.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  hasGender={hasGender}
                  selectedFilters={selectedFilters}
                />
              ))}
            </article>
          </section>
        ) : (
          <p className='flex-grow self-start p-6 text-center text-[13px]'>
            Sorry, there are no results
          </p>
        )}
      </div>

      <Slider
        title='best of allbirds'
        imagesPerSlide={4}
        slides={initSuggestionSlides}
      />
    </main>
  )
}

export default Collections
