import request from 'supertest';

import app from '../../app.js';

describe('/cart', () => {
  const server = request(app);

  const product = {
    handle: 'mens-tree-runners',
    editionId: 6660112482384,
    size: '9',
  };
  const product_2nd = { ...product, size: '10' };
  const productSoldOut = { ...product, size: '8' };
  const productToRemove = { editionId: product.editionId, size: product.size };

  describe('GET /', () => {
    test('empty cart', async () => {
      await server
        .get('/api/cart')
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'your cart is empty' });
    });

    test('non empty cart', async () => {
      const agent = request.agent(app);
      await agent.post('/api/cart/add').send(product).expect(201);
      await agent.get('/api/cart').expect(200).expect('Content-Type', /json/);
    });
  });

  describe('POST /add', () => {
    test('multiple products', async () => {
      const agent = request.agent(app);

      await agent
        .post('/api/cart/add')
        .send(product)
        .expect(201)
        .expect('Content-Type', /json/);

      await agent.post('/api/cart/add').send(product_2nd);
      const { body } = await agent.post('/api/cart/add').send(product);

      const [product_1, product_2] = body.cart;

      expect(body.cart).toHaveLength(2);
      expect(product_1).toMatchObject(product);
      expect(product_1.soldOut).toBeFalsy();
      expect(product_1.amount).toBe(2);
      expect(product_2.amount).toBe(1);
    });

    test('empty fileds', async () => {
      await server
        .post('/api/cart/add')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'some fields are empty' });
    });

    test('wrong product', async () => {
      await server
        .post('/api/cart/add')
        .send({ ...product, handle: 'wrong-product' })
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: "prdouct doesn't exist" });
    });

    test('sold out product', async () => {
      await server
        .post('/api/cart/add')
        .send(productSoldOut)
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'this size is soldout' });
    });
  });

  describe('POST /remove', () => {
    test('remove item', async () => {
      const agent = request.agent(app);

      await agent.post('/api/cart/add').send(product);
      await agent.post('/api/cart/add').send(product);

      const { body } = await agent
        .delete('/api/cart/remove')
        .send(productToRemove)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(body.cart[0].amount).toBe(1);

      await agent
        .delete('/api/cart/remove')
        .send(productToRemove)
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'your cart is empty' });
    });

    test('missing field', async () => {
      await server
        .delete('/api/cart/remove')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({ message: 'some fields are empty' });
    });

    test('no items in cart', async () => {
      const agent = request.agent(app);

      await agent
        .delete('/api/cart/delete')
        .send(productToRemove)
        .expect(404)
        .expect({ message: 'no items in cart' });
    });

    test('remove item not in cart', async () => {
      const agent = request.agent(app);

      await agent.post('/api/cart/add').send(product);

      await agent
        .delete('/api/cart/remove')
        .send(product_2nd)
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'item not found in cart' });
    });
  });

  describe('POST /delete', () => {
    test('delete item', async () => {
      const agent = request.agent(app);

      await agent.post('/api/cart/add').send(product);
      await agent.post('/api/cart/add').send(product);

      await agent
        .delete('/api/cart/delete')
        .send(productToRemove)
        .expect(404)
        .expect('Content-Type', /json/)
        .expect({ message: 'your cart is empty' });
    });
  });
});
