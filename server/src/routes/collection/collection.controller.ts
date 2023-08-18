import { Request, Response } from 'express';
import {
  getCollection,
  getCollectionSale,
  getCollectionFilters,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetCollection(
  req: Request,
  res: Response
): Promise<Response> {
  return await getACollection(req, res, false);
}

async function httpsGetCollectionSale(
  req: Request,
  res: Response
): Promise<Response> {
  return await getACollection(req, res, true);
}

async function getACollection(req, res, isSale = false) {
  if (!req.query?.limit) req.query.limit = 10;

  if (req.query?.limit > 50)
    return res.status(400).json({ message: 'limit must be less than 50' });

  const { skip, limit, page } = getPagination(req.query);
  const { type, gender } = req.query;

  if (!type) return res.status(400).json({ message: 'type field is empty' });

  const { status, products, total, message } = isSale
    ? await getCollectionSale(type, gender, skip, limit)
    : await getCollection(type, gender, skip, limit);

  const pagination = { total, page, perPage: products?.length || 0 };
  res.status(status).json({ pagination, products, message });
}

async function httpsGetCollectionFilters(
  req: Request,
  res: Response
): Promise<Response> {
  const { type, gender } = req.query;

  if (!type) return res.status(400).json({ message: 'type filed is missing' });

  const { status, filters, message } = await getCollectionFilters(type, gender);
  res.status(status).json({ filters, message });
}

export {
  httpsGetCollection,
  httpsGetCollectionSale,
  httpsGetCollectionFilters,
};
