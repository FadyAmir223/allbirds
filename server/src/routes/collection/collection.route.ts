import express from 'express';

import {
  httpsGetCollection,
  httpsGetCollectionSale,
} from './collection.controller.js';

const collectionRoute = express.Router();

collectionRoute.get('/:collection', httpsGetCollection);

collectionRoute.get('/:collection/sale', httpsGetCollectionSale);

export default collectionRoute;
