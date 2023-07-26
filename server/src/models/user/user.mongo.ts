import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  location: [
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
});

const User = mongoose.model('User', userSchema);

export default User;
