import express from 'express';

import { httpsGetProduct, httpsGetreviews } from './product.controller.js';

const productRoute = express.Router();

productRoute.get('/:id', httpsGetProduct);
productRoute.get('/:id/:reviews', httpsGetreviews);

export default productRoute;
