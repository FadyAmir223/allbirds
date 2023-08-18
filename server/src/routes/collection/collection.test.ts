import app from '../../app.js';

test('collection random test', async () => {
  expect(0).toBe(0);
});

// import axios from 'axios';
// import https from 'https';

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });

// describe('/collections', () => {
//   describe('GET /', () => {
//     test('200 status & products', async () => {
//       const response = await axios.get(
//         'https://localhost:3000/api/collections?type=socks&page=2&limit=1',
//         { httpsAgent: agent }
//       );

//       const body = response.data;
//       const { total, page, perPage } = body.pagination;

//       expect(response.status).toBe(200);
//       expect(total).toBeGreaterThan(1);
//       expect(page).toBe(2);
//       expect(perPage).toBe(1);
//       expect(body.products).toHaveLength(1);
//     });

//     test('400 status when limit is greater than 50', async () => {
//       try {
//         await axios.get(
//           'https://localhost:3000/api/collections?type=socks&limit=51',
//           { httpsAgent: agent }
//         );
//       } catch (error) {
//         const response = error.response;

//         expect(response.status).toBe(400);
//         expect(response.data).toEqual({
//           message: 'limit must be less than 50',
//         });
//       }
//     });

//     test('400 status when type field is missing', async () => {
//       try {
//         await axios.get('https://localhost:3000/api/collections', {
//           httpsAgent: agent,
//         });
//       } catch (error) {
//         const response = error.response;

//         expect(response.status).toBe(400);
//         expect(response.data).toEqual({ message: 'type field is empty' });
//       }
//     });

//     test('200 status and no products when type is wrong', async () => {
//       const response = await axios.get(
//         'https://localhost:3000/api/collections?type=wrong',
//         { httpsAgent: agent }
//       );

//       const body = response.data;
//       expect(response.status).toBe(200);
//       expect(body.pagination.total).toBe(0);
//     });
//   });

//   describe('GET /sale', () => {
//     test('200 status & products with only sale edition', async () => {
//       const response = await axios.get(
//         'https://localhost:3000/api/collections/sale?type=shoes&gender=womens&limit=1',
//         { httpsAgent: agent }
//       );

//       const body = response.data;
//       expect(response.status).toBe(200);
//       expect(body.products[0].editions).toHaveLength(1);
//       expect(body.products[0].editions[0].edition).toBe('sale');

//       const x = await axios.get(
//         'https://localhost:3000/api/collections/sale?type=shoes&gender=womens&limit=1',
//         { httpsAgent: agent }
//       );

//       expect(x.status).toBe(200);
//     });
//   });

//   describe('GET /filter', () => {
//     test('200 status & filters', async () => {
//       const response = await axios.get(
//         'https://localhost:3000/api/collections/filters?type=socks',
//         { httpsAgent: agent }
//       );

//       const body = response.data;
//       expect(response.status).toBe(200);
//       expect(body.filters.sizes?.length).toBeGreaterThan(0);
//     });
//   });

//   test('GET /handle', async () => {
//     const response = await axios.get(
//       'https://localhost:3000/api/products/mens-tree-runners',
//       { httpsAgent: agent }
//     );

//     expect(response.status).toBe(200);
//   });
// });
