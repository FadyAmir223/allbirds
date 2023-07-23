import Cart from './cart.mongo.js';

async function getCart(userId) {
  return await Cart.aggregate([
    { $match: { userId: userId } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'items.product',
      },
    },
    {
      $group: {
        _id: null,
        items: { $push: '$items' },
      },
    },
    { $unwind: '$items' },
    { $unwind: '$items.product' },
    { $unwind: '$items.product.editions' },
    { $unwind: '$items.product.editions.products' },
    {
      $match: {
        $expr: {
          $eq: ['$items.product.editions.products.id', '$items.editionId'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        amount: '$items.amount',
        size: '$items.size',
        editionId: '$items.editionId',
        productId: '$items.productId',
        handle: '$items.product.handle',
        name: '$items.product.name',
        price: '$items.product.price',
        salePrice: '$items.product.editions.products.salePrice',
        colorName: '$items.product.editions.products.colorName',
        soldOut: {
          $setIsSubset: [
            ['$items.size'],
            '$items.product.editions.products.sizesSoldOut',
          ],
        },
        image: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$items.product.editions.products.images',
                as: 'img',
                cond: {
                  $or: [
                    {
                      $regexMatch: {
                        input: '$$img',
                        regex: '_45_|_angle_|1-min|^((?!closeup).)*pink-1',
                        options: 'i',
                      },
                    },
                  ],
                },
              },
            },
            0,
          ],
        },
      },
    },
  ]);
}

async function addCartItem(userId, productId, editionId, size) {
  try {
    let cart = await Cart.findOne({ userId }, '-__v');
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.editionId === editionId && item.size === size
    );

    existingItem
      ? existingItem.amount++
      : cart.items.push({ productId, editionId, size, amount: 1 });

    await cart.save();

    return { status: 201, cart: cart.items };
  } catch {
    return {
      status: 500,
      message: 'unable to save item to cart',
    };
  }
}

async function removeCartItem(userId, editionId, size, _delete = false) {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0)
      return { status: 404, message: 'no items in cart' };

    const matchedItem = cart.items.find(
      (item) => item.editionId === editionId && item.size === size
    );

    if (!matchedItem) return { status: 404, message: 'item not found in cart' };

    const newCart =
      _delete || matchedItem.amount === 1
        ? await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { editionId: editionId, size: size } } },
            { new: true, projection: '-items._id' }
          )
        : await Cart.findOneAndUpdate(
            { userId, 'items.editionId': editionId, 'items.size': size },
            { $inc: { 'items.$.amount': -1 } },
            { new: true, projection: '-items._id' }
          );

    return { status: 200, cart: newCart.items };
  } catch (error) {
    console.error('Error while removing cart item:', error);
    return {
      status: 500,
      message: 'unable to remove item from cart',
    };
  }
}

export { getCart, addCartItem, removeCartItem };
