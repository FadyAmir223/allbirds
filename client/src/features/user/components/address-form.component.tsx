import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { userKeys } from '../services/user.key'
import { LocationRes, Locations } from '../types/location.type'
import { Checkbox } from '@/features/collections'
import { axios } from '@/lib/axios'

type AddressFormProps = {
  initFormData?: FormData
}

type FormData = {
  address: string
  city: string
  country: string
  state: string
  company?: string
  phone: string
  isDefault?: boolean
}

const input = [
  { label: 'address', required: true },
  { label: 'city', required: true },
  { label: 'country', required: true },
  { label: 'state', required: true },
  { label: 'company', required: false },
  { label: 'phone', required: true },
] as const

export const AddressForm = ({ initFormData }: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: initFormData })

  const { mutate, isError, error } = useMutation({
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
  const onSubmit = (formData: FormData) => mutate(formData)

  return (
    <div className='mx-auto max-w-2xl'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-x-5 gap-y-3 md:grid-cols-2'>
          {input.map((field) => (
            <div key={field.label} className=''>
              <label
                htmlFor={field.label}
                className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
              >
                {field.label}
              </label>
              <input
                type='text'
                id={field.label}
                className={cn('w-full border border-transparent bg-white p-3', {
                  'border-red outline-0': errors[field.label],
                })}
                {...register(field.label, { required: field.required })}
              />
            </div>
          ))}

          <Checkbox
            id='isDefault'
            tag='set as default address'
            register={register}
          />
        </div>

        <LinkCustom
          styleType='black'
          element='button'
          className='mt-5 block w-full p-3.5 text-[10px]'
          disabled={isSubmitting}
        >
          add address
        </LinkCustom>
      </form>

      {isError && (
        <p className='text-[12px] text-red'>{getErrorMessage(error)}</p>
      )}

      {initFormData && (
        <button className='mt-2 text-[11.5px] uppercase underline'>
          cancle
        </button>
      )}

      <DevTool control={control} />
    </div>
  )
}
