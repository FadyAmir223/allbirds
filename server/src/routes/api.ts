import express from 'express';

import collectionRoute from './collection/collection.route.js';
import productRoute from './product/product.route.js';
import cartRoute from './cart/cart.route.js';
import authRoute from './auth/auth.route.js';

const api = express.Router();

api.use('/collections', collectionRoute);

api.use('/products', productRoute);

api.use('/cart', cartRoute);

api.use('/auth', authRoute);

export default api;
