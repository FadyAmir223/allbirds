import { UseQueryOptions } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { composeUri } from '@/utils/compose-uri.util';
import { collectionKeys } from './collection.key';
import { Collection, CollectionGender, Filters } from '..';

export type CollectionMainQuery = {
  type: string;
  gender?: CollectionGender;
};

export type CollectionQuery = CollectionMainQuery & {
  page?: number;
  limit?: number;
};

const collectionQuery = (
  query: CollectionQuery,
): UseQueryOptions<Collection> => ({
  queryKey: collectionKeys.type(query),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
});

const collectionFiltersQuery = (
  query: CollectionMainQuery,
): UseQueryOptions<Filters> => ({
  queryKey: collectionKeys.filters(query),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
});

const collectionSaleQuery = (
  query: CollectionQuery,
): UseQueryOptions<Collection> => ({
  queryKey: collectionKeys.sale(query),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
});

export {
  collectionKeys,
  collectionQuery,
  collectionFiltersQuery,
  collectionSaleQuery,
};
