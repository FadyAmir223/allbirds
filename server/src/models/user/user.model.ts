import User from './user.mongo.js';

async function getEmail(email) {
  try {
    const emailExist = await User.findOne({ email }, 'email').lean();
    return emailExist;
  } catch {
    return false;
  }
}

async function getUser(email) {
  try {
    return await User.findOne({ email }).lean();
  } catch {}
}

async function getUserById(id) {
  try {
    return await User.findById(id, '-__v -password').lean();
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
    const now = new Date();

    now.setHours(now.getHours() + 1);

    return await User.findOneAndUpdate(
      { email },
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
  getEmail,
  getUser,
  getUserById,
  createLocalUser,
  createSocialUser,
  updateAccessToken,
};
