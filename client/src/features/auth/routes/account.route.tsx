import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { logUserState } from '..'
import { axios } from '@/lib/axios'
import { useAppDispatch } from '@/store/hooks'

const Account = () => {
  const [message, setMessage] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form'>
      <div className='text-center'>
        <h1 className='pb-1 pt-16 text-lg font-bold uppercase'>my account</h1>
        <button
          className='text-[12px] uppercase underline'
          onClick={handleLogout}
        >
          logout
        </button>
        <p className='h-4 text-[11.5px] text-red'>{message}</p>
      </div>
    </main>
  )
}

export default Account
