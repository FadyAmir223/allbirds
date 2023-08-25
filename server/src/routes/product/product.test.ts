import request from 'supertest';

import app from '../../app.js';
import { authAgent, server } from '../../test/test.utils.js';
import {
  adminData,
  product,
  productReview,
  userData,
} from '../../test/test.data.js';
import mongoose from 'mongoose';

describe('/products', () => {
  const PRODUCT_NAME = product.handle;

  describe('GET /:handle', () => {
    test('product', async () => {
      const { body } = await server
        .get(`/api/products/${PRODUCT_NAME}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(body.product?.handle).toMatch(PRODUCT_NAME);
    });

    test('wrong handle', async () => {
      await server
        .get(`/api/products/wrong-handle`)
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'product not found' });
    });
  });

  describe('GET /:handle/reviews', () => {
    test('product reviews', async () => {
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

    test('limit > 50', async () => {
      await server
        .get(`/api/products/${PRODUCT_NAME}/reviews?limit=51`)
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: "reviews can't exceed 50" });
    });
  });

  describe('need auth', () => {
    const agent = request.agent(app);

    beforeEach(async () => {
      await authAgent(agent, 'POST', '/api/auth/local/signup').send(adminData);
    });

    afterEach(async () => {
      await mongoose.connection.dropCollection('users');
    });

    describe('POST /:handle/reviews', () => {
      test('not verified account', async () => {
        const agent = request.agent(app);

        await authAgent(agent, 'POST', '/api/auth/local/signup').send(userData);
        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .expect(401)
          .expect('Content-Type', /json/)
          .expect({ message: 'you must verify your account first' });
      });

      test('empty fields', async () => {
        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .expect({ message: 'some fields are empty' })
          .expect(400)
          .expect('Content-Type', /json/);
      });

      test('invalid score', async () => {
        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .send({ ...productReview, score: 'x' })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid rating' });

        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .send({ ...productReview, score: 0.1 })
          .expect({ message: 'invalid rating' });

        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .send({ ...productReview, score: 6 })
          .expect({ message: 'invalid rating' });
      });

      test('missing size purchased', async () => {
        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .send({ ...productReview, customFields: [] })
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'missing size purchased field' });
      });

      test("didn't order the product", async () => {
        await authAgent(agent, 'POST', `/api/products/${PRODUCT_NAME}/reviews`)
          .send(productReview)
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: "you didn't order this size of the product" });
      });

      describe('order the product', () => {
        beforeEach(async () => {
          await agent.post('/api/cart/add').send(product);
          await authAgent(agent, 'GET', '/api/cart/orders');
        });

        test('already reviewed', async () => {
          await authAgent(
            agent,
            'POST',
            `/api/products/${PRODUCT_NAME}/reviews`
          )
            .send(productReview)
            .expect(201);

          await authAgent(
            agent,
            'POST',
            `/api/products/${PRODUCT_NAME}/reviews`
          )
            .send(productReview)
            .expect(400)
            .expect('Content-Type', /json/)
            .expect({ message: 'you already have reviewed this product' });
        });

        test('make review', async () => {
          const { body } = await authAgent(
            agent,
            'POST',
            `/api/products/${PRODUCT_NAME}/reviews`
          )
            .send(productReview)
            .expect(201)
            .expect('Content-Type', /json/);

          const { pagination, reviews } = body;
          const [{ title, content, username, verifiedBuyer }] = reviews;

          expect(pagination.page).toBe(1);
          expect(pagination.perPage).toBe(3);
          expect(title).toContain('*');
          expect(content).toContain('*');
          expect(username).toBe('Fady A.');
          expect(verifiedBuyer).toBeTruthy();
        });
      });
    });

    describe('DELETE /:handle/reviews/:reviewId', () => {
      test('wrong id length', async () => {
        await authAgent(
          agent,
          'DELETE',
          `/api/products/${PRODUCT_NAME}/reviews/non-24-id`
        )
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid review id' });
      });

      test('wrong id', async () => {
        await authAgent(
          agent,
          'DELETE',
          `/api/products/${PRODUCT_NAME}/reviews/000000000000000000000000`
        )
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid review id' });
      });

      test('remove product', async () => {
        await agent.post('/api/cart/add').send(product);
        await authAgent(agent, 'GET', '/api/cart/orders');

        const { body } = await authAgent(
          agent,
          'POST',
          `/api/products/${PRODUCT_NAME}/reviews`
        ).send(productReview);

        const productId = body.reviews[0]._id;

        const { body: _body } = await authAgent(
          agent,
          'DELETE',
          `/api/products/${PRODUCT_NAME}/reviews/${productId}`
        )
          .expect(200)
          .expect('Content-Type', /json/);

        expect(_body.pagination.page).toBe(1);
        expect(_body.pagination.perPage).toBe(3);
      });
    });
  });
});
