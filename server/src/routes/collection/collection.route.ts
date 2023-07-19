import express from 'express';

import { httpsGetCollection } from './collection.controller.js';

const collectionRoute = express.Router();

collectionRoute.get('/:collection', httpsGetCollection);

export default collectionRoute;
