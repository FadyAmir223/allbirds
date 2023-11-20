import { UseQueryOptions } from '@tanstack/react-query';

import { getCollection, getCollectionFilters } from './collection.api';
import { type Collection } from '../types/collection.type';
import { type Filters } from '../types/filters.type';

export type CollectionKeysType = {
  type: string;
  page?: number;
  limit?: number;
};

const collectionKeys = {
  all: ['collections'],
  type: ({ type, page = 1, limit = 6 }: CollectionKeysType) => [
    ...collectionKeys.all,
    { type, page, limit },
  ],
  filters: (type: string) => [...collectionKeys.all, 'filters', { type }],
};

const collectionQuery = (type: string): UseQueryOptions<Collection> => ({
  queryKey: collectionKeys.type({ type }),
  queryFn: getCollection,
});

const collectionFiltersQuery = (type: string): UseQueryOptions<Filters> => ({
  queryKey: collectionKeys.filters(type),
  queryFn: getCollectionFilters,
});

export { collectionKeys, collectionQuery, collectionFiltersQuery };
