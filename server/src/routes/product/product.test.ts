import request from 'supertest';
import app from '../../app.js';

describe('/products', () => {
  const server = request(app);
  const PRODUCT_NAME = 'mens-tree-runners';

  test('GET /:handle', async () => {
    const { body } = await server
      .get(`/api/products/${PRODUCT_NAME}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(body.product?.handle).toMatch(PRODUCT_NAME);
  });

  test('GET /:handle - wrong handle', async () => {
    await server
      .get(`/api/products/wrong-handle`)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect({ message: 'product not found' });
  });

  test('GET /:handle/reviews', async () => {
    const PAGE = 2;

    const { body } = await server
      .get(`/api/products/${PRODUCT_NAME}/reviews?page=${PAGE}`)
      .expect(200)
      .expect('Content-Type', /json/);

    const { pagination, reviews } = body;

    expect(pagination.page).toBe(PAGE);
    expect(pagination.perPage).toBe(3);
    expect(pagination.perPage).toBe(reviews.length);
  });

  test('GET /:handle/reviews - limit > 50', async () => {
    await server
      .get(`/api/products/${PRODUCT_NAME}/reviews?limit=51`)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({ message: "reviews can't exceed 50" });
  });
});
