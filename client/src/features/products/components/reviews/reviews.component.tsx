import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import GeneralReview from './general-review.component';
import StarRating from '../star-rating.component';
import { productReviewsQuery } from '../../services/product.query';
import { cn } from '@/utils/cn.util';
import screenSize from '@/data/screen-size.json';
import { type Reviews } from '../..';

// TODO: add/remove review - after login, purchase

type ReviewsProps = {
  initReviews: Reviews;
  productName: string;
};

const REVIEW_THRESHOLD = innerWidth > screenSize.md ? 200 : 150;
const PER_PAGE = 3;
const PER_SECTION = 5;

const getTotalSections = (total: number) => Math.ceil(total / PER_PAGE);

const generatePageRange = (current: number, total: number) => {
  const totalSections = getTotalSections(total);
  const perSection = Math.min(PER_SECTION, totalSections);

  const middle = Math.floor(perSection / 2);

  const start = Math.min(
    Math.max(1, current - middle),
    Math.ceil((totalSections - middle) / 2),
  );
  const end = Math.min(total, start + perSection - 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Reviews = ({ initReviews }: ReviewsProps) => {
  const [currPage, setcurrPage] = useState(1);
  const elDiv = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const productName = params.productName as string;

  const { data: reviews, isFetching } = useQuery({
    ...productReviewsQuery({ name: productName, page: currPage }),
    initialData: currPage === 1 ? initReviews : undefined,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    elDiv.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reviews?.pagination.page]);

  if (!reviews) return;

  const totalSections = getTotalSections(reviews?.pagination.total);

  const handlePageChange = (value: number | 'prev' | 'next') => {
    setcurrPage((prevCurrPage) => {
      if (value === 'next') return prevCurrPage + 1;
      else if (value === 'prev') return prevCurrPage - 1;
      else return value;
    });
  };

  return (
    <main>
      <GeneralReview
        productName={productName}
        reviews={{
          rating: reviews.rating,
          total: reviews.pagination.total,
        }}
      />

      <div ref={elDiv} />
      <section className='px-6 md:px-24 py-12'>
        <h4 className='font-bold text-xl mb-6'>
          {reviews.pagination.total} Reviews
        </h4>
        <ul className={cn({ 'opacity-50': isFetching })}>
          {reviews.reviews.map((review) => {
            const isExpanded = review.content.length > REVIEW_THRESHOLD;
            const reviewContent = isExpanded
              ? `${review.content.slice(0, REVIEW_THRESHOLD)}...`
              : review.content;

            return (
              <li
                key={review._id}
                className='py-6 border-t border-t-gray-light last-of-type:border-b last-of-type:border-b-gray-light flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-28 md:justify-between'
              >
                <div className='md:w-3/5'>
                  <div className='relative left-2 mb-3 w-fit'>
                    <StarRating rating={review.score} scale='md' />
                  </div>
                  <h3 className='font-bold text-lg mb-2'>{review.title}</h3>

                  {/* don't cause re-render */}
                  <div className='mb-6 leading-7'>
                    <input
                      type='checkbox'
                      id={review._id}
                      className='hidden peer'
                    />
                    <p className='peer-checked:hidden'>{reviewContent}</p>
                    <p className='hidden peer-checked:inline-block'>
                      {review.content}
                      <label
                        htmlFor={review._id}
                        className='cursor-pointer block font-semibold underline text-[15px]'
                      >
                        Read Less
                      </label>
                    </p>
                    {isExpanded && (
                      <label
                        htmlFor={review._id}
                        className='cursor-pointer block font-semibold underline text-[15px] peer-checked:hidden'
                      >
                        Read More
                      </label>
                    )}
                  </div>

                  <p>{review.createdAt}</p>
                </div>
                <div className='bg-silver p-4 md:w-2/5 h-fit tracking-[0.5px]'>
                  <div className='mb-3 pb-3 border-b border-b-gray-light'>
                    <span className='font-bold mr-3'>{review.username}</span>
                    {review.verifiedBuyer && (
                      <span className='text-[12px] italic'>Verified Buyer</span>
                    )}
                  </div>
                  <ul className='text-[13px]'>
                    {review.customFields.map((field) => (
                      <li key={field._id} className='mb-0.5'>
                        <span className='font-semibold mr-3'>
                          {field.title}
                        </span>
                        <span>{field.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div className='flex justify-between items-center gap-x-5 py-10 max-w-xs mx-auto text-grayish-brown'>
          {reviews.pagination.page !== 1 && (
            <button
              className='text-gray scale-110'
              onClick={() => handlePageChange('prev')}
            >
              <FaAngleLeft />
            </button>
          )}
          {generatePageRange(
            reviews.pagination.page,
            reviews.pagination.total,
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              className={cn({
                'font-bold text-gray': pageNumber === reviews.pagination.page,
              })}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          {reviews.pagination.page < totalSections && (
            <button
              className='text-gray scale-110'
              onClick={() => handlePageChange('next')}
            >
              <FaAngleRight />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Reviews;
