import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import User from './user.mongo.js';
import { getCart } from '../product/product.model.js';
import { mailResetPassword, mailVerifyAccount } from '../../services/mail.js';
import { CLIENT_DOMAIN } from '../../config/loadEnv.js';

async function getUserById(id) {
  try {
    return await User.findById(
      id,
      'email social role verified security.userAgent'
    ).lean();
  } catch {
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    return await User.findOne(
      { email },
      'username email password social'
    ).lean();
  } catch {
    return null;
  }
}

async function getLocalUser(_email) {
  try {
    const { email, password, id } = await User.findOne(
      {
        email: _email,
        'social.provider': { $exists: false },
      },
      'email password'
    );
    return { email, password, id };
  } catch {
    return null;
  }
}

async function createLocalUser(username, email, password, userAgent, deviceId) {
  try {
    let role, verified;

    if (email === 'fadyamir223@gmail.com') {
      role = 'admin';
      verified = true;
    }

    const verifyToken = !verified
      ? await sendVerifyEmail({ username, email })
      : undefined;

    const { id } = await User.create({
      username,
      email,
      password,
      role,
      verified,
      verifyToken,
      security: {
        userAgent,
        trustedDevices: [deviceId],
      },
    });

    return { status: 201, id, message: 'user created' };
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

    const user = await User.findOneAndUpdate(
      { email, 'social.provider': provider },
      {
        username,
        email,
        role,
        verified: true,
        social: { provider, accessToken, refreshToken },
      },
      { upsert: true, new: true, fields: { _id: 1 } }
    ).lean();

    return { id: user._id };
  } catch {
    return null;
  }
}

async function addUserSecurity(userId, userAgent, deviceId) {
  try {
    const { acknowledged } = await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          'security.userAgent': userAgent,
          'security.trustedDevices': deviceId,
        },
      }
    );
    return acknowledged;
  } catch {
    return false;
  }
}

async function updateAccessToken(userId, accessToken) {
  try {
    return await User.findByIdAndUpdate(userId, {
      social: { accessToken },
    }).lean();
  } catch {
    return null;
  }
}

async function getLocations(userId) {
  try {
    const { locations } = await User.findById(userId, { locations: 1 }).lean();
    if (!locations) return { status: 404, message: 'user not found' };
    return { status: 200, locations };
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
    return { status: 201, locations };
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
    return { status: 200, locations };
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
    return { status: 200, locations };
  } catch {
    return { status: 500, message: 'unable to update location' };
  }
}

async function orderCart(userId, items) {
  try {
    const { cart } = await getCart(items);

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
      const { handle, editionId, size, amount } = item;

      const existingOrder = user.orders.find(
        (order) =>
          String(order.handle) === handle &&
          order.editionId === editionId &&
          order.size === size
      );

      if (existingOrder) existingOrder.amount += amount;
      else
        user.orders.push({
          handle,
          editionId,
          size,
          amount,
          delivered: false,
          reviewed: false,
        });
    }

    await user.save();

    // TODO: payment

    /*
      1- total = items.price * items.count
      2- gateway: Stripe, PayPal, Skrill, Payoneer
      3- create payment request { total, paymentMethod, customerInfo  }
      4- handle response
    */

    return {
      status: 201,
      orders: user.orders,
      message: 'purchased successfully',
    };
  } catch {
    return { status: 500, message: 'error happened during purchase' };
  }
}

async function getOrders(userId, history = false) {
  try {
    const filter = history
      ? {
          $filter: {
            input: '$orders',
            as: 'order',
            cond: { $eq: ['$$order.delivered', true] },
          },
        }
      : 1;

    const user = await User.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          orders: filter,
        },
      },
    ]);

    const orders = user[0]?.orders || [];
    return { status: 200, orders };
  } catch (err) {
    console.log(err);

    return { status: 500, message: 'unable to get orders' };
  }
}

async function verifyUser(verifyToken) {
  try {
    const { acknowledged, modifiedCount } = await User.updateOne(
      { verifyToken },
      { $set: { verified: true, verifyToken: '' } }
    );

    const verified = acknowledged && modifiedCount !== 0;
    const res = verified
      ? { status: 200, message: 'email has been verified' }
      : { status: 401, message: 'invalid verification token' };

    return { ...res, verified };
  } catch {
    return { status: 500, verified: false, message: 'unable to verify' };
  }
}

async function requestResetPassword(email) {
  try {
    const user = await User.findOne(
      {
        email,
        'social.provider': { $exists: false },
      },
      '_id username verified social'
    );

    const { id, username, verified } = user;

    if (!verified) {
      await sendVerifyEmail({ username, email });
      return {
        status: 401,
        message: `your email is not verified.
verify to be able to reset your password
a verification email has been sent to ${email}`,
      };
    }

    const expireDate = new Date(Date.now() + 60 * 60 * 1000);
    const token = await sendResetPasswordEmail({ id, username, email });
    const hashToken = await bcrypt.hash(token, 10);

    user.resetPassword = { token: hashToken, expireDate };
    user.save();

    return { status: 200, message: `email has been sent to ${email}` };
  } catch {
    return {
      status: 500,
      message: 'problem has happend during sending the email, please try again',
    };
  }
}

async function verifyResetToken(uid, token) {
  try {
    const {
      resetPassword: { token: hashToken, expireDate },
    } = await User.findById(uid, 'resetPassword').lean();

    const tokenMatch = await bcrypt.compare(token, hashToken);
    if (!tokenMatch || expireDate < new Date()) throw new Error();

    return { status: 200, verified: true };
  } catch {
    return { status: 401, verified: false };
  }
}

async function resetPassword(uid, token, password) {
  try {
    const user = await User.findById(uid, 'resetPassword');

    if (!user) return { status: 404, message: 'user not found' };

    const { token: hashToken, expireDate } = user.resetPassword;
    const tokenMatch = await bcrypt.compare(token, hashToken);

    const min_5 = Date.now() - 5 * 60 * 1000;
    if (!tokenMatch || expireDate < new Date(min_5))
      return { status: 401, message: 'invalid token' };

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetPassword = {};
    user.save();

    return { status: 200, message: 'password has been resetted' };
  } catch {
    return {
      status: 500,
      message: 'unable to reset password, please try again',
    };
  }
}

async function sendVerifyEmail(reciver) {
  const token = uuidv4();
  const verificationUrl = `${CLIENT_DOMAIN}/verify?token=${token}`;
  await mailVerifyAccount(reciver, verificationUrl);
  return token;
}

async function sendResetPasswordEmail(reciver) {
  const token = uuidv4();
  const resetUrl = `${CLIENT_DOMAIN}/reset-password?uid=${reciver.id}&token=${token}`;
  await mailResetPassword(reciver, resetUrl);
  return token;
}

async function getUserTrustedDevices(email) {
  try {
    const {
      security: { trustedDevices },
    } = await User.findOne({ email }, 'security.trustedDevices').lean();
    return trustedDevices;
  } catch {
    return [];
  }
}

export {
  getUserById,
  getUserByEmail,
  getLocalUser,
  createLocalUser,
  createSocialUser,
  addUserSecurity,
  updateAccessToken,
  getLocations,
  addLocation,
  removeLocation,
  updateLocation,
  orderCart,
  getOrders,
  verifyUser,
  requestResetPassword,
  verifyResetToken,
  resetPassword,
  getUserTrustedDevices,
};
