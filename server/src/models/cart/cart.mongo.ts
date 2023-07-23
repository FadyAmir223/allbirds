import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      size: String,
      editionId: Number,
      amount: Number,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
