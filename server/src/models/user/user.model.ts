import mongoose from 'mongoose';

import User from './user.mongo.js';
import { getCart } from '../product/product.model.js';

async function getUserById(id) {
  try {
    return await User.findById(
      id,
      'username email social role verified'
    ).lean();
  } catch {}
}

async function getUserByEmail(email) {
  try {
    return await User.findOne(
      { email },
      'username email password social'
    ).lean();
  } catch {}
}

async function getLocalUser(email) {
  try {
    return await User.findOne(
      {
        email,
        'social.provider': { $exists: false },
      },
      '-__v -social'
    ).lean();
  } catch {}
}

async function createLocalUser(username, email, password) {
  try {
    let role, verified;

    if (email === 'fadyamir223@gmail.com') {
      role = 'admin';
      verified = true;
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      verified,
    });
    return { status: 201, id: user._id, message: 'user created' };
  } catch {
    return { status: 500, message: 'unable to create user' };
  }
}

async function createSocialUser(
  username,
  email,
  provider,
  accessToken,
  refreshToken
) {
  try {
    const role = email === 'fadyamir223@gmail.com' ? 'admin' : undefined;

    return await User.findOneAndUpdate(
      { email, social: { provider } },
      {
        username,
        email,
        role,
        verified: true,
        social: { provider, accessToken, refreshToken },
      },
      { upsert: true, new: true }
    );
  } catch {}
}

async function updateAccessToken(userId, accessToken) {
  try {
    return await User.findByIdAndUpdate(userId, {
      social: { accessToken },
    }).lean();
  } catch {}
}

async function getLocations(userId) {
  try {
    const { locations } = await User.findById(userId, { locations: 1 }).lean();
    if (!locations) return { status: 404, message: 'user not found' };
    return { locations, status: 200 };
  } catch {
    return { status: 500, message: 'unable to get locations' };
  }
}

async function addLocation(userId, location) {
  try {
    const { locations } = await User.findByIdAndUpdate(
      userId,
      { $push: { locations: location } },
      { new: true }
    ).lean();

    if (!locations) return { status: 404, message: 'user not found' };
    return { locations, status: 201 };
  } catch {
    return { status: 500, message: 'unable to add location' };
  }
}

async function removeLocation(userId, locationId) {
  try {
    const { locations } = await User.findByIdAndUpdate(
      userId,
      { $pull: { locations: { _id: locationId } } },
      { new: true }
    ).lean();

    if (!locations) return { status: 404, message: 'user not found' };
    return { locations, status: 200 };
  } catch {
    return { status: 500, message: 'unable to add location' };
  }
}

async function updateLocation(userId, locationId, fields) {
  try {
    const _fields = {};
    for (const key in fields) _fields[`locations.$.${key}`] = fields[key];

    const { locations } = await User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(userId),
        'locations._id': new mongoose.Types.ObjectId(locationId),
      },
      { $set: { ..._fields } },
      { new: true }
    ).lean();

    if (!locations) return { status: 404, message: 'user not found' };
    return { locations, status: 200 };
  } catch {
    return { status: 500, message: 'unable to update location' };
  }
}

async function orderCart(userId, items) {
  try {
    if (items?.length === 0)
      return { status: 401, message: 'there is no items to purchase' };

    const { cart } = await getCart(items);

    if (items.length !== cart?.length)
      return { status: 401, message: 'invalid product in cart' };

    const soldOutItems = cart
      .filter(({ soldOut }) => soldOut)
      .map(({ name, colorName }) => `${name} - ${colorName}`);

    if (soldOutItems.length !== 0)
      return {
        status: 404,
        message: 'some products in cart are sold out',
        soldOutItems,
      };

    const user = await User.findById(userId, 'orders');

    if (!user) return { status: 404, message: 'user not found' };

    for (const item of items) {
      const { productId, editionId, size, amount } = item;

      const existingOrder = user.orders.find(
        (order) =>
          String(order.productId) === productId &&
          order.editionId === editionId &&
          order.size === size
      );

      if (existingOrder) existingOrder.amount += amount;
      else
        user.orders.push({
          productId,
          editionId,
          size,
          amount,
          delivered: false,
        });
    }

    await user.save();

    // TODO:

    /////////////
    // payment //
    /////////////

    return {
      orders: user.orders,
      status: 201,
      message: 'purchased successfully',
    };
  } catch {
    return { status: 500, message: 'error happened during purchase' };
  }
}

async function getOrders(userId) {
  try {
    const user = await User.findOne(
      { _id: userId, 'orders.delivered': false },
      'orders'
    ).lean();

    const orders = user?.orders ? user.orders : [];
    return { orders, status: 200 };
  } catch {
    return { status: 500, message: 'unable to get orders' };
  }
}

export {
  getUserById,
  getUserByEmail,
  getLocalUser,
  createLocalUser,
  createSocialUser,
  updateAccessToken,
  getLocations,
  addLocation,
  removeLocation,
  updateLocation,
  orderCart,
  getOrders,
};
