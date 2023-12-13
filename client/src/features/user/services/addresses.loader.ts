import { queryClient } from '@/lib/react-query'
import { locationsQuery } from '../services/user.query'

export const loader = async () =>
  await queryClient.ensureQueryData(locationsQuery)
