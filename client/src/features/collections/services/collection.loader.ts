import { LoaderFunctionArgs } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';

import {
  collectionQuery,
  collectionFiltersQuery,
  collectionKeys,
} from './collection.query';
import { refactorCollectionsToSlides } from '@/features/misc';
import { ensureType } from '../utils/ensureType';
import { type Filters, type Collection } from '..';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const type = params.type as string;
  const queries = ensureType(type);
  const otherGender = queries.gender && (type === 'mens' ? 'womens' : 'mens');

  const promises = [];
  const collectionP = queryClient.ensureQueryData(collectionQuery(queries));
  const filtersP = queryClient.ensureQueryData(collectionFiltersQuery(queries));
  promises.push(collectionP, filtersP);

  let suggestions: Collection | undefined;

  if (otherGender) {
    suggestions = queryClient.getQueryData(
      collectionKeys.type({ ...queries, gender: otherGender }),
    );

    if (!suggestions) {
      const suggestionsP = queryClient.ensureQueryData(
        collectionQuery({ ...queries, gender: otherGender, limit: 5 }),
      );
      promises.push(suggestionsP);
    }
  }

  const responses = (await Promise.all(promises)) as [
    Collection,
    Filters,
    Collection,
  ];

  const [collection, filters] = responses;

  if (!suggestions) suggestions = responses[2];

  const suggestionSlides = refactorCollectionsToSlides([
    collection,
    suggestions,
  ]);

  return [collection, filters, suggestionSlides];
};
