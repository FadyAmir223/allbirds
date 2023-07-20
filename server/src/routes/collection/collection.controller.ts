import {
  getCollection,
  getCollectionSale,
  getCollectionFilters,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetCollection(req, res) {
  return await getACollection(req, res, false);
}

async function httpsGetCollectionSale(req, res) {
  return await getACollection(req, res, true);
}

async function getACollection(req, res, isSale = false) {
  req.query.limit = req.query.limit || 10;
  const { collection } = req.params;
  const { skip, limit, page } = getPagination(req.query);

  const { products, total } = isSale
    ? await getCollectionSale(collection, skip, limit)
    : await getCollection(collection, skip, limit);

  const pagination = { total, page, perPage: products.length };
  return res.json({ products, pagination });
}

async function httpsGetCollectionFilters(req, res) {
  const { collection } = req.params;
  const filters = await getCollectionFilters(collection);
  res.json({ filters });
}

export {
  httpsGetCollection,
  httpsGetCollectionSale,
  httpsGetCollectionFilters,
};
