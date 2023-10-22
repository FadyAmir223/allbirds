import session from 'express-session';
import createMemoryStore from 'memorystore';
import mongoStore from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';

import {
  NODE_ENV,
  MONGO_URL,
  SESSION_KEY_1,
  SESSION_KEY_2,
  IS_PRODUCTION,
  DB_NAME,
} from '../config/loadEnv.js';

let store;

if (NODE_ENV === 'test') {
  const MemoryStore = createMemoryStore(session);
  store = new MemoryStore({
    checkPeriod: 1000 * 60 * 5,
  });
} else
  store = mongoStore.create({
    mongoUrl: MONGO_URL,
    dbName: DB_NAME,
    collectionName: 'carts',
  });

const cartSession = session({
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
