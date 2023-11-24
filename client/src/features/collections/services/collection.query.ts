import { UseQueryOptions } from '@tanstack/react-query';

import {
  getCollection,
  getCollectionFilters,
  getCollectionSale,
} from './collection.api';
import type { Collection } from '../types/collection.type';
import type { Filters } from '../types/filters.type';
import type { CollectionGender } from '..';

export type CollectionMainQueries = {
  type: string;
  gender?: CollectionGender;
};

export type CollectionQueries = CollectionMainQueries & {
  page?: number;
  limit?: number;
};

const collectionKeys = {
  all: ['collections'],
  type: ({ type, gender, page = 1, limit = 25 }: CollectionQueries) => [
    ...collectionKeys.all,
    { type, gender, page, limit },
  ],
  filters: ({ type, gender }: CollectionMainQueries) => [
    ...collectionKeys.all,
    'filters',
    { type, gender },
  ],
  sale: ({ type, gender, page = 1, limit = 5 }: CollectionQueries) => [
    ...collectionKeys.all,
    'sale',
    { type, gender, page, limit },
  ],
};

const collectionQuery = (
  queries: CollectionQueries,
): UseQueryOptions<Collection> => ({
  queryKey: collectionKeys.type(queries),
  queryFn: getCollection,
});

const collectionFiltersQuery = (
  queries: CollectionMainQueries,
): UseQueryOptions<Filters> => ({
  queryKey: collectionKeys.filters(queries),
  queryFn: getCollectionFilters,
});

const collectionSaleQuery = (
  queries: CollectionQueries,
): UseQueryOptions<Collection> => ({
  queryKey: collectionKeys.sale(queries),
  queryFn: getCollectionSale,
});

export {
  collectionKeys,
  collectionQuery,
  collectionFiltersQuery,
  collectionSaleQuery,
};
