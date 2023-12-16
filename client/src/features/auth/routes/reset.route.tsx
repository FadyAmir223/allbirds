import { useEffect, useState } from 'react'
import { useNavigate, useNavigation, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import Head from '@/components/head.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import type { FieldValues } from 'react-hook-form'
import { logUserState } from '..'
import { passwordValidations } from '../utils/passwordValidations'
import { axios } from '@/lib/axios'
import { useAppDispatch } from '@/store/hooks'

export type ResetFormData = {
  password: string
  confirmPassword: string
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetFormData>({ mode: 'onChange' })

  const [errorMessage, setErrorMessage] = useState('')
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    const timeout = setTimeout(() => setErrorMessage(''), 5000)
    return () => clearTimeout(timeout)
  }, [errorMessage])

  const onSubmit = async (formData: FieldValues) => {
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')

    try {
      const res: { email: string } = await axios.post('auth/password/reset', {
        ...formData,
        uid,
        token,
      })

      await axios.post('auth/local/login', {
        username: res.email,
        password: formData.password,
      })

      dispatch(logUserState(true))
      navigate('/account')
    } catch (error) {
      const message = getErrorMessage(error)
      setErrorMessage(message)
    }
  }

  return (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form'>
      <Head
        title={'reset password'}
        description='sustainable shoes & clothing'
      />

      <div className='mx-auto max-w-lg px-6 py-20'>
        <h1 className='mb-5 text-center text-xl font-bold uppercase'>
          reset account password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label
              className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
              htmlFor='password'
            >
              password
              <input
                className='w-full bg-white p-3'
                type='password'
                id='password'
                autoComplete='on'
                {...register('password', { validate: passwordValidations })}
              />
            </label>
            <p className='h-5 text-[11.5px] text-red'>
              {errors.password?.message}
            </p>
          </div>

          <div className='mb-3'>
            <label
              className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
              htmlFor='confirmPassword'
            >
              confirm password
              <input
                className='mt-1 w-full bg-white p-3'
                type='password'
                id='confirmPassword'
                {...register('confirmPassword', {
                  validate: {
                    isMatch: (confirmPassword, { password }) =>
                      password === confirmPassword || 'passwords do not match',
                  },
                })}
              />
            </label>
            <p className='h-5 text-[11.5px] text-red'>
              {errors.confirmPassword?.message}
            </p>
          </div>

          <LinkCustom
            element='button'
            styleType='black'
            className={cn(
              'mt-3 w-full p-4 text-sm font-normal uppercase duration-300',
              { 'pointer-events-none opacity-60': isSubmitting },
            )}
            disabled={isSubmitting}
          >
            reset password
          </LinkCustom>
        </form>

        <p className='mt-2 h-3 text-sm text-red'>{errorMessage}</p>
      </div>

      <DevTool control={control} />
    </main>
  )
}

export default ResetPassword
