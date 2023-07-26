import User from './user.mongo.js';

async function getEmail(email) {
  try {
    const emailExist = await User.findOne({ email }, 'email');
    return emailExist;
  } catch {
    return false;
  }
}

async function createUser(firstName, lastName, email, password) {
  try {
    await User.create({
      name: { first: firstName, last: lastName },
      email,
      password,
    });

    return { status: 201, message: 'user created' };
  } catch {
    return { status: 500, message: 'unable to create user' };
  }
}

async function getUser(email) {
  return await User.findOne({ email });
}

export { getEmail, createUser, getUser };
