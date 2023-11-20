import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <section className='bg-brown w-full h-[100dvh] grid place-items-center text-gray text-center'>
      <div>
        <h2 className='uppercase tracking-[2px] text-xl font-bold'>
          oh, nothing to see here
        </h2>
        <p className='mt-6 mb-4 text-sm'>
          The page you requested does not exist.
        </p>
        <Link to='/' className='capitalize underline text-sm'>
          go home
        </Link>
      </div>
    </section>
  );
};
