import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  social: {
    provider: String,
    accessToken: String,
    refreshToken: String,
  },
  verified: { type: Boolean, default: false },
  locations: [
    {
      company: String,
      address: String,
      city: String,
      country: String,
      state: String,
      zipCode: Number,
      phone: String,
    },
  ],
  orders: [
    {
      productId: mongoose.Types.ObjectId,
      editionId: Number,
      size: String,
      amount: Number,
      delivered: { type: Boolean, default: false },
      reviewed: { type: Boolean, default: false },
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
