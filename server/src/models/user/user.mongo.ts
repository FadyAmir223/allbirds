import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  verifyToken: String,
  social: {
    provider: String,
    accessToken: String,
    refreshToken: String,
  },
  resetPassword: {
    token: String,
    expireDate: Date,
  },
  security: {
    userAgent: [String],
    trustedDevices: [String],
  },
  locations: [
    {
      company: String,
      address: String,
      city: String,
      country: String,
      state: String,
      phone: String,
    },
  ],
  orders: [
    {
      handle: String,
      editionId: Number,
      size: String,
      amount: Number,
      delivered: { type: Boolean, default: false },
      reviewed: { type: Boolean, default: false },
    },
  ],
})

const User = mongoose.model('User', userSchema)

export default User
