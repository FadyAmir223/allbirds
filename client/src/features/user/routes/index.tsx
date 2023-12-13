import { lazy } from 'react'
import { Outlet, Route } from 'react-router-dom'
import { loader as accountLoader } from '../services/account.loader'
import { loader as addressLoader } from '../services/addresses.loader'
import { useAppSelector } from '@/store/hooks'

const Account = lazy(() => import('./account.route'))
const Addresses = lazy(() => import('./addresses.route'))

export const UserRoute = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user)

  return (
    <Route path='account' element={<Outlet />}>
      <Route
        index
        element={<Account />}
        loader={(args) => accountLoader(args, isLoggedIn)}
      />

      <Route path='addresses' element={<Addresses />} loader={addressLoader} />
    </Route>
  )
}
