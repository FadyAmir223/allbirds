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
        sizes: 1,
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
                    handle: '$$product.handle',
                    colorName: '$$product.colorName',
                    colors: '$$product.colors',
                    hues: '$$product.hues',
                    salePrice: '$$product.salePrice',
                    sizesSoldOut: '$$product.sizesSoldOut',
                    images: {
                      $filter: {
                        input: '$$product.images',
                        as: 'img',
                        cond: {
                          $or: [
                            {
                              $regexMatch: {
                                input: '$$img',
                                regex:
                                  'left|profile|lat|1-min|^((?!closeup).)*pink-1',
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
      $project: {
        products: 1,
        total: { $arrayElemAt: ['$total.count', 0] },
      },
    },
  ]);

  return { products, total };
}

async function getCollectionSale(collectionName, skip, limit) {
  const [{ products, total }] = await Product.aggregate([
    {
      $match: {
        gender: collectionName,
        'editions.edition': 'sale',
      },
    },
    {
      $project: {
        _id: 0,
        handle: 1,
        name: 1,
        price: 1,
        sizes: 1,
        editions: {
          $filter: {
            input: '$editions',
            as: 'edition',
            cond: { $eq: ['$$edition.edition', 'sale'] },
          },
        },
      },
    },
    {
      $project: {
        handle: 1,
        name: 1,
        price: 1,
        sizes: 1,
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
                    handle: '$$product.handle',
                    colorName: '$$product.colorName',
                    colors: '$$product.colors',
                    hues: '$$product.hues',
                    salePrice: '$$product.salePrice',
                    sizesSoldOut: '$$product.sizesSoldOut',
                    images: {
                      $filter: {
                        input: '$$product.images',
                        as: 'img',
                        cond: {
                          $or: [
                            {
                              $regexMatch: {
                                input: '$$img',
                                regex:
                                  'left|profile|lat|1-min|^((?!closeup).)*pink-1',
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

async function getCollectionFilters(collectionName) {
  const [{ sizes, bestFor, material, hues }] = await Product.aggregate([
    { $match: { $or: [{ type: collectionName }, { gender: collectionName }] } },
    {
      $group: {
        _id: null,
        sizes: { $addToSet: '$sizes' },
        bestFor: { $addToSet: '$bestFor' },
        material: { $addToSet: '$material' },
        hues: { $addToSet: '$editions.products.hues' },
      },
    },
    { $unwind: '$sizes' },
    { $unwind: '$sizes' },
    { $unwind: '$bestFor' },
    { $unwind: '$bestFor' },
    { $unwind: '$material' },
    { $unwind: '$hues' },
    { $unwind: '$hues' },
    { $unwind: '$hues' },
    { $unwind: '$hues' },
    {
      $group: {
        _id: null,
        sizes: { $addToSet: '$sizes' },
        bestFor: { $addToSet: '$bestFor' },
        material: { $addToSet: '$material' },
        hues: { $addToSet: '$hues' },
      },
    },
    {
      $project: {
        _id: 0,
        sizes: 1,
        bestFor: 1,
        material: 1,
        hues: 1,
      },
    },
  ]);

  bestFor.sort();
  material.sort();
  hues.sort();

  const extractNumber = (str) => +str.match(/[-+]?\d+(\.\d+)?/)[0];
  const isNumber = (str) => !isNaN(parseFloat(str));
  const startWithW = (str) => str.startsWith('w');

  sizes.sort((a, b) => {
    const aIsNumber = isNumber(a);
    const bIsNumber = isNumber(b);

    switch (true) {
      case (aIsNumber && bIsNumber) || (!aIsNumber && !bIsNumber):
        return extractNumber(a) - extractNumber(b);
      case startWithW(a) && !startWithW(b):
        return -1;
      case !startWithW(a) && startWithW(b):
        return 1;
      default:
        return a.localeCompare(b);
    }
  });

  return { sizes, bestFor, material, hues };
}

export {
  saveProducts,
  getProduct,
  getReviews,
  getCollection,
  getCollectionSale,
  getCollectionFilters,
};
