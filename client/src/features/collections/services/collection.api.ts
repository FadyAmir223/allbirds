import { axios } from '@/lib/axios';
import { composeUri } from '@/utils/compose-uri';
import type { QueryFnArg } from '@/types/query.type';
import type { Collection } from '../types/collection.type';
import type { Filters } from '../types/filters.type';

const getCollection = ({ queryKey }: QueryFnArg): Promise<Collection> =>
  axios.get(composeUri(queryKey));

const getCollectionSale = ({ queryKey }: QueryFnArg): Promise<Collection> =>
  axios.get(composeUri(queryKey));

const getCollectionFilters = ({ queryKey }: QueryFnArg): Promise<Filters> =>
  axios.get(composeUri(queryKey));

export { getCollection, getCollectionSale, getCollectionFilters };
