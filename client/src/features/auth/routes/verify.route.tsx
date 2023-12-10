import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LinkCustom from '@/components/link-custom.component'
import Loading from '@/components/loading.component'
import { axios } from '@/lib/axios'

const Verify = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      try {
        await axios.post(`auth/verify/${token}`)
        setIsVerified(true)
      } catch {
        navigate('/account/login')
      }
    })()
  }, []) // eslint-disable-line

  // loaders execute twice so can't work with changing a DB
  // useEffect & useLayoutEffect execute after init render
  // workaround: flash in loading screen
  // optimal solution: SSR
  return !isVerified ? (
    <Loading />
  ) : (
    <main className='min-h-[calc(100dvh-82px)] bg-dark-form'>
      <div className='py-16 text-center'>
        <h1 className='mb-8 text-xl capitalize'>
          your email has been successfully verified!
        </h1>

        <LinkCustom
          to='/'
          styleType='black'
          className='p-3 text-sm font-normal uppercase duration-300'
        >
          go home
        </LinkCustom>
      </div>
    </main>
  )
}

export default Verify
