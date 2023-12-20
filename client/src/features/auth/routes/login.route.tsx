import { useState } from 'react'
import {
  Form,
  Link,
  Navigate,
  useActionData,
  useNavigation,
  useSearchParams,
} from 'react-router-dom'
import GoogleSvg from '@/assets/svg/google.svg?react'
import { FaFacebook } from 'react-icons/fa'
import { ForgetPasswordForm } from '../components/forget-password-form.component'
import Head from '@/components/head.component'
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
      <Head title={'login'} description='sustainable shoes & clothing' />

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
                  {ErrorMessage && 'wrong email or password'}
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

            <span className='relative my-2 block h-6 before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-full before:bg-black after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-dark-form after:px-5 after:content-["or"]' />

            <div>
              <a
                href='/api/auth/google'
                className='mb-3 flex w-full items-center justify-center rounded-full bg-white p-2 duration-150 hover:opacity-90'
              >
                <span className='mr-2 h-5 w-5'>
                  <GoogleSvg />
                </span>
                Sign in with Google
              </a>

              <a
                href='/api/auth/facebook'
                className='flex w-full items-center justify-center rounded-full bg-[#1877f2] p-2 text-white duration-150 hover:opacity-90'
              >
                <span className='mr-2 scale-[1.35]'>
                  <FaFacebook />
                </span>
                Sign in with Google
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Login
