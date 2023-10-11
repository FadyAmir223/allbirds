import fs from 'fs';
import path from 'path';
import Filter from 'bad-words';

import Product from './product.mongo.js';
import User from '../user/user.mongo.js';
import { __dirname } from '../../utils/loadEnv.js';
// import products from '../../data/allbirds.json' assert { type: 'json' };

async function saveProducts() {
  try {
    const count = await Product.countDocuments();
    if (count !== 0) return;

    const filePath = path.join(__dirname, '../../data/allbirds.json');
    const jsonData = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    const products = JSON.parse(jsonData);

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

    return { status: 200, products: products || [], total: total || 0 };
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

    return { status: 200, products: products || [], total: total || 0 };
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
            { type: type, gender },
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

async function getProduct(handle) {
  try {
    const product = await Product.findOne(
      { handle },
      '-__v -recommendations._id -material_features._id -dropdown._id -editions._id -reviews'
    ).lean();

    if (!product) return { status: 404, message: 'product not found' };
    return { status: 200, product };
  } catch {
    return { status: 500, message: 'unable to get product' };
  }
}

async function getReviews(handle, skip = 0, limit = 3, page = 1) {
  try {
    const {
      reviews: { reviews, count, rating },
    } = await Product.findOne(
      { handle },
      {
        _id: 0,
        'reviews.count': 1,
        'reviews.rating': 1,
        'reviews.reviews': { $slice: [skip, limit] },
      }
    ).lean();

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

async function addReview(handle, review, user) {
  try {
    const { _id: userId, verified: verifiedBuyer } = user;
    let { username } = user;
    const { score, customFields } = review;
    let { title, content } = review;

    let sizePurchased;
    for (const field of customFields)
      if (field?.title.toLowerCase() === 'size purchased')
        sizePurchased = field.value;

    if (!sizePurchased)
      return { status: 400, message: 'missing size purchased field' };

    const _user = await User.findOne(
      {
        _id: userId,
        'orders.handle': handle,
        'orders.size': sizePurchased,
      },
      { 'orders.$': 1, username: 1 }
    ).lean();

    if (!_user?.orders || _user?.orders.length === 0)
      return {
        status: 400,
        message: "you didn't order this size of the product",
      };

    const [{ /* delivered, */ reviewed }] = _user.orders;

    // if (IS_PRODUCTION && !delivered)
    //   return { status: 400, message: "your order hasn't been delivered yet" };

    if (reviewed)
      return { status: 400, message: 'you already have reviewed this product' };

    const filter = new Filter();
    title = filter.clean(title);
    content = filter.clean(content);

    let [first, last] = _user.username.split(' ');
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

    const newRating = await getNewRating(handle, score);

    const { acknowledged: productAcknowledged } = await Product.updateOne(
      { handle },
      {
        $inc: { 'reviews.count': 1 },
        $set: { 'reviews.rating': newRating },
        $push: { 'reviews.reviews': { $each: [newReview], $position: 0 } },
      },
      { new: true }
    );

    if (!productAcknowledged) throw new Error();

    const userToUpdate = await User.findById(user._id, 'orders');

    for (const order of userToUpdate.orders)
      if (order.handle === handle && order.size === sizePurchased)
        order.reviewed = true;

    userToUpdate.save();

    const { status, pagination, rating, reviews, message } = await getReviews(
      handle
    );

    return {
      status: status === 200 ? 201 : status,
      pagination,
      rating,
      reviews,
      message,
    };
  } catch {
    return { status: 500, message: 'unable to save review' };
  }
}

async function removeReview(handle, reviewId, userId) {
  try {
    // TODO: calculate new rating after removing review

    const newRating = await getNewRating(handle);

    const { acknowledged, modifiedCount } = await Product.updateOne(
      {
        handle,
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

    if (modifiedCount === 0)
      return { status: 400, message: 'invalid review id' };

    const { status, pagination, rating, reviews, message } = await getReviews(
      handle
    );

    return { status, pagination, rating, reviews, message };
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
          async ({ handle, editionId, size, amount }) =>
            await Product.aggregate([
              { $match: { handle } },
              { $unwind: '$editions' },
              { $unwind: '$editions.products' },
              { $match: { 'editions.products.id': editionId } },
              { $addFields: { amount, handle, editionId } },
              {
                $project: {
                  _id: 0,
                  amount,
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

async function addCartItem(items, { handle, editionId, size }) {
  try {
    if (!items) items = [];

    const existingItem = items.find(
      (item) => item.editionId === editionId && item.size === size
    );

    if (existingItem) existingItem.amount++;
    else {
      const product = await Product.findOne(
        { handle, 'editions.products.id': editionId },
        '-_id editions.products.$'
      ).lean();

      if (!product) return { status: 404, message: "prdouct doesn't exist" };

      for (const _editions of product.editions)
        for (const _producst of _editions.products)
          if (
            _producst.id === editionId &&
            _producst.sizesSoldOut.includes(size)
          )
            return { status: 404, message: 'this size is soldout' };

      items.push({ handle, editionId, size, amount: 1 });
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
    if (!items || items?.length === 0)
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

async function getNewRating(handle, score?) {
  const [{ _id: scores }] = await Product.aggregate([
    { $match: { handle } },
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
