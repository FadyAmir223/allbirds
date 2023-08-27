import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from './config.db.json';

// globalConfig, projectConfig
export default async function () {
  if (config.memory) {
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    globalThis.__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${config.ip}:${config.port}`;
  }

  await mongoose.connect(`${process.env.MONGO_URI}/${config.database}`);
  await mongoose.disconnect();
}
