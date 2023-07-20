import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    first: String,
    last: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  cart: [
    {
      id: Number,
      name: String,
      colorName: String,
      size: Number,
      price: Number,
      salePrice: Number,
      freeShipping: Boolean,
      image: String,
      amount: Number,
      ordered: Boolean,
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
