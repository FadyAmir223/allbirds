import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AddressForm } from '../components/address-form.component'
import BottomDrawer from '@/components/bottom-drawer.component'
import { locationsQuery } from '../services/user.query'
import { cn } from '@/utils/cn.util'
import { loader } from '../services/addresses.loader'

const Addresses = () => {
  const initLocation = useLoaderData() as Awaited<ReturnType<typeof loader>>
  const { data: _locations } = useQuery({
    ...locationsQuery,
    initialData: initLocation,
  })

  const [isModalOpen, setModalOpen] = useState(false)

  const { locations } = _locations || {}

  const toggleModal = () => setModalOpen(!isModalOpen)

  const handleEdit = () => {}

  const handleDelete = () => {}

  return (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form py-16'>
      <div className='mb-16 text-center'>
        <h1 className='mb-3 pb-1 text-xl font-bold uppercase tracking-[1px]'>
          my addresses
        </h1>
        <button
          className={cn(
            'text-[11px] font-[500] uppercase tracking-[1.5px] underline',
            {
              'pointer-events-none': locations.length === 0,
            },
          )}
        >
          add new address
        </button>
      </div>

      <section className='mx-auto w-full'>
        {locations.length === 0 ? (
          <AddressForm />
        ) : (
          locations.map((location) => (
            <div
              key={location._id}
              className='mx-auto max-w-md bg-white p-10 leading-7'
            >
              <p>
                <span className='mr-2 font-[500] capitalize'>address:</span>
                {location.address}
              </p>
              <p>
                <span className='mr-2 font-[500] capitalize'>city:</span>
                {location.city}
              </p>
              <p>
                <span className='mr-2 font-[500] capitalize'>country:</span>
                {location.country}
              </p>
              <p>
                <span className='mr-2 font-[500] capitalize'>company:</span>
                {location.company}
              </p>
              <p>
                <span className='mr-2 font-[500] capitalize'>phone:</span>
                {location.phone}
              </p>

              <div className='mt-5'>
                <button
                  className='text-[11.5px] font-[500] uppercase tracking-[1px] underline'
                  onClick={handleEdit}
                >
                  edit
                </button>
                <span className='mx-2'>|</span>
                <button
                  className='text-[11.5px] font-[500] uppercase tracking-[1px] underline'
                  onClick={toggleModal}
                >
                  delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <Link
        to='..'
        className='mt-16 block text-center text-[11px] font-[500] uppercase tracking-[1.5px] underline'
      >
        back to account
      </Link>

      <BottomDrawer
        className='px-8 py-12 md:h-[40dvh] md:w-2/4'
        isOpen={isModalOpen}
        handleClose={toggleModal}
      >
        <h3 className='mb-2 text-xl font-bold'>Confirm Delete</h3>
        <p className='mb-10 capitalize'>
          are you sure you want to delete this address?
        </p>
        <div className='text-end'>
          <button
            className='mr-4 w-24 rounded-md bg-red px-3 py-1.5 text-white'
            onClick={handleDelete}
          >
            delete
          </button>
          <button
            className='w-24 rounded-md bg-silver px-3 py-1.5'
            onClick={toggleModal}
          >
            cancel
          </button>
        </div>
      </BottomDrawer>
    </main>
  )
}

export default Addresses
