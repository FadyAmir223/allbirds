import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import type { Locations } from '../types/location.type'
import { userKeys } from '../services/user.key'
import { axios } from '@/lib/axios'

export const useOptimisticDelete = () =>
  useMutation({
    mutationFn: (locationId: string) =>
      axios.delete(`user/locations/${locationId}`),
    onMutate: async (locationId: string) => {
      await queryClient.cancelQueries({ ...userKeys.locations(), exact: true })

      const oldLocations = queryClient.getQueryData(
        userKeys.locations(),
      ) as Locations

      const newLocatoins = {
        locations: oldLocations.locations.filter(
          ({ _id }) => _id !== locationId,
        ),
      }

      queryClient.setQueryData(userKeys.locations(), newLocatoins)
      return oldLocations
    },
    onError: (_, __, oldLocations) => {
      queryClient.setQueryData(userKeys.locations(), oldLocations)
    },
  })
