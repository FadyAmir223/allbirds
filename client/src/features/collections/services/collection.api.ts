import { axios } from '@/lib/axios';
import { composeUri } from '@/utils/compose-uri';
import { CollectionKeysType } from './collection.query';
import { type QueryFnArg } from '@/types/query.type';
import { type Collection } from '../types/collection.type';
import { type Filters } from '../types/filters.type';

const getCollection = ({ queryKey }: QueryFnArg): Promise<Collection> => {
  const [, queryParams] = queryKey as [string, CollectionKeysType];
  const { type } = queryParams;
  const mutableQuerey = [...queryKey];

  if (['mens', 'womens'].includes(type))
    mutableQuerey[1] = {
      ...queryParams,
      type: 'shoes',
      gender: type,
    };

  const uri = composeUri(mutableQuerey);
  return axios.get(uri);
};

const getCollectionFilters = ({ queryKey }: QueryFnArg): Promise<Filters> => {
  const [, , queryParams] = queryKey as [string, string, { type: string }];
  const { type } = queryParams;
  const mutableQuerey = [...queryKey];

  if (['mens', 'womens'].includes(type))
    mutableQuerey[2] = {
      ...queryParams,
      type: 'shoes',
      gender: type,
    };

  const uri = composeUri(mutableQuerey);
  return axios.get(uri);
};

export { getCollection, getCollectionFilters };
