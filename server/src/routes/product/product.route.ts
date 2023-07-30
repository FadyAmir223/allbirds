import express from 'express';

import {
  httpsGetProduct,
  httpsGetReviews,
  httpsAddReview,
  httpsRemoveReview,
} from './product.controller.js';
import needAuth from '../../middlewares/needAuth.js';

const productRoute = express.Router();

productRoute.get('/:id', httpsGetProduct);
productRoute.get('/:id/reviews', httpsGetReviews);

productRoute.use(needAuth);

productRoute.post('/:id/review', httpsAddReview);
productRoute.delete('/:id/review', httpsRemoveReview);

export default productRoute;
