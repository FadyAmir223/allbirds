import express from 'express';

import productRoute from './product/product.route.js';

const api = express.Router();

api.use('/product', productRoute);

export default api;
