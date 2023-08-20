import { saveProducts } from '../models/product/product.model.js';
import { mongoConnect, mongoDisconnect } from '../services/mongo.js';

beforeAll(async () => {
  await mongoConnect(process.env.MONGO_URI);
  await saveProducts();
});

afterAll(async () => {
  await mongoDisconnect();
});
