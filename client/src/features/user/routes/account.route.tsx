import { useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import Head from '@/components/head.component'
import {
  locationsQuery,
  ordersHistoryQuery,
  userQuery,
} from '../services/user.query'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { loader } from '../services/account.loader'
import { logUserState } from '@/features/auth'
import { axios } from '@/lib/axios'
import { useAppDispatch } from '@/store/hooks'

const Account = () => {
  const [message, setMessage] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [initUser, initLocations, initOrders] = useLoaderData() as Exclude<
    Awaited<ReturnType<typeof loader>>,
    Response
  >

  const [{ data: _user }, { data: _locations }, { data: _orders }] = useQueries(
    {
      queries: [
        { ...userQuery, initialData: initUser },
        { ...locationsQuery, initialData: initLocations },
        { ...ordersHistoryQuery, initialData: initOrders },
      ],
    },
  )

  const { user } = _user || {}
  const { locations } = _locations || {}
  const { orders } = _orders || {}
  if (!user || !locations || !orders) return

  const [location] = locations

  const handleLogout = async () => {
    try {
      await axios.post('auth/logout')
      dispatch(logUserState(false))
      navigate('/', { replace: true })
    } catch (error) {
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form py-20'>
      <Head title={'my account'} description='sustainable shoes & clothing' />

      <div className='mb-16 text-center'>
        <h1 className='pb-1  text-xl font-bold uppercase tracking-[1px]'>
          my account
        </h1>
        <button
          className='text-[11.5px] font-[500] uppercase underline'
          onClick={handleLogout}
        >
          logout
        </button>
        <p className='h-4 text-[11.5px] text-red'>{message}</p>
      </div>

      <div className='flex flex-col justify-between gap-y-6 px-10 lg:flex-row lg:gap-y-0'>
        {orders.length === 0 ? (
          <section>You haven't placed any orders yet.</section>
        ) : (
          <section className='w-full bg-white p-10 lg:w-2/5'></section>
        )}

        <section className='w-full bg-white p-10 lg:w-2/5'>
          <p className='mb-4 text-lg font-[500] capitalize'>{user.username}</p>
          <p className={cn({ 'mb-10': locations.length === 0 })}>
            {user.email}
          </p>

          {locations.length === 0 ? (
            <p>you haven't added an address yet</p>
          ) : (
            <div className='leading-6'>
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
            </div>
          )}

          <Link
            to='addresses'
            className='mt-5 inline-block text-[12px] uppercase underline'
          >
            add an address
          </Link>
        </section>
      </div>
    </main>
  )
}

export default Account
