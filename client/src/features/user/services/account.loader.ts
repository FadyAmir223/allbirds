import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { queryClient } from '@/lib/react-query'
import { locationsQuery, ordersHistoryQuery, userQuery } from './user.query'

export const loader = async (
  { request }: LoaderFunctionArgs,
  isLoggedIn: boolean,
) => {
  if (!isLoggedIn) {
    const pathname = new URL(request.url).pathname
    const redirectPath = pathname ? `?redirectTo=${pathname}` : ''
    return redirect(`login${redirectPath}`)
  } else {
    const userP = queryClient.ensureQueryData(userQuery)
    const locationsP = queryClient.ensureQueryData(locationsQuery)
    const ordersHistoryP = queryClient.ensureQueryData(ordersHistoryQuery)
    return [
      ...(await Promise.all([userP, locationsP, ordersHistoryP])),
    ] as const
  }
}
