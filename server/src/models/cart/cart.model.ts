import mongoose from 'mongoose';

import Product from '../product/product.mongo.js';

async function getCart(items) {
  if (!items) return { status: 404, message: "cart doesn't exist" };
  try {
    const cart = (
      await Promise.all(
        items.map(
          async ({ productId, editionId, size, amount }) =>
            await Product.aggregate([
              { $match: { _id: new mongoose.Types.ObjectId(productId) } },
              { $unwind: '$editions' },
              { $unwind: '$editions.products' },
              { $match: { 'editions.products.id': editionId } },
              { $addFields: { amount, productId, editionId } },
              {
                $project: {
                  _id: 0,
                  amount,
                  productId,
                  editionId,
                  size,
                  handle: '$handle',
                  name: '$name',
                  price: '$price',
                  salePrice: '$editions.products.salePrice',
                  colorName: '$editions.products.colorName',
                  soldOut: {
                    $setIsSubset: [[size], '$editions.products.sizesSoldOut'],
                  },
                  image: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$editions.products.images',
                          as: 'img',
                          cond: {
                            $regexMatch: {
                              input: '$$img',
                              regex:
                                '_45_|_angle_|1-min|^((?!closeup).)*pink-1',
                              options: 'i',
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            ])
        )
      )
    ).flat();
    return { status: 200, cart };
  } catch {
    return { status: 500, message: 'unable to get the cart' };
  }
}

async function addCartItem(items, { productId, editionId, size }) {
  try {
    if (!items) items = [];

    const existingItem = items.find(
      (item) => item.editionId === editionId && item.size === size
    );

    existingItem
      ? existingItem.amount++
      : items.push({ productId, editionId, size, amount: 1 });

    const { status, cart, message } = await getCart(items);

    return {
      status: status === 200 ? 201 : status,
      newItems: items,
      cart,
      message,
    };
  } catch {
    return {
      status: 500,
      message: 'unable to save item to cart',
    };
  }
}

async function removeCartItem(items, { editionId, size }, _delete = false) {
  try {
    if (items?.length === 0)
      return { status: 404, message: 'no items in cart' };

    let matchedItem, matchedIdx;

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (item.editionId === editionId && item.size === size) {
        matchedItem = item;
        matchedIdx = idx;
        break;
      }
    }

    if (!matchedItem) return { status: 404, message: 'item not found in cart' };

    if (_delete || matchedItem.amount === 1)
      items = items.filter(
        (item) => !(item.editionId === editionId && item.size === size)
      );
    else items[matchedIdx].amount--;

    const { status, cart, message } = await getCart(items);

    return { status, newItems: items, cart, message };
  } catch (error) {
    return {
      status: 500,
      message: 'unable to remove item from cart',
    };
  }
}

export { getCart, addCartItem, removeCartItem };
