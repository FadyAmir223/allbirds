import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown) => {
  let message: string

  if (isAxiosError(error))
    message = error.response?.data.message || error.message
  else if (error instanceof Error) message = error.message
  else if (error && typeof error === 'object' && 'message' in error)
    message = String(error.message)
  else if (typeof error === 'string') message = error
  else message = 'something went wrong'

  return message
}
