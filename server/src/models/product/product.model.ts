import Product from './product.mongo.js';
import products from '../../data/allbirds.json' assert { type: 'json' };

async function saveProducts() {
  for (const product of products) {
    const productItem = new Product(product);

    try {
      const { _id, ...updateData } = productItem.toObject();
      await Product.updateOne({ handle: productItem.handle }, updateData, {
        upsert: true,
      });
    } catch (err) {
      console.error(`couldn't save product: ${err}`);
    }
  }
}

async function getCollection(collectionName, skip, limit) {
  const products = await Product.find(
    {
      $or: [{ gender: collectionName }, { type: collectionName }],
    },
    '-_id name handle price material silhouette bestFor sizes editions.edition editions.products'
  )
    .skip(skip)
    .limit(limit);

  console.log({ skip, limit });

  const count = await Product.countDocuments({
    $or: [{ gender: collectionName }, { type: collectionName }],
  });

  for (const product_ of products)
    for (const edition of product_.editions)
      for (const product of edition.products) {
        const productImages = product.images.filter((img) =>
          ['left', 'profile', 'lat'].some((keyword) =>
            img.toLowerCase().includes(keyword)
          )
        );

        if (productImages.length === 0) productImages[0] = product.images[0];
        product.images = productImages;
      }

  return { products, count };
}

async function getProduct(productName) {
  return await Product.findOne(
    { handle: productName },
    '-_id -__v -recommendations._id -material_features._id -dropdown._id -editions._id -editions.products._id -reviews'
  );
}

async function getReviews(productName, skip, limit) {
  return await Product.findOne(
    { handle: productName },
    {
      _id: 0,
      'reviews.count': 1,
      'reviews.rating': 1,
      'reviews.reviews': { $slice: [skip, limit] },
    }
  );
}

export { saveProducts, getCollection, getProduct, getReviews };
