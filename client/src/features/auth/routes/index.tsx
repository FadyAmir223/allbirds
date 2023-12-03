import { lazy } from 'react'
import { Outlet, Route } from 'react-router-dom'

import { loader as accountLoader } from '../services/account.loader'

const Login = lazy(() => import('./login.route'))
const Signup = lazy(() => import('./signup.route'))
const Account = lazy(() => import('./account.loader'))

export const UserRoute = () => {
  return (
    <Route path='account' element={<Outlet />}>
      <Route index loader={accountLoader} element={<Account />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Route>
  )
}
