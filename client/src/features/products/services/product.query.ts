import { UseQueryOptions } from '@tanstack/react-query'
import { composeUri } from '@/utils/compose-uri.util'
import { ProductDetailed, Reviews } from '..'
import { productKeys } from './product.key'
import { axios } from '@/lib/axios'

export type ProductReviewsQuery = {
  name: string
  page?: number
  limit?: number
}

const productQuery = (name: string): UseQueryOptions<ProductDetailed> => ({
  queryKey: productKeys.details(name),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
})

const productReviewsQuery = (
  query: ProductReviewsQuery,
): UseQueryOptions<Reviews> => ({
  queryKey: productKeys.reviews(query),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
})

export { productKeys, productQuery, productReviewsQuery }
