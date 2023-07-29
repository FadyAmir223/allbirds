import express from 'express';

import {
  httpsGetProduct,
  httpsGetReviews,
  httpsAddReview,
  httpsRemoveReview,
} from './product.controller.js';

const productRoute = express.Router();

productRoute.get('/:id', httpsGetProduct);
productRoute.get('/:id/:reviews', httpsGetReviews);
productRoute.post('/:id/:reviews', httpsAddReview);
productRoute.delete('/:id/:reviews', httpsRemoveReview);

export default productRoute;
