import https from 'https';
import fs from 'fs';

import { SERVER_DOMAIN, SERVER_PORT } from './utils/loadEnv.js';
import { mongoConnect } from './services/mongo.js';
import app from './app.js';
import { saveProducts } from './models/product/product.model.js';

const server = https.createServer(
  { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
  app
);

(async function startServer() {
  await mongoConnect();
  await saveProducts();

  server.listen(SERVER_PORT, () => {
    console.log('\x1b[36m', `${SERVER_DOMAIN}:${SERVER_PORT}`, '\x1b[0m');
  });
})();
