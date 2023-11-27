import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

import { axios } from '@/lib/axios';
import { composeUri } from '@/utils/compose-uri.util';
import { productKeys } from './product.key';
import { ProductDetailed, Reviews } from '..';

export type ProductReviewsQuery = {
  name: string;
  pages?: number;
  limit?: number;
};

const productQuery = (name: string): UseQueryOptions<ProductDetailed> => ({
  queryKey: productKeys.details(name),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
});

const productReviewsQuery = (
  query: ProductReviewsQuery,
): UseQueryOptions<Reviews> => ({
  queryKey: productKeys.reviews(query),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
});

const addProductReviewQuery = (name: string): UseMutationOptions => ({
  mutationFn: (data) =>
    axios.post(composeUri(productKeys.addReview(name)), data),
});

const deleteProductReviewQuery = (
  name: string,
  id: string,
): UseMutationOptions => ({
  mutationFn: () =>
    axios.delete(composeUri(productKeys.deleteReview(name, id))),
});

export {
  productKeys,
  productQuery,
  productReviewsQuery,
  addProductReviewQuery,
  deleteProductReviewQuery,
};
