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

async function getCollection(collectionName, skip, limit) {
  const [{ products, total }] = await Product.aggregate([
    {
      $match: {
        $or: [{ gender: collectionName }, { type: collectionName }],
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        handle: 1,
        price: 1,
        editions: {
          $map: {
            input: '$editions',
            as: 'edition',
            in: {
              edition: '$$edition.edition',
              products: {
                $map: {
                  input: '$$edition.products',
                  as: 'product',
                  in: {
                    _id: '$$product._id',
                    handle: '$$product.handle',
                    name: '$$product.name',
                    price: '$$product.price',
                    images: {
                      $filter: {
                        input: '$$product.images',
                        as: 'img',
                        cond: {
                          $or: [
                            {
                              $regexMatch: {
                                input: '$$img',
                                regex: 'left|profile|lat|1-min|^((?!closeup).)*pink-1',
                                options: 'i',
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $facet: {
        products: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
    {
      $unwind: '$total',
    },
    {
      $project: {
        products: 1,
        total: '$total.count',
      },
    },
  ]);

  return { products, total };
}

async function getCollectionSale(collectionName, skip, limit) {
  const [{ products, total }] = await Product.aggregate([
    {
      $match: {
        $or: [{ gender: collectionName }, { type: collectionName }],
        'editions.edition': 'sale',
      },
    },
    {
      $project: {
        list: {
          $filter: {
            input: '$editions',
            as: 'edition',
            cond: { $eq: ['$$edition.edition', 'sale'] },
          },
        },
      },
    },
    {
      $facet: {
        products: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
    {
      $unwind: '$total',
    },
    {
      $project: {
        products: 1,
        total: '$total.count',
      },
    },
  ]);

  return { products, total };
}

export {
  saveProducts,
  getProduct,
  getReviews,
  getCollection,
  getCollectionSale,
};
