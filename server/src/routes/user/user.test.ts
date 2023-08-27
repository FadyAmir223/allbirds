import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../app.js';
import { authAgent } from '../../test/test.utils.js';
import {
  editLocation,
  location,
  loginData,
  product,
  product_2nd,
  userData,
} from '../../test/test.data.js';

describe('/user', () => {
  const agent = request.agent(app);

  beforeEach(async () => {
    await authAgent(agent, 'POST', '/api/auth/local/signup').send(userData);
  });

  afterEach(async () => {
    await mongoose.connection.dropCollection('users');
  });

  describe('needAuth', () => {
    test('check user agent', async () => {
      const agent = request.agent(app);

      await agent.post('/api/auth/local/login').send(loginData);

      await authAgent(agent, 'GET', '/api/user/orders', 'different user agent')
        .expect(401)
        .expect('Content-Type', /json/)
        .expect({ message: 'unauthorized access' });
    });
  });

  describe('/orders', () => {
    describe('GET /', () => {
      test('get order', async () => {
        await agent.post('/api/cart/add').send(product);
        const { body } = await authAgent(agent, 'GET', '/api/cart/orders')
          .expect(201)
          .expect('Content-Type', /json/);

        const { orders } = body;
        const [{ delivered, reviewed, amount }] = orders;

        expect(orders).toHaveLength(1);
        expect(orders[0]).toMatchObject(product);
        expect(delivered).toBeFalsy();
        expect(reviewed).toBeFalsy();
        expect(amount).toBe(1);
      });

      test('no orders', async () => {
        await authAgent(agent, 'GET', '/api/user/orders')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ orders: [] });
      });
    });

    describe('POST /', () => {
      test('make order', async () => {
        await agent.post('/api/cart/add').send(product);
        await agent.post('/api/cart/add').send(product_2nd);

        await authAgent(agent, 'GET', '/api/cart/orders')
          .expect(201)
          .expect('Content-Type', /json/);

        await agent.post('/api/cart/add').send(product_2nd);

        const { body } = await authAgent(agent, 'GET', '/api/cart/orders');

        const { orders, message } = body;
        const [{ delivered, reviewed, amount }, { amount: amount_2 }] = orders;

        expect(message).toBe('purchased successfully');
        expect(orders).toHaveLength(2);
        expect(orders[0]).toMatchObject(product);
        expect(delivered).toBeFalsy();
        expect(reviewed).toBeFalsy();
        expect(amount).toBe(1);
        expect(amount_2).toBe(2);
      });

      test('make order with empty cart', async () => {
        await authAgent(agent, 'GET', '/api/cart/orders')
          .expect({ message: 'there is no items to purchase' })
          .expect(400)
          .expect('Content-Type', /json/);
      });
    });

    describe('GET /history', () => {
      test('not delivered product', async () => {
        await authAgent(agent, 'GET', '/api/user/orders/history')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ orders: [] });
      });
    });
  });

  describe('/locations', () => {
    describe('GET /', () => {
      test('no location', async () => {
        await authAgent(agent, 'GET', '/api/user/locations')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ locations: [] });
      });

      test('two locations', async () => {
        await authAgent(agent, 'POST', '/api/user/locations').send(location);
        await authAgent(agent, 'POST', '/api/user/locations').send(location);

        const { body } = await authAgent(agent, 'GET', '/api/user/locations')
          .expect(200)
          .expect('Content-Type', /json/);

        const { locations: newLocations } = body;
        expect(newLocations).toHaveLength(2);
        expect(newLocations[0]).toMatchObject(location);
      });
    });

    describe('POST /', () => {
      test('empty fields', async () => {
        await authAgent(agent, 'POST', '/api/user/locations')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'some fields are missing' });
      });

      test('add location', async () => {
        await authAgent(agent, 'POST', '/api/user/locations')
          .send(location)
          .expect(201)
          .expect('Content-Type', /json/);

        const { body } = await authAgent(
          agent,
          'POST',
          '/api/user/locations'
        ).send(location);

        const { locations: newLocations } = body;
        expect(newLocations).toHaveLength(2);
        expect(newLocations[0]).toMatchObject(location);
      });
    });

    describe('DELETE /', () => {
      test('wrong id', async () => {
        await authAgent(agent, 'DELETE', '/api/user/locations/non-24-id')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid location id' });
      });

      test('one by one', async () => {
        await authAgent(agent, 'POST', '/api/user/locations').send(location);

        const { body: locations } = await authAgent(
          agent,
          'POST',
          '/api/user/locations'
        ).send(location);

        const { _id: id_1 } = locations.locations[0];
        const { _id: id_2 } = locations.locations[1];

        const { body } = await authAgent(
          agent,
          'DELETE',
          `/api/user/locations/${id_1}`
        )
          .expect(200)
          .expect('Content-Type', /json/);

        expect(body.locations).toHaveLength(1);

        await authAgent(agent, 'DELETE', `/api/user/locations/${id_2}`).expect({
          locations: [],
        });
      });
    });

    describe('PATCH /', () => {
      test('wrong id', async () => {
        await authAgent(agent, 'PATCH', '/api/user/locations/non-24-id')
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'invalid location id' });
      });

      test('empty fields', async () => {
        await authAgent(
          agent,
          'PATCH',
          '/api/user/locations/000000000000000000000000'
        )
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({ message: 'no fields to update location' });
      });

      test('edit location', async () => {
        const { body: location_1 } = await authAgent(
          agent,
          'POST',
          '/api/user/locations'
        ).send(location);

        const { _id } = location_1.locations[0];

        const { body } = await authAgent(
          agent,
          'PATCH',
          `/api/user/locations/${_id}`
        )
          .send(editLocation)
          .expect(200)
          .expect('Content-Type', /json/);

        expect(body.locations[0]).toMatchObject(editLocation);
        expect(body.locations[0]).toMatchObject({
          ...location,
          ...editLocation,
        });
      });
    });
  });
});
