import express from 'express';

import {
  httpsGetCollection,
  httpsGetCollectionSale,
  httpsGetCollectionFilters,
} from './collection.controller.js';

const collectionRoute = express.Router();

collectionRoute.get('/:collection', httpsGetCollection);

collectionRoute.get('/:collection/sale', httpsGetCollectionSale);

collectionRoute.get('/:collection/filters', httpsGetCollectionFilters);

export default collectionRoute;
