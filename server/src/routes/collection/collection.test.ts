import request from 'supertest';
import app from '../../app.js';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.js';

describe('collections EP', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  test('respond with 200 status', async () => {
    const res = await request(app)
      .get(`/api/collections?type=socks`)
      .expect(200); // ?limit=3
  });
});
