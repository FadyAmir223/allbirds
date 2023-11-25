import { useState } from 'react';
import {
  useParams,
  useLoaderData,
  useSearchParams,
  Link,
} from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';

import SideBar from '../components/side-bar.component';
import ProductCard from '../components/product-card.component';
import { SectionDesktop, Slider } from '@/features/misc';
import {
  collectionQuery,
  collectionFiltersQuery,
} from '../services/collection.query';
import { ensureType } from '../utils/ensureType.util';
import {
  type Collection,
  type Filters,
  type SelectedFilters,
  type FilterKey,
  type FilterValues,
} from '..';

const delimiter = '_';

const genders = [
  { label: 'women', type: 'womens' },
  { label: 'men', type: 'mens' },
];

const Collections = () => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const params = useParams();
  const type = params.type as string;
  const ensuredType = ensureType(type);
  const hasGender = ensuredType.gender !== undefined;

  const [initCollection, initFilters, initSuggestionSlides] =
    useLoaderData() as [Collection, Filters, SectionDesktop[]];

  const [{ data: collection }, { data: filter }] = useQueries({
    queries: [
      { ...collectionQuery(ensuredType), initialData: initCollection },
      { ...collectionFiltersQuery(ensuredType), initialData: initFilters },
    ],
  });

  const { filters } = filter || {};
  if (!collection || !filters) return;

  if (!hasGender)
    filters.sizes = filters.sizes.map((size) => size.split('.')[0]);

  const selectedFilters: SelectedFilters = {} as Record<
    FilterKey,
    FilterValues
  >;

  for (const key in filters)
    selectedFilters[key as FilterKey] = searchParams.get(key)?.split(delimiter);

  const filteredCollection = collection.products.filter((product) => {
    const byMaterial =
      selectedFilters.material?.includes(product.material) ?? true;

    const byBestFor =
      selectedFilters.bestFor?.some((selectedFilter) =>
        product.bestFor.includes(selectedFilter),
      ) ?? true;

    return byMaterial && byBestFor;
  });

  const otherGender =
    hasGender && (type === genders[0].type ? genders[1] : genders[0]);

  const handleFilterMobileToggle = () => setFilterOpen(!isFilterOpen);

  return (
    <main className='py-10'>
      <div className='flex items-center mb-16'>
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
            <div className='flex justify-between px-4 mb-4'>
              <button
                className='lg:hidden flex items-center rounded-full border border-gray-light hover:border-silver-dark duration-[250ms] text-[9.5px] uppercase tracking-[0.7px] px-3.5 py-[3px]'
                onClick={handleFilterMobileToggle}
              >
                <span className=''>filters</span>
                <span className='pl-2 flex flex-col items-center gap-1'>
                  <span className='w-5 h-[1px] bg-gray relative before:absolute before:rounded-full before:w-[3px] before:h-[3px] before:border before:border-gray before:left-1/4 before:top-[-1px]' />
                  <span className='w-5 h-[1px] bg-gray relative before:absolute before:rounded-full before:w-[3px] before:h-[3px] before:border before:border-gray before:right-1/4 before:top-[-1px]' />
                </span>
              </button>

              {otherGender && (
                <span className='flex items-center rounded-full border border-gray text-[9.5px] uppercase tracking-[0.7px] lg:ml-auto'>
                  {genders.map((gender) =>
                    type === gender.type ? (
                      <span
                        key={gender.label}
                        className='bg-gray text-white border-2 border-gray-light px-3.5 py-[3px] font-semibold rounded-full'
                      >
                        {gender.label}
                      </span>
                    ) : (
                      <Link
                        key={gender.label}
                        to={'/collections/' + otherGender.type}
                        className='px-3.5 py-[3px]'
                      >
                        {otherGender.label}
                      </Link>
                    ),
                  )}
                </span>
              )}
            </div>

            <article className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-silver-2 md:bg-transparent'>
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
          <p className='text-[13px] self-start flex-grow text-center p-6'>
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
  );
};

export default Collections;
