import express from 'express';

import collectionRoute from './collection/collection.route.js';
import productRoute from './product/product.route.js';

const api = express.Router();

api.use('/collections', collectionRoute);
api.use('/products', productRoute);

export default api;
