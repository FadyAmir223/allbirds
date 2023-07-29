import mongoose from 'mongoose';

import User from './user.mongo.js';
import { getCart } from '../product/product.model.js';

async function getUserById(id) {
  try {
    return await User.findById(
      id,
      'username email social verified role'
    ).lean();
  } catch {}
}

async function getUserByEmail(email) {
  try {
    return await User.findOne(
      { email },
      'username email password social verified'
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
    const role = email === 'fadyamir223@gmail.com' ? 'admin' : undefined;

    const user = await User.create({ username, email, password, role });
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

    if (!locations) throw new Error('user not found');
    return { locations, status: 201 };
  } catch (err) {
    const message = err?.message ? err.message : 'unable to add location';
    return { status: 500, message };
  }
}

async function removeLocation(userId, locationId) {
  try {
    const { locations } = await User.findByIdAndUpdate(
      userId,
      { $pull: { locations: { _id: locationId } } },
      { new: true }
    ).lean();

    if (!locations) throw new Error('user not found');
    return { locations, status: 200 };
  } catch (err) {
    const message = err?.message ? err.message : 'unable to add location';
    return { status: 500, message };
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

    if (!locations) throw new Error('user not found');
    return { locations, status: 200 };
  } catch (err) {
    const message = err?.message ? err.message : 'unable to update location';
    return { status: 500, message };
  }
}

async function orderCart(user, items) {
  try {
    if (items?.length)
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
        message: 'products in cart are sold out',
        soldOutItems,
      };

    // payment

    return { status: 201, message: 'purchased successfully' };
  } catch {
    return { status: 500, message: 'error happened during purchase' };
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
};
