import { useParams } from 'react-router-dom'

import StarRating from '../star-rating.component'
import { type ReviewsHeadline } from '../..'

type GeneralReviewProps = {
  reviews: ReviewsHeadline
}

const GeneralReview = ({ reviews }: GeneralReviewProps) => {
  const { productName } = useParams()

  return (
    <section className='bg-silver py-12 text-center'>
      <h2 className='mb-5 text-2xl font-bold capitalize'>
        {productName} reviews
      </h2>
      <div className='flex items-center justify-center gap-x-2'>
        <span className='mr-6 text-4xl font-bold'>{reviews.rating}</span>
        <StarRating rating={reviews.rating} scale='lg' />
      </div>
      <p className='mb-10 text-[12px]'>{reviews.total} Reviews</p>
      <div className='mx-auto mb-5 max-w-sm bg-white p-6 text-center'>
        <h5 className='mb-2 text-xl font-bold'>Size</h5>
        <div className='relative h-4 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:-translate-y-1/2 before:bg-gray-2 after:absolute after:right-0 after:top-0 after:h-full after:w-[3px] after:-translate-y-1/2 after:bg-gray-2'>
          <span className='absolute left-1/2 h-[3px] w-full -translate-x-1/2 -translate-y-1/2 bg-gray-2 before:absolute before:right-1/2 before:top-1/2 before:h-3 before:w-3 before:-translate-y-1/2 before:rounded-full before:bg-gray' />
        </div>
        <ul className='flex justify-between text-sm'>
          {['Runs Small', 'True to Size', 'Runs Large'].map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
      <p className='mx-auto max-w-lg text-sm text-gray'>
        This style is available in whole sizes only. In between sizes? We
        recommend you size up.
      </p>
    </section>
  )
}

export default GeneralReview
