import express from 'express'

import {
  httpsSearchProducts,
  httpsGetProduct,
  httpsGetReviews,
  httpsAddReview,
  httpsRemoveReview,
} from './product.controller.js'
import needAuth from '../../middlewares/needAuth.js'

const productRoute = express.Router()

productRoute.get('/search', httpsSearchProducts)
productRoute.get('/:handle', httpsGetProduct)
productRoute.get('/:handle/reviews', httpsGetReviews)

productRoute.use(needAuth)

productRoute.post('/:handle/reviews', httpsAddReview)
productRoute.delete('/:handle/reviews', httpsRemoveReview)

export default productRoute
