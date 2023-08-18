import { mongoDisconnect } from '../services/mongo.js';

export default async function (globalConfig, projectConfig) {
  await mongoDisconnect();
}
