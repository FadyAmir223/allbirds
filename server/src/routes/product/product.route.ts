import express from 'express';

import {
  httpsGetProduct,
  httpsGetReviews,
  httpsAddReview,
  httpsRemoveReview,
} from './product.controller.js';
import needAuth from '../../middlewares/needAuth.js';

const productRoute = express.Router();

productRoute.get('/:handle', httpsGetProduct);
productRoute.get('/:handle/reviews', httpsGetReviews);

productRoute.use(needAuth);

productRoute.post('/:handle/review', httpsAddReview);
productRoute.delete('/:handle/review/:reviewId', httpsRemoveReview);

export default productRoute;
