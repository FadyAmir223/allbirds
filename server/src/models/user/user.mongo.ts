import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: [
    {
      company: String,
      address_1: String,
      address_2: String,
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
      handle: String,
      name: String,
      colorName: String,
      size: Number,
      price: Number,
      salePrice: Number,
      freeShipping: Boolean,
      image: String,
      amount: Number,
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
