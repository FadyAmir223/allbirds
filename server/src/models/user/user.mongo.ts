import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
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
      editionId: String,
      size: String,
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
