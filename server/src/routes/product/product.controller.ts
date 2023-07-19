import { getProduct, getReviews } from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req, res) {
  res.json(await getProduct(req.params.product));
}

async function httpsGetreviews(req, res) {
  req.query.limit = req.query.limit || 3;
  const { skip, limit, page } = getPagination(req.query);

  const { reviews: reviews_ } = await getReviews(
    req.params.product,
    skip,
    limit
  );
  const { count, rating, reviews } = reviews_;

  const pagination = {
    total: count,
    page,
    perPage: reviews.length,
  };

  res.json({ pagination, rating, reviews });
}

export { httpsGetProduct, httpsGetreviews };
