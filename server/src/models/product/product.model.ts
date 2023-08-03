import mongoose from 'mongoose';

import Product from './product.mongo.js';
import products from '../../data/allbirds.json' assert { type: 'json' };
import User from '../user/user.mongo.js';

async function saveProducts() {
  try {
    const count = await Product.countDocuments();
    if (count !== 0) return;

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

    return { status: 200, products, total };
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

    return { status: 200, products, total };
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

    return { status: 200, filters: { sizes, bestFor, material, hues } };
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

async function getReviews(productId, skip = 0, limit = 3, page = 1) {
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

    const pagination = {
      total: count,
      page,
      perPage: reviews.length,
    };

    return { status: 200, pagination, rating, reviews };
  } catch {
    return { status: 500, message: 'unable to get reviews' };
  }
}

async function addReview(productId, review, user) {
  try {
    let { _id: userId, username, verified: verifiedBuyer } = user;
    const { score, title, content, customFields } = review;

    if (!(score && title && content))
      return { status: 400, message: 'some fields are empty' };

    if (!(score === Number.parseInt(score) && score >= 1 && score <= 5))
      return { status: 400, message: 'wrong rating' };

    if (!verifiedBuyer)
      return { status: 401, message: 'you must verify your account first' };

    let sizePurchased;
    for (const field of review?.customFields)
      if (field?.title === 'Size Purchased') sizePurchased = field.value;

    const userOrders = await User.findOne(
      {
        _id: userId,
        'orders.productId': new mongoose.Types.ObjectId(productId),
        'orders.size': sizePurchased,
      },
      { 'orders.$': 1 }
    );

    if (!userOrders?.orders || userOrders?.orders.length === 0)
      return {
        status: 400,
        message: "you didn't order this size of the product",
      };

    const [{ delivered, reviewed }] = userOrders.orders;

    // if (!delivered)
    //   return { status: 400, message: "your order hasn't been delivered yet" };

    if (reviewed)
      return { status: 400, message: 'you have been reviewed this product' };

    let [first, last] = username.split(' ');
    first = first[0].toUpperCase() + first.slice(1);
    last = last[0].toUpperCase();
    username = `${first} ${last}.`;

    const createdAt = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newReview = {
      score,
      title,
      content,
      username,
      verifiedBuyer,
      userId,
      createdAt,
      customFields,
    };

    const newRating = await getNewRating(productId, score);

    const { acknowledged: productAcknowledged } = await Product.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      {
        $inc: { 'reviews.count': 1 },
        $set: { 'reviews.rating': newRating },
        $push: { 'reviews.reviews': { $each: [newReview], $position: 0 } },
      },
      { new: true }
    );

    if (!productAcknowledged) throw new Error();

    const { acknowledged: userAcknowledged } = await User.updateOne(
      {
        _id: user._id,
        'orders.productId': new mongoose.Types.ObjectId(productId),
        'orders.size': sizePurchased,
      },
      { $set: { 'orders.$.reviewed': true } }
    );

    if (!userAcknowledged) throw new Error();

    const { status, pagination, rating, reviews, message } = await getReviews(
      productId
    );

    return {
      status: status === 200 ? 201 : status,
      pagination,
      rating,
      reviews,
      message,
    };
  } catch (err) {
    console.log(err);
    return { status: 500, message: 'unable to save review' };
  }
}

async function removeReview(productId, reviewId, userId) {
  try {
    const newRating = await getNewRating(productId);

    const { acknowledged } = await Product.updateOne(
      {
        _id: productId,
        'reviews.reviews._id': reviewId,
        'reviews.reviews.userId': userId,
      },
      {
        $pull: { 'reviews.reviews': { _id: reviewId } },
        $inc: { 'reviews.count': -1 },
        $set: { 'reviews.rating': newRating },
      }
    );

    if (!acknowledged) throw new Error();

    const reviews = await getReviews(productId);
    return { status: 200, reviews };
  } catch {
    return { status: 500, message: 'unable to remove reivew' };
  }
}

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

    if (existingItem) existingItem.amount++;
    else {
      const productExists = await Product.findOne(
        { _id: productId, 'editions.products.id': editionId },
        '-_id handle sizes'
      ).lean();

      if (!productExists)
        return { status: 404, message: "prdouct doesn't exist" };

      if (!productExists.sizes.includes(size))
        return { status: 404, message: 'this size is soldout' };

      items.push({ productId, editionId, size, amount: 1 });
    }

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

async function getNewRating(productId, score?) {
  const [{ _id: scores }] = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productId) } },
    { $project: { _id: '$reviews.reviews.score' } },
  ]);

  if (score) scores.push(score);

  const totalScores = scores.reduce((acc, i) => acc + i, 0);
  const newRating = Number(totalScores / scores.length).toFixed(1);
  return newRating;
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
