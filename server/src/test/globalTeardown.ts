import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './config.db.json';

// globalConfig, projectConfig
export default async function () {
  if (config.memory) {
    const instance: MongoMemoryServer = globalThis.__MONGOINSTANCE;
    await instance.stop();
  }
}
