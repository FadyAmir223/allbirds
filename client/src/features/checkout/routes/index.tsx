import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { lazyImport } from '@/utils/lazy-import.util'
import { loader } from '../services/loader'
import { useAppSelector } from '@/store/hooks'

const Checkout = lazy(() => import('./checkout.route'))
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound')

export const CheckoutRoute = () => {
  // if (cart.items.length === 0) navigate('/')
  const totalAmount = useAppSelector((state) => state.cart.totalAmount)

  return (
    <Route
      path='checkout'
      errorElement={<NotFound />}
      loader={() => loader(totalAmount)}
    >
      <Route index element={<Checkout />} />
    </Route>
  )
}
