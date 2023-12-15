import { ProductReviewsQuery } from './product.query'

export const productKeys = {
  main: ['products'],
  details: (name: string) => [...productKeys.main, name],
  reviews: ({ name, page = 1, limit = 3 }: ProductReviewsQuery) => [
    ...productKeys.addReview(name),
    { page, limit },
  ],
  addReview: (name: string) => [...productKeys.details(name), 'reviews'],
  deleteReview: (name: string, id: string) => [
    ...productKeys.addReview(name),
    id,
  ],
  search: (q: string, limit: number) => [
    ...productKeys.main,
    'search',
    { q, limit },
  ],
}
