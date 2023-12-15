import {
  keepPreviousData,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { composeUri } from '@/utils/compose-uri.util'
import screenSize from '@/data/screen-size.json'
import type { SearchRes, SerachProduct } from '../types/search.type'
import { productKeys } from '@/features/products'
import { axios } from '@/lib/axios'
import { Pagination } from '@/types/pagination.type'

export type SerachQuery = {
  q: string
  limit?: number
}

export const getSerachQuery = ({
  q,
  limit = innerWidth > screenSize.md ? 15 : 10,
}: SerachQuery): UseInfiniteQueryOptions<
  SearchRes,
  unknown,
  { products: SerachProduct[]; pagination: Pagination }
> => ({
  queryKey: productKeys.search(q, limit),
  queryFn: ({ queryKey, pageParam }) =>
    axios.get(composeUri(queryKey, { page: pageParam })),
  getNextPageParam: (last) => {
    const { page = 1, total = 0 } = last.pagination
    return page * limit < total ? page + 1 : undefined
  },
  select: (data) => ({
    products: data.pages.flatMap((page) => page.products),
    pagination: data.pages[data.pages.length - 1].pagination,
  }),
  initialPageParam: 1,
  gcTime: 1000 * 20,
  placeholderData: keepPreviousData,
})
