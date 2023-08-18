import { mongoConnect } from '../services/mongo.js';

export default async function (globalConfig, projectConfig) {
  await mongoConnect();
}
