import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  keepPreviousData,
  useMutation,
  useQueries,
} from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import StarRating from '../star-rating.component'
import { AddReview } from './add-review.component'
import LinkCustom from '@/components/link-custom.component'
import { productKeys, productReviewsQuery } from '../../services/product.query'
import { cn } from '@/utils/cn.util'
import { composeUri } from '@/utils/compose-uri.util'
import screenSize from '@/data/screen-size.json'
import type { ReactNode } from 'react'
import type { Order, Orders } from '@/features/user'
import { type Reviews } from '../..'
import { ordersHistoryQuery, userKeys } from '@/features/user'
import { axios } from '@/lib/axios'

type ReviewsProps = {
  initReviews: Reviews
  children: ReactNode
}

const REVIEW_THRESHOLD = innerWidth > screenSize.md ? 200 : 150

const PER_PAGE = 3
const PER_SECTION = 5
const NEIGHBOURS = 2

const getTotalPages = (total: number) => Math.ceil(total / PER_PAGE)

const getPageRange = (currPage: number, total: number) => {
  const totalPages = getTotalPages(total)
  const perSection = Math.min(PER_SECTION, totalPages)

  let start = currPage - NEIGHBOURS

  if (start < 1) start = 1
  else if (start + perSection - 1 > totalPages)
    start -= start + perSection - 1 - totalPages

  return Array.from({ length: perSection }, (_, i) => start + i)
}

const Reviews = ({ initReviews, children }: ReviewsProps) => {
  const [currPage, setcurrPage] = useState(1)
  const [isAddingReview, setAddingReview] = useState(false)

  const elDiv = useRef<HTMLDivElement | null>(null)
  const didMount = useRef(false)

  const params = useParams()
  const productName = params.productName as string

  const [{ data: reviews, isFetching }, { data: ordersHistory }] = useQueries({
    queries: [
      {
        ...productReviewsQuery({ name: productName, page: currPage }),
        initialData: currPage === 1 ? initReviews : undefined,
        placeholderData: keepPreviousData,
        staleTime: Infinity,
      },
      { ...ordersHistoryQuery },
    ],
  })

  const { mutate: removeReview } = useMutation({
    mutationFn: () => axios.delete(composeUri(productKeys.review(productName))),
    onSettled: (newReviews, error) => {
      if (error) return

      queryClient.setQueryData(
        productKeys.reviews({ name: productName }),
        newReviews,
      )

      queryClient.setQueryData(
        userKeys.ordersHistory(),
        ({ orders }: Orders) => ({
          orders: orders.map(
            (order): Order =>
              order.handle === productName && order.delivered && order.reviewed
                ? { ...order, reviewed: false }
                : order,
          ),
        }),
      )
    },
  })

  useEffect(() => {
    if (didMount.current)
      elDiv.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else didMount.current = true
  }, [reviews?.pagination.page])

  if (!reviews) return

  const totalPages = getTotalPages(reviews.pagination.total)

  const hasReview = !!ordersHistory?.orders?.find(
    ({ handle, delivered, reviewed }) =>
      handle === productName && delivered && reviewed,
  )

  const orderedProduct =
    !hasReview &&
    ordersHistory?.orders?.find(
      ({ handle, delivered, reviewed }) =>
        handle === productName && delivered && !reviewed,
    )

  const canReview = !!orderedProduct

  const handlePageChange = (value: number | 'prev' | 'next') => {
    setcurrPage((prevCurrPage) => {
      if (value === 'next') return prevCurrPage + 1
      else if (value === 'prev') return prevCurrPage - 1
      else return value
    })
  }

  const handleReview = () => {
    if (canReview) setAddingReview(!isAddingReview)
    else if (hasReview) removeReview()
  }

  return (
    <main>
      {children}

      <div ref={elDiv} />
      <section className='px-6 py-12 md:px-24'>
        <div className='mb-6 flex items-center justify-between'>
          <h4 className='text-xl font-bold'>
            {reviews.pagination.total} Reviews
          </h4>

          {(canReview || hasReview) && (
            <LinkCustom element='button' onClick={handleReview}>
              {canReview ? 'add' : hasReview ? 'remove' : ''} review
            </LinkCustom>
          )}
        </div>

        <ul className={cn({ 'opacity-50': isFetching })}>
          {reviews.reviews.map((review) => {
            const isExpanded = review.content.length > REVIEW_THRESHOLD
            const reviewContent = isExpanded
              ? `${review.content.slice(0, REVIEW_THRESHOLD)}...`
              : review.content

            return (
              <li
                key={review._id}
                className='flex flex-col gap-y-6 border-t border-t-gray-light py-6 last-of-type:border-b last-of-type:border-b-gray-light md:flex-row md:justify-between md:gap-x-28 md:gap-y-0'
              >
                <div className='md:w-3/5'>
                  <div className='relative left-2 mb-3 w-fit'>
                    <StarRating rating={review.score} scale='md' />
                  </div>
                  <h3 className='mb-2 text-lg font-bold'>{review.title}</h3>

                  {/* don't cause re-render */}
                  <div className='mb-6 leading-7'>
                    <input
                      type='checkbox'
                      id={review._id}
                      className='peer hidden'
                    />
                    <p className='peer-checked:hidden'>{reviewContent}</p>
                    <p className='hidden peer-checked:inline-block'>
                      {review.content}
                      <label
                        htmlFor={review._id}
                        className='block cursor-pointer text-[15px] font-[500] underline'
                      >
                        Read Less
                      </label>
                    </p>
                    {isExpanded && (
                      <label
                        htmlFor={review._id}
                        className='block cursor-pointer text-[15px] font-[500] underline peer-checked:hidden'
                      >
                        Read More
                      </label>
                    )}
                  </div>

                  <p>{review.createdAt}</p>
                </div>
                <div className='h-fit bg-silver p-4 tracking-[0.5px] md:w-2/5'>
                  <div className='mb-3 border-b border-b-gray-light pb-3'>
                    <span className='mr-3 font-bold'>{review.username}</span>
                    {review.verifiedBuyer && (
                      <span className='text-[12px] italic'>Verified Buyer</span>
                    )}
                  </div>
                  <ul className='text-[13px]'>
                    {review.customFields.map((field) => (
                      <li key={field._id} className='mb-0.5'>
                        <span className='mr-3 font-[500]'>{field.title}</span>
                        <span>{field.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
        <div className='mx-auto flex max-w-xs items-center justify-between gap-x-5 py-10 text-grayish-brown'>
          {reviews.pagination.page !== 1 && (
            <button
              className='scale-110 text-gray'
              onClick={() => handlePageChange('prev')}
            >
              <FaAngleLeft />
            </button>
          )}
          {getPageRange(reviews.pagination.page, reviews.pagination.total).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={cn({
                  'font-bold text-gray': pageNumber === reviews.pagination.page,
                })}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ),
          )}
          {reviews.pagination.page < totalPages && (
            <button
              className='scale-110 text-gray'
              onClick={() => handlePageChange('next')}
            >
              <FaAngleRight />
            </button>
          )}
        </div>

        {canReview && (
          <AddReview
            isOpen={isAddingReview}
            handleClose={handleReview}
            orderedProduct={orderedProduct}
          />
        )}
      </section>
    </main>
  )
}

export default Reviews
