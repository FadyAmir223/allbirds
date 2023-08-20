import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './config.db.json';

export default async function (globalConfig, projectConfig) {
  if (config.memory) {
    const instance: MongoMemoryServer = globalThis.__MONGOINSTANCE;
    await instance.stop();
  }
}
