import Cart from './cart.mongo.js';

async function getCart(userId) {
  return await Cart.aggregate([
    { $match: { userId: userId } },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'info',
      },
    },
    { $unwind: '$info' },
    { $unwind: '$info.editions' },
    { $unwind: '$info.editions.products' },
    {
      $match: {
        $expr: { $eq: ['$info.editions.products.id', '$editionId'] },
      },
    },
    {
      $project: {
        _id: 0,
        product: {
          name: '$info.name',
          colorName: '$info.editions.products.colorName',
          size: '$size',
          id: '$info.editions.products.id',
          price: '$info.price',
          salePrice: '$info.editions.products.salePrice',
          amount: '$amount',
          handle: '$info.editions.products.handle',
          freeShipping: '$info.freeShipping',
          images: {
            $filter: {
              input: '$info.editions.products.images',
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
        },
      },
    },
  ]);
}

async function addCartItem(userId, productId, editionId) {
  const cartItem = new Cart({ userId, productId, editionId });
  await cartItem.save();
}

export { addCartItem, getCart };
