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
  const { skip, limit, page } = getPagination(req.query);
  const { type, gender } = req.query;

  const { products, total } = isSale
    ? await getCollectionSale(type, gender, skip, limit)
    : await getCollection(type, gender, skip, limit);

  const pagination = { total, page, perPage: products.length };
  return res.json({ pagination, products });
}

async function httpsGetCollectionFilters(req, res) {
  const { type, gender } = req.query;
  const filters = await getCollectionFilters(type, gender);
  res.json({ filters });
}

export {
  httpsGetCollection,
  httpsGetCollectionSale,
  httpsGetCollectionFilters,
};
