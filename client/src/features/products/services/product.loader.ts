import { LoaderFunctionArgs } from 'react-router-dom'

import { productQuery, productReviewsQuery } from './product.query'
import { queryClient } from '@/lib/react-query'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const productName = params.productName as string

  const productP = queryClient.ensureQueryData(productQuery(productName))
  const reviewsP = queryClient.ensureQueryData(
    productReviewsQuery({ name: productName }),
  )

  return await Promise.all([productP, reviewsP])
}
