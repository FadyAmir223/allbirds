import { lazy } from 'react'
import { Outlet, Route } from 'react-router-dom'
import { loader as accountLoader } from '../services/account.loader'
import { action as loginAction } from '../services/login.action'
import { loader as resetLoader } from '../services/reset.loader'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const Account = lazy(() => import('./account.route'))
const Register = lazy(() => import('./register.route'))
const Login = lazy(() => import('./login.route'))
const Verify = lazy(() => import('./verify.route'))
const Reset = lazy(() => import('./reset.route'))

export const UserRoute = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  return (
    <Route path='account' element={<Outlet />}>
      <Route
        index
        element={<Account />}
        loader={(args) => accountLoader(args, isLoggedIn)}
      />

      <Route path='register' element={<Register />} />
      <Route
        path='login'
        element={<Login />}
        action={(args) => loginAction(args, dispatch)}
      />

      <Route path='verify' element={<Verify />} />
      <Route path='reset' element={<Reset />} loader={resetLoader} />
    </Route>
  )
}
