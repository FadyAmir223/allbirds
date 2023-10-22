import app from './app.js';
import { SERVER_PORT, SERVER_URL } from './config/loadEnv.js';
import { saveProducts } from './models/product/product.model.js';
import { mongoConnect } from './services/mongo.js';

(async function startServer() {
  await mongoConnect();
  await saveProducts();

  app.listen(SERVER_PORT, () => {
    console.log(SERVER_URL);
  });
})();
