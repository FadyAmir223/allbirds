import { redirect } from 'react-router-dom'

export const authRedirect = (request: Request) => {
  const pathname = new URL(request.url).pathname
  const redirectPath = pathname ? `?redirectTo=${pathname}` : ''
  return redirect(`/account/login/${redirectPath}`)
}
