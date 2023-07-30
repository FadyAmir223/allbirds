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
  const { locations, status, message } = await addLocation(
    req.user._id,
    req.body
  );
  res.status(status).json({ locations, message });
}

async function httpsRemoveLocation(req, res) {
  const { locations, status, message } = await removeLocation(
    req.user._id,
    req.params.id
  );
  res.status(status).json({ locations, message });
}

async function httpsUpdateLocation(req, res) {
  const { locations, status, message } = await updateLocation(
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
  const { orders, status, message } = await getOrders(req.user._id);
  res.status(status).json({ orders, message });
}

export {
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
};
