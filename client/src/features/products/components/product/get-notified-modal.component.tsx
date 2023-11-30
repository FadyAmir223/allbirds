import { FormEvent, useRef, useState } from 'react';

import BottomDrawer from '@/components/bottom-drawer.component';
import LinkCustom from '@/components/link-custom.component';
import { cn } from '@/utils/cn.util';
import type { ModalProps } from '../../types/modal.type';

const GetNotifiedModal = (props: ModalProps) => {
  const [isEmailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const elForm = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = elForm.current;
    const email = form?.elements.namedItem('email') as HTMLInputElement | null;

    if (!email?.value) return setErrorMessage(true);
    setEmailSent(true);

    // ...
    // add to email service collection
  };

  return (
    <BottomDrawer
      {...props}
      className='w-3/4 h-3/4 p-4 grid place-items-center'
    >
      {isEmailSent ? (
        <div className='text-center max-w-xl'>
          <h3 className='font-bold text-3xl mb-3'>It's Official</h3>
          <p className='text-sm'>
            We got your info, and we’re rooting for you. In the meantime, we’ll
            keep you in the loop about comfy, planet-friendly things.
          </p>
        </div>
      ) : (
        <div className=' text-center max-w-xl'>
          <h2 className='capitalize mb-4 font-bold text-2xl'>
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
                  'bg-white p-2 text-sm text-gray border-2 border-transparent border-gray focus:outline-0 font-bold duration-200 w-full',
                  {
                    'border-red-dark md:border-red-dark': errorMessage,
                  },
                )}
              />
              <span
                className={cn(
                  'text-[11px] font-bold tracking-[0.5px] text-red-dark invisible text-start block',
                  { visible: errorMessage },
                )}
              >
                Please use valid email address
              </span>
            </div>
            <LinkCustom element='button' className='p-2 w-full text-sm'>
              get notified
            </LinkCustom>
          </form>

          <p className='text-grayish-brown text-xs text-start'>
            Note: You can opt-out at any time. See our Privacy Policy and Terms
            below.
          </p>
        </div>
      )}
    </BottomDrawer>
  );
};

export default GetNotifiedModal;
