import { UseInfiniteQueryOptions } from '@tanstack/react-query'
import { composeUri } from '@/utils/compose-uri.util'
import screenSize from '@/data/screen-size.json'
import type { SearchRes, SerachProduct } from '../types/search.type'
import { searchKeys } from './search.key'
import { axios } from '@/lib/axios'

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
  SerachProduct[]
> => ({
  queryKey: searchKeys.main({ q, limit }),
  queryFn: ({ queryKey, pageParam }) => {
    if (Array.isArray(queryKey)) queryKey[queryKey.length - 1].page = pageParam
    return axios.get(composeUri(queryKey))
  },
  getNextPageParam: (last) => {
    const { page, total } = last.pagination
    return page * limit < total ? page + 1 : undefined
  },
  select: (data) => data.pages.flatMap((page) => page.products),
  initialPageParam: 1,
})
