import request from 'supertest';
import app from '../../app.js';

import mongoose from 'mongoose';

describe('/products', () => {
  const PRODUCT_NAME = 'mens-tree-runners';

  test('collection random test', async () => {
    // const res = await
    request(app)
      .get(`/api/products/${PRODUCT_NAME}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        console.log(response);
      });

    // expect(res.body.product?.handle).toMatch(PRODUCT_NAME);
  });
});

// import axios from 'axios';
// import https from 'https';

// const instance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false,
//   }),
// });

// describe('/products', () => {
//   test('GET /handle', async () => {
//     const res = await instance.get(
//       'https://localhost:3000/api/products/mens-tree-runners'
//     );
//     expect(res.status).toBe(200);
//   });
// });
