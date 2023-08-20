import request from 'supertest';
import app from '../../app.js';

describe('/products', () => {
  const PRODUCT_NAME = 'mens-tree-runners';

  test('collection random test', async () => {
    const { body } = await request(app)
      .get(`/api/products/${PRODUCT_NAME}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(body.product?.handle).toMatch(PRODUCT_NAME);
  });
});
