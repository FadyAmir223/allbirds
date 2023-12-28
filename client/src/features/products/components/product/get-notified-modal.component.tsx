import { useRef, useState } from 'react'
import BottomDrawer from '@/components/bottom-drawer.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import type { FormEvent } from 'react'
import type { ModalProps } from '../../types/modal.type'

const GetNotifiedModal = (props: ModalProps) => {
  const [isEmailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const elForm = useRef<HTMLFormElement | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(elForm.current!)
    const email = formData.get('email') as string

    if (!email) return setErrorMessage(true)
    setEmailSent(true)

    // ...
    // add to email service collection
  }

  return (
    <BottomDrawer
      className='grid translate-y-[calc(65%+2.5dvh)] place-items-center p-4 md:h-3/4 md:w-3/4'
      {...props}
    >
      {isEmailSent ? (
        <div className='max-w-xl text-center'>
          <h3 className='mb-3 text-3xl font-bold'>It's Official</h3>
          <p className='text-sm'>
            We got your info, and we’re rooting for you. In the meantime, we’ll
            keep you in the loop about comfy, planet-friendly things.
          </p>
        </div>
      ) : (
        <div className=' max-w-xl text-center'>
          <h2 className='mb-4 text-2xl font-bold capitalize'>
            colors always come and go
          </h2>
          <p className='mb-6'>
            Once limited edition colors sell out, they’re gone for good. But on
            the upside, new colors aren’t far behind. Sign up and we’ll let you
            know when they’re here, along with other fun updates.
          </p>

          <form className='mb-3' ref={elForm} onSubmit={handleSubmit}>
            <div className='mb-2'>
              <input
                type='text'
                name='email'
                placeholder='Enter Your Email Address'
                autoComplete='off'
                className={cn(
                  'w-full border-2 border-gray border-transparent bg-white p-2 text-sm font-bold text-gray duration-200 focus:outline-0',
                  {
                    'border-red-dark md:border-red-dark': errorMessage,
                  },
                )}
              />
              <span
                className={cn(
                  'invisible block text-start text-[11px] font-bold tracking-[0.5px] text-red-dark',
                  { visible: errorMessage },
                )}
              >
                Please use valid email address
              </span>
            </div>
            <LinkCustom element='button' className='w-full p-2 text-sm'>
              get notified
            </LinkCustom>
          </form>

          <p className='text-start text-xs text-grayish-brown'>
            Note: You can opt-out at any time. See our Privacy Policy and Terms
            below.
          </p>
        </div>
      )}
    </BottomDrawer>
  )
}

export default GetNotifiedModal
