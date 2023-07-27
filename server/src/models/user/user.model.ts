import User from './user.mongo.js';

async function getEmail(email) {
  try {
    const emailExist = await User.findOne({ email }, 'email');
    return emailExist;
  } catch {
    return false;
  }
}

async function getUser(email) {
  try {
    return await User.findOne({ email });
  } catch {}
}

async function getUserById(id) {
  try {
    return await User.findById(id, '-__v -password');
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
    const user = await User.findOneAndUpdate(
      { email },
      {
        username,
        email,
        verified: true,
        social: { provider, accessToken, refreshToken },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return user._id;
  } catch {}
}

export { getEmail, getUser, getUserById, createLocalUser, createSocialUser };
