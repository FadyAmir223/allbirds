import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import type { Location } from '../types/location.type'
import { useAddAddress } from '../hooks/useOptimisticAdd'
import { useOptimisticEdit } from '../hooks/useOptimisticEdit'
import { Checkbox } from '@/features/collections'

type AddressFormProps = {
  initFormData: Location | null
  backToAddresses: () => void
}

export type FormData = {
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

export const AddressForm = ({
  initFormData,
  backToAddresses,
}: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: initFormData || undefined })

  const {
    mutate: addAddress,
    isError: isErrorAdd,
    error: errorAdd,
  } = useAddAddress()

  const {
    mutate: editAddress,
    isError: isErrorEdit,
    error: errorEdit,
  } = useOptimisticEdit()

  const onSubmit = (formData: FormData) => {
    initFormData
      ? editAddress({ formData, addressId: initFormData._id })
      : addAddress(formData)

    backToAddresses()
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-x-5 gap-y-3 md:grid-cols-2'>
          {input.map((field) => (
            <div key={field.label}>
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

      {isErrorAdd ||
        (isErrorEdit && (
          <p className='text-[12px] text-red'>
            {getErrorMessage(errorAdd || errorEdit)}
          </p>
        ))}

      {initFormData && (
        <button
          className='mt-2 text-[11.5px] uppercase underline'
          onClick={backToAddresses}
        >
          cancel
        </button>
      )}

      <DevTool control={control} />
    </div>
  )
}
