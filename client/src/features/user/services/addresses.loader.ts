import { type LoaderFunctionArgs } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import { locationsQuery } from './user.query'
import { authRedirect } from './authRedirect'

export const loader = async (
  { request }: LoaderFunctionArgs,
  isLoggedIn: boolean,
) => {
  if (!isLoggedIn) return authRedirect(request)
  return await queryClient.ensureQueryData(locationsQuery)
}
