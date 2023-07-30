import {
  getProduct,
  getReviews,
  addReview,
  removeReview,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req, res) {
  const { id } = req.params;
  const { product, status, message } = await getProduct(id);
  res.status(status).json({ product, message });
}

async function httpsGetReviews(req, res) {
  req.query.limit = req.query.limit || 3;
  const { skip, limit, page } = getPagination(req.query);
  const { id } = req.params;

  const { reviews, count, rating, status, message } = await getReviews(
    id,
    skip,
    limit
  );

  const pagination = {
    total: count,
    page,
    perPage: reviews.length,
  };

  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsAddReview(req, res) {}

async function httpsRemoveReview(req, res) {}

export { httpsGetProduct, httpsGetReviews, httpsAddReview, httpsRemoveReview };
