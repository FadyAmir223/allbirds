import { UseQueryOptions } from '@tanstack/react-query'
import { composeUri } from '@/utils/compose-uri.util'
import type { Locations } from '../types/location.type'
import type { Orders } from '../types/order.type'
import type { User } from '../types/user.type'
import { userKeys } from './user.key'
import { axios } from '@/lib/axios'

const userQuery: UseQueryOptions<User> = {
  queryKey: userKeys.record,
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
  staleTime: Infinity,
}

const locationsQuery: UseQueryOptions<Locations> = {
  queryKey: userKeys.locations(),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
  staleTime: Infinity,
}

const ordersQuery: UseQueryOptions<Orders> = {
  queryKey: userKeys.orders(),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
  staleTime: Infinity,
}

const ordersHistoryQuery: UseQueryOptions<Orders> = {
  queryKey: userKeys.ordersHistory(),
  queryFn: ({ queryKey }) => axios.get(composeUri(queryKey)),
  staleTime: Infinity,
  retry: false,
}

export { userQuery, locationsQuery, ordersQuery, ordersHistoryQuery }
