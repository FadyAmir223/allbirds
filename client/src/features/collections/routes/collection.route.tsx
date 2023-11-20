import { useParams, useLoaderData } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';

import ProductCard from '../components/product-card.component';
import {
  collectionQuery,
  collectionFiltersQuery,
} from '../services/collection.query';
import { type Collection } from '../types/collection.type';
import { type Filters } from '../types/filters.type';

const Collections = () => {
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

  // const hasGender = ['mens', 'womens'].includes(type);
  const { filters } = filter || {};
  if (!collection || !filters) return;

  return (
    <main className='py-10 relative'>
      <aside className='hidden lg:block absolute top-0 left-0 h-full p-4 w-[265px] text-gray'></aside>

      <section className='lg:ml-[265px] grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-silver-2 md:bg-transparent'>
        {collection.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </main>
  );
};

export default Collections;
