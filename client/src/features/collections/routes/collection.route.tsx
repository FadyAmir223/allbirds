import { useParams, useLoaderData, useSearchParams } from 'react-router-dom';
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

  console.log(filteredCollection.length);

  return (
    <main className='py-10 flex items-center'>
      <SideBar
        filters={filters}
        selectedFilters={selectedFilters}
        delimiter={delimiter}
      />

      {filteredCollection.length !== 0 ? (
        <section className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-silver-2 md:bg-transparent flex-grow self-start'>
          {filteredCollection.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              selectedFilters={selectedFilters}
            />
          ))}
        </section>
      ) : (
        <p className='text-[13px] self-start flex-grow text-center p-6'>
          Sorry, there are no results
        </p>
      )}
    </main>
  );
};

export default Collections;
