import Product from './product.mongo.js';

import products from '../../data/allbirds.json' assert { type: 'json' };

async function saveProducts() {
  for (const product of products) {
    const productItem = new Product(product);

    try {
      await Product.updateOne({ handle: productItem.handle }, productItem, {
        upsert: true,
      });
    } catch (err) {
      console.error(`couldn't save planet ${err}`);
    }
  }
}

export { saveProducts };
