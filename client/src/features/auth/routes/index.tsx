import { lazy } from 'react'
import { Outlet, Route } from 'react-router-dom'
import { action as loginAction } from '../services/login.action'
import { loader as resetLoader } from '../services/reset.loader'
import { useAppDispatch } from '@/store/hooks'

const Register = lazy(() => import('./register.route'))
const Login = lazy(() => import('./login.route'))
const Verify = lazy(() => import('./verify.route'))
const Reset = lazy(() => import('./reset.route'))

export const AuthRoute = () => {
  const dispatch = useAppDispatch()

  return (
    <Route path='account' element={<Outlet />}>
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
