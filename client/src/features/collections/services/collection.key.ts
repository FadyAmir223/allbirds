import type { CollectionMainQuery, CollectionQuery } from '.';

export const collectionKeys = {
  all: ['collections'],
  type: ({ type, gender, page = 1, limit = 20 }: CollectionQuery) => [
    ...collectionKeys.all,
    { type, gender, page, limit },
  ],
  filters: ({ type, gender }: CollectionMainQuery) => [
    ...collectionKeys.all,
    'filters',
    { type, gender },
  ],
  sale: ({ type, gender, page = 1, limit = 5 }: CollectionQuery) => [
    ...collectionKeys.all,
    'sale',
    { type, gender, page, limit },
  ],
};
