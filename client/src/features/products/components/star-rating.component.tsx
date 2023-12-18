import { Fragment } from 'react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'
import { cn } from '@/utils/cn.util'

const scales = {
  sm: 'scale-110',
  md: 'scale-[1.37]',
  lg: 'scale-[1.65]',
}

type StarRatingProps = {
  rating: number
  scale: keyof typeof scales
}

const StarRating = ({ rating, scale }: StarRatingProps) => {
  return (
    <div className={cn('flex items-center gap-x-0.5', scales[scale])}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Fragment key={idx}>
          {idx + 1 <= rating ? (
            <span className=' text-gray'>
              <MdStar />
            </span>
          ) : idx + 1 > rating && idx < rating ? (
            <span className=' text-gray'>
              <MdStarHalf />
            </span>
          ) : (
            <span className=''>
              <MdStarBorder />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default StarRating
