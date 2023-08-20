import request from 'supertest';

import app from '../../app.js';

describe('/collections', () => {
  describe('GET /', () => {
    test('200 status & products', async () => {
      const response = await request(app)
        .get('/api/collections?type=socks&page=2&limit=1')
        .expect(200);

      const { total, page, perPage } = response.body.pagination;
      expect(total).toBeGreaterThan(1);
      expect(page).toBe(2);
      expect(perPage).toBe(1);
      expect(response.body.products).toHaveLength(1);
    });

    test('400 status when limit is greater than 50', async () => {
      await request(app)
        .get('/api/collections?type=socks&limit=51')
        .expect(400)
        .expect({
          message: 'limit must be less than 50',
        });
    });

    test('400 status when type field is missing', async () => {
      const response = await request(app)
        .get('/api/collections')
        .expect(400)
        .expect({ message: 'type field is empty' });
    });

    test('200 status and no products when type is wrong', async () => {
      const { body } = await request(app)
        .get('/api/collections?type=wrong')
        .expect(200);

      expect(body.products).toEqual([]);
    });
  });

  describe('GET /sale', () => {
    test('200 status & products with only sale edition', async () => {
      const response = await request(app)
        .get('/api/collections/sale?type=shoes&gender=womens&limit=1')
        .expect(200);

      expect(response.body.products[0].editions).toHaveLength(1);
      expect(response.body.products[0].editions[0].edition).toBe('sale');
    });
  });

  describe('GET /filter', () => {
    test('200 status & filters', async () => {
      const { body } = await request(app)
        .get('/api/collections/filters?type=socks')
        .expect(200);

      expect(body.filters.sizes?.length).toBeGreaterThan(0);
    });
  });
});
