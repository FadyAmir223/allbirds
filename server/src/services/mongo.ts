import mongoose from 'mongoose';

import { MONGO_URL } from '../utils/loadEnv.js';

// mongod --dbpath "G:/user tools/mongoDB/data"

const dbName = 'allbirds';
const DB_URL = `${MONGO_URL}/${dbName}`;

mongoose.connection.once('open', () => {
  console.log('mongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const mongoConnect = async (dbUrl: string = DB_URL) => {
  try {
    if (mongoose.connection.readyState !== 1) await mongoose.connect(dbUrl);
  } catch (err) {
    console.log(err);
  }
};

const mongoDisconnect = async () => {
  try {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};

export { DB_URL, dbName, mongoConnect, mongoDisconnect };
