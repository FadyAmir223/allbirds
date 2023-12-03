import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'

const EmailServiceForm = () => {
  const [errorMessage, setErrorMessage] = useState(false)
  const elForm = useRef<HTMLFormElement | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = elForm.current
    const email = form?.elements.namedItem('email') as HTMLInputElement | null

    if (!email?.value) return setErrorMessage(true)

    // ...
    // add to email service collection
  }

  const handleErrorHide = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => {
    if (!(event.target as HTMLElement).closest('#email-service'))
      setErrorMessage(false)
  }

  return (
    <section className='bg-brown px-6 py-9 text-gray' onClick={handleErrorHide}>
      <div className='mx-auto mb-8 w-full text-center sm:w-2/3'>
        <h3 className='mb-5 text-2xl font-bold capitalize'>want first dips?</h3>
        <p className='text-sm'>
          Join our email list and be the first to know about new limited edition
          products, material innovations, and lots of other fun updates.
        </p>
      </div>

      <div className='mx-auto mb-2 flex justify-center'>
        <div className='w-full sm:w-1/2' id='email-service'>
          <form
            className='flex flex-col gap-y-3 md:flex-row md:gap-x-3 md:gap-y-0'
            ref={elForm}
            onSubmit={handleSubmit}
          >
            <input
              type='text'
              name='email'
              placeholder='Enter Your Email Address'
              autoComplete='off'
              className={cn(
                'flex-grow border-2 border-transparent border-b-gray bg-white px-2 py-[8px] text-sm font-bold text-gray duration-200 focus:outline-0',
                {
                  'border-b-red-dark md:border-red-dark': errorMessage,
                },
              )}
            />
            <LinkCustom
              type='submit'
              element='button'
              className='w-full md:w-auto'
            >
              sign up
            </LinkCustom>
          </form>

          <span
            className={cn(
              'invisible text-[11px] font-bold tracking-[0.5px] text-red-dark',
              { visible: errorMessage },
            )}
          >
            Please use valid email address
          </span>
        </div>
      </div>

      <div className='text-center'>
        <span className='text-center text-[10px]'>
          Note: You can opt-out at any time. See our{' '}
          <Link to='/pages/privacy-policy' className='font-bold underline'>
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to='/pages/terms-of-use' className='font-bold underline'>
            Terms
          </Link>
          .
        </span>
      </div>
    </section>
  )
}

export default EmailServiceForm
