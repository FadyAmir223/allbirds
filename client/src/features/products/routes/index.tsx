import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { lazyImport } from '@/utils/lazy-import.util'
import { loader as productLoader } from '../services/product.loader'

const Product = lazy(() => import('./product.route'))
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound')

export const ProductRoute = () => {
  return (
    <Route path='products'>
      <Route index element={<Navigate to='/' replace />} />
      <Route
        path=':productName'
        element={<Product />}
        errorElement={<NotFound />}
        loader={productLoader}
      />
    </Route>
  )
}
