import { getCollection } from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetCollection(req, res) {
  const { collection } = req.params;
  req.query.limit = req.query.limit || 10;
  const { skip, limit, page } = getPagination(req.query);
  const { products, count } = await getCollection(collection, skip, limit);

  const pagination = {
    total: count,
    page,
    perPage: products.length,
  };

  res.json({ products, pagination });
}

export { httpsGetCollection };
