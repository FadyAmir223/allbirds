import {
  addLocation,
  getLocations,
  removeLocation,
  updateLocation,
  getOrders,
} from '../../models/user/user.model.js';

async function htppsGetLocations(req, res) {
  const { status, message, locations } = await getLocations(req.user._id);
  res.status(status).json({ message, locations });
}

async function httpsAddLocation(req, res) {
  const { address, city, country, state, phone } = req.body;

  if (!(address && city && country && state && phone))
    return res.status(400).json({ message: 'missing some filds' });

  const { status, locations, message } = await addLocation(
    req.user._id,
    req.body
  );
  res.status(status).json({ locations, message });
}

async function httpsRemoveLocation(req, res) {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' });

  const { status, locations, message } = await removeLocation(
    req.user._id,
    req.params.id
  );
  res.status(status).json({ locations, message });
}

async function httpsUpdateLocation(req, res) {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' });

  if (!req.body)
    return res.status(400).json({ message: 'no fields to update location' });

  const { status, locations, message } = await updateLocation(
    req.user._id,
    req.params,
    req.body
  );

  res.status(status).json({ locations, message });
}

function httpsOrderCart(req, res) {
  res.redirect(`/api/cart/orders?userId=${req.user._id}`);
}

async function httpsGetOrders(req, res) {
  const { status, orders, message } = await getOrders(req.user._id);
  res.status(status).json({ orders, message });
}

async function httpsGetOrderHistory(req, res) {
  const { status, orders, message } = await getOrders(req.user._id, true);
  res.status(status).json({ orders, message });
}

export {
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
  httpsGetOrderHistory,
};
