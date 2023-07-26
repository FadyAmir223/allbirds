import serverSession from 'express-session';
import mongoStore from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';

import {
  MONGO_URL,
  SESSION_KEY_1,
  SESSION_KEY_2,
  IS_PRODUCTION,
} from '../utils/loadEnv.js';
import { dbName } from '../services/mongo.js';

const store = mongoStore.create({
  mongoUrl: MONGO_URL,
  dbName,
  collectionName: 'carts',
});

const cartSession = serverSession({
  genid: () => uuidv4(),
  name: 'cart',
  secret: [SESSION_KEY_1, SESSION_KEY_2],
  resave: true,
  rolling: true,
  saveUninitialized: false,
  store,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: IS_PRODUCTION,
    httpOnly: true,
  },
});

export default cartSession;
