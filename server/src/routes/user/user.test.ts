import request from 'supertest';
import app from '../../app.js';

describe('/user', () => {
  const server = request(app);
  const agent = request.agent(app);

  const authAgent = (
    agent = request(app),
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
    endpoint: string,
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
  ) => agent[method.toLowerCase()](endpoint).set('User-Agent', userAgent);

  const userData = {
    firstName: 'fady',
    lastName: 'amir',
    email: 'fadyamir23@gmail.com',
    password: 'P@ssw0rd',
    confirmPassword: 'P@ssw0rd',
  };

  const loginData = {
    username: userData.email,
    password: userData.password,
  };

  const product = {
    handle: 'mens-tree-runners',
    editionId: 6660112482384,
    size: '9',
  };

  const product_2nd = { ...product, size: '10' };

  beforeAll(async () => {
    await authAgent(agent, 'POST', '/api/auth/local/signup').send(userData);
  });

  describe('needAuth', () => {
    test('check logged in', async () => {
      await server
        .get('/api/user/orders')
        .expect(401)
        .expect('Content-Type', /json/)
        .expect({ message: 'you must login first' });
    });

    test('check user agent', async () => {
      const agent = request.agent(app);

      await agent.post('/api/auth/local/login').send(loginData);

      await authAgent(agent, 'GET', '/api/user/orders', 'different user agent')
        .expect(401)
        .expect('Content-Type', /json/)
        .expect({ message: 'unauthorized access' });
    });
  });

  describe('GET /orders', () => {
    test('no orders', async () => {
      await authAgent(agent, 'GET', '/api/user/orders')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ orders: [] });
    });
  });

  describe('POST /orders', () => {
    test('make order with empty cart', async () => {
      await authAgent(agent, 'POST', '/api/user/orders')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'there is no items to purchase' });
    });

    // await authAgent(agent, 'POST', '/api/cart/add').send(product);

    test('make order', async () => {
      await authAgent(agent, 'POST', '/api/cart/add').send(product);
      const { body } = await authAgent(agent, 'POST', '/api/user/orders')
        .expect(201)
        .expect('Content-Type', /json/);

      const { orders } = body;
      const [{ delivered, reviewed, amount }] = orders;

      expect(body.message).toBe('purchased successfully');
      expect(orders).toHaveLength(1);
      expect(orders[0]).toMatchObject(product);
      expect(delivered).toBeFalsy();
      expect(reviewed).toBeFalsy();
      expect(amount).toBe(1);
    });
  });
});
