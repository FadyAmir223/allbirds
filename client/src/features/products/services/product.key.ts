import { ProductReviewsQuery } from './product.query';

export const productKeys = {
  details: (name: string) => ['products', name],
  reviews: ({ name, pages = 1, limit = 3 }: ProductReviewsQuery) => [
    ...productKeys.addReview(name),
    { pages, limit },
  ],
  addReview: (name: string) => [...productKeys.details(name), 'reviews'],
  deleteReview: (name: string, id: string) => [
    ...productKeys.addReview(name),
    id,
  ],
};
