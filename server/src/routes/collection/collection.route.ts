import express from 'express';

import {
  httpsGetCollection,
  httpsGetCollectionSale,
  httpsGetCollectionFilters,
} from './collection.controller.js';

const collectionRoute = express.Router();

collectionRoute.get('/', httpsGetCollection);
collectionRoute.get('/sale', httpsGetCollectionSale);
collectionRoute.get('/filters', httpsGetCollectionFilters);

export default collectionRoute;
