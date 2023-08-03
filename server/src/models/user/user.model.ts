import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import User from './user.mongo.js';
import { getCart } from '../product/product.model.js';
import { mailResetPassword, mailVerifyAccount } from '../../services/mail.js';
import { CLIENT_URL } from '../../utils/loadEnv.js';
import { isPasswordComplex } from '../../utils/authProtection.js';

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

    // if (email === 'fadyamir223@gmail.com') {
    //   role = 'admin';
    //   verified = true;
    // }

    const verifyToken = !verified
      ? await sendVerifyEmail({ username, email })
      : undefined;

    const { _id: id } = await User.create({
      username,
      email,
      password,
      role,
      verified,
      verifyToken,
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

async function getOrders(userId) {
  try {
    const user = await User.findOne(
      { _id: userId, 'orders.delivered': false },
      'orders'
    ).lean();

    const orders = user?.orders ? user.orders : [];
    return { status: 200, orders };
  } catch {
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
    const message = verified
      ? 'email has been verified'
      : 'invalid verification token';

    return { status: 200, verified, message };
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

    const { _id, username, verified, social } = user;

    if (social?.provider)
      return {
        status: 401,
        message: `you are using "${social.provider}" as a provider for your account`,
      };

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
    const token = await sendResetPasswordEmail({ username, email });

    user.resetPassword = { token, expireDate };
    user.save();

    return { status: 200, message: `email has been sent to ${email}` };
  } catch {
    return {
      status: 500,
      message: 'problem has happend during sending the email, please try again',
    };
  }
}

async function verifyResetToken(token) {
  try {
    const user = await User.findOne(
      { 'resetPassword.token': token },
      'resetPassword.expireDate'
    ).lean();

    if (!user) return { status: 400, verified: false };

    if (!user?.resetPassword || user.resetPassword.expireDate < new Date())
      throw new Error();

    return { status: 200, verified: true };
  } catch {
    return { status: 401, verified: false };
  }
}

async function resetPassword(data) {
  try {
    const { token, password, confirmPassword } = data;

    if (!token || token.length !== 36)
      return { status: 400, message: 'invalid token' };

    if (!(password && confirmPassword))
      return { status: 400, message: 'some fields are empty' };

    if (password !== confirmPassword)
      return { status: 400, message: 'non matched passwords' };

    if (!isPasswordComplex(password))
      return { status: 400, message: 'password not complex enough' };

    const user = await User.findOne(
      { 'resetPassword.token': token },
      'verified social'
    );
    if (!user) return { status: 400, message: 'invalid token' };
    const { verified, social } = user;

    if (social?.provider)
      return {
        status: 401,
        message: `you are using "${social.provider}" as a provider for your account`,
      };

    if (!verified)
      return {
        status: 401,
        message: 'your email is not verified',
      };

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetPassword = null;

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
  const verificationUrl = `${CLIENT_URL}/verify?token=${token}`;
  await mailVerifyAccount(reciver, verificationUrl);
  return token;
}

async function sendResetPasswordEmail(reciver) {
  const token = uuidv4();
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;
  await mailResetPassword(reciver, resetUrl);
  return token;
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
  verifyUser,
  requestResetPassword,
  verifyResetToken,
  resetPassword,
};
