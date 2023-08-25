import request from 'supertest';
import app from '../app.js';

const server = request(app);

const authAgent = (
  agent = request(app),
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  endpoint: string,
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
) => agent[method.toLowerCase()](endpoint).set('User-Agent', userAgent);

export { server, authAgent };
