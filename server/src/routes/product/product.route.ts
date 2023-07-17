import express from 'express';

import { httpsGetProduct } from './product.controller.js';

const productRoute = express.Router();

productRoute.get('/', (req, res) => {
  res.json(httpsGetProduct());
});

export default productRoute;
