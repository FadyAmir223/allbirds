import mongoose from 'mongoose';
import { MONGO_URL } from '../config/loadEnv.js';

mongoose.connection.once('open', () => {
  console.log('mongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const mongoConnect = async (dbUrl: string = MONGO_URL) => {
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

export { mongoConnect, mongoDisconnect };
