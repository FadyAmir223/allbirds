import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { MdStar, MdStarBorder } from 'react-icons/md'
import BottomDrawer from '@/components/bottom-drawer.component'
import { productKeys } from '../../services/product.query'
import { composeUri } from '@/utils/compose-uri.util'
import { getErrorMessage } from '@/utils/getErrorMessage.util'
import type { FormEvent } from 'react'
import type { Order, Orders } from '@/features/user'
import { userKeys } from '@/features/user'
import { axios } from '@/lib/axios'

type AddReviewProps = {
  isOpen: boolean
  handleClose: () => void
  orderedProduct: Order | undefined
}

const initScore = -1

export const AddReview = ({
  isOpen,
  handleClose,
  orderedProduct,
}: AddReviewProps) => {
  const params = useParams()
  const productName = params.productName as string

  const elForm = useRef<HTMLFormElement | null>(null)

  const [score, setScore] = useState({ value: initScore, fixed: false })
  const [validationMessage, setvalidationMessage] = useState('')

  const handleScore = (rating: number, fixed = false) => {
    if (!score.fixed || (rating > initScore && fixed))
      setScore({ value: rating, fixed })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(elForm.current!)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (score.value === initScore)
      return setvalidationMessage('provide a score')
    else if (score)
      if (!title || !content) return setvalidationMessage('fill up the fields')

    const customFields = [
      { title: 'Typical Size', value: orderedProduct!.size },
      { title: 'Size Purchased', value: orderedProduct!.size },
      { title: 'Typical Width', value: 'Average' },
    ]

    mutate({ score: score.value + 1, title, content, customFields })
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (body: unknown) =>
      axios.post(composeUri(productKeys.review(productName)), body),
    onMutate: () => setvalidationMessage(''),
    onSettled: (newReviews, error) => {
      if (error) return

      handleClose()

      const formData = new FormData(elForm.current!)
      formData.set('title', '')
      formData.set('content', '')

      queryClient.setQueryData(
        productKeys.reviews({ name: productName }),
        newReviews,
      )

      queryClient.setQueryData(
        userKeys.ordersHistory(),
        ({ orders }: Orders) => ({
          orders: orders.map(
            (order): Order =>
              order.handle === productName && order.delivered && !order.reviewed
                ? { ...order, reviewed: true }
                : order,
          ),
        }),
      )
    },
  })

  return (
    <BottomDrawer
      isOpen={isOpen}
      handleClose={handleClose}
      className='p-10 md:h-[80dvh] md:w-4/5 lg:w-[55%]'
    >
      <form
        ref={elForm}
        className='flex h-full flex-col justify-between'
        onSubmit={handleSubmit}
      >
        <div className='flex-grow'>
          <h2 className='mb-5 text-2xl font-bold'>Add Review</h2>

          <div className='mb-4 flex items-center'>
            <p className='mr-5'>Give Overall Rating</p>
            <div className='flex cursor-pointer'>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className='scale-150 pr-2 last-of-type:pr-0'
                  onMouseEnter={() => handleScore(idx)}
                  onMouseLeave={() => handleScore(initScore)}
                  onClick={() => handleScore(idx, true)}
                >
                  {idx <= score.value ? <MdStar /> : <MdStarBorder />}
                </div>
              ))}
            </div>
          </div>

          <div className=''>
            <p className='mb-2.5 text-lg'>Write Your Review</p>
            <input
              type='text'
              name='title'
              placeholder='title'
              className='mb-5 block w-full rounded-md bg-dark-form p-3 focus:outline-0'
            />
            <textarea
              name='content'
              rows={4}
              placeholder='detailed review'
              className='w-full flex-grow rounded-md bg-dark-form p-3 focus:outline-0'
            />
          </div>

          <p className='text-sm text-red'>{validationMessage}</p>
          {isError && (
            <p className='text-sm text-red'>{getErrorMessage(error)}</p>
          )}
        </div>

        <div className='text-end'>
          <button
            className='mr-4 w-24 rounded-md bg-blue-dark px-3 py-1.5 text-white'
            disabled={isPending}
          >
            submit
          </button>
          <button
            className='w-24 rounded-md bg-dark-form px-3 py-1.5'
            onClick={handleClose}
          >
            cancel
          </button>
        </div>
      </form>
    </BottomDrawer>
  )
}
