import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import Head from '@/components/head.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { logUserState } from '..'
import { passwordValidations } from '../utils/passwordValidations'
import { Checkbox } from '@/features/collections'
import { axios } from '@/lib/axios'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export type RegisterFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  emailService: boolean
}

const inputs = [
  {
    label: 'first name',
    id: 'firstName',
    type: 'text',
    required: false,
  },
  {
    label: 'last name',
    id: 'lastName',
    type: 'text',
    required: false,
  },
  {
    label: 'email',
    id: 'email',
    type: 'email',
    required: true,
  },
  {
    label: 'password',
    id: 'password',
    type: 'password',
    required: true,
  },
  {
    label: 'confirm password',
    id: 'confirmPassword',
    type: 'password',
    required: true,
  },
  {
    label: 'Email me with news and offers',
    id: 'emailService',
    type: 'checkbox',
    required: false,
  },
] as const

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailService: true,
    },
  })

  const [searchParams] = useSearchParams()
  const { isLoggedIn } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: (formData: RegisterFormData) =>
      axios.post('auth/local/register', formData),
    onSuccess: () => {
      dispatch(logUserState(true))
    },
  })

  const onSubmit = (formData: RegisterFormData) => mutate(formData)

  return isLoggedIn ? (
    <Navigate to={searchParams.get('redirectTo') || '/account'} replace />
  ) : (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form'>
      <Head title={'register'} description='sustainable shoes & clothing' />

      <div className='mx-auto max-w-xl px-6 py-20'>
        <h1 className='mb-5 text-2xl font-bold uppercase'>create an account</h1>
        <p className='mb-3 text-sm'>We never save credit card information.</p>
        <p className='mb-8 text-sm'>
          Registering makes checkout fast and easy and saves your order
          information in your account.
        </p>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {inputs.map((input) => (
            <div key={input.id} className='mb-4'>
              {input.type === 'checkbox' ? (
                <Checkbox id={input.id} tag={input.label} register={register} />
              ) : (
                <>
                  <label
                    className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
                    htmlFor={input.id}
                  >
                    {input.label}
                    {input.required && (
                      <span className='text-sm text-red'>*</span>
                    )}
                  </label>
                  <input
                    className='w-full bg-white p-3'
                    autoComplete='off'
                    type={input.type}
                    {...register(input.id, {
                      required: {
                        value: input.required,
                        message: `${input.label} is required`,
                      },

                      ...(input.label === 'email'
                        ? {
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email format',
                            },
                          }
                        : {}),

                      ...(input.label === 'password'
                        ? {
                            validate: passwordValidations,
                          }
                        : {}),

                      ...(input.id === 'confirmPassword'
                        ? {
                            validate: {
                              isMatch: (confirmPassword, { password }) =>
                                password === confirmPassword ||
                                'passwords do not match',
                            },
                          }
                        : {}),
                    })}
                  />
                </>
              )}
              <p className='mt-1 h-5 text-[11.5px] text-red'>
                {errors[input.id]?.message}
              </p>
            </div>
          ))}

          <LinkCustom
            element='button'
            styleType='black'
            className={cn(
              'w-full p-4 text-sm font-normal uppercase duration-300',
              { 'pointer-events-none opacity-60': isPending },
            )}
            disabled={isPending}
          >
            register
          </LinkCustom>

          <p className='mt-2 h-5 text-[12px] text-red'>
            {isError && getErrorMessage(error)}
          </p>
        </form>

        <p className='inline-block text-sm capitalize'>
          already have an account?
          <Link
            className='ml-1.5 inline-block text-blue-400 underline'
            to='/account/login'
          >
            login
          </Link>
        </p>

        <DevTool control={control} />
      </div>
    </main>
  )
}

export default Register
