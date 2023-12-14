import type { CollectionQuery } from '.'

export const collectionKeys = {
  all: ['collections'],
  type: ({ type, gender, page = 1, limit = 20 }: CollectionQuery) => [
    ...collectionKeys.all,
    { type, gender, page, limit },
  ],
  sale: ({ type, gender, page = 1, limit = 20 }: CollectionQuery) => [
    ...collectionKeys.all,
    'sale',
    { type, gender, page, limit },
  ],
}
