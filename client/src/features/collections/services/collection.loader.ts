import { LoaderFunctionArgs } from 'react-router-dom';

import { queryClient } from '@/lib/react-query';
import { collectionQuery, collectionFiltersQuery } from './collection.query';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const type = params.type || '';

  const Pcollection = queryClient.ensureQueryData(collectionQuery(type));
  const Pfilters = queryClient.ensureQueryData(collectionFiltersQuery(type));

  return await Promise.all([Pcollection, Pfilters]);
};
