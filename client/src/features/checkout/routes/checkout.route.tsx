import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import BottomDrawer from '@/components/bottom-drawer.component'
import LinkCustom from '@/components/link-custom.component'
import { cn } from '@/utils/cn.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import { clearCart } from '@/features/cart'
import { axios } from '@/lib/axios'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const Checkout = () => {
  const cart = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const elItems = useRef(cart.items)
  const navigate = useNavigate()

  const { mutate, isPending, isError, error, data } = useMutation<{
    message: string
  }>({
    mutationFn: () => axios.post('user/orders', { items: cart.items }),
    onSuccess: () => {
      dispatch(clearCart())
      setDrawerOpen(true)
    },
  })

  const closeDrawer = () => {
    setDrawerOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <main className='container mx-auto px-6 py-16'>
      <ul className='mb-6 w-fit border-b border-b-silver-dark pb-3'>
        {elItems.current.map((item) => (
          <li
            key={item.editionId + item.size}
            className='mb-5 flex justify-between gap-x-7 last-of-type:mb-0'
          >
            <div className='flex'>
              <div className='relative mr-4'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='object-fit aspect-square w-[5rem] bg-silver'
                />
                <span className='absolute right-0 top-0 grid h-6 w-6 -translate-y-[30%] translate-x-[30%] place-items-center rounded-full bg-[#565d61e6] text-sm text-[#e8e6e3]'>
                  {item.amount}
                </span>
              </div>

              <div className='text-[0.85rem]'>
                <h4 className='font-bold'>{item.name}</h4>
                <p className=''>{item.colorName}</p>
                <p className=''>size: {item.size}</p>
              </div>
            </div>

            <div className='self-center'>
              {item.salePrice && (
                <span className='mr-1 text-red'>${item.salePrice}</span>
              )}
              <span
                className={cn({
                  'text-gray-medium line-through': item.salePrice,
                })}
              >
                ${item.price}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <LinkCustom
        element='button'
        disabled={isPending}
        onClick={() => mutate()}
      >
        pay now <span className='text-[10px] tracking-wide'>(mock)</span>
      </LinkCustom>

      {isError && (
        <p className='mt-1 text-sm capitalize text-red'>
          {getErrorMessage(error)}
        </p>
      )}

      <BottomDrawer
        isOpen={isDrawerOpen}
        handleClose={closeDrawer}
        className='grid place-items-center text-center text-xl md:h-2/5 md:w-1/2'
      >
        <p className=''>{data?.message}</p>
      </BottomDrawer>
    </main>
  )
}

export default Checkout
