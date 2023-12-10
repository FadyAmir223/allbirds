import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { axios } from '@/lib/axios'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  try {
    await axios.post('auth/password/verify-reset-token', { uid, token })
    return null
  } catch {
    throw redirect('/account/login')
  }
}
