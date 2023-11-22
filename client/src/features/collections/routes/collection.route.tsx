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
import {
  collectionQuery,
  collectionFiltersQuery,
} from '../services/collection.query';
import { type Collection } from '../types/collection.type';
import {
  type FilterValues,
  type FilterKey,
  type Filters,
  type SelectedFilters,
} from '../types/filters.type';

const delimiter = '_';

const Collections = () => {
  const [isFilterOpen, setFilterOpen] = useState(true);
  const [searchParams] = useSearchParams();

  const params = useParams();
  const type = params.type || '';

  const [initCollection, initFilters] = useLoaderData() as [
    Collection,
    Filters,
  ];

  const [{ data: collection }, { data: filter }] = useQueries({
    queries: [
      { ...collectionQuery(type), initialData: initCollection },
      { ...collectionFiltersQuery(type), initialData: initFilters },
    ],
  });

  const { filters } = filter || {};
  if (!collection || !filters) return;

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

  const isGender = ['mens', 'womens'].includes(type);
  const otherGender = isGender && (type === 'mens' ? 'womens' : 'mens');

  const handleFilterMobileToggle = () => setFilterOpen(!isFilterOpen);

  return (
    <main className='py-10 flex items-center'>
      <SideBar
        filters={filters}
        selectedFilters={selectedFilters}
        delimiter={delimiter}
        isFilterOpen={isFilterOpen}
        handleFilterMobileToggle={handleFilterMobileToggle}
      />

      {filteredCollection.length !== 0 ? (
        <section className='flex-grow self-start'>
          {isGender && (
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

              <span className='flex items-center rounded-full border border-gray text-[9.5px] uppercase tracking-[0.7px] lg:ml-auto'>
                {[
                  { label: 'women', type: 'womens' },
                  { label: 'men', type: 'mens' },
                ].map(({ label, type }) =>
                  otherGender === type ? (
                    <span
                      key={label}
                      className='bg-gray text-white border-2 border-gray-light px-3.5 py-[3px] font-semibold rounded-full'
                    >
                      {label}
                    </span>
                  ) : (
                    <Link
                      key={label}
                      to={'/collections/' + otherGender}
                      className='px-3.5 py-[3px]'
                    >
                      {label}
                    </Link>
                  ),
                )}
              </span>
            </div>
          )}

          <article className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-silver-2 md:bg-transparent'>
            {filteredCollection.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
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

      {/* suggestions goes here */}
    </main>
  );
};

export default Collections;
