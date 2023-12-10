import { LoaderFunctionArgs, redirect } from 'react-router-dom'

export const loader = (
  { request }: LoaderFunctionArgs,
  isLoggedIn: boolean,
) => {
  if (isLoggedIn) return null

  const pathname = new URL(request.url).pathname
  const redirectPath = pathname ? `?redirectTo=${pathname}` : ''
  return redirect(`login${redirectPath}`)
}
