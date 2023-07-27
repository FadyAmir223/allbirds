import User from './user.mongo.js';

async function getUserById(id) {
  try {
    return await User.findById(id, '-__v -password').lean();
  } catch {}
}

async function getUserByEmail(email) {
  try {
    return await User.findOne({ email }, '-__v -password').lean();
  } catch {}
}

async function getLocalUser(email) {
  try {
    return await User.findOne(
      {
        email,
        'social.provider': { $exists: false },
      },
      '-__v -password'
    ).lean();
  } catch {}
}

async function createLocalUser(username, email, password) {
  try {
    const user = await User.create({ username, email, password });
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
    return await User.findOneAndUpdate(
      { email, social: { provider } },
      {
        username,
        email,
        verified: true,
        social: { provider, accessToken, refreshToken },
      },
      { upsert: true, new: true }
    );
  } catch {}
}

async function updateAccessToken(_id, accessToken) {
  try {
    return await User.findByIdAndUpdate(_id, {
      social: { accessToken },
    }).lean();
  } catch {}
}

export {
  getUserById,
  getUserByEmail,
  getLocalUser,
  createLocalUser,
  createSocialUser,
  updateAccessToken,
};
