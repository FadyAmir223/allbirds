import { useLoaderData, useParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'

import MaterialFeatures from '../components/product/material-features.component'
import ProductDetails from '../components/product/product-details.component'
import GeneralReview from '../components/reviews/general-review.component'
import Reviews from '../components/reviews/reviews.component'
import { productQuery, productReviewsQuery } from '../services/product.query'
import { type ProductDetailed, type Reviews as ReviewsType } from '..'

const Product = () => {
  const [initProduct, initReviews] = useLoaderData() as [
    ProductDetailed,
    ReviewsType,
  ]

  const params = useParams()
  const productName = params.productName as string

  const [{ data: detailedProduct }, { data: reviews }] = useQueries({
    queries: [
      { ...productQuery(productName), initialData: initProduct },
      {
        ...productReviewsQuery({ name: productName }),
        initialData: initReviews,
      },
    ],
  })

  const { product } = detailedProduct || {}
  if (!product || !reviews) return

  return (
    <main>
      <ProductDetails
        initProduct={initProduct}
        reviews={{
          rating: reviews?.rating,
          total: reviews?.pagination.total,
        }}
      >
        <MaterialFeatures materialFeatures={product.materialFeatures} />
      </ProductDetails>

      <Reviews initReviews={initReviews}>
        <GeneralReview
          reviews={{
            rating: reviews.rating,
            total: reviews.pagination.total,
          }}
        />
      </Reviews>
    </main>
  )
}

export default Product
