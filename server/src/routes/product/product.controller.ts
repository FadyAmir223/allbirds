import { getProduct, getReviews } from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req, res) {
  const { id } = req.params;
  const product = await getProduct(id);
  return res.json({ product });
}

async function httpsGetreviews(req, res) {
  req.query.limit = req.query.limit || 3;
  const { skip, limit, page } = getPagination(req.query);
  const { id } = req.params;

  const { reviews: reviews_ } = await getReviews(id, skip, limit);
  const { count, rating, reviews } = reviews_;

  const pagination = {
    total: count,
    page,
    perPage: reviews.length,
  };

  return res.json({ pagination, rating, reviews });
}

export { httpsGetProduct, httpsGetreviews };
