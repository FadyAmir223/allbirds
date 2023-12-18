import { ProductReviewsQuery } from './product.query'

export const productKeys = {
  main: ['products'],
  details: (name: string) => [...productKeys.main, name],
  review: (name: string) => [...productKeys.details(name), 'reviews'],
  reviews: ({ name, page = 1, limit = 3 }: ProductReviewsQuery) => [
    ...productKeys.review(name),
    { page, limit },
  ],
  search: (q: string, limit: number) => [
    ...productKeys.main,
    'search',
    { q, limit },
  ],
}
