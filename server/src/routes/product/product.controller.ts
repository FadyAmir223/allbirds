import {
  getProduct,
  getReviews,
  addReview,
  removeReview,
} from '../../models/product/product.model.js';
import { getPagination } from '../../utils/query.js';

async function httpsGetProduct(req, res) {
  const { id } = req.params;
  const { status, product, message } = await getProduct(id);
  res.status(status).json({ product, message });
}

async function httpsGetReviews(req, res) {
  req.query.limit = req.query.limit || 3;

  if (req.query.limit > 50)
    return res.status(400).json({ message: "reviews can't exceed 50" });

  const { skip, limit, page } = getPagination(req.query);
  const { id } = req.params;

  const { status, pagination, rating, reviews, message } = await getReviews(
    id,
    skip,
    limit,
    page
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsAddReview(req, res) {
  const { status, pagination, rating, reviews, message } = await addReview(
    req.params.id,
    req.body,
    req.user
  );
  res.status(status).json({ pagination, rating, reviews, message });
}

async function httpsRemoveReview(req, res) {
  const { id, reviewId } = req.params;

  const { status, reviews, message } = await removeReview(
    id,
    reviewId,
    req.user._id
  );
  res.status(status).json({ reviews, message });
}

export { httpsGetProduct, httpsGetReviews, httpsAddReview, httpsRemoveReview };
