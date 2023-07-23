import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: String,
  editionId: String,
  size: String,
  amount: Number,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
