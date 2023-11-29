import { FormEvent, MouseEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import LinkCustom from '@/components/link-custom.component';
import { cn } from '@/utils/cn.util';

const EmailServiceForm = () => {
  const [errorMessage, setErrorMessage] = useState(false);
  const elForm = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = elForm.current;
    const email = form?.elements.namedItem('email') as HTMLInputElement | null;

    if (!email?.value) return setErrorMessage(true);

    // ...
    // add to email service collection
  };

  const handleErrorHide = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => {
    if (!(event.target as HTMLElement).closest('#email-service'))
      setErrorMessage(false);
  };

  return (
    <section className='px-6 py-9 bg-brown text-gray' onClick={handleErrorHide}>
      <div className='w-full sm:w-2/3 mb-8 text-center mx-auto'>
        <h3 className='capitalize text-2xl mb-5 font-bold'>want first dips?</h3>
        <p className='text-sm'>
          Join our email list and be the first to know about new limited edition
          products, material innovations, and lots of other fun updates.
        </p>
      </div>

      <div className='mb-2 flex justify-center mx-auto'>
        <div className='w-full sm:w-1/2' id='email-service'>
          <form
            className='flex gap-y-3 md:gap-y-0 md:gap-x-3 flex-col md:flex-row'
            ref={elForm}
            onSubmit={handleSubmit}
          >
            <input
              type='text'
              name='email'
              placeholder='Enter Your Email Address'
              autoComplete='off'
              className={cn(
                'bg-white py-[8px] px-2 text-sm text-gray border-2 border-transparent border-b-gray focus:outline-0 font-bold flex-grow duration-200',
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
              'text-[11px] font-bold tracking-[0.5px] text-red-dark invisible',
              { visible: errorMessage },
            )}
          >
            Please use valid email address
          </span>
        </div>
      </div>

      <div className='text-center'>
        <span className='text-[10px] text-center'>
          Note: You can opt-out at any time. See our{' '}
          <Link to='/pages/privacy-policy' className='underline font-bold'>
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to='/pages/terms-of-use' className='underline font-bold'>
            Terms
          </Link>
          .
        </span>
      </div>
    </section>
  );
};

export default EmailServiceForm;
