import { SerachQuery } from './serach.query'

export const searchKeys = {
  main: ({ q, limit }: SerachQuery) => ['products', 'search', { q, limit }],
}
