import { useReducer } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AddressForm } from '../components/address-form.component'
import BottomDrawer from '@/components/bottom-drawer.component'
import Head from '@/components/head.component'
import { locationsQuery } from '../services/user.query'
import { cn } from '@/utils/cn.util'
import { createAction } from '@/utils/createAction.util'
import type { Location } from '../types/location.type'
import { useOptimisticDelete } from '../hooks/useOptimisticDelete'
import { loader as addressesLoader } from '../services/addresses.loader'

type State = {
  isAdding: boolean
  isEditing: boolean
  isDelete: boolean
  addressToDelete: string
  addressToEdit: Location | null
}

type Action =
  | { type: 'SET_ADDRESS'; payload: State['addressToEdit'] }
  | { type: 'ADD' }
  | { type: 'EDIT'; payload: State['addressToEdit'] }
  | { type: 'CONFIRM_DELETE'; payload: State['addressToDelete'] }
  | { type: 'DELETE' }
  | { type: 'CANCEL_DELETE' }
  | { type: 'BACK' }

const initData: State = {
  isAdding: false,
  isEditing: false,
  isDelete: false,
  addressToDelete: '',
  addressToEdit: null,
}

const reducer = (state = initData, action: Action): State => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return { ...state, addressToEdit: action.payload }
    case 'ADD':
      return { ...state, isAdding: true }
    case 'EDIT':
      return { ...state, isEditing: true, addressToEdit: action.payload }
    case 'CONFIRM_DELETE':
      return { ...state, isDelete: true, addressToDelete: action.payload }
    case 'DELETE':
      return { ...state, isDelete: false }
    case 'CANCEL_DELETE':
      return { ...state, isDelete: false, addressToDelete: '' }
    case 'BACK':
      return {
        ...state,
        isAdding: false,
        isEditing: false,
        addressToEdit: null,
      }
    default:
      throw new Error('wrong type')
  }
}

const Addresses = () => {
  const initLocation = useLoaderData() as Exclude<
    Awaited<ReturnType<typeof addressesLoader>>,
    Response
  >
  const { data: _locations } = useQuery({
    ...locationsQuery,
    initialData: initLocation,
  })

  const { mutate: deleteAddress } = useOptimisticDelete()

  const [state, dispatch] = useReducer(reducer, initData)

  const { locations } = _locations || {}

  const toggleAdd = () => dispatch(createAction('ADD'))

  const handleEdit = (address: Location) =>
    dispatch(createAction('EDIT', address))

  const backToAddresses = () => dispatch(createAction('BACK'))

  const handleWantDelete = (addressId: string) =>
    dispatch(createAction('CONFIRM_DELETE', addressId))

  const handleDelete = () => {
    deleteAddress(state.addressToDelete)
    dispatch(createAction('DELETE'))
  }

  const cancelDelete = () => dispatch(createAction('CANCEL_DELETE'))

  return (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form px-3 py-16 sm:px-6'>
      <Head title={'my addresses'} description='sustainable shoes & clothing' />

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
          onClick={toggleAdd}
        >
          add new address
        </button>
      </div>

      <section className='mx-auto w-full'>
        {locations.length === 0 || state.isAdding || state.isEditing ? (
          <AddressForm
            initFormData={state.addressToEdit}
            backToAddresses={backToAddresses}
          />
        ) : (
          locations.map((location) => (
            <div
              key={location._id}
              className='mx-auto mb-4 max-w-md bg-white p-10 leading-7 last-of-type:mb-0'
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
                  onClick={() => handleEdit(location)}
                >
                  edit
                </button>
                <span className='mx-2'>|</span>
                <button
                  className='text-[11.5px] font-[500] uppercase tracking-[1px] underline'
                  onClick={() => handleWantDelete(location._id)}
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
        className='translate-y-[calc(50%+30dvh)] px-8 py-12 opacity-100 md:h-[40dvh] md:w-2/4'
        isOpen={state.isDelete}
        handleClose={cancelDelete}
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
            className='w-24 rounded-md bg-dark-form px-3 py-1.5'
            onClick={cancelDelete}
          >
            cancel
          </button>
        </div>
      </BottomDrawer>
    </main>
  )
}

export default Addresses
