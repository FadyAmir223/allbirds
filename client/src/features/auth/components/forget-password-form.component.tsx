import { FormEvent, useEffect, useRef, useState } from 'react'
import BottomDrawer from '@/components/bottom-drawer.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { axios } from '@/lib/axios'

type ForgetPasswordFormProps = {
  toggleForgetPassword: () => void
}

export const ForgetPasswordForm = ({
  toggleForgetPassword,
}: ForgetPasswordFormProps) => {
  const [message, setMessage] = useState({ success: '', error: '' })
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const elForm = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    const timeout = setTimeout(
      () => setMessage({ ...message, error: '' }),
      5000,
    )
    return () => clearTimeout(timeout)
  }, [message.error]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(elForm.current!)
    const email = formData.get('email') as string

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isEmailValid)
      return setMessage({ ...message, error: 'invalid email format' })

    try {
      setSubmitting(true)
      const res = await axios.post('auth/password/request-reset-token', {
        email,
      })

      setMessage({ ...message, success: getErrorMessage(res) })
      setDrawerOpen(true)
    } catch (error) {
      setMessage({ ...message, error: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className='mb-5 text-2xl font-bold uppercase'>reset your password</h1>

      <form ref={elForm} noValidate onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
            htmlFor='email'
          >
            email
          </label>
          <input
            className='w-full bg-white p-3'
            type='email'
            name='email'
            id='email'
            autoComplete='off'
          />
          <p className='mt-1 h-5 text-[11.5px] text-red'>{message.error}</p>
        </div>

        <button
          className={cn(
            'w-full cursor-pointer bg-black p-4 text-sm uppercase text-white',
            { 'pointer-events-none opacity-60': isSubmitting },
          )}
          disabled={isSubmitting}
        >
          submit
        </button>
      </form>

      <button
        className='mt-6 text-[11.5px] uppercase tracking-[0.5px] underline'
        onClick={toggleForgetPassword}
      >
        cancel
      </button>

      <BottomDrawer
        isOpen={isDrawerOpen}
        handleClose={toggleForgetPassword}
        className='grid place-items-center text-center text-xl md:h-2/5 md:w-1/2'
      >
        {message.success}
      </BottomDrawer>
    </>
  )
}
