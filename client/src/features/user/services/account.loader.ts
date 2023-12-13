import { LoaderFunctionArgs } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import { locationsQuery, ordersHistoryQuery, userQuery } from './user.query'
import { authRedirect } from './authRedirect'

export const loader = async (
  { request }: LoaderFunctionArgs,
  isLoggedIn: boolean,
) => {
  if (!isLoggedIn) return authRedirect(request)

  const userP = queryClient.ensureQueryData(userQuery)
  const locationsP = queryClient.ensureQueryData(locationsQuery)
  const ordersHistoryP = queryClient.ensureQueryData(ordersHistoryQuery)
  return [...(await Promise.all([userP, locationsP, ordersHistoryP]))] as const
}
