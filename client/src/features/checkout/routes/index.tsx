import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { lazyImport } from '@/utils/lazy-import.util'

const Checkout = lazy(() => import('./checkout.route'))
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound')

export const CheckoutRoute = () => {
  return (
    <Route path='checkout' errorElement={<NotFound />}>
      <Route index element={<Checkout />} />
    </Route>
  )
}
