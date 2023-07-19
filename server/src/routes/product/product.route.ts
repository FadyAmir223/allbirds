import express from 'express';

import { httpsGetProduct, httpsGetreviews } from './product.controller.js';

const productRoute = express.Router();

productRoute.get('/:product', httpsGetProduct);
productRoute.get('/:product/:reviews', httpsGetreviews);

export default productRoute;
