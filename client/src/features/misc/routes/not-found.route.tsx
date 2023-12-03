import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <section className='grid h-[100dvh] w-full place-items-center bg-brown text-center text-gray'>
      <div>
        <h2 className='text-xl font-bold uppercase tracking-[2px]'>
          oh, nothing to see here
        </h2>
        <p className='mb-4 mt-6 text-sm'>
          The page you requested does not exist.
        </p>
        <Link to='/' className='text-sm capitalize underline'>
          go home
        </Link>
      </div>
    </section>
  )
}
