import { server } from '../../test/test.utils.js';

describe('/collections', () => {
  describe('GET /', () => {
    test('products', async () => {
      const response = await server
        .get('/api/collections?type=shoes&gender=mens&page=2')
        .expect(200)
        .expect('Content-Type', /json/);

      const { total, page, perPage } = response.body.pagination;
      expect(total).toBeGreaterThan(0);
      expect(page).toBe(2);
      expect(perPage).toBeGreaterThan(0);
      expect(perPage).toBeLessThanOrEqual(10);
      expect(response.body.products).toHaveLength(10);
    });

    test('limit is greater than 50', async () => {
      await server
        .get('/api/collections?type=socks&limit=51')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'limit must be less than 50' });
    });

    test('type field is missing', async () => {
      await server
        .get('/api/collections')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'type field is missing' });
    });

    test('no products when type is wrong', async () => {
      const { body } = await server
        .get('/api/collections?type=wrong')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(body.products.length).toBe(0);
    });
  });

  describe('GET /sale', () => {
    test('products with only sale edition', async () => {
      const response = await server
        .get('/api/collections/sale?type=shoes&gender=womens&limit=1')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.products[0].editions).toHaveLength(1);
      expect(response.body.products[0].editions[0].edition).toBe('sale');
    });
  });

  describe('GET /filters', () => {
    test('200 status & filters', async () => {
      const { body } = await server
        .get('/api/collections/filters?type=socks')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(body.filters?.sizes.length).toBeGreaterThan(0);
    });

    test('400 status when type field is missing', async () => {
      await server
        .get('/api/collections/filters')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'type field is missing' });
    });
  });
});
