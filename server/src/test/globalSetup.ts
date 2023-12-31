import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from './config.db.json';

export default async function (globalConfig, projectConfig) {
  if (config.memory) {
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    globalThis.__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI =
      process.env.MONGO_URI = `mongodb://${config.user}:${config.password}${config.dns}:${config.port}/$${config.name}?authSource=admin`;
  }

  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.disconnect();
}
