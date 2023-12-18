import { useRouteError } from 'react-router-dom'
import { getErrorMessage } from '@/utils/getErrorMessage.util'

const ErrorFallback = () => {
  const error = useRouteError()

  return <div>{getErrorMessage(error)}</div>
}

export default ErrorFallback
