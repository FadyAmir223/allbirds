import mongoose from 'mongoose';

import { MONGO_URL } from '../utils/loadEnv.js';

// mongod --dbpath "G:/user tools/mongoDB/data"

const DB_URL = MONGO_URL + '/allbirds';

mongoose.connection.once('open', () => {
  console.log('mongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const mongoConnect = async () => {
  await mongoose.connect(DB_URL);
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

export { DB_URL, mongoConnect, mongoDisconnect };
