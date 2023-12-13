import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { type FormData } from '../components/address-form.component'
import type { Locations } from '../types/location.type'
import { userKeys } from '../services/user.key'
import { axios } from '@/lib/axios'

type MutationArgs = {
  formData: FormData
  addressId: string
}

export const useOptimisticEdit = () =>
  useMutation({
    mutationFn: ({ formData, addressId }: MutationArgs) =>
      axios.patch(`user/locations/${addressId}`, formData),
    onMutate: async ({ formData, addressId }) => {
      await queryClient.cancelQueries({ ...userKeys.locations(), exact: true })

      const oldLocations = queryClient.getQueryData(
        userKeys.locations(),
      ) as Locations

      const newLocations = {
        locations: oldLocations.locations.map((location) =>
          location._id === addressId ? { ...location, ...formData } : location,
        ),
      }

      queryClient.setQueryData(userKeys.locations(), newLocations)

      return oldLocations
    },
    onError: (_, __, oldLocations) => {
      queryClient.setQueryData(userKeys.locations(), oldLocations)
    },
  })
