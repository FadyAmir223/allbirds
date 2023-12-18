import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import ErrorFallback from '@/components/error-fallback.component'
import Layout from '@/components/layout.component'
import { lazyImport } from '@/utils/lazy-import.util'
import { AuthRoute } from '@/features/auth'
import { CheckoutRoute } from '@/features/checkout'
import { CollectionRoute } from '@/features/collections'
import { PagesRoute } from '@/features/pages'
import { ProductRoute } from '@/features/products'
import { UserRoute } from '@/features/user'

const mistFactory = () => import('@/features/misc')
const { Home } = lazyImport(mistFactory, 'Home')
const { NotFound } = lazyImport(mistFactory, 'NotFound')

const App = () => {
  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route
              path='/'
              element={<Layout />}
              errorElement={<ErrorFallback />}
            >
              <Route path='*' element={<NotFound />} />
              <Route index element={<Home />} />
              {CollectionRoute()}
              {ProductRoute()}
              {AuthRoute()}
              {UserRoute()}
              {PagesRoute()}
            </Route>
            ,{CheckoutRoute()}
          </>,
        ),
      )}
    />
  )
}

export default App
