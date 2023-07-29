import mongoose from 'mongoose';
import Product from './product.mongo.js';
import products from '../../data/allbirds.json' assert { type: 'json' };

async function saveProducts() {
  try {
    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { handle: product.handle },
          update: { $set: product },
          upsert: true,
        },
      }))
    );
  } catch (err) {
    console.error('error upserting products:', err);
  }
}

async function getCollection(type, gender, skip, limit) {
  try {
    const [{ products, total }] = await Product.aggregate([
      {
        $match: {
          $or: [
            { type: type, gender: gender },
            { type: type, gender: 'unisex' },
          ],
        },
      },
      {
        $project: {
          _id: 1,
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
                      id: '$$product.id',
                      handle: '$$product.handle ',
                      colorName: '$$product.colorName',
                      colors: '$$product.colors',
                      hues: '$$product.hues',
                      salePrice: '$$product.salePrice',
                      sizesSoldOut: '$$product.sizesSoldOut',

                      image: {
                        $arrayElemAt: [
                          {
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
                          0,
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

    return { products, total, status: 200 };
  } catch {
    return { status: 500, message: 'unable to get sales' };
  }
}

async function getCollectionSale(type, gender, skip, limit) {
  try {
    const [{ products, total }] = await Product.aggregate([
      {
        $match: {
          $or: [
            { type: type, gender: gender },
            { type: type, gender: 'unisex' },
          ],
        },
      },
      {
        $project: {
          _id: 1,
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
                      id: '$$product.id',
                      handle: '$$product.handle',
                      colorName: '$$product.colorName',
                      colors: '$$product.colors',
                      hues: '$$product.hues',
                      salePrice: '$$product.salePrice',
                      sizesSoldOut: '$$product.sizesSoldOut',
                      image: {
                        $arrayElemAt: [
                          {
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
                          0,
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

    return { products, total, status: 200 };
  } catch {
    return { status: 500, message: 'unable to get sales' };
  }
}

async function getCollectionFilters(type, gender) {
  try {
    const [{ sizes, bestFor, material, hues }] = await Product.aggregate([
      {
        $match: {
          $or: [
            { type: type, gender: gender },
            { type: type, gender: 'unisex' },
          ],
        },
      },
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
          return 1;
        case !startWithW(a) && startWithW(b):
          return -1;
        default:
          return a.localeCompare(b);
      }
    });

    return { filters: { sizes, bestFor, material, hues }, status: 200 };
  } catch {
    return { status: 500, message: 'unable to get filters' };
  }
}

async function getProduct(id) {
  try {
    const product = await Product.findById(
      id,
      '-__v -recommendations._id -material_features._id -dropdown._id -editions._id -reviews'
    ).lean();

    if (!product) return { status: 404, message: 'product not found' };
    return { status: 200, product };
  } catch {
    return { status: 500, message: 'unable to get product' };
  }
}

async function getReviews(productId, skip, limit) {
  try {
    const {
      reviews: { reviews, count, rating },
    } = await Product.findById(productId, {
      _id: 0,
      'reviews.count': 1,
      'reviews.rating': 1,
      'reviews.reviews': { $slice: [skip, limit] },
    }).lean();

    if (!reviews)
      return { status: 404, message: 'no reviews for this product' };
    return { status: 200, reviews, count, rating };
  } catch {
    return { status: 500, message: 'unable to get reviews' };
  }
}

async function addReview() {}

async function removeReview() {}

async function getCart(items) {
  try {
    if (!items || items.length === 0)
      return { status: 404, message: 'your cart is empty' };

    const cart = (
      await Promise.all(
        items.map(
          async ({ productId, editionId, size, amount }) =>
            await Product.aggregate([
              { $match: { _id: new mongoose.Types.ObjectId(productId) } },
              { $unwind: '$editions' },
              { $unwind: '$editions.products' },
              { $match: { 'editions.products.id': editionId } },
              { $addFields: { amount, productId, editionId } },
              {
                $project: {
                  _id: 0,
                  amount,
                  productId,
                  editionId,
                  size,
                  handle: '$handle',
                  name: '$name',
                  price: '$price',
                  salePrice: '$editions.products.salePrice',
                  colorName: '$editions.products.colorName',
                  soldOut: {
                    $setIsSubset: [[size], '$editions.products.sizesSoldOut'],
                  },
                  image: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$editions.products.images',
                          as: 'img',
                          cond: {
                            $regexMatch: {
                              input: '$$img',
                              regex:
                                '_45_|_angle_|1-min|^((?!closeup).)*pink-1',
                              options: 'i',
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            ])
        )
      )
    ).flat();
    return { status: 200, cart };
  } catch {
    return { status: 500, message: 'unable to get the cart' };
  }
}

async function addCartItem(items, { productId, editionId, size }) {
  try {
    if (!items) items = [];

    const existingItem = items.find(
      (item) => item.editionId === editionId && item.size === size
    );

    existingItem
      ? existingItem.amount++
      : items.push({ productId, editionId, size, amount: 1 });

    const { status, cart, message } = await getCart(items);

    return {
      status: status === 200 ? 201 : status,
      newItems: items,
      cart,
      message,
    };
  } catch {
    return {
      status: 500,
      message: 'unable to save item to cart',
    };
  }
}

async function removeCartItem(items, { editionId, size }, _delete = false) {
  try {
    if (items?.length === 0)
      return { status: 404, message: 'no items in cart' };

    let matchedItem, matchedIdx;

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (item.editionId === editionId && item.size === size) {
        matchedItem = item;
        matchedIdx = idx;
        break;
      }
    }

    if (!matchedItem) return { status: 404, message: 'item not found in cart' };

    if (_delete || matchedItem.amount === 1)
      items = items.filter(
        (item) => !(item.editionId === editionId && item.size === size)
      );
    else items[matchedIdx].amount--;

    const { status, cart, message } = await getCart(items);
    return { status, newItems: items, cart, message };
  } catch (error) {
    return {
      status: 500,
      message: 'unable to remove item from cart',
    };
  }
}

export {
  saveProducts,
  getCollection,
  getCollectionSale,
  getCollectionFilters,
  getProduct,
  getCart,
  addCartItem,
  removeCartItem,
  getReviews,
  addReview,
  removeReview,
};
