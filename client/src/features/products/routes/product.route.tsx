import { useLoaderData, useParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import MaterialFeatures from '../components/product/material-features.component'
import ProductDetails from '../components/product/product-details.component'
import GeneralReview from '../components/reviews/general-review.component'
import Reviews from '../components/reviews/reviews.component'
import Head from '@/components/head.component'
import { productQuery, productReviewsQuery } from '../services/product.query'
import { loader as productLoader } from '../services/product.loader'

const Product = () => {
  const [initProduct, initReviews] = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

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
      <Head title={product.name} description='sustainable shoes & clothing' />

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
