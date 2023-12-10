import { ActionFunctionArgs } from 'react-router-dom'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { logUserState } from '..'
import { axios } from '@/lib/axios'

export const action = async (
  { request }: ActionFunctionArgs,
  dispatch: Dispatch<AnyAction>,
) => {
  const formData = await request.formData()
  const username = formData.get('email') as string
  const password = formData.get('password')

  if (!username || !password) return 'wrong email or password'
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
  if (!isEmailValid) return 'invalid email format'

  try {
    await axios.post('auth/local/login', { username, password })
    dispatch(logUserState(true))
    return null
  } catch (error) {
    return getErrorMessage(error)
  }
}
