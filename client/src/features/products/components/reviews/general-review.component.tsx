import StarRating from '../star-rating.component';
import { type ReviewsHeadline } from '../..';

type GeneralReviewProps = {
  productName: string;
  reviews: ReviewsHeadline;
};

const GeneralReview = ({ productName, reviews }: GeneralReviewProps) => {
  return (
    <section className='bg-silver py-12 text-center'>
      <h2 className='capitalize text-2xl font-bold mb-5'>
        {productName} reviews
      </h2>
      <div className='flex gap-x-2 justify-center items-center'>
        <span className='font-bold text-4xl mr-6'>{reviews.rating}</span>
        <StarRating rating={reviews.rating} scale='lg' />
      </div>
      <p className='mb-10 text-[12px]'>{reviews.total} Reviews</p>
      <div className='bg-white p-6 text-center max-w-sm mx-auto mb-5'>
        <h5 className='font-bold text-xl mb-2'>Size</h5>
        <div className='relative h-4 before:absolute before:h-full before:w-[3px] before:bg-gray-2 before:left-0 before:top-0 before:-translate-y-1/2 after:absolute after:h-full after:w-[3px] after:bg-gray-2 after:right-0 after:top-0 after:-translate-y-1/2'>
          <span className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-2 w-full h-[3px] before:bg-gray before:absolute before:rounded-full before:w-3 before:h-3 before:top-1/2 before:right-1/2 before:-translate-y-1/2' />
        </div>
        <ul className='flex justify-between text-sm'>
          {['Runs Small', 'True to Size', 'Runs Large'].map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
      <p className='text-sm text-gray max-w-lg mx-auto'>
        This style is available in whole sizes only. In between sizes? We
        recommend you size up.
      </p>
    </section>
  );
};

export default GeneralReview;
