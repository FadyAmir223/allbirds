import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { type FormData } from '../components/address-form.component'
import type { LocationRes, Locations } from '../types/location.type'
import { userKeys } from '../services/user.key'
import { axios } from '@/lib/axios'

export const useAddAddress = () =>
  useMutation({
    mutationFn: (formData: FormData): Promise<LocationRes> =>
      axios.post('user/locations', formData),
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ ...userKeys.locations(), exact: true })

      const oldLocations = queryClient.getQueryData(
        userKeys.locations(),
      ) as Locations

      queryClient.setQueryData(userKeys.locations(), {
        locations: [...oldLocations.locations, { ...formData, _id: '0' }],
      })

      return oldLocations
    },
    onError: (_, __, oldLocations) => {
      queryClient.setQueryData(userKeys.locations(), oldLocations)
    },
    onSettled: (newLocation) => {
      queryClient.setQueryData(userKeys.locations(), (updater: Locations) => ({
        locations: [...updater.locations.slice(0, -1), newLocation?.location],
      }))
    },
  })
