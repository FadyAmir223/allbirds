import { useState } from 'react'
import {
  Form,
  Link,
  Navigate,
  useActionData,
  useNavigation,
  useSearchParams,
} from 'react-router-dom'
import { ForgetPasswordForm } from '../components/forget-password-form.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { useAppSelector } from '@/store/hooks'

const Login = () => {
  const [forgetPassword, setForgetPassword] = useState(false)
  const ErrorMessage = useActionData() as string
  const { isLoggedIn } = useAppSelector((state) => state.user)
  const [searchParams] = useSearchParams()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  const toggleForgetPassword = () => setForgetPassword(!forgetPassword)

  return isLoggedIn ? (
    <Navigate to={searchParams.get('redirectTo') || '/account'} replace />
  ) : (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form'>
      <div className='mx-auto max-w-xl px-6 py-20'>
        {forgetPassword ? (
          <ForgetPasswordForm toggleForgetPassword={toggleForgetPassword} />
        ) : (
          <>
            <h1 className='mb-5 text-2xl font-bold uppercase'>login</h1>

            <Form noValidate replace method='post'>
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
                <p className='mt-1 h-2 text-[11.5px] text-red'>
                  {ErrorMessage}
                </p>
              </div>

              <div className='mb-8'>
                <label
                  className='mb-1 block text-[12px] font-bold uppercase tracking-[1px]'
                  htmlFor='password'
                >
                  password
                </label>
                <input
                  className='w-full bg-white p-3'
                  type='password'
                  name='password'
                  id='password'
                />
              </div>

              <LinkCustom
                element='button'
                styleType='black'
                className={cn(
                  'w-full p-4 text-sm font-normal uppercase duration-300',
                  { 'pointer-events-none opacity-60': isSubmitting },
                )}
                disabled={isSubmitting}
              >
                sign in
              </LinkCustom>
            </Form>

            <button
              className='mb-4 mt-6 block text-[11.5px] uppercase tracking-[0.5px] underline'
              onClick={toggleForgetPassword}
            >
              forgot password
            </button>

            <p className='inline-block text-sm capitalize'>
              new to allbirds?
              <Link
                className='ml-1.5 inline-block text-blue-400 underline'
                to='/account/register'
              >
                register
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default Login
